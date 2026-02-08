import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../controllers/lesson_player_controller.dart';

class QuizBottomSheet extends GetView<LessonPlayerController> {
  const QuizBottomSheet({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: Get.height * 0.85,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(24),
          topRight: Radius.circular(24),
        ),
      ),
      child: Column(
        children: [
          // Drag Handle
          const SizedBox(height: 12),
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(2),
            ),
          ),

          // Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Quick Quiz',
                  style: GoogleFonts.lexend(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFF0F121A),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: controller.closeQuiz,
                ),
              ],
            ),
          ),

          const Divider(height: 1),

          // Content
          Expanded(
            child: Obx(() {
              if (controller.isQuizCompleted.value) {
                return _buildResultView();
              }
              return _buildQuestionView();
            }),
          ),
        ],
      ),
    );
  }

  Widget _buildQuestionView() {
    final question = controller
        .currentSubtopic
        .value!
        .questions[controller.currentQuestionIndex.value];
    final totalQuestions = controller.currentSubtopic.value!.questions.length;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Progress Bar
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value:
                  (controller.currentQuestionIndex.value + 1) / totalQuestions,
              backgroundColor: Colors.grey[100],
              valueColor: const AlwaysStoppedAnimation<Color>(
                Color(0xFF1F3D89),
              ),
              minHeight: 6,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Question ${controller.currentQuestionIndex.value + 1} of $totalQuestions',
            style: GoogleFonts.lexend(
              fontSize: 12,
              color: Colors.grey[500],
              fontWeight: FontWeight.w500,
            ),
          ),

          const SizedBox(height: 24),

          // Question Text
          Text(
            question.questionText,
            style: GoogleFonts.lexend(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: const Color(0xFF0F121A),
              height: 1.4,
            ),
          ),

          const SizedBox(height: 32),

          // Options
          ...question.options.map((option) {
            return _buildOptionItem(option);
          }),

          const SizedBox(height: 32),

          // Action Button
          SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton(
              onPressed: controller.showAnswerFeedback.value
                  ? controller.nextQuestion
                  : controller.selectedAnswer.value != null
                  ? controller.submitAnswer
                  : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1F3D89),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 0,
                disabledBackgroundColor: Colors.grey[300],
                disabledForegroundColor: Colors.grey[500],
              ),
              child: Text(
                controller.showAnswerFeedback.value
                    ? (controller.currentQuestionIndex.value ==
                              totalQuestions - 1
                          ? 'Finish Quiz'
                          : 'Next Question')
                    : 'Submit Answer',
                style: GoogleFonts.lexend(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOptionItem(String option) {
    return Obx(() {
      final isSelected = controller.selectedAnswer.value == option;
      final showFeedback = controller.showAnswerFeedback.value;
      final isCorrectAnswer =
          option ==
          controller
              .currentSubtopic
              .value!
              .questions[controller.currentQuestionIndex.value]
              .correctAnswer;

      Color borderColor = Colors.grey[200]!;
      Color backgroundColor = Colors.transparent;
      Color textColor = const Color(0xFF0F121A);
      IconData? icon;

      if (showFeedback) {
        if (isCorrectAnswer) {
          borderColor = Colors.green;
          backgroundColor = Colors.green.withOpacity(0.1);
          textColor = Colors.green[800]!;
          icon = Icons.check_circle;
        } else if (isSelected) {
          borderColor = Colors.red;
          backgroundColor = Colors.red.withOpacity(0.1);
          textColor = Colors.red[800]!;
          icon = Icons.cancel;
        }
      } else if (isSelected) {
        borderColor = const Color(0xFF1F3D89);
        backgroundColor = const Color(0xFF1F3D89).withOpacity(0.05);
        textColor = const Color(0xFF1F3D89);
      }

      return Padding(
        padding: const EdgeInsets.only(bottom: 12),
        child: InkWell(
          onTap: () => controller.selectAnswer(option),
          borderRadius: BorderRadius.circular(12),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            decoration: BoxDecoration(
              color: backgroundColor,
              border: Border.all(
                color: borderColor,
                width: isSelected || (showFeedback && isCorrectAnswer) ? 2 : 1,
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    option,
                    style: GoogleFonts.lexend(
                      fontSize: 15,
                      color: textColor,
                      fontWeight: isSelected
                          ? FontWeight.w500
                          : FontWeight.normal,
                    ),
                  ),
                ),
                if (icon != null)
                  Icon(icon, color: textColor, size: 20)
                else if (isSelected)
                  const Icon(
                    Icons.radio_button_checked,
                    color: Color(0xFF1F3D89),
                    size: 20,
                  )
                else
                  Icon(
                    Icons.radio_button_unchecked,
                    color: Colors.grey[400],
                    size: 20,
                  ),
              ],
            ),
          ),
        ),
      );
    });
  }

  Widget _buildResultView() {
    final score = controller.quizScore.value;

    return Padding(
      padding: const EdgeInsets.all(32),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: const Color(0xFF1F3D89).withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.emoji_events,
              color: Color(0xFF1F3D89),
              size: 40,
            ),
          ),
          const SizedBox(height: 24),
          Text(
            'Quiz Completed!',
            style: GoogleFonts.lexend(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: const Color(0xFF0F121A),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'You scored $score points',
            style: GoogleFonts.lexend(fontSize: 16, color: Colors.grey[600]),
          ),
          const SizedBox(height: 48),

          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: controller.retryQuiz,
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size.fromHeight(56),
                    side: const BorderSide(color: Color(0xFF1F3D89)),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: Text(
                    'Retry',
                    style: GoogleFonts.lexend(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFF1F3D89),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: ElevatedButton(
                  onPressed: controller.closeQuiz,
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size.fromHeight(56),
                    backgroundColor: const Color(0xFF1F3D89),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: Text(
                    'Close',
                    style: GoogleFonts.lexend(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
