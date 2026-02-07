import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../modules/home/views/home_view.dart';
import '../modules/library/views/library_view.dart';
import '../modules/achievements/views/achievements_view.dart';
import '../modules/profile/views/profile_view.dart';

class AppBottomNavBar extends StatelessWidget {
  final int currentIndex;

  const AppBottomNavBar({super.key, required this.currentIndex});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.95),
        border: Border(top: BorderSide(color: Colors.grey[200]!)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildNavItem(
                context,
                index: 0,
                icon: Icons.home_rounded,
                label: 'Home',
                onTap: () => _navigateTo(context, 0),
              ),
              _buildNavItem(
                context,
                index: 1,
                icon: Icons.auto_stories,
                label: 'Library',
                onTap: () => _navigateTo(context, 1),
              ),
              _buildNavItem(
                context,
                index: 2,
                icon: Icons.leaderboard_rounded,
                label: 'Progress',
                onTap: () => _navigateTo(context, 2),
              ),
              _buildNavItem(
                context,
                index: 3,
                icon: Icons.person_rounded,
                label: 'Profile',
                onTap: () => _navigateTo(context, 3),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(
    BuildContext context, {
    required int index,
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    final isActive = currentIndex == index;
    final color = isActive ? const Color(0xFF1F3D89) : Colors.grey[400];

    return InkWell(
      onTap: isActive ? null : onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: isActive
            ? BoxDecoration(
                color: const Color(0xFF1F3D89).withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              )
            : null,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 4),
            Text(
              label,
              style: GoogleFonts.lexend(
                fontSize: 10,
                fontWeight: isActive ? FontWeight.bold : FontWeight.w500,
                color: color,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _navigateTo(BuildContext context, int index) {
    if (index == currentIndex) return;

    Widget page;
    switch (index) {
      case 0:
        page = const HomeView();
        break;
      case 1:
        page = const LibraryView();
        break;
      case 2:
        page = const AchievementsView();
        break;
      case 3:
        page = const ProfileView();
        break;
      default:
        return;
    }

    Navigator.push(
      context,
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) => page,
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(opacity: animation, child: child);
        },
      ),
    );
  }
}
