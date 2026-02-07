import 'package:get/get.dart';
import 'package:e_learn_app/app/data/models/learner_course_model.dart';
import 'package:e_learn_app/app/data/services/api_service.dart';
import 'package:video_player/video_player.dart';
import 'package:chewie/chewie.dart';
import 'package:flutter/material.dart';

class LessonPlayerController extends GetxController {
  final RxBool isPlaying = false.obs;
  final RxDouble videoProgress = 0.0.obs;
  final RxString currentTime = '00:00'.obs;
  final RxString totalTime = '00:00'.obs;
  final RxBool isBookmarked = false.obs;

  VideoPlayerController? videoPlayerController;
  ChewieController? chewieController;
  final isVideoInitialized = false.obs;

  void toggleBookmark() {
    isBookmarked.value = !isBookmarked.value;
  }

  void goToNextLesson() {
    try {
      // Navigate to learning path transition screen
      Get.toNamed(
        '/learning-path-transition',
        arguments: {
          'currentIndex': 2, // Current lesson (Lesson 3, 0-indexed)
          'nextIndex': 3, // Next lesson (Lesson 4, 0-indexed)
        },
      );
      print('Navigating to learning path transition...');
    } catch (e) {
      print('Navigation error: $e');
      Get.snackbar(
        'Error',
        'Failed to load animation. Please try again.',
        snackPosition: SnackPosition.BOTTOM,
        duration: const Duration(seconds: 2),
      );
    }
  }

  final course = Rx<CourseDetailModel?>(null);
  final isLoading = true.obs;
  final errorMessage = ''.obs;

  @override
  void onInit() {
    super.onInit();
    final dynamic args = Get.arguments;
    if (args != null && args is String) {
      fetchCourseDetail(args);
    } else {
      // For demo purposes, we might keep default values if no ID is provided
      isLoading.value = false;
    }
  }

  Future<void> fetchCourseDetail(String courseId) async {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      final response = await ApiService.getCourseDetail(courseId);
      course.value = response.data;

      // Initialize video with the first topic's first subtopic video if available
      if (course.value?.topics.isNotEmpty == true &&
          course.value?.topics.first.subtopics.isNotEmpty == true) {
        final firstVideoUrl =
            course.value!.topics.first.subtopics.first.videoUrl;
        if (firstVideoUrl.isNotEmpty) {
          initializePlayer(firstVideoUrl);
        }
      }
    } catch (e) {
      errorMessage.value = e.toString();
      print('Error fetching course detail for player: $e');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> initializePlayer(String videoUrl) async {
    try {
      print('Initializing player with URL: $videoUrl');

      // Dispose previous controllers if any
      _disposeControllers();

      videoPlayerController = VideoPlayerController.networkUrl(
        Uri.parse(videoUrl),
      );

      print('VideoPlayerController created. Initializing...');
      await videoPlayerController!.initialize();
      print('VideoPlayerController initialized successfully.');

      chewieController = ChewieController(
        videoPlayerController: videoPlayerController!,
        autoPlay: true,
        looping: false,
        aspectRatio: 16 / 9,
        placeholder: Container(
          color: Colors.black,
          child: const Center(child: CircularProgressIndicator()),
        ),
        errorBuilder: (context, errorMessage) {
          print('Chewie Error: $errorMessage');
          return Center(
            child: Text(
              errorMessage,
              style: const TextStyle(color: Colors.white),
            ),
          );
        },
      );
      print('ChewieController initialized successfully.');

      isVideoInitialized.value = true;

      // Listen to video position
      videoPlayerController!.addListener(() {
        if (videoPlayerController!.value.isInitialized) {
          final current = videoPlayerController!.value.position;
          final total = videoPlayerController!.value.duration;

          if (total.inSeconds > 0) {
            videoProgress.value = current.inSeconds / total.inSeconds;
          }

          currentTime.value = _formatDuration(current);
          totalTime.value = _formatDuration(total);
        }

        if (videoPlayerController!.value.hasError) {
          print(
            'Video Player Error: ${videoPlayerController!.value.errorDescription}',
          );
        }
      });
    } catch (e, stackTrace) {
      print('Error initializing video player: $e');
      print('Stack trace: $stackTrace');
      Get.snackbar('Error', 'Could not play video: $e');
    }
  }

  String _formatDuration(Duration duration) {
    String twoDigits(int n) => n.toString().padLeft(2, "0");
    String twoDigitMinutes = twoDigits(duration.inMinutes.remainder(60));
    String twoDigitSeconds = twoDigits(duration.inSeconds.remainder(60));
    return "${twoDigits(duration.inHours)}:$twoDigitMinutes:$twoDigitSeconds";
  }

  void _disposeControllers() {
    videoPlayerController?.dispose();
    chewieController?.dispose();
    videoPlayerController = null;
    chewieController = null;
    isVideoInitialized.value = false;
  }

  @override
  void onReady() {
    super.onReady();
  }

  @override
  void onClose() {
    _disposeControllers();
    super.onClose();
  }

  // Helper for view to toggle play via custom controls if needed,
  // though Chewie handles UI mostly.
  void togglePlay() {
    if (videoPlayerController != null &&
        videoPlayerController!.value.isInitialized) {
      if (videoPlayerController!.value.isPlaying) {
        videoPlayerController!.pause();
        isPlaying.value = false;
      } else {
        videoPlayerController!.play();
        isPlaying.value = true;
      }
    }
  }
}
