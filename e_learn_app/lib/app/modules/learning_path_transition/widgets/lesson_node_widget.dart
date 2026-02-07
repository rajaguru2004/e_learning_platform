import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

enum NodeState { completed, current, next, locked }

class LessonNodeWidget extends StatefulWidget {
  final int lessonNumber;
  final String title;
  final NodeState state;
  final bool alignRight;

  const LessonNodeWidget({
    super.key,
    required this.lessonNumber,
    required this.title,
    required this.state,
    this.alignRight = false,
  });

  @override
  State<LessonNodeWidget> createState() => _LessonNodeWidgetState();
}

class _LessonNodeWidgetState extends State<LessonNodeWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _pulseController;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );

    if (widget.state == NodeState.current) {
      _pulseController.repeat();
    }
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: widget.alignRight
          ? MainAxisAlignment.end
          : MainAxisAlignment.start,
      children: widget.alignRight
          ? [_buildLabel(), const SizedBox(width: 16), _buildNode()]
          : [_buildNode(), const SizedBox(width: 16), _buildLabel()],
    );
  }

  Widget _buildNode() {
    return AnimatedBuilder(
      animation: _pulseController,
      builder: (context, child) {
        return Container(
          decoration: widget.state == NodeState.current
              ? BoxDecoration(
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: const Color(
                        0xFF1F1F89,
                      ).withOpacity(0.4 * (1 - _pulseController.value)),
                      blurRadius: 0,
                      spreadRadius: 10 * _pulseController.value,
                    ),
                  ],
                )
              : null,
          child: child,
        );
      },
      child: Container(
        width: widget.state == NodeState.current ? 56 : 48,
        height: widget.state == NodeState.current ? 56 : 48,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: _getNodeColor(),
          border: widget.state == NodeState.current
              ? Border.all(color: Colors.white, width: 4)
              : widget.state == NodeState.locked
              ? Border.all(color: const Color(0xFFE0E0E0), width: 2)
              : null,
          boxShadow: [
            if (widget.state == NodeState.completed ||
                widget.state == NodeState.current ||
                widget.state == NodeState.next)
              BoxShadow(
                color: _getNodeColor().withOpacity(0.3),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
          ],
        ),
        child: Center(child: _getNodeIcon()),
      ),
    );
  }

  Widget _buildLabel() {
    return Column(
      crossAxisAlignment: widget.alignRight
          ? CrossAxisAlignment.end
          : CrossAxisAlignment.start,
      children: [
        Text(
          _getStateLabel(),
          style: GoogleFonts.lexend(
            fontSize: 10,
            fontWeight: FontWeight.w600,
            color: _getStateLabelColor(),
            letterSpacing: 1.5,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          widget.title,
          style: GoogleFonts.lexend(
            fontSize: widget.state == NodeState.current ? 16 : 14,
            fontWeight: widget.state == NodeState.current
                ? FontWeight.bold
                : FontWeight.w500,
            color: widget.state == NodeState.locked
                ? Colors.grey[400]
                : const Color(0xFF0F121A),
          ),
          textAlign: widget.alignRight ? TextAlign.right : TextAlign.left,
        ),
      ],
    );
  }

  Color _getNodeColor() {
    switch (widget.state) {
      case NodeState.completed:
        return const Color(0xFF2EC4B6); // Mint color
      case NodeState.current:
        return const Color(0xFF1F1F89); // Primary blue
      case NodeState.next:
        return const Color(0xFF1F1F89).withOpacity(0.7);
      case NodeState.locked:
        return Colors.white;
    }
  }

  Widget _getNodeIcon() {
    switch (widget.state) {
      case NodeState.completed:
        return const Icon(Icons.check, color: Colors.white, size: 24);
      case NodeState.current:
        return Text(
          '${widget.lessonNumber.toString().padLeft(2, '0')}',
          style: GoogleFonts.lexend(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        );
      case NodeState.next:
        return Text(
          '${widget.lessonNumber.toString().padLeft(2, '0')}',
          style: GoogleFonts.lexend(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        );
      case NodeState.locked:
        return Icon(Icons.lock_outline, color: Colors.grey[400], size: 20);
    }
  }

  String _getStateLabel() {
    switch (widget.state) {
      case NodeState.completed:
        return 'COMPLETED';
      case NodeState.current:
        return 'CURRENT';
      case NodeState.next:
        return 'NEXT';
      case NodeState.locked:
        return 'LOCKED';
    }
  }

  Color _getStateLabelColor() {
    switch (widget.state) {
      case NodeState.completed:
        return const Color(0xFF2EC4B6);
      case NodeState.current:
        return const Color(0xFF1F1F89);
      case NodeState.next:
        return const Color(0xFF1F1F89).withOpacity(0.7);
      case NodeState.locked:
        return Colors.grey[400]!;
    }
  }
}
