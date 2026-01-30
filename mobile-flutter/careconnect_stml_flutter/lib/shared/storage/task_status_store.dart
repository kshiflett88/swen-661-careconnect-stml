import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

/// Stores task completion state locally as a map:
/// { "<taskId>": "<completedAt ISO8601 string>" }
class TaskStatusStore {
  static const _key = 'task_status_v1';

  Future<Map<String, dynamic>> _readAll() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_key);
    if (raw == null) return {};
    return jsonDecode(raw) as Map<String, dynamic>;
  }

  Future<void> _writeAll(Map<String, dynamic> data) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_key, jsonEncode(data));
  }

  Future<DateTime?> getCompletedAt(String taskId) async {
    final all = await _readAll();
    final value = all[taskId];
    if (value == null) return null;
    return DateTime.tryParse(value as String);
  }

  Future<void> setCompleted(String taskId, DateTime when) async {
    final all = await _readAll();
    all[taskId] = when.toIso8601String();
    await _writeAll(all);
  }

  Future<void> clearCompleted(String taskId) async {
    final all = await _readAll();
    all.remove(taskId);
    await _writeAll(all);
  }
}
