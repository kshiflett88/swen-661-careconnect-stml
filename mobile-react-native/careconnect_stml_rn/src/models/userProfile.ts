export type UserProfile = {
  userName: string;
  caregiverName: string;
  caregiverPhone: string;
  caregiverEmail: string;
  // optional
  dateOfBirth?: string | Date | null;
};

export function mockUserProfile(): UserProfile {
  return {
    userName: 'John Doe',
    caregiverName: 'Jane Doe',
    caregiverPhone: '(555) 123-4567',
    caregiverEmail: 'jane.doe@email.com',
    // you can remove this line if you want DOB hidden
    dateOfBirth: 'January 2, 1950',
  };
}
