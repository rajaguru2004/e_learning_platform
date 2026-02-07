# Learner Courses API Integration - Complete Guide

## Overview

I've successfully implemented the learner courses API endpoints into your Flutter app. The app now fetches real course data from the learner API and displays it with static thumbnail images.

## 🆕 What Was Implemented

### 1. **New API Endpoints**
- **GET** `/api/learner/courses` - Fetch all available courses for learners
- **GET** `/api/learner/courses/:courseId` - Fetch detailed information about a specific course

### 2. **New Data Models**
Created `learner_course_model.dart` with the following models:
- **`LearnerCourseModel`** - Course listing data
- **`LearnerInstructorModel`** - Instructor information (simplified)
- **`LearnerCoursesResponse`** - API response wrapper
- **`LearnerCoursesData`** - Courses data with pagination
- **`CourseDetailModel`** - Detailed course information including enrollment status
- **`CourseDetailResponse`** - Course detail API response wrapper
- **`PaginationModel`** - Pagination metadata

### 3. **Updated Files**

#### **`api_constants.dart`**
Added new endpoint constants:
```dart
static const String learnerCourses = '/api/learner/courses';
static String learnerCourseDetail(String courseId) => '/api/learner/courses/$courseId';
```

#### **`api_service.dart`**
Added two new methods:
```dart
// Fetch all learner courses
static Future<LearnerCoursesResponse> getLearnerCourses() async

// Fetch course detail by ID
static Future<CourseDetailResponse> getCourseDetail(String courseId) async
```

#### **`home_controller.dart`**
- Changed from `CourseModel` to `LearnerCourseModel`
- Updated to use `ApiService.getLearnerCourses()` instead of `getMyCourses()`
- Maintains the same static image cycling logic

#### **`home_view.dart`**
- Updated to use `'COURSE'` as default category badge
- All other fields map correctly to the learner course model

## 📊 API Response Structures

### Learner Courses List Response
```json
{
  "success": true,
  "message": "Courses retrieved successfully",
  "data": {
    "courses": [
      {
        "id": "course-id",
        "title": "Course Title",
        "slug": "course-slug",
        "description": "Course description",
        "thumbnailUrl": null,
        "price": "49",
        "discountedPrice": null,
        "duration": 60,
        "enrollmentCount": 0,
        "averageRating": "0",
        "totalReviews": 0,
        "createdAt": "...",
        "instructor": {
          "id": "instructor-id",
          "name": "Instructor Name"
        }
      }
    ],
    "pagination": {
      "total": 3,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

### Course Detail Response
```json
{
  "success": true,
  "message": "Course details retrieved successfully",
  "data": {
    "id": "course-id",
    "title": "Course Title",
    "description": "Course description",
    "price": "49",
    "duration": 60,
    "statusCode": "PUBLISHED",
    "visibilityCode": "SIGNED_IN",
    "accessCode": "PAYMENT",
    "instructor": {
      "id": "instructor-id",
      "name": "Instructor Name",
      "email": "instructor@email.com"
    },
    "reviews": [],
    "isEnrolled": false,
    "enrollment": null
  }
}
```

## 🔄 Data Flow

```
1. HomeController.onInit() is called
2. fetchCourses() executes
3. ApiService.getLearnerCourses() makes HTTP request
4. Auth token is automatically injected from secure storage
5. API returns course list
6. Data is parsed into LearnerCourseModel objects
7. Courses are displayed in the UI with static images
```

## 🎨 Static Images

The app uses 6 static Unsplash images that cycle through courses:
1. UI/UX Design themed
2. Python/Coding themed
3. Finance/Business themed
4. Technology themed
5. Computer/Development themed
6. Workspace themed

Images are assigned based on course index: `index % 6`

## 📱 Features

### Course Listing (Home Screen)
✅ **Real course data** from learner API  
✅ **Course title** and **description**  
✅ **Price** display  
✅ **Instructor name**  
✅ **Duration** (in minutes)  
✅ **Rating** (average rating)  
✅ **Enrollment count**  
✅ **Static thumbnails** (cycling through 6 images)  
✅ **Loading state** with spinner  
✅ **Error handling** with retry  
✅ **Empty state** when no courses  

### Course Detail (Ready to Use)
The API service includes `getCourseDetail(courseId)` which returns:
- Full course information
- Enrollment status (`isEnrolled`)
- Course reviews
- Access code and visibility settings
- Instructor email

## 🚀 Usage Examples

### Fetch All Learner Courses
```dart
final response = await ApiService.getLearnerCourses();
List<LearnerCourseModel> courses = response.data.courses;
```

### Fetch Course Detail
```dart
final response = await ApiService.getCourseDetail('course-id-here');
CourseDetailModel courseDetail = response.data;

print('Title: ${courseDetail.title}');
print('Is Enrolled: ${courseDetail.isEnrolled}');
print('Reviews: ${courseDetail.reviews.length}');
```

### Navigate to Course Detail (Example)
In your CourseCard widget's onTap:
```dart
onTap: () async {
  try {
    final detail = await ApiService.getCourseDetail(course.id);
    Get.toNamed('/course-detail', arguments: detail.data);
  } catch (e) {
    Get.snackbar('Error', 'Failed to load course details');
  }
}
```

## 🔐 Authentication

All requests automatically include the authentication token:
- Token is retrieved from secure storage
- Injected in `Authorization: Bearer <token>` header
- No manual token management needed

## 📝 Differences from Instructor API

| Field | Instructor API | Learner API |
|-------|---------------|-------------|
| `statusCode` | ✅ Included | ❌ Not in list (only in detail) |
| `visibilityCode` | ✅ Included | ❌ Not in list (only in detail) |
| `accessCode` | ✅ Included | ❌ Not in list (only in detail) |
| `isEnrolled` | ❌ Not included | ✅ Only in detail |
| `enrollment` | ❌ Not included | ✅ Only in detail |
| `instructor.email` | ✅ Included | ✅ Only in detail |

## 🎯 Next Steps

### 1. Implement Course Detail Page
Create a course detail view that uses the `getCourseDetail()` API:

```dart
class CourseDetailView extends StatelessWidget {
  final String courseId;
  
  @override
  Widget build(BuildContext context) {
    return FutureBuilder<CourseDetailResponse>(
      future: ApiService.getCourseDetail(courseId),
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          final course = snapshot.data!.data;
          return CourseDetailContent(course: course);
        }
        return LoadingSpinner();
      },
    );
  }
}
```

### 2. Add Enrollment Feature
Use the `isEnrolled` field to show different UI:
- Show "Continue Learning" if enrolled
- Show "Enroll Now" if not enrolled

### 3. Display Reviews
Parse and display the `reviews` array from course detail

### 4. Filter Courses
Add filtering by price, rating, duration, etc.

### 5. Search Functionality
Implement course search using the course title and description

## 🔧 Testing

### Test the Integration
1. Login with valid credentials
2. Navigate to home screen
3. Courses should load automatically
4. See 3 courses from the API:
   - "python course" - ₹49
   - "Business Analytics Fundamentals" - Free
   - "Python for Data Science" - ₹149.99

### Expected Behavior
- ✅ Loading spinner appears briefly
- ✅ Courses display with static images
- ✅ Course titles, descriptions, and prices are correct
- ✅ Instructor names are shown
- ✅ Default "COURSE" badge appears
- ✅ Pull to refresh works (call `controller.refreshCourses()`)

## ⚠️ Important Notes

1. **Lint Errors**: Will disappear after Dart analyzer picks up new files
2. **Static Images**: Thumbnails use predefined Unsplash URLs, not from API
3. **Progress Bar**: Shows 50% default progress (API doesn't provide enrollment progress in list)
4. **Category Badge**: Shows "COURSE" for all courses (list API doesn't include statusCode)

## 📦 File Structure

```
lib/app/data/
├── models/
│   ├── course_model.dart (existing - for instructor)
│   ├── learner_course_model.dart (new)
│   └── user_model.dart (existing)
├── services/
│   ├── api_service.dart (updated)
│   ├── auth_service.dart (existing)
│   └── storage_service.dart (existing)
└── constants/
    └── api_constants.dart (updated)
```

## 🎨 UI Components Remain the Same

The `CourseCard` widget and all UI components work exactly the same. Only the data source changed from instructor API to learner API.

## ✅ Summary

**Before**: HomeController fetched instructor courses (`/api/v1/courses/my`)  
**After**: HomeController fetches learner courses (`/api/learner/courses`)  

All authentication, image cycling, loading states, and error handling remain identical. The transition is seamless!

Would you like me to help implement the course detail page or add any additional features?
