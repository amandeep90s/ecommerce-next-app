import { ERole } from '@/enums';

export const usersData = [
  {
    name: 'Admin User',
    email: 'programmeramandeep@gmail.com',
    password: 'Admin@1234',
    role: ERole.ADMIN,
    is_email_verified: true,
  },
  {
    name: 'Amandeep Singh',
    email: 'amandeepsinghcode@gmail.com',
    password: 'Aman@1234',
    role: ERole.USER,
    is_email_verified: true,
  },
];
