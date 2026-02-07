import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../controllers/badges_controller.dart';

class BadgesView extends GetView<BadgesController> {
  const BadgesView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(
          'Badges Cabinet',
          style: GoogleFonts.lexend(
            fontWeight: FontWeight.bold,
            color: const Color(0xFF1F3D89),
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF1F3D89)),
          onPressed: () => Get.back(),
        ),
      ),
      body: Obx(() {
        if (controller.isLoading.value) {
          return const Center(child: CircularProgressIndicator());
        }

        if (controller.errorMessage.value.isNotEmpty) {
          return Center(child: Text(controller.errorMessage.value));
        }

        final totalPoints =
            controller.profile.value?.data.stats.totalPoints ?? 0;

        return Column(
          children: [
            _buildHeader(totalPoints),
            const Divider(height: 1),
            _buildTableHeader(),
            Expanded(
              child: ListView.separated(
                itemCount: controller.badgeRanges.length,
                separatorBuilder: (context, index) => const Divider(height: 1),
                itemBuilder: (context, index) {
                  final badge = controller.badgeRanges[index];
                  final isActive = controller.isBadgeActive(badge['min']);
                  return _buildBadgeRow(badge, isActive);
                },
              ),
            ),
          ],
        );
      }),
    );
  }

  Widget _buildHeader(int totalPoints) {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF1F3D89).withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.workspace_premium,
              color: Color(0xFF1F3D89),
              size: 32,
            ),
          ),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'YOUR SCORE',
                style: GoogleFonts.lexend(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey[500],
                  letterSpacing: 1,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                '$totalPoints pts',
                style: GoogleFonts.lexend(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFFF4C430),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTableHeader() {
    return Container(
      color: Colors.grey[50],
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          Expanded(
            flex: 3,
            child: Text(
              'BADGE',
              style: GoogleFonts.lexend(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: Colors.grey[600],
              ),
            ),
          ),
          Expanded(
            flex: 2,
            child: Text(
              'RANGE',
              style: GoogleFonts.lexend(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: Colors.grey[600],
              ),
            ),
          ),
          Expanded(
            flex: 2,
            child: Text(
              'STATUS',
              textAlign: TextAlign.center,
              style: GoogleFonts.lexend(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: Colors.grey[600],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBadgeRow(Map<String, dynamic> badge, bool isActive) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      child: Row(
        children: [
          Expanded(
            flex: 3,
            child: Row(
              children: [
                Stack(
                  alignment: Alignment.center,
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: Colors.grey[100],
                        shape: BoxShape.circle,
                      ),
                    ),
                    const Icon(
                      Icons.military_tech,
                      color: Color(0xFFF4C32F),
                      size: 28,
                    ),
                  ],
                ),
                const SizedBox(width: 12),
                Text(
                  badge['name'],
                  style: GoogleFonts.lexend(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: isActive ? Colors.black87 : Colors.grey[400],
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            flex: 2,
            child: Text(
              badge['range'],
              style: GoogleFonts.lexend(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: const Color(
                  0xFFF4C430,
                ).withOpacity(isActive ? 1.0 : 0.5),
              ),
            ),
          ),
          Expanded(
            flex: 2,
            child: Center(
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: isActive
                      ? const Color(0xFF2EC4B6).withOpacity(0.1)
                      : Colors.grey[100],
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  isActive ? 'Active' : 'Locked',
                  style: GoogleFonts.lexend(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: isActive
                        ? const Color(0xFF2EC4B6)
                        : Colors.grey[400],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
