import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import '../../../data/services/payment_service.dart';
import '../../../data/services/api_service.dart';

/// Controller for managing payment flow
class PaymentController extends GetxController {
  final PaymentService _paymentService = PaymentService();
  final isProcessing = false.obs;

  // Course ID for payment verification
  String? _courseId;

  @override
  void onInit() {
    super.onInit();
    _initializePayment();
  }

  /// Initialize Razorpay with callbacks
  void _initializePayment() {
    _paymentService.initialize(
      onSuccess: _handlePaymentSuccess,
      onFailure: _handlePaymentFailure,
    );
  }

  /// Start payment flow for a course
  Future<void> initiatePayment({
    required String courseId,
    required String courseTitle,
    required String price,
  }) async {
    try {
      _courseId = courseId;

      isProcessing.value = true;

      // Create payment order on backend
      final orderResponse = await ApiService.createPaymentOrder(
        courseId,
        price,
      );

      if (orderResponse.success) {
        // Open Razorpay checkout with order details
        _paymentService.openCheckout(
          orderId: orderResponse.data.orderId,
          amount: orderResponse.data.amount,
          courseName: courseTitle,
        );
      } else {
        throw Exception(orderResponse.message);
      }
    } catch (e) {
      isProcessing.value = false;
      Get.snackbar(
        'Payment Error',
        'Failed to initiate payment: $e',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
        margin: const EdgeInsets.all(16),
        borderRadius: 8,
        duration: const Duration(seconds: 4),
      );
    }
  }

  /// Handle successful payment
  void _handlePaymentSuccess(PaymentSuccessResponse response) async {
    try {
      // Verify payment on backend
      final verificationResponse = await ApiService.verifyPayment(
        response.paymentId ?? '',
        response.orderId ?? '',
        response.signature ?? '',
        _courseId ?? '',
      );

      isProcessing.value = false;

      if (verificationResponse.success) {
        // Show success message
        Get.snackbar(
          'Payment Successful',
          'You have been enrolled in the course!',
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: const Color(0xFF2EC4B6),
          colorText: Colors.white,
          margin: const EdgeInsets.all(16),
          borderRadius: 8,
          duration: const Duration(seconds: 3),
        );

        // Navigate to lesson player after a short delay
        Future.delayed(const Duration(seconds: 1), () {
          Get.offAllNamed('/lesson-player', arguments: _courseId);
        });
      } else {
        throw Exception(verificationResponse.message);
      }
    } catch (e) {
      isProcessing.value = false;
      Get.snackbar(
        'Verification Error',
        'Payment received but verification failed: $e',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.orange,
        colorText: Colors.white,
        margin: const EdgeInsets.all(16),
        borderRadius: 8,
        duration: const Duration(seconds: 5),
      );
    }
  }

  /// Handle payment failure
  void _handlePaymentFailure(PaymentFailureResponse response) {
    isProcessing.value = false;

    String errorMessage = 'Payment failed';
    if (response.message != null) {
      errorMessage = response.message!;
    } else if (response.code == 0) {
      errorMessage = 'Payment cancelled by user';
    }

    Get.snackbar(
      'Payment Failed',
      errorMessage,
      snackPosition: SnackPosition.BOTTOM,
      backgroundColor: Colors.red,
      colorText: Colors.white,
      margin: const EdgeInsets.all(16),
      borderRadius: 8,
      duration: const Duration(seconds: 4),
    );
  }

  @override
  void onClose() {
    _paymentService.dispose();
    super.onClose();
  }
}
