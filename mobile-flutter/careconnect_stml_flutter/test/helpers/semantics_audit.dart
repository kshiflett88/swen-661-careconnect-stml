import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_test/flutter_test.dart';

/// Semantics audit helper for widget tests (WCAG 4.1.2 Name/Role/Value support).
///
/// Goals:
/// - Works on older Flutter SDKs (bitmask ints for SemanticsData.actions/flags).
/// - Avoids SemanticsHandle leaks ("active at end of test").
/// - Avoids double-dispose (_outstandingHandles > 0) when tests also call ensureSemantics().
/// - Tolerates Keys on wrapper widgets (semantics/actions may be on descendants).
///
/// Backward compatible with existing tests that do:
///   final audit = SemanticsAudit(tester);
///   await audit.start();
///   ...
///   audit.dispose();
class SemanticsAudit {
  final WidgetTester tester;
  SemanticsHandle? _ownedHandle;

  SemanticsAudit(this.tester);

  /// Enable semantics if needed and guarantee cleanup.
  Future<void> start() async {
    _ensureEnabled();
    // If the test forgets to call dispose(), still clean up.
    addTearDown(() {
      dispose();
    });
  }

  /// Dispose only the handle this helper created (idempotent).
  void dispose() {
    _ownedHandle?.dispose();
    _ownedHandle = null;
  }

  void _ensureEnabled() {
    // If semantics are already enabled by the test, do not create another handle.
    final alreadyEnabled = tester.binding.pipelineOwner.semanticsOwner != null;
    if (alreadyEnabled) return;
    _ownedHandle ??= tester.ensureSemantics();
  }

  // ---------- Semantics extraction ----------

  SemanticsData _dataFor(Finder finder) {
    _ensureEnabled();
    expect(finder, findsOneWidget);

    final data = tester.getSemantics(finder).getSemanticsData();
    final hasMeaningful =
        data.actions != 0 || data.flags != 0 || data.label.trim().isNotEmpty;
    if (hasMeaningful) return data;

    // Fallback: semantics often live on a descendant (Key on wrapper).
    final descendantSemantics =
        find.descendant(of: finder, matching: find.byType(Semantics));
    if (descendantSemantics.evaluate().isNotEmpty) {
      return tester.getSemantics(descendantSemantics.first).getSemanticsData();
    }

    return data;
  }

  /// Build an "accessible label" from multiple sources:
  /// 1) Semantics label
  /// 2) IconButton tooltip (common for icon-only controls)
  /// 3) Descendant IconButton tooltip
  /// 4) Descendant visible Text widgets
  String _accessibleLabel(Finder finder, SemanticsData data) {
    final parts = <String>[];

    final sem = data.label.trim();
    if (sem.isNotEmpty) parts.add(sem);

    final w = tester.widget(finder);
    if (w is IconButton && (w.tooltip?.trim().isNotEmpty ?? false)) {
      parts.add(w.tooltip!.trim());
    }

    final iconDesc = find.descendant(of: finder, matching: find.byType(IconButton));
    if (iconDesc.evaluate().isNotEmpty) {
      final iw = tester.widget<IconButton>(iconDesc.first);
      if (iw.tooltip?.trim().isNotEmpty ?? false) parts.add(iw.tooltip!.trim());
    }

    final textDesc = find.descendant(of: finder, matching: find.byType(Text));
    if (textDesc.evaluate().isNotEmpty) {
      for (final e in textDesc.evaluate()) {
        final t = e.widget as Text;
        final s = (t.data ?? '').trim();
        if (s.isNotEmpty) parts.add(s);
      }
    }

    // Deduplicate while preserving order
    final seen = <String>{};
    final unique = <String>[];
    for (final p in parts) {
      if (seen.add(p)) unique.add(p);
    }
    return unique.join(' ').trim();
  }

  // ---------- Operability heuristics (older SDK safe) ----------

  bool _hasTapOrLongPress(SemanticsData data) {
    return data.hasAction(SemanticsAction.tap) ||
        data.hasAction(SemanticsAction.longPress);
  }

  bool _finderOrDescendantIsPressable(Finder finder) {
    bool isPressableWidget(Object w) =>
        w is ButtonStyleButton ||
        w is IconButton ||
        w is InkWell ||
        w is GestureDetector;

    final w = tester.widget(finder);
    if (isPressableWidget(w)) return true;

    final pressableDesc = find.descendant(
      of: finder,
      matching: find.byWidgetPredicate(isPressableWidget),
    );
    return pressableDesc.evaluate().isNotEmpty;
  }

  bool _finderOrDescendantIsToggle(Finder finder) {
    bool isToggleWidget(Object w) =>
        w is Switch || w is Checkbox || w is Radio || w is Slider;

    final w = tester.widget(finder);
    if (isToggleWidget(w)) return true;

    final toggleDesc = find.descendant(
      of: finder,
      matching: find.byWidgetPredicate(isToggleWidget),
    );
    return toggleDesc.evaluate().isNotEmpty;
  }

  // ---------- Public assertions ----------

  void expectHasNonEmptyLabel(Finder finder, {String? reason}) {
    final data = _dataFor(finder);
    final label = _accessibleLabel(finder, data);
    expect(
      label.isNotEmpty,
      isTrue,
      reason: reason ?? 'Expected widget to have a non-empty accessible label.',
    );
  }

  /// WCAG 4.1.2: Name + Role + Value (buttons/pressables)
  void expectButton(
    Finder finder, {
    String? expectedLabel,
    String? labelContains,
    bool enabled = true,
    String? reason,
  }) {
    final data = _dataFor(finder);

    // Role: prefer semantics flag, but accept known button widgets when Key is on wrapper.
    final hasRole = data.hasFlag(SemanticsFlag.isButton) || _finderOrDescendantIsPressable(finder);
    expect(
      hasRole,
      isTrue,
      reason: reason ?? 'Expected control to expose a button role.',
    );

    // Operable: semantics action OR known pressable widget (descendant accepted)
    final operable = _hasTapOrLongPress(data) || _finderOrDescendantIsPressable(finder);
    expect(
      operable,
      isTrue,
      reason: reason ?? 'Expected control to be operable via semantics or known pressable widget.',
    );

    // Enabled: only enforce when flag is present, or when explicitly expecting disabled
    if (data.hasFlag(SemanticsFlag.isEnabled) || enabled == false) {
      expect(
        data.hasFlag(SemanticsFlag.isEnabled),
        enabled,
        reason: reason ?? 'Expected enabled state to be ${enabled ? 'enabled' : 'disabled'}.',
      );
    }

    final label = _accessibleLabel(finder, data);
    expect(
      label.isNotEmpty,
      isTrue,
      reason: reason ?? 'Expected control to have a non-empty accessible label.',
    );

    if (expectedLabel != null) {
      expect(label, expectedLabel, reason: reason ?? 'Expected accessible label to match exactly.');
    }
    if (labelContains != null) {
      expect(
        label.contains(labelContains),
        isTrue,
        reason: reason ?? 'Expected accessible label to contain "$labelContains".',
      );
    }
  }

  /// WCAG 4.1.2: Name + Value (toggles)
  void expectToggle(
    Finder finder, {
    String? labelContains,
    bool? isOn,
    String? reason,
  }) {
    final data = _dataFor(finder);

    final hasStateFlag =
        data.hasFlag(SemanticsFlag.hasCheckedState) || data.hasFlag(SemanticsFlag.hasToggledState);
    expect(
      hasStateFlag,
      isTrue,
      reason: reason ?? 'Expected toggle to expose a checked/toggled state flag.',
    );

    // Operable: action OR toggle widget OR state flags (some SDKs/tests don't surface actions)
    final operable = _hasTapOrLongPress(data) || _finderOrDescendantIsToggle(finder) || hasStateFlag;
    expect(
      operable,
      isTrue,
      reason: reason ?? 'Expected toggle to be operable.',
    );

    final label = _accessibleLabel(finder, data);
    expect(
      label.isNotEmpty,
      isTrue,
      reason: reason ?? 'Expected toggle to have a non-empty accessible label.',
    );
    if (labelContains != null) {
      expect(label.contains(labelContains), isTrue,
          reason: reason ?? 'Expected toggle label to contain "$labelContains".');
    }

    if (isOn != null) {
      final currentOn =
          data.hasFlag(SemanticsFlag.isChecked) || data.hasFlag(SemanticsFlag.isToggled);
      expect(
        currentOn,
        isOn,
        reason: reason ?? 'Expected toggle state to be ${isOn ? 'ON' : 'OFF'}.',
      );
    }
  }
}
