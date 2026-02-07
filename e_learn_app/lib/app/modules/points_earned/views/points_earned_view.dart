import 'package:flutter/material.dart';
import 'package:get/get.dart';

class PointsEarnedView extends StatelessWidget {
  final int pointsEarned;
  final String nextBadge;
  final int currentPoints;
  final int badgeTarget;

  const PointsEarnedView({
    Key? key,
    this.pointsEarned = 50,
    this.nextBadge = 'Master Explorer',
    this.currentPoints = 450,
    this.badgeTarget = 600,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final progress = currentPoints / badgeTarget;
    final pointsToGo = badgeTarget - currentPoints;

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: GestureDetector(
        onTap: () => Get.back(),
        child: Container(
          color: const Color(0xFF141414).withOpacity(0.6),
          child: Center(
            child: GestureDetector(
              onTap: () {}, // Prevent dismissal when tapping the card
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 24),
                constraints: const BoxConstraints(maxWidth: 400),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1C1F2B) : Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.3),
                      blurRadius: 20,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Bottom Sheet Handle
                    Container(
                      height: 20,
                      alignment: Alignment.center,
                      child: Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: isDark
                              ? const Color(0xFF374151)
                              : const Color(0xFFE5E7EB),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),

                    // Celebration Hero Section
                    Padding(
                      padding: const EdgeInsets.fromLTRB(24, 32, 24, 16),
                      child: Column(
                        children: [
                          // Star Icon with Sparkles
                          Stack(
                            alignment: Alignment.center,
                            clipBehavior: Clip.none,
                            children: [
                              // Decorative Sparkles
                              Positioned(
                                top: -16,
                                left: -16,
                                child: Icon(
                                  Icons.auto_awesome,
                                  color: const Color(
                                    0xFFF4C430,
                                  ).withOpacity(0.4),
                                  size: 24,
                                ),
                              ),
                              Positioned(
                                bottom: -8,
                                right: -24,
                                child: Icon(
                                  Icons.auto_awesome,
                                  color: const Color(
                                    0xFFF4C430,
                                  ).withOpacity(0.6),
                                  size: 30,
                                ),
                              ),

                              // Main Star Container
                              Container(
                                padding: const EdgeInsets.all(24),
                                decoration: BoxDecoration(
                                  color: const Color(
                                    0xFFF4C430,
                                  ).withOpacity(0.1),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.star,
                                  color: Color(0xFFF4C430),
                                  size: 80,
                                ),
                              ),
                            ],
                          ),

                          const SizedBox(height: 24),

                          // Great Work Text
                          Text(
                            'GREAT WORK!',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              letterSpacing: 2.0,
                              color: isDark
                                  ? const Color(0xFF60A5FA)
                                  : const Color(0xFF1F3D89),
                            ),
                          ),

                          const SizedBox(height: 4),

                          // Points Earned Title
                          Text(
                            'You earned $pointsEarned points',
                            style: TextStyle(
                              fontSize: 30,
                              fontWeight: FontWeight.bold,
                              color: isDark
                                  ? Colors.white
                                  : const Color(0xFF0F121A),
                              letterSpacing: -0.5,
                              height: 1.2,
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Progress Section
                    Container(
                      margin: const EdgeInsets.symmetric(horizontal: 24),
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        border: Border(
                          top: BorderSide(
                            color: isDark
                                ? const Color(0xFF374151)
                                : const Color(0xFFF3F4F6),
                          ),
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Next Badge Header
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'NEXT BADGE',
                                    style: TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.w500,
                                      letterSpacing: 1.2,
                                      color: isDark
                                          ? const Color(0xFFA1ACC3)
                                          : const Color(0xFF6B7280),
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    nextBadge,
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                      color: isDark
                                          ? Colors.white
                                          : const Color(0xFF0F121A),
                                    ),
                                  ),
                                ],
                              ),
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.baseline,
                                textBaseline: TextBaseline.alphabetic,
                                children: [
                                  Text(
                                    currentPoints.toString(),
                                    style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.bold,
                                      color: isDark
                                          ? Colors.white
                                          : const Color(0xFF0F121A),
                                    ),
                                  ),
                                  Text(
                                    ' / $badgeTarget',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: isDark
                                          ? const Color(0xFFA1ACC3)
                                          : const Color(0xFF9CA3AF),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),

                          const SizedBox(height: 12),

                          // Progress Bar
                          Container(
                            height: 12,
                            decoration: BoxDecoration(
                              color: isDark
                                  ? const Color(0xFF374151)
                                  : const Color(0xFFF3F4F6),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: FractionallySizedBox(
                              alignment: Alignment.centerLeft,
                              widthFactor: progress.clamp(0.0, 1.0),
                              child: Container(
                                decoration: BoxDecoration(
                                  color: const Color(0xFF2EC4B6),
                                  borderRadius: BorderRadius.circular(6),
                                  boxShadow: [
                                    BoxShadow(
                                      color: const Color(
                                        0xFF2EC4B6,
                                      ).withOpacity(0.3),
                                      blurRadius: 10,
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),

                          const SizedBox(height: 12),

                          // Points to Go
                          Row(
                            children: [
                              const Icon(
                                Icons.trending_up,
                                color: Color(0xFF2EC4B6),
                                size: 14,
                              ),
                              const SizedBox(width: 4),
                              Flexible(
                                child: Text(
                                  '$pointsToGo points to go until your next reward',
                                  style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w500,
                                    color: Color(0xFF2EC4B6),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                    // Action Buttons
                    Padding(
                      padding: const EdgeInsets.fromLTRB(24, 8, 24, 32),
                      child: Column(
                        children: [
                          // Awesome Button
                          SizedBox(
                            width: double.infinity,
                            height: 56,
                            child: ElevatedButton(
                              onPressed: () => Get.back(),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF1F3D89),
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                elevation: 0,
                              ),
                              child: const Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    'Awesome!',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  SizedBox(width: 8),
                                  Icon(Icons.arrow_forward, size: 20),
                                ],
                              ),
                            ),
                          ),

                          const SizedBox(height: 16),

                          // View Leaderboard Button
                          TextButton(
                            onPressed: () {
                              // TODO: Navigate to leaderboard
                            },
                            child: Text(
                              'View leaderboard',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                                color: isDark
                                    ? const Color(0xFFA1ACC3)
                                    : const Color(0xFF6B7280),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
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
