/// Represents a care recipient's profile information
class UserProfile {
  final String userId;
  final String userName;
  final String? userPhotoUrl;
  final String caregiverName;
  final String caregiverPhone;
  final String caregiverEmail;

  const UserProfile({
    required this.userId,
    required this.userName,
    this.userPhotoUrl,
    required this.caregiverName,
    required this.caregiverPhone,
    required this.caregiverEmail,
  });

  factory UserProfile.mock() {
    return const UserProfile(
      userId: 'user_001',
      userName: 'Keisha Williams',
      userPhotoUrl: null,
      caregiverName: 'Marcus Johnson',
      caregiverPhone: '+1-555-123-4567',
      caregiverEmail: 'marcus.johnson@email.com',
    );
  }
}
