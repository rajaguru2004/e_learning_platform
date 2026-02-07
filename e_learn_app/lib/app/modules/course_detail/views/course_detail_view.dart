import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../controllers/course_detail_controller.dart';

class CourseDetailView extends GetView<CourseDetailController> {
  const CourseDetailView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF6F6F8),
      body: SafeArea(
        child: Stack(
          children: [
            CustomScrollView(
              slivers: [
                // Top App Bar
                SliverAppBar(
                  pinned: true,
                  elevation: 0,
                  backgroundColor: const Color(0xFFF6F6F8).withOpacity(0.8),
                  leading: IconButton(
                    icon: const Icon(
                      Icons.arrow_back_ios,
                      color: Color(0xFF1F3D89),
                    ),
                    onPressed: () => Get.back(),
                  ),
                  title: Text(
                    'Course Details',
                    style: GoogleFonts.lexend(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                      letterSpacing: -0.5,
                    ),
                  ),
                  centerTitle: true,
                  actions: [
                    IconButton(
                      icon: const Icon(
                        Icons.more_vert,
                        color: Color(0xFF1F3D89),
                      ),
                      onPressed: () {},
                    ),
                  ],
                ),

                // Hero Section
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: _buildHeroSection(),
                  ),
                ),

                // Progress Section
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    child: _buildProgressCard(),
                  ),
                ),

                // Stats Row
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: _buildStatsRow(),
                  ),
                ),

                // Course Syllabus
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    child: _buildSyllabusHeader(),
                  ),
                ),

                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
                  sliver: SliverList(
                    delegate: SliverChildListDelegate([
                      _buildLessonItem(
                        icon: Icons.play_circle,
                        title: '01. Visual Hierarchy',
                        duration: 'Video • 12:40',
                        status: LessonStatus.completed,
                      ),
                      const SizedBox(height: 12),
                      _buildLessonItem(
                        icon: Icons.play_circle,
                        title: '02. Typography Systems',
                        duration: 'Video • 15:20',
                        status: LessonStatus.completed,
                      ),
                      const SizedBox(height: 12),
                      _buildLessonItem(
                        icon: Icons.play_circle,
                        title: '03. Modern Color Theory',
                        duration: 'Video • 22:15 • Resume',
                        status: LessonStatus.inProgress,
                      ),
                      const SizedBox(height: 12),
                      _buildLessonItem(
                        icon: Icons.quiz,
                        title: '04. Color Logic Quiz',
                        duration: 'Quiz • 10 Questions',
                        status: LessonStatus.locked,
                      ),
                      const SizedBox(height: 12),
                      _buildLessonItem(
                        icon: Icons.play_circle,
                        title: '05. Layout Grids',
                        duration: 'Video • 18:30',
                        status: LessonStatus.locked,
                      ),
                    ]),
                  ),
                ),
              ],
            ),

            // Bottom Action Button
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: _buildBottomAction(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeroSection() {
    return Container(
      height: 200,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: Stack(
          fit: StackFit.expand,
          children: [
            Image.network(
              'https://lh3.googleusercontent.com/aida-public/AB6AXuA32-oqyLJl2r32AeJD1ZTB9Uu6jfC-fqv4fzfID48El5MtoVsv8angUbAIsK7ZyvvTzOr6P8kulGW8mNIvXewqlp8iNw9BMH3cRRFndOHzuyuyFqzzc0uw3gwfv4jMwezzBUBvQMY56yAQaJX-zF_yDC0ciIBgCYTWr2yKypjwatIxVi3W3OxanIdFMildPPcxWb_u7zyd-E_HiKE8vi-TX6mr1GNs_mr-1bucKfzUNO4Y0U63rm0Oc10zHY7BR-KsZbvRYaZbBBU',
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  color: Colors.grey[300],
                  child: const Center(
                    child: Icon(Icons.image, size: 48, color: Colors.grey),
                  ),
                );
              },
            ),
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [Colors.transparent, Colors.black.withOpacity(0.6)],
                ),
              ),
            ),
            Positioned(
              bottom: 16,
              left: 16,
              right: 16,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1F3D89),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      'DESIGN MASTERY',
                      style: GoogleFonts.lexend(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1,
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Advanced UI Design Principles',
                    style: GoogleFonts.lexend(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProgressCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[100]!),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'COURSE PROGRESS',
                    style: GoogleFonts.lexend(
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      color: Colors.grey[500],
                      letterSpacing: 1.5,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.baseline,
                    textBaseline: TextBaseline.alphabetic,
                    children: [
                      Text(
                        '85',
                        style: GoogleFonts.lexend(
                          fontSize: 30,
                          fontWeight: FontWeight.bold,
                          color: const Color(0xFF1F3D89),
                        ),
                      ),
                      Text(
                        '%',
                        style: GoogleFonts.lexend(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: const Color(0xFF2EC4B6),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              Text(
                'Almost finished!',
                style: GoogleFonts.lexend(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF2EC4B6),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: 0.85,
              backgroundColor: Colors.grey[100],
              valueColor: const AlwaysStoppedAnimation<Color>(
                Color(0xFF2EC4B6),
              ),
              minHeight: 12,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsRow() {
    return Row(
      children: [
        Expanded(child: _buildStatCard('Total', '24', const Color(0xFF1F3D89))),
        const SizedBox(width: 12),
        Expanded(child: _buildStatCard('Done', '20', const Color(0xFF2EC4B6))),
        const SizedBox(width: 12),
        Expanded(child: _buildStatCard('Left', '4', Colors.grey[400]!)),
      ],
    );
  }

  Widget _buildStatCard(String label, String value, Color valueColor) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[100]!),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          Text(
            label,
            style: GoogleFonts.lexend(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: Colors.grey[500],
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: GoogleFonts.lexend(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: valueColor,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSyllabusHeader() {
    return Row(
      children: [
        const Icon(
          Icons.format_list_bulleted,
          color: Color(0xFF1F3D89),
          size: 24,
        ),
        const SizedBox(width: 8),
        Text(
          'Course Syllabus',
          style: GoogleFonts.lexend(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            letterSpacing: -0.5,
          ),
        ),
      ],
    );
  }

  Widget _buildLessonItem({
    required IconData icon,
    required String title,
    required String duration,
    required LessonStatus status,
  }) {
    Color bgColor;
    Color iconBgColor;
    Color iconColor;
    IconData statusIcon;
    Color statusIconColor;
    bool hasRing = false;
    double opacity = 1.0;

    switch (status) {
      case LessonStatus.completed:
        bgColor = Colors.white;
        iconBgColor = const Color(0xFF2EC4B6).withOpacity(0.1);
        iconColor = const Color(0xFF2EC4B6);
        statusIcon = Icons.check_circle;
        statusIconColor = const Color(0xFF2EC4B6);
        break;
      case LessonStatus.inProgress:
        bgColor = const Color(0xFF1F3D89).withOpacity(0.05);
        iconBgColor = const Color(0xFF1F3D89);
        iconColor = Colors.white;
        statusIcon = Icons.radio_button_checked;
        statusIconColor = const Color(0xFF1F3D89);
        hasRing = true;
        break;
      case LessonStatus.locked:
        bgColor = Colors.grey[50]!;
        iconBgColor = Colors.grey[200]!;
        iconColor = Colors.grey[500]!;
        statusIcon = Icons.lock;
        statusIconColor = Colors.grey[400]!;
        opacity = 0.6;
        break;
    }

    return Opacity(
      opacity: opacity,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: hasRing
                ? const Color(0xFF1F3D89).withOpacity(0.2)
                : Colors.grey[100]!,
          ),
          boxShadow: hasRing
              ? [
                  BoxShadow(
                    color: const Color(0xFF1F3D89).withOpacity(0.1),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ]
              : [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: iconBgColor,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, color: iconColor, size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.lexend(
                      fontSize: 14,
                      fontWeight: status == LessonStatus.inProgress
                          ? FontWeight.bold
                          : FontWeight.w600,
                      color: status == LessonStatus.inProgress
                          ? const Color(0xFF1F3D89)
                          : Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    duration,
                    style: GoogleFonts.lexend(
                      fontSize: 12,
                      color: status == LessonStatus.inProgress
                          ? const Color(0xFF1F3D89).withOpacity(0.6)
                          : Colors.grey[500],
                    ),
                  ),
                ],
              ),
            ),
            Icon(statusIcon, color: statusIconColor, size: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomAction() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.8),
        border: Border(top: BorderSide(color: Colors.grey[100]!)),
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: () {},
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF1F3D89),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              elevation: 4,
              shadowColor: const Color(0xFF1F3D89).withOpacity(0.2),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'Continue Lesson 03',
                  style: GoogleFonts.lexend(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(width: 8),
                const Icon(Icons.arrow_forward, size: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

enum LessonStatus { completed, inProgress, locked }
