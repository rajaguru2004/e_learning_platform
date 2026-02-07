import 'package:get/get.dart';
import 'package:e_learn_app/app/data/models/learner_course_model.dart';
import 'package:e_learn_app/app/data/services/api_service.dart';

class LessonPlayerController extends GetxController {
  final RxBool isPlaying = false.obs;
  final RxDouble videoProgress = 0.52.obs; // 52% progress (12:45 of 24:00)
  final RxString currentTime = '12:45'.obs;
  final RxString totalTime = '24:00'.obs;
  final RxBool isBookmarked = false.obs;

  void togglePlay() {
    isPlaying.value = !isPlaying.value;
  }

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
    } catch (e) {
      errorMessage.value = e.toString();
      print('Error fetching course detail for player: $e');
    } finally {
      isLoading.value = false;
    }
  }

  @override
  void onReady() {
    super.onReady();
  }

  @override
  void onClose() {
    super.onClose();
  }
}
