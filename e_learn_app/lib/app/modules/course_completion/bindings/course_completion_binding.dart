import 'package:get/get.dart';
import '../controllers/course_completion_controller.dart';

class CourseCompletionBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<CourseCompletionController>(() => CourseCompletionController());
  }
}
