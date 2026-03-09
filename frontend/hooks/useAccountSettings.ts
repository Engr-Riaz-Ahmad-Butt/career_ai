import { useMutation } from '@tanstack/react-query';
import { userApi } from '@/lib/api/endpoints/user.api';

export interface ProfileUpdateFormInput {
  readonly fullName: string;
  readonly phone?: string;
  readonly bio?: string;
}

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const [firstName, ...rest] = fullName.trim().split(' ');
  return {
    firstName: firstName || '.',
    lastName: rest.join(' ') || '.',
  };
}

export function useProfileUpdateMutation() {
  return useMutation({
    mutationFn: async (values: ProfileUpdateFormInput) => {
      const { firstName, lastName } = splitFullName(values.fullName);

      return userApi.updateProfile({
        firstName,
        lastName,
        phone: values.phone,
      });
    },
  });
}

export function usePasswordChangeMutation() {
  return useMutation({
    mutationFn: (values: { currentPassword: string; newPassword: string }) =>
      userApi.changePassword(values),
  });
}
