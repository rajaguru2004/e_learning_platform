import 'package:get/get.dart';
import '../../../data/models/profile_model.dart';
import '../../../data/models/enrollment_model.dart';
import '../../../data/services/api_service.dart';

class ProfileController extends GetxController {
  final isLoading = true.obs;
  final profile = Rxn<ProfileResponse>();
  final enrollments = Rxn<EnrollmentResponse>();
  final errorMessage = ''.obs;

  @override
  void onInit() {
    super.onInit();
    fetchProfile();
  }

  Future<void> fetchProfile() async {
    try {
      isLoading.value = true;
      errorMessage.value = '';
      final results = await Future.wait([
        ApiService.getProfile(),
        ApiService.getEnrollments(),
      ]);
      profile.value = results[0] as ProfileResponse;
      enrollments.value = results[1] as EnrollmentResponse;
    } catch (e) {
      errorMessage.value = e.toString();
    } finally {
      isLoading.value = false;
    }
  }

  List<Enrollment> get recentEnrollments {
    if (enrollments.value == null) return [];
    // Sort by createdAt or updatedAt descending and take top 2
    final list = List<Enrollment>.from(enrollments.value!.data.enrollments);
    list.sort((a, b) {
      final dateA = a.updatedAt ?? a.createdAt ?? DateTime(0);
      final dateB = b.updatedAt ?? b.createdAt ?? DateTime(0);
      return dateB.compareTo(dateA);
    });
    return list.take(2).toList();
  }
}
