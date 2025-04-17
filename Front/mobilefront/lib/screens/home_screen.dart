import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text(
        'Bienvenue dans mon application!',
        style: TextStyle(fontSize: 24),
      ),
    );
  }
}