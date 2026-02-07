import 'package:get/get.dart';

import '../modules/course_completion/bindings/course_completion_binding.dart';
import '../modules/course_completion/views/course_completion_view.dart';
import '../modules/course_detail/bindings/course_detail_binding.dart';
import '../modules/course_detail/views/course_detail_view.dart';
import '../modules/home/bindings/home_binding.dart';
import '../modules/home/views/home_view.dart';
import '../modules/learning_path_transition/bindings/learning_path_transition_binding.dart';
import '../modules/learning_path_transition/views/learning_path_transition_view.dart';
import '../modules/lesson_player/bindings/lesson_player_binding.dart';
import '../modules/lesson_player/views/lesson_player_view.dart';
import '../modules/login/bindings/login_binding.dart';
import '../modules/login/views/login_view.dart';

part 'app_routes.dart';

class AppPages {
  AppPages._();

  static const INITIAL = Routes.LOGIN;

  static final routes = [
    GetPage(
      name: _Paths.HOME,
      page: () => const HomeView(),
      binding: HomeBinding(),
    ),
    GetPage(
      name: _Paths.LOGIN,
      page: () => const LoginView(),
      binding: LoginBinding(),
    ),
    GetPage(
      name: _Paths.COURSE_DETAIL,
      page: () => const CourseDetailView(),
      binding: CourseDetailBinding(),
    ),
    GetPage(
      name: _Paths.LESSON_PLAYER,
      page: () => const LessonPlayerView(),
      binding: LessonPlayerBinding(),
    ),
    GetPage(
      name: _Paths.COURSE_COMPLETION,
      page: () => const CourseCompletionView(),
      binding: CourseCompletionBinding(),
    ),
    GetPage(
      name: _Paths.LEARNING_PATH_TRANSITION,
      page: () => const LearningPathTransitionView(),
      binding: LearningPathTransitionBinding(),
    ),
  ];
}
