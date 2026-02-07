import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../widgets/app_bottom_nav_bar.dart';

class LibraryView extends StatefulWidget {
  const LibraryView({super.key});

  @override
  State<LibraryView> createState() => _LibraryViewState();
}

class _LibraryViewState extends State<LibraryView> {
  int _selectedTabIndex = 0;

  final List<Map<String, dynamic>> _allCourses = [
    {
      'title': 'Advanced UI Design',
      'subtitle': 'Design Systems & Interactions',
      'points': 150,
      'progress': 0.65,
      'imageUrl':
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCg1_FlS24MiLQaWbhB-OJqgGCBSLtdOwW-hGcXV3wDSFW5dx1qYuk7f3_toPsWfwq-a-lgMXMQ_cLvyWYw6zmmvDySXVPLd-CLnPprVzC7q_25hsVU9KLYydccqLcUI2gsiuATCOsvYTEMua_lUBaJgMsbK2JPNfPBoSuVr7tU274ahtt6fnoMJPmNWak-y6B5Qz2cSGzLP6MWnU12WiIyMud6syGgn3nsqdKmArVcOvOw64HhHSn46dFkXqesknlNXd10hPMMbr8',
      'isActive': true,
      'isCompleted': false,
    },
    {
      'title': 'Intro to UX Research',
      'subtitle': 'User Interviews & Analysis',
      'points': 200,
      'progress': 1.0,
      'imageUrl':
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBUyxSAAYYH3QzC2P0SevqMyoc72VmNAolvb0fd_nDGlmlBn4JNzNoZp5H4ts3d0mP8FdAzNMOnltB0bEwEa-v_9by_EdQ3U3QGY3n-CKbm6yRlpJenZ2ZJW21zfK95G5EyGIjvmTirfdcuTg5gs6e-NQAPkAMWJK9hdgCh697N5Q8mL6YWyBRxtbeDmx9B_oyywr3kG24tuEr2eXf1LguCUyynVJQQ44l8U6SKpHLhzH0lTqmbnoXTp-pTsFNjDIoRVEn7BH4Zg6w',
      'isActive': false,
      'isCompleted': true,
    },
    {
      'title': 'Frontend Development',
      'subtitle': 'React & Tailwind Frameworks',
      'points': 350,
      'progress': 0.12,
      'imageUrl':
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAm5m8PTTPNZhW71fXaOC68vm2Z2BrL9ytPiYT24HVet1Bnfkx62CZFWqJC6hT7Bxg0PeUpxvJ4SNDuUPHjbTw_RaXYDAzyEYv-VxhQoOMUhx6fvwuL5joT5leDsz0cqloCw_hRT0XpCVoPykNyKS7eYt9rSeoi6370tsbq-Za67Kdur-uhIqFRsyL-yN8xc_M-eNl60mLevoHcseREXV42Mj482jw4j_21i8HvadgMit-Mh8YwOZwjlD8KSklxmfTBhap5lQpA-Xs',
      'isActive': true,
      'isCompleted': false,
    },
  ];

  List<Map<String, dynamic>> get _filteredCourses {
    if (_selectedTabIndex == 0) return _allCourses;
    if (_selectedTabIndex == 1) {
      return _allCourses.where((c) => !c['isCompleted']).toList();
    }
    return _allCourses.where((c) => c['isCompleted']).toList();
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
              child: ListView.separated(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 100),
                itemCount: _filteredCourses.length,
                separatorBuilder: (context, index) =>
                    const SizedBox(height: 20),
                itemBuilder: (context, index) {
                  final course = _filteredCourses[index];
                  return LibraryCourseCard(
                    title: course['title'],
                    subtitle: course['subtitle'],
                    points: course['points'],
                    progress: course['progress'],
                    imageUrl: course['imageUrl'],
                    isActive: course['isActive'],
                    isCompleted: course['isCompleted'],
                  );
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

  const LibraryCourseCard({
    super.key,
    required this.title,
    required this.subtitle,
    required this.points,
    required this.progress,
    required this.imageUrl,
    required this.isActive,
    required this.isCompleted,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
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
                        child: const Center(child: Icon(Icons.image, size: 48)),
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
                    isCompleted ? 'COMPLETED' : 'ACTIVE',
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
                const SizedBox(height: 16),

                // Action Button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {},
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
                          isCompleted
                              ? Icons.workspace_premium
                              : Icons.play_arrow,
                          size: 18,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          isCompleted ? 'View Certificate' : 'Continue Lesson',
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
    );
  }
}
