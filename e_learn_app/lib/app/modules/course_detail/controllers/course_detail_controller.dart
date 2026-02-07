import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:e_learn_app/app/data/models/learner_course_model.dart';
import 'package:e_learn_app/app/data/services/api_service.dart';
import '../../payment/controllers/payment_controller.dart';

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

  void enroll() async {
    // If already enrolled, navigate to lesson player
    if (course.value?.isEnrolled ?? false) {
      Get.toNamed('/lesson-player', arguments: course.value?.id);
      return;
    }

    final courseData = course.value;
    if (courseData == null) {
      Get.snackbar(
        'Error',
        'Course information not available',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
        margin: const EdgeInsets.all(16),
        borderRadius: 8,
      );
      return;
    }

    // Check if course is free or paid
    final price = courseData.price;
    final isFree = price == '0' || price.isEmpty;

    if (isFree) {
      // For free courses, enroll directly via API
      // Note: This requires a backend endpoint for free enrollment
      // For now, show a message
      Get.snackbar(
        'Free Enrollment',
        'Free course enrollment will be implemented',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: const Color(0xFF1F3D89),
        colorText: Colors.white,
        margin: const EdgeInsets.all(16),
        borderRadius: 8,
        duration: const Duration(seconds: 3),
      );
    } else {
      // For paid courses, initiate payment flow
      final paymentController = Get.put(PaymentController());
      await paymentController.initiatePayment(
        courseId: courseData.id,
        courseTitle: courseData.title,
        price: price,
      );
    }
  }
}
