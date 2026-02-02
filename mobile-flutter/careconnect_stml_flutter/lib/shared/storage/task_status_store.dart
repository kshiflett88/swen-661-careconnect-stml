import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

/// Contract so we can swap implementations in tests (SharedPrefs vs in-memory).
abstract class TaskStatusStore {
  Future<DateTime?> getCompletedAt(String taskId);
  Future<void> setCompleted(String taskId, DateTime when);
  Future<void> clearCompleted(String taskId);
  Future<void> clearAll();
}

/// Production implementation using SharedPreferences.
/// Stores task completion state locally as a map:
/// { "<taskId>": "<completedAt ISO8601 string>" }
class SharedPrefsTaskStatusStore implements TaskStatusStore {
  static const _key = 'task_status_v1';

  Future<Map<String, dynamic>> _readAll() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_key);
    if (raw == null) return {};
    return jsonDecode(raw) as Map<String, dynamic>;
  }

  Future<void> clearAll() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_key);
  }

  Future<void> _writeAll(Map<String, dynamic> data) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_key, jsonEncode(data));
  }

  @override
  Future<DateTime?> getCompletedAt(String taskId) async {
    final all = await _readAll();
    final value = all[taskId];
    if (value == null) return null;
    return DateTime.tryParse(value as String);
  }

  @override
  Future<void> setCompleted(String taskId, DateTime when) async {
    final all = await _readAll();
    all[taskId] = when.toIso8601String();
    await _writeAll(all);
  }

  @override
  Future<void> clearCompleted(String taskId) async {
    final all = await _readAll();
    all.remove(taskId);
    await _writeAll(all);
  }
}

/// Test-friendly implementation (no plugins).
class InMemoryTaskStatusStore implements TaskStatusStore {
  final Map<String, DateTime> _completed = {};

  @override
  Future<DateTime?> getCompletedAt(String taskId) async => _completed[taskId];

  @override
  Future<void> setCompleted(String taskId, DateTime when) async {
    _completed[taskId] = when;
  }

  @override
  Future<void> clearCompleted(String taskId) async {
    _completed.remove(taskId);
  }

  @override
  Future<void> clearAll() async {
    _completed.clear();
  }
}

