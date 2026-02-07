import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:e_learn_app/app/data/models/learner_course_model.dart';
import 'package:e_learn_app/app/data/services/api_service.dart';

class CourseDetailController extends GetxController {
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
      errorMessage.value = 'Course ID not found in arguments';
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
    } finally {
      isLoading.value = false;
    }
  }

  void enroll() {
    if (course.value?.isEnrolled ?? false) {
      Get.toNamed('/lesson-player', arguments: course.value?.id);
      return;
    }

    // Implement enrollment logic here
    Get.snackbar(
      'Enrollment',
      'Enrollment functionality coming soon!',
      snackPosition: SnackPosition.BOTTOM,
      backgroundColor: const Color(0xFF1F3D89),
      colorText: Colors.white,
      margin: const EdgeInsets.all(16),
      borderRadius: 8,
      duration: const Duration(seconds: 3),
    );
  }
}
