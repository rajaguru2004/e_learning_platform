import 'package:get/get.dart';
import '../controllers/lesson_player_controller.dart';

class LessonPlayerBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<LessonPlayerController>(() => LessonPlayerController());
  }
}
