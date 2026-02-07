import 'package:e_learn_app/app/data/models/user_model.dart';
import 'package:e_learn_app/app/data/services/auth_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class LoginController extends GetxController {
  // Observable variables
  var isPasswordVisible = false.obs;
  var isLoading = false.obs;
  var emailController = TextEditingController();
  var passwordController = TextEditingController();

  // Current user
  var currentUser = Rxn<UserModel>();

  // Toggle password visibility
  void togglePasswordVisibility() {
    isPasswordVisible.value = !isPasswordVisible.value;
  }

  // Sign in function with API integration
  Future<void> signIn() async {
    final email = emailController.text.trim();
    final password = passwordController.text.trim();

    if (email.isEmpty || password.isEmpty) {
      Get.snackbar(
        'Error',
        'Please enter both email and password',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red[100],
        colorText: Colors.red[900],
      );
      return;
    }

    try {
      isLoading.value = true;

      // Call login API
      final response = await AuthService.login(email, password);

      // Store user data
      currentUser.value = response.data.user;

      // Show success message
      Get.snackbar(
        'Success',
        response.message,
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.green[100],
        colorText: Colors.green[900],
      );

      // Navigate to home screen
      Get.offAllNamed('/home');
    } catch (e) {
      // Show error message
      Get.snackbar(
        'Login Failed',
        e.toString().replaceAll('Exception: ', ''),
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red[100],
        colorText: Colors.red[900],
        duration: const Duration(seconds: 4),
      );
    } finally {
      isLoading.value = false;
    }
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
