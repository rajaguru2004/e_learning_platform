import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../controllers/lesson_player_controller.dart';

class LessonPlayerView extends GetView<LessonPlayerController> {
  const LessonPlayerView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF6F6F8),
      body: SafeArea(
        child: Stack(
          children: [
            CustomScrollView(
              slivers: [
                // Header / Top Bar
                _buildHeader(),

                // Video Player
                SliverToBoxAdapter(child: _buildVideoPlayer()),

                // Content Section
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(24, 32, 24, 120),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildModuleInfo(),
                        const SizedBox(height: 12),
                        _buildLessonTitle(),
                        const SizedBox(height: 16),
                        _buildInstructorCard(),
                        const SizedBox(height: 32),
                        _buildLessonDescription(),
                        const SizedBox(height: 32),
                        _buildProgressWidget(),
                        const SizedBox(height: 40),
                        _buildUpNextSection(),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            // Fixed Bottom Navigation
            _buildBottomNavigation(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return SliverAppBar(
      pinned: true,
      elevation: 0,
      backgroundColor: Colors.white.withOpacity(0.8),
      surfaceTintColor: Colors.transparent,
      leading: Container(
        margin: const EdgeInsets.only(left: 8),
        child: IconButton(
          icon: const Icon(Icons.menu, color: Color(0xFF0F121A)),
          onPressed: () {},
          style: IconButton.styleFrom(
            backgroundColor: Colors.transparent,
            hoverColor: Colors.grey[100],
          ),
        ),
      ),
      title: Text(
        'LESSON PLAYER',
        style: GoogleFonts.lexend(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: Colors.grey[500],
          letterSpacing: 1.5,
        ),
      ),
      centerTitle: true,
      actions: [
        Container(
          margin: const EdgeInsets.only(right: 8),
          child: IconButton(
            icon: const Icon(Icons.close, color: Color(0xFF0F121A)),
            onPressed: () => Get.back(),
            style: IconButton.styleFrom(
              backgroundColor: Colors.transparent,
              hoverColor: Colors.grey[100],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildVideoPlayer() {
    return Container(
      width: double.infinity,
      color: Colors.black,
      child: AspectRatio(
        aspectRatio: 16 / 9,
        child: Stack(
          children: [
            // Video thumbnail/background
            Container(
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: NetworkImage(
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuBTIJqyGnwRZ88Okp34oPWMbGdy4c6euzh6zowSkA6eRuxI-sGYA8kgRBmArvBK-wQhqI1_qpPWdUO0S-dvtgUAngyisqK0GJ0figqlkoZ7V9kO7LqmqAp60Gzi6qS-spBgb4EwIP1WoYK5CRaOwjExGNZN-FqNjspHZCx7YwRYyKbnHrX-eOyT3vs4_oFqp1-8Vf6UYFBp2Tv85qGQ12tuBQnLcdnxCi5p9XTk6s4sXWcKpVMxpXuqIkndTryVQjGZeI3l6MlaFQ4',
                  ),
                  fit: BoxFit.cover,
                ),
              ),
              child: Container(
                decoration: BoxDecoration(color: Colors.black.withOpacity(0.3)),
              ),
            ),

            // Play Button
            Center(
              child: Obx(
                () => GestureDetector(
                  onTap: controller.togglePlay,
                  child: Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: const Color(0xFF1F3D89).withOpacity(0.9),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.3),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Icon(
                      controller.isPlaying.value
                          ? Icons.pause
                          : Icons.play_arrow,
                      color: Colors.white,
                      size: 40,
                    ),
                  ),
                ),
              ),
            ),

            // Custom Player Controls
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [Colors.transparent, Colors.black.withOpacity(0.8)],
                  ),
                ),
                child: Column(
                  children: [
                    // Progress Bar
                    Obx(
                      () => Row(
                        children: [
                          Expanded(
                            flex: 5,
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(2),
                              child: Stack(
                                children: [
                                  Container(
                                    height: 4,
                                    color: Colors.white.withOpacity(0.3),
                                  ),
                                  FractionallySizedBox(
                                    widthFactor: controller.videoProgress.value,
                                    child: Container(
                                      height: 4,
                                      decoration: BoxDecoration(
                                        color: const Color(0xFF1F3D89),
                                        borderRadius: BorderRadius.circular(2),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            flex: 3,
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(2),
                              child: Container(
                                height: 4,
                                color: Colors.white.withOpacity(0.3),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 8),

                    // Controls
                    Obx(
                      () => Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            '${controller.currentTime.value} / ${controller.totalTime.value}',
                            style: GoogleFonts.lexend(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          Row(
                            children: [
                              Icon(
                                Icons.settings,
                                color: Colors.white,
                                size: 18,
                              ),
                              const SizedBox(width: 16),
                              Icon(
                                Icons.fullscreen,
                                color: Colors.white,
                                size: 18,
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildModuleInfo() {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            color: const Color(0xFF1F3D89).withOpacity(0.1),
            borderRadius: BorderRadius.circular(4),
          ),
          child: Text(
            'MODULE 03',
            style: GoogleFonts.lexend(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: const Color(0xFF1F3D89),
              letterSpacing: 1.5,
            ),
          ),
        ),
        const SizedBox(width: 8),
        Text(
          '• 15 mins',
          style: GoogleFonts.lexend(
            fontSize: 10,
            fontWeight: FontWeight.w500,
            color: Colors.grey[400],
          ),
        ),
      ],
    );
  }

  Widget _buildLessonTitle() {
    return Text(
      'Mastering Grid Systems and Visual Hierarchy',
      style: GoogleFonts.lexend(
        fontSize: 24,
        fontWeight: FontWeight.bold,
        color: const Color(0xFF0F121A),
        height: 1.2,
      ),
    );
  }

  Widget _buildInstructorCard() {
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
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.grey[200],
              image: DecorationImage(
                image: NetworkImage(
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuAZAKtuSumTIhnZKGOJRoYNM5OxOdpbupKrytv-B9Y6tUe-8AVPXA6ibvnUlGGeOMHZY6TyQy6tEMnFGgq-KhKv-EiyxsMxCIfFBaBmh35BO6c2IHA5jodhTeMHl7WXJKzl0J-dmMhfiDmLPzNTXvr-X3kayGAN2d7TV4x1hzt8pFFX_hRKB3aJObAg5omJjm8eAHEOQANXyIkRCYN6CU0jsVaE71C9RkTlnv0gRonM8mdBeqB8qyKqRwbwiWkQAwPD0ahbysGBPnk',
                ),
                fit: BoxFit.cover,
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Alex Sterling',
                  style: GoogleFonts.lexend(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF0F121A),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Lead Design Instructor',
                  style: GoogleFonts.lexend(
                    fontSize: 11,
                    color: Colors.grey[500],
                  ),
                ),
              ],
            ),
          ),
          TextButton(
            onPressed: () {},
            style: TextButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            ),
            child: Text(
              'Follow',
              style: GoogleFonts.lexend(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: const Color(0xFF1F3D89),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLessonDescription() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'In this comprehensive lesson, we\'ll dive deep into the mechanics of 12-column grid systems. Understanding how to balance whitespace with content is the cornerstone of professional UI design.',
          style: GoogleFonts.lexend(
            fontSize: 14,
            color: Colors.grey[600],
            height: 1.6,
          ),
        ),
        const SizedBox(height: 16),
        Text(
          'We will cover:',
          style: GoogleFonts.lexend(
            fontSize: 14,
            color: Colors.grey[600],
            height: 1.6,
          ),
        ),
        const SizedBox(height: 8),
        _buildBulletPoint('Fixed vs. Fluid grid structures'),
        const SizedBox(height: 8),
        _buildBulletPoint('Establishing a 4px horizontal baseline'),
        const SizedBox(height: 8),
        _buildBulletPoint('Gestalt principles in modern layout design'),
      ],
    );
  }

  Widget _buildBulletPoint(String text) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(width: 20),
        Container(
          margin: const EdgeInsets.only(top: 9),
          width: 4,
          height: 4,
          decoration: BoxDecoration(
            color: Colors.grey[400],
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            text,
            style: GoogleFonts.lexend(
              fontSize: 14,
              color: Colors.grey[600],
              height: 1.6,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildProgressWidget() {
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
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Your Progress',
                    style: GoogleFonts.lexend(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFF0F121A),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '12 of 18 lessons completed',
                    style: GoogleFonts.lexend(
                      fontSize: 12,
                      color: Colors.grey[500],
                    ),
                  ),
                ],
              ),
              Text(
                '65%',
                style: GoogleFonts.lexend(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF1F3D89),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: 0.65,
              backgroundColor: Colors.grey[100],
              valueColor: const AlwaysStoppedAnimation<Color>(
                Color(0xFF1F3D89),
              ),
              minHeight: 8,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildUpNextSection() {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'UP NEXT',
              style: GoogleFonts.lexend(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: Colors.grey[400],
                letterSpacing: 1.5,
              ),
            ),
            TextButton(
              onPressed: () {},
              child: Text(
                'See All',
                style: GoogleFonts.lexend(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF1F3D89),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        _buildUpNextItem(
          icon: Icons.play_circle_outline,
          title: 'Lesson 5: Color Theory in Depth',
          duration: '12:30 • Video',
          isLocked: true,
        ),
        const SizedBox(height: 12),
        _buildUpNextItem(
          icon: Icons.description_outlined,
          title: 'Lesson 6: Practical Typography',
          duration: '8:15 • Reading',
          isLocked: true,
          opacity: 0.6,
        ),
      ],
    );
  }

  Widget _buildUpNextItem({
    required IconData icon,
    required String title,
    required String duration,
    required bool isLocked,
    double opacity = 1.0,
  }) {
    return Opacity(
      opacity: opacity,
      child: InkWell(
        onTap: () {},
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.transparent,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, color: Colors.grey[400], size: 24),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: GoogleFonts.lexend(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFF0F121A),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      duration,
                      style: GoogleFonts.lexend(
                        fontSize: 10,
                        color: Colors.grey[500],
                      ),
                    ),
                  ],
                ),
              ),
              Icon(Icons.lock_outline, color: Colors.grey[300], size: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBottomNavigation() {
    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.9),
          border: Border(top: BorderSide(color: Colors.grey[100]!)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 8,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: SafeArea(
          top: false,
          child: Row(
            children: [
              // Bookmark Button
              Obx(
                () => Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: const Color(0xFF1F3D89).withOpacity(0.2),
                      width: 2,
                    ),
                  ),
                  child: IconButton(
                    icon: Icon(
                      controller.isBookmarked.value
                          ? Icons.bookmark
                          : Icons.bookmark_border,
                      color: const Color(0xFF1F3D89),
                    ),
                    onPressed: controller.toggleBookmark,
                  ),
                ),
              ),
              const SizedBox(width: 12),

              // Next Lesson Button
              Expanded(
                child: SizedBox(
                  height: 56,
                  child: ElevatedButton(
                    onPressed: controller.goToNextLesson,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF1F3D89),
                      foregroundColor: Colors.white,
                      elevation: 4,
                      shadowColor: const Color(0xFF1F3D89).withOpacity(0.2),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Next Lesson',
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
            ],
          ),
        ),
      ),
    );
  }
}
