import 'package:flutter/material.dart';

class LessonViewerScreen extends StatefulWidget {
  final String lessonTitle;
  final String lessonNumber;
  final String duration;
  final int totalLessons;
  final int currentLessonIndex;

  const LessonViewerScreen({
    Key? key,
    required this.lessonTitle,
    required this.lessonNumber,
    required this.duration,
    required this.totalLessons,
    required this.currentLessonIndex,
  }) : super(key: key);

  @override
  State<LessonViewerScreen> createState() => _LessonViewerScreenState();
}

class _LessonViewerScreenState extends State<LessonViewerScreen> {
  bool isPlaying = false;
  double videoProgress = 0.35; // 35% watched
  bool showControls = true;
  int selectedTab = 0; // 0: Overview, 1: Notes, 2: Resources

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDarkMode
          ? const Color(0xFF13161f)
          : const Color(0xFFf6f6f8),
      body: SafeArea(
        child: Column(
          children: [
            // Video Player Section
            _buildVideoPlayer(isDarkMode),

            // Scrollable Content
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Lesson Header
                    _buildLessonHeader(isDarkMode),

                    // Tab Bar
                    _buildTabBar(isDarkMode),

                    // Tab Content
                    _buildTabContent(isDarkMode),
                  ],
                ),
              ),
            ),

            // Bottom Navigation
            _buildBottomNavigation(isDarkMode),
          ],
        ),
      ),
    );
  }

  Widget _buildVideoPlayer(bool isDarkMode) {
    return Container(
      width: double.infinity,
      height: 240,
      color: Colors.black,
      child: Stack(
        children: [
          // Video thumbnail/placeholder
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Colors.grey[900]!, Colors.grey[800]!],
              ),
            ),
            child: Center(
              child: Icon(
                isPlaying
                    ? Icons.pause_circle_filled
                    : Icons.play_circle_filled,
                size: 64,
                color: Colors.white.withOpacity(0.9),
              ),
            ),
          ),

          // Top Controls
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [Colors.black.withOpacity(0.7), Colors.transparent],
                ),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconButton(
                    icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
                    onPressed: () => Navigator.pop(context),
                  ),
                  IconButton(
                    icon: const Icon(Icons.more_vert, color: Colors.white),
                    onPressed: () {},
                  ),
                ],
              ),
            ),
          ),

          // Center Play/Pause Button
          Center(
            child: GestureDetector(
              onTap: () {
                setState(() {
                  isPlaying = !isPlaying;
                });
              },
              child: Container(
                width: 72,
                height: 72,
                decoration: BoxDecoration(
                  color: const Color(0xFF1f3d89).withOpacity(0.95),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF1f3d89).withOpacity(0.4),
                      blurRadius: 20,
                      spreadRadius: 2,
                    ),
                  ],
                ),
                child: Icon(
                  isPlaying ? Icons.pause : Icons.play_arrow,
                  size: 40,
                  color: Colors.white,
                ),
              ),
            ),
          ),

          // Bottom Progress Bar
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Progress Indicator
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Row(
                    children: [
                      Text(
                        '${(videoProgress * 22.25).toStringAsFixed(0)}:${((videoProgress * 22.25 % 1) * 60).toInt().toString().padLeft(2, '0')}',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: SliderTheme(
                          data: SliderThemeData(
                            trackHeight: 3,
                            thumbShape: const RoundSliderThumbShape(
                              enabledThumbRadius: 6,
                            ),
                            overlayShape: const RoundSliderOverlayShape(
                              overlayRadius: 12,
                            ),
                            activeTrackColor: const Color(0xFF2EC4B6),
                            inactiveTrackColor: Colors.white.withOpacity(0.3),
                            thumbColor: const Color(0xFF2EC4B6),
                            overlayColor: const Color(
                              0xFF2EC4B6,
                            ).withOpacity(0.3),
                          ),
                          child: Slider(
                            value: videoProgress,
                            onChanged: (value) {
                              setState(() {
                                videoProgress = value;
                              });
                            },
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Text(
                        '22:15',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLessonHeader(bool isDarkMode) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Lesson number and category
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFF1f3d89),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  'LESSON ${widget.lessonNumber}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.2,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFF2EC4B6).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: const Color(0xFF2EC4B6).withOpacity(0.3),
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.play_circle_outline,
                      size: 12,
                      color: const Color(0xFF2EC4B6),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      widget.duration,
                      style: const TextStyle(
                        color: Color(0xFF2EC4B6),
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Lesson Title
          Text(
            widget.lessonTitle,
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: isDarkMode ? Colors.white : const Color(0xFF0f121a),
              height: 1.2,
            ),
          ),
          const SizedBox(height: 12),

          // Progress indicator
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isDarkMode ? const Color(0xFF1f2937) : Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isDarkMode
                    ? const Color(0xFF374151)
                    : const Color(0xFFe5e7eb),
              ),
            ),
            child: Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: const Color(0xFF2EC4B6).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(
                    Icons.bar_chart_rounded,
                    color: Color(0xFF2EC4B6),
                    size: 20,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Your Progress',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                              color: isDarkMode
                                  ? Colors.grey[400]
                                  : Colors.grey[600],
                            ),
                          ),
                          Text(
                            '${(videoProgress * 100).toInt()}%',
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF2EC4B6),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(10),
                        child: LinearProgressIndicator(
                          value: videoProgress,
                          backgroundColor: isDarkMode
                              ? const Color(0xFF374151)
                              : const Color(0xFFe5e7eb),
                          valueColor: const AlwaysStoppedAnimation<Color>(
                            Color(0xFF2EC4B6),
                          ),
                          minHeight: 6,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTabBar(bool isDarkMode) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: isDarkMode ? const Color(0xFF1f2937) : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isDarkMode ? const Color(0xFF374151) : const Color(0xFFe5e7eb),
        ),
      ),
      child: Row(
        children: [
          _buildTab('Overview', 0, isDarkMode),
          _buildTab('Notes', 1, isDarkMode),
          _buildTab('Resources', 2, isDarkMode),
        ],
      ),
    );
  }

  Widget _buildTab(String title, int index, bool isDarkMode) {
    final isSelected = selectedTab == index;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            selectedTab = index;
          });
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF1f3d89) : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Text(
            title,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 14,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
              color: isSelected
                  ? Colors.white
                  : (isDarkMode ? Colors.grey[400] : Colors.grey[600]),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTabContent(bool isDarkMode) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (selectedTab == 0) _buildOverviewTab(isDarkMode),
          if (selectedTab == 1) _buildNotesTab(isDarkMode),
          if (selectedTab == 2) _buildResourcesTab(isDarkMode),
        ],
      ),
    );
  }

  Widget _buildOverviewTab(bool isDarkMode) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'About This Lesson',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: isDarkMode ? Colors.white : const Color(0xFF0f121a),
          ),
        ),
        const SizedBox(height: 12),
        Text(
          'In this comprehensive lesson, you\'ll explore the foundational principles of modern color theory and how it applies to digital design. Learn how to create harmonious color palettes, understand color psychology, and implement effective color systems in your UI projects.',
          style: TextStyle(
            fontSize: 14,
            height: 1.6,
            color: isDarkMode ? Colors.grey[300] : Colors.grey[700],
          ),
        ),
        const SizedBox(height: 24),
        Text(
          'What You\'ll Learn',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: isDarkMode ? Colors.white : const Color(0xFF0f121a),
          ),
        ),
        const SizedBox(height: 12),
        _buildLearningPoint(
          'Color wheel fundamentals and relationships',
          isDarkMode,
        ),
        _buildLearningPoint(
          'Creating accessible color combinations',
          isDarkMode,
        ),
        _buildLearningPoint(
          'Psychology of color in user interfaces',
          isDarkMode,
        ),
        _buildLearningPoint('Building scalable color systems', isDarkMode),
        _buildLearningPoint(
          'Tools and workflows for color selection',
          isDarkMode,
        ),
      ],
    );
  }

  Widget _buildLearningPoint(String text, bool isDarkMode) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            margin: const EdgeInsets.only(top: 4),
            width: 20,
            height: 20,
            decoration: BoxDecoration(
              color: const Color(0xFF2EC4B6).withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.check, size: 14, color: Color(0xFF2EC4B6)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              text,
              style: TextStyle(
                fontSize: 14,
                height: 1.5,
                color: isDarkMode ? Colors.grey[300] : Colors.grey[700],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNotesTab(bool isDarkMode) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'My Notes',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: isDarkMode ? Colors.white : const Color(0xFF0f121a),
          ),
        ),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isDarkMode ? const Color(0xFF1f2937) : Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isDarkMode
                  ? const Color(0xFF374151)
                  : const Color(0xFFe5e7eb),
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextField(
                maxLines: 6,
                decoration: InputDecoration(
                  hintText: 'Take notes while watching...',
                  hintStyle: TextStyle(
                    color: isDarkMode ? Colors.grey[500] : Colors.grey[400],
                  ),
                  border: InputBorder.none,
                ),
                style: TextStyle(
                  fontSize: 14,
                  color: isDarkMode ? Colors.white : const Color(0xFF0f121a),
                ),
              ),
              const SizedBox(height: 12),
              ElevatedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.add, size: 18),
                label: const Text('Save Note'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1f3d89),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 10,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildResourcesTab(bool isDarkMode) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Lesson Resources',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: isDarkMode ? Colors.white : const Color(0xFF0f121a),
          ),
        ),
        const SizedBox(height: 12),
        _buildResourceItem(
          'Color Theory Cheat Sheet.pdf',
          '2.4 MB',
          Icons.picture_as_pdf,
          isDarkMode,
        ),
        _buildResourceItem(
          'Palette Examples.fig',
          '1.8 MB',
          Icons.design_services,
          isDarkMode,
        ),
        _buildResourceItem(
          'Color Contrast Guide.pdf',
          '1.2 MB',
          Icons.picture_as_pdf,
          isDarkMode,
        ),
      ],
    );
  }

  Widget _buildResourceItem(
    String title,
    String size,
    IconData icon,
    bool isDarkMode,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isDarkMode ? const Color(0xFF1f2937) : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isDarkMode ? const Color(0xFF374151) : const Color(0xFFe5e7eb),
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: const Color(0xFF1f3d89).withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: const Color(0xFF1f3d89), size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: isDarkMode ? Colors.white : const Color(0xFF0f121a),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  size,
                  style: TextStyle(
                    fontSize: 12,
                    color: isDarkMode ? Colors.grey[400] : Colors.grey[600],
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.download, size: 20),
            color: const Color(0xFF2EC4B6),
            onPressed: () {},
          ),
        ],
      ),
    );
  }

  Widget _buildBottomNavigation(bool isDarkMode) {
    final hasNextLesson = widget.currentLessonIndex < widget.totalLessons - 1;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDarkMode
            ? const Color(0xFF13161f).withOpacity(0.8)
            : Colors.white.withOpacity(0.8),
        border: Border(
          top: BorderSide(
            color: isDarkMode
                ? const Color(0xFF374151)
                : const Color(0xFFe5e7eb),
          ),
        ),
      ),
      child: Row(
        children: [
          // Mark as Complete Button
          Expanded(
            child: OutlinedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.check_circle_outline, size: 20),
              label: const Text('Mark Complete'),
              style: OutlinedButton.styleFrom(
                foregroundColor: const Color(0xFF2EC4B6),
                side: const BorderSide(color: Color(0xFF2EC4B6), width: 2),
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),

          // Next Lesson Button
          Expanded(
            child: ElevatedButton(
              onPressed: hasNextLesson ? () {} : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1f3d89),
                foregroundColor: Colors.white,
                disabledBackgroundColor: Colors.grey[300],
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 0,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    hasNextLesson ? 'Next Lesson' : 'Complete',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                    ),
                  ),
                  if (hasNextLesson) ...[
                    const SizedBox(width: 8),
                    const Icon(Icons.arrow_forward, size: 18),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
