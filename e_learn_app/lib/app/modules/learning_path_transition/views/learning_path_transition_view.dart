import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../controllers/learning_path_transition_controller.dart';
import '../widgets/curved_path_painter.dart';
import '../widgets/lesson_node_widget.dart';

class LearningPathTransitionView
    extends GetView<LearningPathTransitionController> {
  const LearningPathTransitionView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FB),
      body: SafeArea(
        child: Stack(
          children: [
            // Decorative background element
            Positioned(
              top: 0,
              right: 0,
              child: Container(
                width: 256,
                height: 256,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [
                      const Color(0xFF1F1F89).withOpacity(0.05),
                      Colors.transparent,
                    ],
                  ),
                ),
                transform: Matrix4.translationValues(100, -100, 0),
              ),
            ),

            // Main content
            Column(
              children: [
                _buildHeader(),
                Expanded(child: _buildLearningPath(context)),
                _buildBottomNavigation(),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.fromLTRB(24, 48, 24, 16),
      color: const Color(0xFFF8F9FB).withOpacity(0.8),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Advanced UI Principles',
                      style: GoogleFonts.lexend(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: const Color(0xFF0F121A),
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Container(
                          width: 96,
                          height: 6,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(3),
                            color: Colors.grey[200],
                          ),
                          child: FractionallySizedBox(
                            alignment: Alignment.centerLeft,
                            widthFactor: 0.4,
                            child: Container(
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(3),
                                color: const Color(0xFF2EC4B6),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          '40% COMPLETE',
                          style: GoogleFonts.lexend(
                            fontSize: 10,
                            fontWeight: FontWeight.w500,
                            color: Colors.grey[500],
                            letterSpacing: 1.5,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.settings,
                  color: Color(0xFF0F121A),
                  size: 20,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLearningPath(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return SingleChildScrollView(
          child: SizedBox(
            height: constraints.maxHeight > 800 ? constraints.maxHeight : 800,
            child: Stack(
              children: [
                // Curved path background
                Positioned.fill(
                  child: CustomPaint(
                    painter: CurvedPathPainter(
                      pathColor: const Color(0xFF1F1F89),
                      strokeWidth: 4,
                    ),
                  ),
                ),

                // Lesson nodes
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 40,
                    vertical: 32,
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      // Node 1 - Completed (left aligned)
                      const Padding(
                        padding: EdgeInsets.only(left: 40),
                        child: LessonNodeWidget(
                          lessonNumber: 1,
                          title: '01: Introduction',
                          state: NodeState.completed,
                          alignRight: false,
                        ),
                      ),

                      // Node 2 - Completed (right aligned)
                      const Padding(
                        padding: EdgeInsets.only(right: 40),
                        child: LessonNodeWidget(
                          lessonNumber: 2,
                          title: '02: Visual Hierarchy',
                          state: NodeState.completed,
                          alignRight: true,
                        ),
                      ),

                      // Node 3 - Current (left aligned, larger)
                      const Padding(
                        padding: EdgeInsets.only(left: 60),
                        child: LessonNodeWidget(
                          lessonNumber: 3,
                          title: 'Color Theory',
                          state: NodeState.current,
                          alignRight: false,
                        ),
                      ),

                      // Node 4 - Next (right aligned)
                      const Padding(
                        padding: EdgeInsets.only(right: 60),
                        child: LessonNodeWidget(
                          lessonNumber: 4,
                          title: '04: Typography',
                          state: NodeState.next,
                          alignRight: true,
                        ),
                      ),

                      // Node 5 - Locked (left aligned)
                      Padding(
                        padding: const EdgeInsets.only(left: 40),
                        child: Opacity(
                          opacity: 0.6,
                          child: const LessonNodeWidget(
                            lessonNumber: 5,
                            title: '05: Layout Grids',
                            state: NodeState.locked,
                            alignRight: false,
                          ),
                        ),
                      ),

                      // Final Goal
                      Column(
                        children: [
                          Container(
                            width: 96,
                            height: 96,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: const Color(0xFF1F1F89).withOpacity(0.05),
                            ),
                            child: Center(
                              child: Container(
                                width: 64,
                                height: 64,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: const Color(
                                    0xFF1F1F89,
                                  ).withOpacity(0.1),
                                ),
                                child: const Icon(
                                  Icons.inventory_2,
                                  color: Color(0xFF1F1F89),
                                  size: 32,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            'Final Project Milestone',
                            style: GoogleFonts.lexend(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: const Color(0xFF1F1F89),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'UNLOCK AT LEVEL 10',
                            style: GoogleFonts.lexend(
                              fontSize: 10,
                              fontWeight: FontWeight.w500,
                              color: Colors.grey[400],
                              letterSpacing: 2,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Animated moving icon
                Obx(() => _buildMovingIcon(context, constraints)),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildMovingIcon(BuildContext context, BoxConstraints constraints) {
    final progress = controller.animationProgress.value;
    final size = Size(
      MediaQuery.of(context).size.width,
      constraints.maxHeight > 800 ? constraints.maxHeight : 800,
    );

    // Calculate position along the path
    final position = CurvedPathPainter.getPositionOnPath(
      size,
      controller.currentLessonIndex,
      controller.nextLessonIndex,
      progress,
    );

    return Positioned(
      left: position.dx - 24, // Center the 48px icon
      top: position.dy - 24,
      child: AnimatedOpacity(
        opacity: progress > 0.02 && progress < 0.98 ? 1.0 : 0.0,
        duration: const Duration(milliseconds: 200),
        child: Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [const Color(0xFF1F1F89), const Color(0xFF2EC4B6)],
            ),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF1F1F89).withOpacity(0.5),
                blurRadius: 16,
                spreadRadius: 4,
              ),
              BoxShadow(
                color: const Color(0xFF2EC4B6).withOpacity(0.3),
                blurRadius: 24,
                spreadRadius: 2,
              ),
            ],
          ),
          child: const Icon(Icons.arrow_forward, color: Colors.white, size: 24),
        ),
      ),
    );
  }

  Widget _buildBottomNavigation() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
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
        child: SizedBox(
          height: 80,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _buildNavItem(Icons.home, 'Home', false),
              _buildNavItem(Icons.map, 'Path', true),
              _buildNavItem(Icons.bar_chart, 'Progress', false),
              _buildNavItem(Icons.person, 'Profile', false),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(IconData icon, String label, bool isActive) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(
          icon,
          color: isActive ? const Color(0xFF1F1F89) : Colors.grey[400],
          size: 24,
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: GoogleFonts.lexend(
            fontSize: 10,
            fontWeight: isActive ? FontWeight.bold : FontWeight.w500,
            color: isActive ? const Color(0xFF1F1F89) : Colors.grey[400],
          ),
        ),
      ],
    );
  }
}
