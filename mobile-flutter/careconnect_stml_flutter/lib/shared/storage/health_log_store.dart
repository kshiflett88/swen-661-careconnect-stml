import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

import '../../data/models/health_log_entry.dart';

/// Contract so we can swap implementations (SharedPrefs vs in-memory for tests).
abstract class HealthLogStore {
  Future<List<HealthLogEntry>> getAll();
  Future<void> add(HealthLogEntry entry);
  Future<void> clearAll();
}

/// Production implementation using SharedPreferences.
class SharedPrefsHealthLogStore implements HealthLogStore {
  static const _key = 'health_logs_v1';

  Future<List<HealthLogEntry>> _readAll() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_key);
    if (raw == null) return [];

    final decoded = jsonDecode(raw) as List<dynamic>;
    final entries = decoded
        .map((e) => HealthLogEntry.fromJson(e as Map<String, dynamic>))
        .toList();

    // Keep your current sorting behavior (newest first)
    entries.sort((a, b) => b.timestamp.compareTo(a.timestamp));
    return entries;
  }

  Future<void> _writeAll(List<HealthLogEntry> entries) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
      _key,
      jsonEncode(entries.map((e) => e.toJson()).toList()),
    );
  }

  @override
  Future<List<HealthLogEntry>> getAll() async => _readAll();

  @override
  Future<void> add(HealthLogEntry entry) async {
    final current = await _readAll();
    final updated = [entry, ...current];
    await _writeAll(updated);
  }

  @override
  Future<void> clearAll() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_key);
  }
}

/// Test-friendly implementation (no plugins).
class InMemoryHealthLogStore implements HealthLogStore {
  final List<HealthLogEntry> entries = [];

  @override
  Future<List<HealthLogEntry>> getAll() async => List.unmodifiable(entries);

  @override
  Future<void> add(HealthLogEntry entry) async {
    entries.insert(0, entry); // mimic "newest first"
  }

  @override
  Future<void> clearAll() async {
    entries.clear();
  }
}
