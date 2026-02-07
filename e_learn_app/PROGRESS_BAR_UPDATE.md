# Progress Bar Logic Update

## Change Made
Modified `lib/app/modules/home/views/home_view.dart` to conditionally display the progress bar in `CourseCard` only when a `progress` value is provided.

## Before
- `progress` parameter in `CourseCard` was required and non-nullable (`double`).
- `HomeView` always passed `0.5` as a default progress value.
- Every course card displayed an "IN PROGRESS" 50% bar, regardless of enrollment status.

## After
- `progress` parameter in `CourseCard` is now optional and nullable (`double?`).
- `HomeView` no longer passes a default `0.5` progress value (defaulting to `null`).
- `CourseCard` checks `if (progress != null)` before rendering:
  - The "IN PROGRESS" text and percentage label.
  - The linear progress indicator bar.

## Visual Changes
- ✅ **Unenrolled/Not Purchased Courses**: No progress bar is shown. The card is cleaner and focuses on the "Enroll" button.
- ✅ **Enrolled Courses (Future)**: When the API provides progress data for enrolled courses, passing a non-null implementation will automatically show the progress bar again.

This aligns with the user request to hide the progress bar for not purchased courses, giving a more accurate representation of the course state.
