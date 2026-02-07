import 'package:flutter/animation.dart';
import 'package:get/get.dart';

class LearningPathTransitionController extends GetxController
    with GetSingleTickerProviderStateMixin {
  late AnimationController animationController;
  late Animation<double> pathAnimation;

  final RxDouble animationProgress = 0.0.obs;
  final RxBool animationCompleted = false.obs;

  // Navigation parameters
  String currentLessonId = '';
  String nextLessonId = '';
  int currentLessonIndex = 2; // 0-indexed (Lesson 3)
  int nextLessonIndex = 3; // 0-indexed (Lesson 4)

  @override
  void onInit() {
    super.onInit();
    print('🎬 Learning Path Transition Controller initialized');

    // Get navigation arguments if passed
    if (Get.arguments != null) {
      currentLessonIndex = Get.arguments['currentIndex'] ?? 2;
      nextLessonIndex = Get.arguments['nextIndex'] ?? 3;
      print('📍 Animating from lesson $currentLessonIndex to $nextLessonIndex');
    }

    // Initialize animation controller (4 seconds duration - extended for visibility)
    animationController = AnimationController(
      duration: const Duration(milliseconds: 4000),
      vsync: this,
    );

    // Create curved animation for smooth movement
    pathAnimation = CurvedAnimation(
      parent: animationController,
      curve: Curves.easeInOutCubic,
    );

    // Listen to animation progress
    animationController.addListener(() {
      animationProgress.value = pathAnimation.value;
      if (animationProgress.value % 0.25 < 0.01) {
        print(
          '⏳ Animation progress: ${(animationProgress.value * 100).toInt()}%',
        );
      }
    });

    // Handle animation completion
    animationController.addStatusListener((status) {
      print('📊 Animation status: $status');
      if (status == AnimationStatus.completed) {
        animationCompleted.value = true;
        print('✅ Animation completed! Navigating to lesson player...');
        // Navigate to lesson player after animation completes
        Future.delayed(const Duration(milliseconds: 800), () {
          print('🎯 Navigating to lesson player');
          Get.offNamed('/lesson-player');
        });
      }
    });

    // Start animation automatically after a short delay
    Future.delayed(const Duration(milliseconds: 500), () {
      print('▶️ Starting animation...');
      animationController.forward();
    });
  }

  @override
  void onClose() {
    animationController.dispose();
    super.onClose();
  }
}
