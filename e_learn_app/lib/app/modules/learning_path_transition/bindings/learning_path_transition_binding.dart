import 'package:get/get.dart';
import '../controllers/learning_path_transition_controller.dart';

class LearningPathTransitionBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<LearningPathTransitionController>(
      () => LearningPathTransitionController(),
    );
  }
}
