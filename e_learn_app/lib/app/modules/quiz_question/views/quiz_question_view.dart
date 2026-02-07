import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../points_earned/views/points_earned_view.dart';

class QuizQuestionView extends StatelessWidget {
  const QuizQuestionView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark
          ? const Color(0xFF13161F)
          : const Color(0xFFF6F6F8),
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              children: [
                // Top App Bar
                _buildTopAppBar(context, isDark),

                // Progress Indicator
                _buildProgressIndicator(isDark),

                // Content Area (Scrollable)
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.only(
                      left: 16,
                      right: 16,
                      bottom: 120, // Space for fixed bottom bar
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 16),
                        // Question Text
                        _buildQuestionText(isDark),

                        const SizedBox(height: 24),
                        // Options List
                        _buildOptionsList(isDark),

                        const SizedBox(height: 32),
                        // Learning Tip
                        _buildLearningTip(isDark),

                        const SizedBox(height: 24),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            // Fixed Bottom Action Bar
            _buildBottomActionBar(context, isDark),
          ],
        ),
      ),
    );
  }

  Widget _buildTopAppBar(BuildContext context, bool isDark) {
    return Padding(
      padding: const EdgeInsets.all(16.0).copyWith(bottom: 8),
      child: Row(
        children: [
          // Close Button
          InkWell(
            onTap: () => Get.back(),
            borderRadius: BorderRadius.circular(20),
            child: Container(
              width: 40,
              height: 40,
              alignment: Alignment.center,
              child: Icon(
                Icons.close,
                color: isDark ? Colors.white : const Color(0xFF0F121A),
              ),
            ),
          ),

          // Title
          Expanded(
            child: Text(
              'Module 1: Fundamentals',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: isDark ? Colors.white : const Color(0xFF0F121A),
                letterSpacing: -0.3,
              ),
              textAlign: TextAlign.center,
            ),
          ),

          // Help Button
          InkWell(
            onTap: () {
              // TODO: Show help dialog
            },
            borderRadius: BorderRadius.circular(20),
            child: Container(
              width: 40,
              height: 40,
              alignment: Alignment.center,
              child: Icon(
                Icons.help_outline,
                color: isDark ? Colors.white : const Color(0xFF0F121A),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProgressIndicator(bool isDark) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'QUESTION 6 OF 10',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w500,
                  letterSpacing: 1.2,
                  color: isDark
                      ? const Color(0xFFA1ACC3)
                      : const Color(0xFF56668F),
                ),
              ),
              Text(
                '60% Complete',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: isDark
                      ? const Color(0xFF60A5FA)
                      : const Color(0xFF1F3D89),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          // Progress Bar
          Container(
            height: 6,
            width: double.infinity,
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF374151) : const Color(0xFFD2D7E4),
              borderRadius: BorderRadius.circular(3),
            ),
            child: FractionallySizedBox(
              alignment: Alignment.centerLeft,
              widthFactor: 0.6,
              child: Container(
                decoration: BoxDecoration(
                  color: const Color(0xFF1F3D89),
                  borderRadius: BorderRadius.circular(3),
                ),
              ),
            ),
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }

  Widget _buildQuestionText(bool isDark) {
    return Text(
      'Which of the following best describes UI accessibility?',
      style: TextStyle(
        fontSize: 20,
        fontWeight: FontWeight.bold,
        color: isDark ? Colors.white : const Color(0xFF0F121A),
        height: 1.3,
        letterSpacing: -0.5,
      ),
    );
  }

  Widget _buildOptionsList(bool isDark) {
    return Column(
      children: [
        // Option 1: Incorrect Choice
        _buildIncorrectOption(
          isDark: isDark,
          text: 'Creating visually appealing interfaces',
          feedback:
              'This focuses only on aesthetics. Accessibility is broader than visual design.',
        ),

        const SizedBox(height: 12),

        // Option 2: Correct Choice
        _buildCorrectOption(
          isDark: isDark,
          text: 'Designing for everyone regardless of ability',
        ),

        const SizedBox(height: 12),

        // Option 3: Default (Not Selected)
        _buildDefaultOption(
          isDark: isDark,
          text: 'Optimizing for high-end mobile devices',
        ),

        const SizedBox(height: 12),

        // Option 4: Default (Not Selected)
        _buildDefaultOption(
          isDark: isDark,
          text: 'Focusing on SEO and performance',
        ),
      ],
    );
  }

  Widget _buildIncorrectOption({
    required bool isDark,
    required String text,
    required String feedback,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF1F222C) : Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFFEF476F), width: 2),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.03),
                blurRadius: 4,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Row(
            children: [
              Expanded(
                child: Text(
                  text,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: isDark ? Colors.white : const Color(0xFF0F121A),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              // Error Icon
              Container(
                width: 24,
                height: 24,
                decoration: const BoxDecoration(
                  color: Color(0xFFEF476F),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.close, color: Colors.white, size: 14),
              ),
            ],
          ),
        ),

        const SizedBox(height: 8),

        // Feedback
        Padding(
          padding: const EdgeInsets.only(left: 4),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Icon(
                Icons.info_outline,
                color: Color(0xFFEF476F),
                size: 14,
              ),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  feedback,
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFFEF476F),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildCorrectOption({required bool isDark, required String text}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isDark
                ? const Color(0xFF2EC4B6).withOpacity(0.05)
                : const Color(0xFF2EC4B6).withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFF2EC4B6), width: 2),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.03),
                blurRadius: 4,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Row(
            children: [
              Expanded(
                child: Text(
                  text,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: isDark ? Colors.white : const Color(0xFF0F121A),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              // Check Icon
              Container(
                width: 24,
                height: 24,
                decoration: const BoxDecoration(
                  color: Color(0xFF2EC4B6),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check, color: Colors.white, size: 14),
              ),
            ],
          ),
        ),

        const SizedBox(height: 8),

        // Correct Label
        Padding(
          padding: const EdgeInsets.only(left: 4),
          child: Row(
            children: [
              const Icon(Icons.verified, color: Color(0xFF2EC4B6), size: 14),
              const SizedBox(width: 6),
              const Text(
                'CORRECT ANSWER',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF2EC4B6),
                  letterSpacing: 1.0,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDefaultOption({required bool isDark, required String text}) {
    return Opacity(
      opacity: 0.6,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1F222C) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isDark ? const Color(0xFF374151) : const Color(0xFFE5E7EB),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.03),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            Expanded(
              child: Text(
                text,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: isDark ? Colors.white : const Color(0xFF0F121A),
                ),
              ),
            ),
            const SizedBox(width: 12),
            // Empty Circle
            Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isDark
                      ? const Color(0xFF4B5563)
                      : const Color(0xFFD1D5DB),
                  width: 2,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLearningTip(bool isDark) {
    return Container(
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isDark ? const Color(0xFF374151) : const Color(0xFFF3F4F6),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image Placeholder
          Container(
            height: 128,
            width: double.infinity,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  const Color(0xFF1F3D89).withOpacity(0.3),
                  const Color(0xFF2EC4B6).withOpacity(0.3),
                ],
              ),
            ),
            child: Center(
              child: Icon(
                Icons.accessibility_new,
                size: 48,
                color: Colors.white.withOpacity(0.5),
              ),
            ),
          ),

          // Tip Content
          Container(
            padding: const EdgeInsets.all(12),
            color: isDark ? const Color(0xFF1F222C) : Colors.white,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'LEARNING TIP',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.5,
                    color: isDark
                        ? const Color(0xFFA1ACC3)
                        : const Color(0xFF56668F),
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Inclusive design ensures that products are usable by people with various permanent, temporary, or situational disabilities.',
                  style: TextStyle(
                    fontSize: 12,
                    color: isDark ? Colors.white : const Color(0xFF0F121A),
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomActionBar(BuildContext context, bool isDark) {
    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      child: Container(
        padding: const EdgeInsets.all(16).copyWith(bottom: 24),
        decoration: BoxDecoration(
          color: isDark
              ? const Color(0xFF13161F).withOpacity(0.8)
              : Colors.white.withOpacity(0.8),
          border: Border(
            top: BorderSide(
              color: isDark ? const Color(0xFF374151) : const Color(0xFFF3F4F6),
            ),
          ),
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: BackdropFilter(
            filter: ColorFilter.mode(
              Colors.white.withOpacity(0),
              BlendMode.src,
            ),
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  // Show points earned popup
                  Navigator.of(context).push(
                    PageRouteBuilder(
                      opaque: false,
                      pageBuilder: (context, _, __) => const PointsEarnedView(),
                      transitionsBuilder:
                          (context, animation, secondaryAnimation, child) {
                            return FadeTransition(
                              opacity: animation,
                              child: child,
                            );
                          },
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1F3D89),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 8,
                  shadowColor: const Color(0xFF1F3D89).withOpacity(0.3),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Continue',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(width: 8),
                    Icon(Icons.arrow_forward, size: 20),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
