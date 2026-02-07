/// Razorpay configuration for payment processing
/// Keys loaded from rzp-key.csv (test mode)
class RazorpayConfig {
  // Test API Keys - Replace with production keys before going live
  static const String keyId = 'rzp_test_SDQ5bgkGO64MYI';
  static const String keySecret = 'oy5GRl0XkyQ65VZYq450z3Sl';

  // Company/App details shown in Razorpay checkout
  static const String companyName = 'E-Learning Platform';
  static const String companyLogo = ''; // Optional: Add your logo URL
  static const String currency = 'INR';

  // Theme configuration for Razorpay checkout
  static const String themeColor = '#1F3D89'; // Matches app primary color

  // Contact details
  static const String contactEmail = 'support@elearning.com';
  static const String contactPhone = '9999999999';
}
