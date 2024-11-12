import { NavItem, PatientItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number;
  latitude?: number; 
  job: string;
  profile_picture?: string | null; 
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  // {
  //   title: 'Patients',
  //   href: '/dashboard/patient',
  //   icon: 'user',
  //   label: 'patient'
  // },
  {
    title: 'Calendar',
    href: '/dashboard/calendar',
    icon: 'calendar',
    label: 'Calendar'
  },
  {
    title: 'Profile',
    href: '/dashboard/profile',
    icon: 'user',
    label: 'Profile'
  },
];

export const roles = [
  'Manager',
  "Provider"
]

export const patientItems= (userDetailsId: string): PatientItem[] => [
  {
    title: 'Patient Details',
    href: `/dashboard/patient/patientDetails/${userDetailsId}`,
    label: 'Patient Details'
  },
  {
    title: 'Appointments',
    href: `/dashboard/patient/patientDetails/${userDetailsId}/appointments`,
    label: 'Appointments'
  },
  {
    title: 'Messages',
    href: '/dashboard/patient',
    label: 'Messages'
  },
  {
    title: 'Tasks',
    href: '/dashboard/patient',
    label: 'Tasks'
  },
  {
    title: 'Recalls',
    href: '/dashboard',
    label: 'Recalls'
  },
  {
    title: 'Alerts',
    href: '/dashboard/patient',
    label: 'Alerts'
  },
  {
    title: 'Quick Notes',
    href: '/dashboard/patient',
    label: 'Quick Notes'
  },
  {
    title: 'Dashboard',
    href: '/dashboard',
    label: 'Dashboard'
  },
  {
    title: 'Diagnoses',
    href: '/dashboard/patient',
    label: 'Diagnoses'
  },
  {
    title: 'Medications',
    href: '/dashboard/patient',
    label: 'Medications'
  },
  {
    title: 'Allergies',
    href: '/dashboard',
    label: 'Allergies'
  },
  {
    title: 'Vitals',
    href: '/dashboard/patient',
    label: 'Vitals'
  },
  {
    title: 'Injections',
    href: '/dashboard',
    label: 'Injections'
  },
  {
    title: 'Vaccines',
    href: '/dashboard/patient',
    label: 'Vaccines'
  },
  {
    title: 'Encounters',
    href: '/dashboard',
    label: 'Encounters'
  },
  {
    title: 'Lab Records',
    href: '/dashboard/patient',
    label: 'Lab Records'
  },
  {
    title: 'Images',
    href: '/dashboard',
    label: 'Images'
  },
  {
    title: 'Documents',
    href: '/dashboard/patient',
    label: 'Documents'
  },
  {
    title: 'Referrals',
    href: '/dashboard',
    label: 'Referrals'
  },
  {
    title: 'Audit Trails',
    href: '/dashboard/patient',
    label: 'Audit Trails'
  },
  {
    title: 'Amendments',
    href: '/dashboard',
    label: 'Amendments'
  },
];


export const timeSlots = [
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
];