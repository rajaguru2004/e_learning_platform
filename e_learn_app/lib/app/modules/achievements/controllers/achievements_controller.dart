import 'package:get/get.dart';
import '../../../data/models/enrollment_model.dart';
import '../../../data/models/profile_model.dart';
import '../../../data/services/api_service.dart';

class AchievementsController extends GetxController {
  final isLoading = true.obs;
  final enrollments = Rxn<EnrollmentResponse>();
  final profile = Rxn<ProfileResponse>();
  final errorMessage = ''.obs;

  @override
  void onInit() {
    super.onInit();
    fetchData();
  }

  Future<void> fetchData() async {
    try {
      isLoading.value = true;
      errorMessage.value = '';
      final results = await Future.wait([
        ApiService.getEnrollments(),
        ApiService.getProfile(),
      ]);
      enrollments.value = results[0] as EnrollmentResponse;
      profile.value = results[1] as ProfileResponse;
    } catch (e) {
      errorMessage.value = e.toString();
    } finally {
      isLoading.value = false;
    }
  }

  // Alias for backward compatibility if needed, though fetchData is better
  Future<void> fetchEnrollments() => fetchData();

  int get completedCoursesCount {
    if (enrollments.value == null) return 0;
    return enrollments.value!.data.enrollments
        .where((e) => e.statusCode == 'COMPLETED')
        .length;
  }

  int get totalXp {
    // If stats provides totalPoints, use that. Otherwise calculate from enrollments.
    if (profile.value != null) {
      return profile.value!.data.stats.totalPoints;
    }

    if (enrollments.value == null) return 0;
    int xp = 0;
    for (var enrollment in enrollments.value!.data.enrollments) {
      if (enrollment.statusCode == 'COMPLETED') {
        xp += 500;
      } else {
        xp += (enrollment.progressPercent * 2);
      }
    }
    return xp;
  }
}
