import 'package:e_learn_app/app/data/models/learner_course_model.dart';
import 'package:e_learn_app/app/data/models/profile_model.dart';
import 'package:e_learn_app/app/data/services/api_service.dart';
import 'package:get/get.dart';

class HomeController extends GetxController {
  final courses = <LearnerCourseModel>[].obs;
  final profile = Rxn<ProfileResponse>();
  final isLoading = true.obs;
  final errorMessage = ''.obs;

  // Static image URLs to use for courses (cycling through them)
  final List<String> staticImageUrls = [
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
  ];

  @override
  void onInit() {
    super.onInit();
    fetchAllData();
  }

  Future<void> fetchAllData() async {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      final results = await Future.wait([
        ApiService.getLearnerCourses(),
        ApiService.getProfile(),
      ]);

      courses.value = (results[0] as LearnerCoursesResponse).data.courses;
      profile.value = results[1] as ProfileResponse;
    } catch (e) {
      errorMessage.value = e.toString();
      print('Error fetching home data: $e');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> fetchCourses() => fetchAllData();

  String getImageUrlForCourse(int index) {
    // Cycle through static images based on course index
    return staticImageUrls[index % staticImageUrls.length];
  }

  void refreshCourses() {
    fetchCourses();
  }
}
