import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../widgets/app_bottom_nav_bar.dart';

class AchievementsView extends StatelessWidget {
  const AchievementsView({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final backgroundColor = isDark
        ? const Color(0xFF13161F)
        : const Color(0xFFF6F6F8);
    final primaryColor = const Color(0xFF1F3D89);
    final rewardYellow = const Color(0xFFF4C430);

    return Scaffold(
      backgroundColor: backgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            // Top App Bar
            _buildTopAppBar(context, isDark, primaryColor),

            // Scrollable Content
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    // Profile & Progress Summary
                    _buildProfileSection(isDark, primaryColor, rewardYellow),

                    // Milestones Section
                    _buildMilestonesSection(isDark, primaryColor, rewardYellow),

                    const SizedBox(height: 100),
                  ],
                ),
              ),
            ),

            // Bottom Action Button
            _buildBottomAction(primaryColor),
          ],
        ),
      ),
      bottomNavigationBar: const AppBottomNavBar(currentIndex: 2),
    );
  }

  Widget _buildTopAppBar(
    BuildContext context,
    bool isDark,
    Color primaryColor,
  ) {
    final textColor = isDark ? Colors.white : primaryColor;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: isDark
            ? const Color(0xFF13161F).withOpacity(0.8)
            : const Color(0xFFF6F6F8).withOpacity(0.8),
        border: Border(
          bottom: BorderSide(
            color: isDark
                ? Colors.white.withOpacity(0.05)
                : Colors.black.withOpacity(0.05),
          ),
        ),
      ),
      child: Row(
        children: [
          InkWell(
            onTap: () => Navigator.pop(context),
            child: SizedBox(
              width: 48,
              height: 48,
              child: Icon(Icons.arrow_back_ios, color: textColor, size: 24),
            ),
          ),
          Expanded(
            child: Text(
              'Achievements',
              textAlign: TextAlign.center,
              style: GoogleFonts.lexend(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: textColor,
                letterSpacing: -0.5,
              ),
            ),
          ),
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(borderRadius: BorderRadius.circular(8)),
            child: IconButton(
              icon: Icon(Icons.share, color: textColor),
              onPressed: () {},
              padding: EdgeInsets.zero,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileSection(
    bool isDark,
    Color primaryColor,
    Color rewardYellow,
  ) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          // Profile Avatar with Badge
          Stack(
            children: [
              Container(
                width: 96,
                height: 96,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: isDark
                        ? Colors.white.withOpacity(0.1)
                        : primaryColor.withOpacity(0.2),
                    width: 4,
                  ),
                  image: const DecorationImage(
                    image: NetworkImage('https://i.pravatar.cc/200?img=12'),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              Positioned(
                bottom: -4,
                right: -4,
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: rewardYellow,
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: isDark ? const Color(0xFF13161F) : Colors.white,
                      width: 2,
                    ),
                  ),
                  child: Icon(
                    Icons.verified_user,
                    color: primaryColor,
                    size: 16,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Name and Rank
          Text(
            'Alex Johnson',
            style: GoogleFonts.lexend(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : primaryColor,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Current Rank: Achiever',
            style: GoogleFonts.lexend(
              fontSize: 16,
              fontWeight: FontWeight.w500,
              color: isDark
                  ? Colors.white.withOpacity(0.7)
                  : primaryColor.withOpacity(0.7),
            ),
          ),

          const SizedBox(height: 24),

          // XP Bar
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isDark ? Colors.white.withOpacity(0.05) : Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isDark
                    ? Colors.white.withOpacity(0.05)
                    : Colors.black.withOpacity(0.05),
              ),
              boxShadow: isDark
                  ? null
                  : [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'NEXT LEVEL: SPECIALIST',
                      style: GoogleFonts.lexend(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: isDark ? Colors.white : primaryColor,
                        letterSpacing: 1,
                      ),
                    ),
                    Text(
                      '1,250 / 2,000 XP',
                      style: GoogleFonts.lexend(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: isDark ? Colors.white : primaryColor,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                ClipRRect(
                  borderRadius: BorderRadius.circular(6),
                  child: LinearProgressIndicator(
                    value: 0.625,
                    backgroundColor: isDark
                        ? Colors.white.withOpacity(0.1)
                        : primaryColor.withOpacity(0.1),
                    valueColor: AlwaysStoppedAnimation<Color>(primaryColor),
                    minHeight: 12,
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Icon(
                      Icons.trending_up,
                      size: 14,
                      color: isDark
                          ? Colors.white.withOpacity(0.6)
                          : primaryColor.withOpacity(0.6),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '750 XP remaining to unlock Specialist status',
                      style: GoogleFonts.lexend(
                        fontSize: 11,
                        fontWeight: FontWeight.w500,
                        color: isDark
                            ? Colors.white.withOpacity(0.6)
                            : primaryColor.withOpacity(0.6),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMilestonesSection(
    bool isDark,
    Color primaryColor,
    Color rewardYellow,
  ) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Learning Path',
            style: GoogleFonts.lexend(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : primaryColor,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 16),

          // Completed: Newbie
          _buildMilestoneCard(
            isDark: isDark,
            primaryColor: primaryColor,
            icon: Icons.school,
            title: 'Newbie',
            subtitle: 'Started your journey',
            status: MilestoneStatus.completed,
            rewardYellow: rewardYellow,
          ),
          const SizedBox(height: 16),

          // Completed: Explorer
          _buildMilestoneCard(
            isDark: isDark,
            primaryColor: primaryColor,
            icon: Icons.explore,
            title: 'Explorer',
            subtitle: 'Completed first course',
            status: MilestoneStatus.completed,
            rewardYellow: rewardYellow,
          ),
          const SizedBox(height: 16),

          // Current: Achiever
          _buildMilestoneCard(
            isDark: isDark,
            primaryColor: primaryColor,
            icon: Icons.military_tech,
            title: 'Achiever',
            subtitle: 'Consistent 7-day streak',
            status: MilestoneStatus.current,
            rewardYellow: rewardYellow,
          ),
          const SizedBox(height: 16),

          // Locked: Specialist
          _buildMilestoneCard(
            isDark: isDark,
            primaryColor: primaryColor,
            icon: Icons.psychology,
            title: 'Specialist',
            subtitle: 'Unlock at 2,000 XP',
            status: MilestoneStatus.locked,
            rewardYellow: rewardYellow,
          ),
          const SizedBox(height: 16),

          // Locked: Expert
          _buildMilestoneCard(
            isDark: isDark,
            primaryColor: primaryColor,
            icon: Icons.workspace_premium,
            title: 'Expert',
            subtitle: 'Unlock at 5,000 XP',
            status: MilestoneStatus.locked,
            rewardYellow: rewardYellow,
          ),
          const SizedBox(height: 16),

          // Locked: Master
          _buildMilestoneCard(
            isDark: isDark,
            primaryColor: primaryColor,
            icon: Icons.diamond,
            title: 'Master',
            subtitle: 'Unlock at 10,000 XP',
            status: MilestoneStatus.locked,
            rewardYellow: rewardYellow,
          ),
        ],
      ),
    );
  }

  Widget _buildMilestoneCard({
    required bool isDark,
    required Color primaryColor,
    required IconData icon,
    required String title,
    required String subtitle,
    required MilestoneStatus status,
    required Color rewardYellow,
  }) {
    Color backgroundColor;
    Color borderColor;
    Color iconBackgroundColor;
    Color iconColor;
    Color titleColor;
    Color subtitleColor;
    Widget? statusIcon;
    Widget? badge;
    double opacity = 1.0;
    bool hasShadow = false;
    bool isDashed = false;

    switch (status) {
      case MilestoneStatus.completed:
        backgroundColor = isDark
            ? Colors.white.withOpacity(0.05)
            : Colors.white.withOpacity(0.5);
        borderColor = isDark
            ? Colors.white.withOpacity(0.05)
            : Colors.black.withOpacity(0.05);
        iconBackgroundColor = isDark
            ? Colors.white.withOpacity(0.1)
            : primaryColor.withOpacity(0.1);
        iconColor = isDark ? Colors.white : primaryColor;
        titleColor = isDark ? Colors.white : primaryColor;
        subtitleColor = isDark
            ? Colors.white.withOpacity(0.6)
            : primaryColor.withOpacity(0.6);
        statusIcon = const Icon(
          Icons.check_circle,
          color: Colors.green,
          size: 24,
        );
        opacity = 0.8;
        break;

      case MilestoneStatus.current:
        backgroundColor = isDark ? primaryColor : Colors.white;
        borderColor = rewardYellow;
        iconBackgroundColor = rewardYellow.withOpacity(0.2);
        iconColor = rewardYellow;
        titleColor = isDark ? Colors.white : primaryColor;
        subtitleColor = isDark
            ? Colors.white.withOpacity(0.9)
            : primaryColor.withOpacity(0.8);
        statusIcon = Icon(Icons.star, color: rewardYellow, size: 32);
        badge = Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
          decoration: BoxDecoration(
            color: rewardYellow,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            'CURRENT',
            style: GoogleFonts.lexend(
              fontSize: 9,
              fontWeight: FontWeight.bold,
              color: primaryColor,
              letterSpacing: 0.5,
            ),
          ),
        );
        hasShadow = true;
        break;

      case MilestoneStatus.locked:
        backgroundColor = isDark
            ? Colors.black.withOpacity(0.2)
            : Colors.black.withOpacity(0.05);
        borderColor = isDark
            ? Colors.white.withOpacity(0.1)
            : Colors.black.withOpacity(0.1);
        iconBackgroundColor = isDark
            ? Colors.white.withOpacity(0.05)
            : Colors.black.withOpacity(0.1);
        iconColor = isDark
            ? Colors.white.withOpacity(0.4)
            : Colors.black.withOpacity(0.4);
        titleColor = isDark
            ? Colors.white.withOpacity(0.4)
            : Colors.black.withOpacity(0.4);
        subtitleColor = isDark
            ? Colors.white.withOpacity(0.3)
            : Colors.black.withOpacity(0.3);
        statusIcon = Icon(
          Icons.lock,
          color: isDark
              ? Colors.white.withOpacity(0.2)
              : Colors.black.withOpacity(0.2),
          size: 24,
        );
        isDashed = true;
        break;
    }

    return Opacity(
      opacity: status == MilestoneStatus.locked ? 0.6 : opacity,
      child: ColorFiltered(
        colorFilter: status == MilestoneStatus.locked
            ? const ColorFilter.mode(Colors.grey, BlendMode.saturation)
            : const ColorFilter.mode(Colors.transparent, BlendMode.multiply),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: backgroundColor,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: borderColor,
              width: status == MilestoneStatus.current ? 2 : 1,
              style: isDashed ? BorderStyle.none : BorderStyle.solid,
            ),
            boxShadow: hasShadow
                ? [
                    BoxShadow(
                      color: rewardYellow.withOpacity(0.2),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ]
                : null,
          ),
          child: Stack(
            children: [
              Row(
                children: [
                  Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                      color: iconBackgroundColor,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      icon,
                      color: iconColor,
                      size: status == MilestoneStatus.current ? 36 : 32,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: GoogleFonts.lexend(
                            fontSize: status == MilestoneStatus.current
                                ? 18
                                : 16,
                            fontWeight: status == MilestoneStatus.current
                                ? FontWeight.w800
                                : FontWeight.bold,
                            color: titleColor,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          subtitle,
                          style: GoogleFonts.lexend(
                            fontSize: status == MilestoneStatus.locked
                                ? 11
                                : 13,
                            fontWeight: FontWeight.w500,
                            color: subtitleColor,
                            fontStyle: status == MilestoneStatus.locked
                                ? FontStyle.normal
                                : FontStyle.italic,
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (statusIcon != null) statusIcon,
                ],
              ),
              if (badge != null) Positioned(top: 0, right: 0, child: badge),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBottomAction(Color primaryColor) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFFF6F6F8).withOpacity(0.95),
        border: Border(top: BorderSide(color: Colors.black.withOpacity(0.05))),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(
                backgroundColor: primaryColor,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 4,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Continue Learning',
                    style: GoogleFonts.lexend(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Icon(Icons.play_arrow, size: 20),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}

enum MilestoneStatus { completed, current, locked }
