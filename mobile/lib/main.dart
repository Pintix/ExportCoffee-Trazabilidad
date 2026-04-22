import 'package:flutter/material.dart';
import 'package:pocketbase/pocketbase.dart';
import 'package:lucide_icons/lucide_icons.dart';

void main() {
  runApp(const ExportCoffeeApp());
}

class ExportCoffeeApp extends StatelessWidget {
  const ExportCoffeeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ExportCoffee',
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: const Color(0xFF1E1E1E),
        hintColor: const Color(0xFFC7A17A),
        scaffoldBackgroundColor: const Color(0xFF121212),
        useMaterial3: true,
      ),
      home: const DashboardScreen(),
    );
  }
}

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final pb = PocketBase('http://localhost:8090'); // Cambiar por IP real en dispositivo

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ExportCoffee IA'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Trazabilidad Integral',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            _buildActionCard(
              context,
              'Nuevo Lote',
              'Registra la cosecha actual',
              LucideIcons.clipboardList,
            ),
            const SizedBox(height: 12),
            _buildActionCard(
              context,
              'Análisis de Calidad',
              'Usa la IA para evaluar el grano',
              LucideIcons.brain,
            ),
            const SizedBox(height: 12),
            _buildActionCard(
              context,
              'Pasaportes QR',
              'Genera códigos de trazabilidad',
              LucideIcons.qrCode,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionCard(BuildContext context, String title, String subtitle, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E1E1E),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white12),
      ),
      child: Row(
        children: [
          Icon(icon, color: const Color(0xFFC7A17A), size: 32),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                Text(subtitle, style: const TextStyle(color: Colors.grey, fontSize: 14)),
              ],
            ),
          ),
          const Icon(LucideIcons.chevronRight, color: Colors.grey),
        ],
      ),
    );
  }
}
