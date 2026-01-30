import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../../data/models/health_log_entry.dart';

/// Stores health logs locally as a JSON list of entries.
class HealthLogStore {
  static const _key = 'health_logs_v1';

  Future<List<HealthLogEntry>> getAll() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_key);
    if (raw == null) return [];
    final decoded = jsonDecode(raw) as List;
    final entries = decoded
        .cast<Map<String, dynamic>>()
        .map(HealthLogEntry.fromJson)
        .toList();
    entries.sort((a, b) => b.timestamp.compareTo(a.timestamp));
    return entries;
  }

  Future<void> add(HealthLogEntry entry) async {
    final prefs = await SharedPreferences.getInstance();
    final current = await getAll();
    final updated = [entry, ...current];
    await prefs.setString(
      _key,
      jsonEncode(updated.map((e) => e.toJson()).toList()),
    );
  }

  Future<void> clearAll() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_key);
  }
}
