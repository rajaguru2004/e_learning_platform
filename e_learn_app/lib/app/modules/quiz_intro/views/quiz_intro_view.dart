import 'package:flutter/material.dart';
import 'package:get/get.dart';

class QuizIntroView extends StatelessWidget {
  const QuizIntroView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark
          ? const Color(0xFF13161F)
          : const Color(0xFFF6F6F8),
      body: SafeArea(
        child: Column(
          children: [
            // Top Navigation Bar
            _buildHeader(context),

            // Main Content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 0,
                ),
                child: Column(
                  children: [
                    const SizedBox(height: 16),
                    // Hero Illustration
                    _buildHeroIllustration(isDark),

                    const SizedBox(height: 32),
                    // Quiz Header
                    _buildQuizHeader(isDark),

                    const SizedBox(height: 32),
                    // Info Grid
                    _buildInfoGrid(isDark),

                    const SizedBox(height: 32),
                    // Status & Attempts Note
                    _buildStatusNote(isDark),

                    const SizedBox(height: 48),
                    // Start Quiz Button
                    _buildStartButton(context, isDark),

                    const SizedBox(height: 16),
                    Text(
                      'Ready? The timer starts as soon as you begin.',
                      style: TextStyle(
                        fontSize: 12,
                        fontStyle: FontStyle.italic,
                        color: isDark ? Colors.grey[600] : Colors.grey[500],
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Back Button
          InkWell(
            onTap: () => Get.back(),
            borderRadius: BorderRadius.circular(20),
            child: Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Icon(Icons.arrow_back_ios_new, size: 20),
            ),
          ),

          // Title
          const Text(
            'Quiz Info',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              letterSpacing: -0.5,
            ),
          ),

          // Spacer
          const SizedBox(width: 40),
        ],
      ),
    );
  }

  Widget _buildHeroIllustration(bool isDark) {
    return Container(
      width: double.infinity,
      constraints: const BoxConstraints(maxWidth: 384),
      child: AspectRatio(
        aspectRatio: 4 / 3,
        child: Container(
          decoration: BoxDecoration(
            color: isDark
                ? const Color(0xFF1F3D89).withOpacity(0.2)
                : const Color(0xFF1F3D89).withOpacity(0.05),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFF1F3D89).withOpacity(0.1)),
          ),
          child: Center(
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                // Main Icon Container
                Container(
                  width: 96,
                  height: 96,
                  decoration: BoxDecoration(
                    color: const Color(0xFF1F3D89),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.3),
                        blurRadius: 20,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.assignment_turned_in,
                    size: 48,
                    color: Colors.white,
                  ),
                ),

                // Check Mark Badge
                Positioned(
                  right: -16,
                  top: -8,
                  child: Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: const Color(0xFF10B981),
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.2),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.check,
                      color: Colors.white,
                      size: 24,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildQuizHeader(bool isDark) {
    return Column(
      children: [
        const Text(
          'Module 3: Advanced Principles',
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            height: 1.2,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 12),
        Text(
          'Test your knowledge on the concepts covered in this module. This assessment helps track your progress through the course.',
          style: TextStyle(
            fontSize: 16,
            color: isDark ? Colors.grey[400] : Colors.grey[600],
            height: 1.5,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildInfoGrid(bool isDark) {
    return Row(
      children: [
        Expanded(
          child: _buildInfoCard(
            isDark: isDark,
            icon: Icons.quiz,
            label: 'QUESTIONS',
            value: '20 Items',
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildInfoCard(
            isDark: isDark,
            icon: Icons.schedule,
            label: 'TIME LIMIT',
            value: '15 Mins',
          ),
        ),
      ],
    );
  }

  Widget _buildInfoCard({
    required bool isDark,
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1C1F2E) : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isDark ? const Color(0xFF2D3142) : const Color(0xFFE5E7EB),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: const Color(0xFF1F3D89), size: 28),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w500,
              letterSpacing: 1.2,
              color: isDark ? Colors.grey[400] : Colors.grey[500],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusNote(bool isDark) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark
            ? const Color(0xFF1F3D89).withOpacity(0.2)
            : const Color(0xFF1F3D89).withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF1F3D89).withOpacity(0.2)),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: isDark
                  ? const Color(0xFF1F3D89).withOpacity(0.4)
                  : const Color(0xFF1F3D89).withOpacity(0.2),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Icon(
              Icons.info_outline,
              color: isDark ? const Color(0xFF60A5FA) : const Color(0xFF1F3D89),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Multiple attempts allowed',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: isDark
                        ? const Color(0xFF93C5FD)
                        : const Color(0xFF1F3D89),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Your highest score will be recorded.',
                  style: TextStyle(
                    fontSize: 12,
                    color: isDark
                        ? const Color(0xFF93C5FD).withOpacity(0.7)
                        : const Color(0xFF1F3D89).withOpacity(0.7),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStartButton(BuildContext context, bool isDark) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: () {
          // TODO: Navigate to quiz screen
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF1F3D89),
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 8,
          shadowColor: const Color(0xFF1F3D89).withOpacity(0.2),
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Start Quiz',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            SizedBox(width: 8),
            Icon(Icons.play_arrow, size: 24),
          ],
        ),
      ),
    );
  }
}
