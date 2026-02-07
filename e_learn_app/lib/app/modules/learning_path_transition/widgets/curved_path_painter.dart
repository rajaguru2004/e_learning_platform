import 'package:flutter/material.dart';

class CurvedPathPainter extends CustomPainter {
  final Color pathColor;
  final double strokeWidth;

  CurvedPathPainter({
    this.pathColor = const Color(0xFF1F1F89),
    this.strokeWidth = 4.0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = pathColor.withOpacity(0.2)
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final path = Path();

    // Start from top
    path.moveTo(size.width / 2, 0);

    // Node positions (approximate y-coordinates)
    final nodePositions = [
      0.0, // Node 1
      size.height * 0.18, // Node 2
      size.height * 0.36, // Node 3 (current)
      size.height * 0.54, // Node 4 (next)
      size.height * 0.72, // Node 5
      size.height * 0.90, // Final goal
    ];

    // Create wavy path with alternating curves
    double centerX = size.width / 2;
    double amplitude = size.width * 0.25; // How far left/right the curve goes

    for (int i = 0; i < nodePositions.length - 1; i++) {
      double startY = nodePositions[i];
      double endY = nodePositions[i + 1];

      // Alternate between right and left curves
      double offsetX = (i % 2 == 0) ? amplitude : -amplitude;

      // Control points for Bezier curve
      double controlX1 = centerX + offsetX;
      double controlY1 = startY + (endY - startY) * 0.3;

      double controlX2 = centerX + offsetX;
      double controlY2 = startY + (endY - startY) * 0.7;

      // Draw cubic Bezier curve
      path.cubicTo(
        controlX1,
        controlY1,
        controlX2,
        controlY2,
        centerX + (i % 2 == 0 ? -amplitude : amplitude) * 0.3,
        endY,
      );

      // Connect to next segment
      if (i < nodePositions.length - 2) {
        path.lineTo(centerX, endY);
      }
    }

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(CurvedPathPainter oldDelegate) => false;

  // Helper method to get position along the path for animation
  static Offset getPositionOnPath(
    Size size,
    int fromIndex,
    int toIndex,
    double progress,
  ) {
    double centerX = size.width / 2;
    double amplitude = size.width * 0.25;

    final nodePositions = [
      0.0,
      size.height * 0.18,
      size.height * 0.36,
      size.height * 0.54,
      size.height * 0.72,
      size.height * 0.90,
    ];

    double startY = nodePositions[fromIndex];
    double endY = nodePositions[toIndex];

    // Calculate position along the curve
    double t = progress;

    // Get the correct start X position (end of previous segment)
    double startX = centerX;
    if (fromIndex > 0) {
      // The previous segment ended at an offset position
      startX =
          centerX + ((fromIndex - 1) % 2 == 0 ? -amplitude : amplitude) * 0.3;
    }

    // Bezier curve calculation for current segment
    double offsetX = (fromIndex % 2 == 0) ? amplitude : -amplitude;
    double controlX1 = centerX + offsetX;
    double controlY1 = startY + (endY - startY) * 0.3;
    double controlX2 = centerX + offsetX;
    double controlY2 = startY + (endY - startY) * 0.7;
    double endX = centerX + (fromIndex % 2 == 0 ? -amplitude : amplitude) * 0.3;

    // Cubic Bezier formula
    double x =
        (1 - t) * (1 - t) * (1 - t) * startX +
        3 * (1 - t) * (1 - t) * t * controlX1 +
        3 * (1 - t) * t * t * controlX2 +
        t * t * t * endX;

    double y =
        (1 - t) * (1 - t) * (1 - t) * startY +
        3 * (1 - t) * (1 - t) * t * controlY1 +
        3 * (1 - t) * t * t * controlY2 +
        t * t * t * endY;

    return Offset(x, y);
  }
}
