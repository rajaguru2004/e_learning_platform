# API Integration for Courses - Setup Guide

## What I've Implemented

I've successfully integrated the courses API into your Flutter home view. Here's what was done:

### 1. **Added Dependencies**
- Added `http: ^1.2.0` to `pubspec.yaml` for making API requests

### 2. **Created Data Layer**

#### **Models** (`lib/app/data/models/course_model.dart`)
- `CourseModel`: Main course data model
- `InstructorModel`: Instructor information
- `ReviewerModel`: Reviewer information  
- `CoursesResponse`: API response wrapper
- `CoursesData`: Courses data with pagination
- `PaginationModel`: Pagination information

All models include `fromJson` factory methods to parse the API response.

#### **API Constants** (`lib/app/data/constants/api_constants.dart`)
- Centralized location for API URLs
- **IMPORTANT**: You need to update `baseUrl` with your actual API URL

#### **API Service** (`lib/app/data/services/api_service.dart`)
- `getMyCourses()` method to fetch courses from the API
- Includes authentication token support (currently null, add when available)
- Error handling for failed requests

### 3. **Updated Controller** (`lib/app/modules/home/controllers/home_controller.dart`)
- Added reactive course list with `Obx` observables
- Loading and error state management
- `fetchCourses()` method to call the API
- `getImageUrlForCourse()` to cycle through static image URLs
- Static image URLs array (keeping your existing Unsplash images)

### 4. **Updated View** (`lib/app/modules/home/views/home_view.dart`)
- Replaced static course cards with dynamic data from API
- Added loading indicator while fetching courses
- Added error state with retry button
- Added empty state for when no courses exist
- Updated `CourseCard` widget to accept optional fields (price, instructor, duration, rating)
- **Images are still static** - cycling through the predefined Unsplash URLs

## Next Steps - Action Required

### 1. **Update Base URL**
Edit `/home/suryaguru/StudioProjects/flutter_v_338/e_learning_platform/e_learn_app/lib/app/data/constants/api_constants.dart`:

```dart
static const String baseUrl = 'http://your-actual-api-url.com';  // Change this!
```

### 2. **Install Dependencies**
Run in the terminal:
```bash
cd /home/suryaguru/StudioProjects/flutter_v_338/e_learning_platform/e_learn_app
flutter pub get
```

### 3. **Add Authentication Token (Optional)**
If your API requires authentication, update the `ApiService`:
```dart
ApiService.authToken = 'your-jwt-token-here';
```

### 4. **Test the Integration**
Once the base URL is updated and dependencies are installed:
1. Start your backend server
2. Run the Flutter app
3. Navigate to the home view
4. You should see courses from the API with the static images

## Features Included

✅ **Loading State**: Shows circular progress indicator while fetching
✅ **Error Handling**: Displays error message with retry button
✅ **Empty State**: Shows friendly message when no courses exist
✅ **Static Images**: Uses predefined Unsplash URLs (cycles through 6 images)
✅ **Dynamic Data**: Title, description, status, price, instructor, duration, rating from API
✅ **Reactive UI**: Automatically updates when data changes
✅ **Pull-to-Refresh**: Can refresh courses with `controller.refreshCourses()`

## API Response Mapping

The API response fields are mapped as follows:
- `title` → Course card title
- `description` → Course card description
- `statusCode` → Course category badge (DRAFT/PUBLISHED/UNDER_REVIEW)
- `price` → Available in CourseCard (optional parameter)
- `instructor.name` → Available in CourseCard (optional parameter)
- `duration` → Available in CourseCard (optional parameter)
- `averageRating` → Available in CourseCard (optional parameter)
- `thumbnailUrl` → **NOT USED** (using static images instead)
- `progress` → Set to default 0.5 (since API doesn't provide enrollment progress)

## Static Image URLs Used

The following 6 Unsplash images cycle through your courses:
1. UI/UX themed image
2. Coding/Python themed image
3. Finance themed image
4. Technology themed image
5. Computer/Laptop themed image
6. Workspace themed image

The images automatically rotate based on the course index, so each course gets a visually appealing thumbnail.
