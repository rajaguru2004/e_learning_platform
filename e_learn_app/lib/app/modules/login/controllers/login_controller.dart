import 'package:flutter/material.dart';
import 'package:get/get.dart';

class LoginController extends GetxController {
  // Observable variables
  var isPasswordVisible = false.obs;
  var emailController = TextEditingController();
  var passwordController = TextEditingController();

  // Toggle password visibility
  void togglePasswordVisibility() {
    isPasswordVisible.value = !isPasswordVisible.value;
  }

  // Sign in function
  void signIn() {
    final email = emailController.text.trim();
    final password = passwordController.text.trim();

    if (email.isEmpty || password.isEmpty) {
      Get.snackbar(
        'Error',
        'Please enter both email and password',
        snackPosition: SnackPosition.BOTTOM,
      );
      return;
    }

    // TODO: Implement actual authentication logic
    // For now, navigate to home screen after basic validation
    Get.offAllNamed('/home');
  }

  // Social login functions
  void signInWithGoogle() {
    // TODO: Implement Google sign in
    Get.snackbar(
      'Google Sign In',
      'Google sign in to be implemented',
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  void signInWithApple() {
    // TODO: Implement Apple sign in
    Get.snackbar(
      'Apple Sign In',
      'Apple sign in to be implemented',
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  void navigateToSignUp() {
    // TODO: Navigate to sign up screen
    Get.snackbar(
      'Sign Up',
      'Navigation to sign up screen to be implemented',
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  void navigateToForgotPassword() {
    // TODO: Navigate to forgot password screen
    Get.snackbar(
      'Forgot Password',
      'Navigation to forgot password screen to be implemented',
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  @override
  void onClose() {
    emailController.dispose();
    passwordController.dispose();
    super.onClose();
  }
}
