import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:get/get.dart';

import '../../../widgets/app_bottom_nav_bar.dart';
import '../../../data/services/api_service.dart';
import '../../../data/models/learner_course_model.dart';
import '../../../data/models/enrollment_model.dart';
import '../../../routes/app_pages.dart';

class LibraryView extends StatefulWidget {
  const LibraryView({super.key});

  @override
  State<LibraryView> createState() => _LibraryViewState();
}

class _LibraryViewState extends State<LibraryView> {
  int _selectedTabIndex = 0;
  bool _isLoading = true;
  String? _errorMessage;

  List<LearnerCourseModel> _allCourses = [];
  List<Enrollment> _enrollments = [];

  // Static image URLs to use for courses (cycling through them)
  final List<String> _staticImageUrls = [
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
  ];

  String _getImageUrl(int index) {
    return _staticImageUrls[index % _staticImageUrls.length];
  }

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final results = await Future.wait([
        ApiService.getLearnerCourses(),
        ApiService.getEnrollments(),
      ]);

      final coursesResponse = results[0] as LearnerCoursesResponse;
      final enrollmentsResponse = results[1] as EnrollmentResponse;

      setState(() {
        _allCourses = coursesResponse.data.courses;
        _enrollments = enrollmentsResponse.data.enrollments;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
        _errorMessage = e.toString();
      });
    }
  }

  List<dynamic> get _filteredItems {
    if (_selectedTabIndex == 0) return _allCourses;
    if (_selectedTabIndex == 1) {
      return _enrollments.where((e) => e.completedAt == null).toList();
    }
    return _enrollments.where((e) => e.completedAt != null).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FB),
      body: SafeArea(
        child: Column(
          children: [
            // iOS Style Top App Bar
            Container(
              color: Colors.white.withOpacity(0.8),
              padding: const EdgeInsets.fromLTRB(16, 24, 16, 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Library',
                    style: GoogleFonts.lexend(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      letterSpacing: -0.5,
                      color: const Color(0xFF2E2E2E),
                    ),
                  ),
                  Row(
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: Colors.grey[100],
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Icon(
                          Icons.search,
                          color: Color(0xFF2E2E2E),
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: const Color(0xFF1F3D89).withOpacity(0.2),
                            width: 2,
                          ),
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(18),
                          child: Image.network(
                            'https://lh3.googleusercontent.com/aida-public/AB6AXuDLi8zVgJqqULQAYyhRcoSKQTM5ZB83V17Ya6bxyxps0kAU9ghLAFmOwloOMhwuCnQPQMXeobeL1Phr-BFZLcg17pzc12cfN6_d12yMwT6gNu77HUVhB1vTpNDeA21fMkP0Mu0gxPfIEiz-ZIMUZXVzmZCQ4LuUdbNtnGeOCDSTH1hOSobaC4OTqCCEy811pBj5VnskIv8R7DgpAaydFA7_TzK8nRyze5_myZiwAIsxFMMLRB0rUXeiEDIfB34136JaY6l0xVO11Xk',
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return Container(
                                color: const Color(0xFF1F3D89),
                                child: const Icon(
                                  Icons.person,
                                  color: Colors.white,
                                  size: 20,
                                ),
                              );
                            },
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Segmented Tab Navigation
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              margin: const EdgeInsets.only(bottom: 24),
              child: Container(
                decoration: BoxDecoration(
                  border: Border(bottom: BorderSide(color: Colors.grey[200]!)),
                ),
                child: Row(
                  children: [
                    _buildTab('All Courses', 0),
                    _buildTab('In Progress', 1),
                    _buildTab('Completed', 2),
                  ],
                ),
              ),
            ),

            // Course List Section
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : _errorMessage != null
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text('Error: $_errorMessage'),
                          const SizedBox(height: 16),
                          ElevatedButton(
                            onPressed: _fetchData,
                            child: const Text('Retry'),
                          ),
                        ],
                      ),
                    )
                  : _filteredItems.isEmpty
                  ? Center(
                      child: Text(
                        'No courses found',
                        style: GoogleFonts.lexend(color: Colors.grey),
                      ),
                    )
                  : ListView.separated(
                      padding: const EdgeInsets.fromLTRB(16, 0, 16, 100),
                      itemCount: _filteredItems.length,
                      separatorBuilder: (context, index) =>
                          const SizedBox(height: 20),
                      itemBuilder: (context, index) {
                        final item = _filteredItems[index];

                        if (item is LearnerCourseModel) {
                          return LibraryCourseCard(
                            title: item.title,
                            subtitle: item.instructor.name,
                            points: 0,
                            progress: 0.0,
                            imageUrl: _getImageUrl(index),
                            isActive: false,
                            isCompleted: false,
                            isEnrolled: false,
                            price: item.price,
                            onTap: () {
                              Get.toNamed(
                                Routes.COURSE_DETAIL,
                                arguments: item.id,
                              );
                            },
                          );
                        } else if (item is Enrollment) {
                          return LibraryCourseCard(
                            title: item.course.title,
                            subtitle: item.course.instructor.name,
                            points: 0,
                            progress: item.progressPercent / 100,
                            imageUrl: _getImageUrl(index),
                            isActive: item.isActive,
                            isCompleted: item.completedAt != null,
                            isEnrolled: true,
                            onTap: () {
                              Get.toNamed(
                                Routes.LESSON_PLAYER,
                                arguments: item.course.id,
                              );
                            },
                          );
                        }
                        return const SizedBox.shrink();
                      },
                    ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: const AppBottomNavBar(currentIndex: 1),
    );
  }

  Widget _buildTab(String label, int index) {
    final isSelected = _selectedTabIndex == index;
    return Expanded(
      child: InkWell(
        onTap: () {
          setState(() {
            _selectedTabIndex = index;
          });
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(
                color: isSelected
                    ? const Color(0xFF1F3D89)
                    : Colors.transparent,
                width: 2,
              ),
            ),
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: GoogleFonts.lexend(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: isSelected ? const Color(0xFF1F3D89) : Colors.grey[400],
            ),
          ),
        ),
      ),
    );
  }
}

class LibraryCourseCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final int points;
  final double progress;
  final String imageUrl;
  final bool isActive;
  final bool isCompleted;
  final bool isEnrolled;
  final String? price;
  final VoidCallback? onTap;

  const LibraryCourseCard({
    super.key,
    required this.title,
    required this.subtitle,
    required this.points,
    required this.progress,
    required this.imageUrl,
    required this.isActive,
    required this.isCompleted,
    this.isEnrolled = true,
    this.price,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey[100]!),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 20,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Course Image
            Stack(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(12),
                    topRight: Radius.circular(12),
                  ),
                  child: ColorFiltered(
                    colorFilter: isCompleted
                        ? ColorFilter.mode(
                            Colors.grey.withOpacity(0.3),
                            BlendMode.saturation,
                          )
                        : const ColorFilter.mode(
                            Colors.transparent,
                            BlendMode.multiply,
                          ),
                    child: Image.network(
                      imageUrl,
                      height: 176,
                      width: double.infinity,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return Container(
                          height: 176,
                          color: Colors.grey[300],
                          child: const Center(
                            child: Icon(Icons.image, size: 48),
                          ),
                        );
                      },
                    ),
                  ),
                ),
                if (isCompleted)
                  Positioned.fill(
                    child: Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFF2EC4B6).withOpacity(0.1),
                      ),
                    ),
                  ),
                Positioned(
                  top: 12,
                  left: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: isCompleted
                          ? const Color(0xFF2EC4B6)
                          : const Color(0xFF1F3D89),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      !isEnrolled
                          ? (price != null && price != '0' ? '₹$price' : 'FREE')
                          : (isCompleted ? 'COMPLETED' : 'ACTIVE'),
                      style: GoogleFonts.lexend(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1,
                      ),
                    ),
                  ),
                ),
              ],
            ),

            // Course Details
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Text(
                          title,
                          style: GoogleFonts.lexend(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            height: 1.2,
                            color: const Color(0xFF2E2E2E),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Row(
                        children: [
                          const Icon(
                            Icons.stars,
                            color: Color(0xFFF4C430),
                            size: 16,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '$points pts',
                            style: GoogleFonts.lexend(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: const Color(0xFFF4C430),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: GoogleFonts.lexend(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: Colors.grey[500],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Progress Bar
                  if (isEnrolled)
                    Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              isCompleted ? 'MASTERED' : 'CURRENT PROGRESS',
                              style: GoogleFonts.lexend(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: const Color(0xFF2EC4B6),
                                letterSpacing: 0.5,
                              ),
                            ),
                            Text(
                              '${(progress * 100).toInt()}%',
                              style: GoogleFonts.lexend(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: isCompleted
                                    ? const Color(0xFF2EC4B6)
                                    : const Color(0xFF2E2E2E),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: LinearProgressIndicator(
                            value: progress,
                            backgroundColor: isCompleted
                                ? const Color(0xFF2EC4B6).withOpacity(0.2)
                                : Colors.grey[100],
                            valueColor: const AlwaysStoppedAnimation<Color>(
                              Color(0xFF2EC4B6),
                            ),
                            minHeight: 8,
                          ),
                        ),
                      ],
                    ),
                  if (isEnrolled) const SizedBox(height: 16),

                  // Action Button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: onTap,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: isCompleted
                            ? Colors.white
                            : const Color(0xFF1F3D89),
                        foregroundColor: isCompleted
                            ? const Color(0xFF1F3D89)
                            : Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                          side: isCompleted
                              ? const BorderSide(
                                  color: Color(0xFF1F3D89),
                                  width: 2,
                                )
                              : BorderSide.none,
                        ),
                        elevation: 0,
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            !isEnrolled
                                ? Icons.shopping_cart_outlined
                                : (isCompleted
                                      ? Icons.workspace_premium
                                      : Icons.play_arrow),
                            size: 18,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            !isEnrolled
                                ? 'Enroll Now'
                                : (isCompleted
                                      ? 'View Certificate'
                                      : 'Continue Lesson'),
                            style: GoogleFonts.lexend(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
