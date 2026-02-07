# Course Card Button Update

## Change Made
Updated the course card button in `lib/app/modules/home/views/home_view.dart` to display enrollment information instead of "Continue Lesson".

## Before
- Button text: "Continue Lesson"
- Icon: Play arrow (▶)
- Purpose: Implied the user was already enrolled

## After
- Button text: 
  - "Enroll - ₹{price}" (for paid courses)
  - "Enroll Now - Free" (for free courses)
- Icon: Shopping cart (🛒)
- Purpose: Clearly indicates enrollment action with price

## Logic
```dart
price != null && price!.isNotEmpty && price != '0'
    ? 'Enroll - ₹$price'
    : 'Enroll Now - Free'
```

This checks:
1. If price exists and is not empty
2. If price is not "0" (free)
3. Shows price for paid courses
4. Shows "Free" for free courses

## Visual Changes
- ✅ Shopping cart icon instead of play icon
- ✅ Price displayed on button for paid courses
- ✅ "Free" label for courses with price = "0"
- ✅ Clear call-to-action for enrollment

This better matches the learner course context where users are browsing courses they haven't enrolled in yet.
