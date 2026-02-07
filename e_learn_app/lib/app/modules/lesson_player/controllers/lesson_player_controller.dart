import 'package:get/get.dart';

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
    // Navigate to next lesson
    Get.snackbar(
      'Next Lesson',
      'Loading Lesson 5: Color Theory in Depth',
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  @override
  void onInit() {
    super.onInit();
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
