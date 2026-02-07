import 'package:get/get.dart';
import '../../../data/models/profile_model.dart';
import '../../../data/services/api_service.dart';

class BadgesController extends GetxController {
  final isLoading = true.obs;
  final profile = Rxn<ProfileResponse>();
  final errorMessage = ''.obs;

  final List<Map<String, dynamic>> badgeRanges = [
    {'name': 'Bronze', 'range': '0 - 99 pts', 'min': 0, 'max': 99},
    {'name': 'Silver', 'range': '100 - 299 pts', 'min': 100, 'max': 299},
    {'name': 'Gold', 'range': '300 - 599 pts', 'min': 300, 'max': 599},
    {'name': 'Platinum', 'range': '600 - 999 pts', 'min': 600, 'max': 999},
    {'name': 'Diamond', 'range': '1,000 - ∞ pts', 'min': 1000, 'max': 1000000},
  ];

  @override
  void onInit() {
    super.onInit();
    fetchProfile();
  }

  Future<void> fetchProfile() async {
    try {
      isLoading.value = true;
      errorMessage.value = '';
      final response = await ApiService.getProfile();
      profile.value = response;
    } catch (e) {
      errorMessage.value = e.toString();
    } finally {
      isLoading.value = false;
    }
  }

  bool isBadgeActive(int min) {
    if (profile.value == null) return false;
    return profile.value!.data.stats.totalPoints >= min;
  }
}
