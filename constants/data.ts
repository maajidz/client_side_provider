import { NavItem, PatientItem } from "@/types";

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
    name: "Candice Schiner",
    company: "Dell",
    role: "Frontend Developer",
    verified: false,
    status: "Active",
  },
  {
    id: 2,
    name: "John Doe",
    company: "TechCorp",
    role: "Backend Developer",
    verified: true,
    status: "Active",
  },
  {
    id: 3,
    name: "Alice Johnson",
    company: "WebTech",
    role: "UI Designer",
    verified: true,
    status: "Active",
  },
  {
    id: 4,
    name: "David Smith",
    company: "Innovate Inc.",
    role: "Fullstack Developer",
    verified: false,
    status: "Inactive",
  },
  {
    id: 5,
    name: "Emma Wilson",
    company: "TechGuru",
    role: "Product Manager",
    verified: true,
    status: "Active",
  },
  {
    id: 6,
    name: "James Brown",
    company: "CodeGenius",
    role: "QA Engineer",
    verified: false,
    status: "Active",
  },
  {
    id: 7,
    name: "Laura White",
    company: "SoftWorks",
    role: "UX Designer",
    verified: true,
    status: "Active",
  },
  {
    id: 8,
    name: "Michael Lee",
    company: "DevCraft",
    role: "DevOps Engineer",
    verified: false,
    status: "Active",
  },
  {
    id: 9,
    name: "Olivia Green",
    company: "WebSolutions",
    role: "Frontend Developer",
    verified: true,
    status: "Active",
  },
  {
    id: 10,
    name: "Robert Taylor",
    company: "DataTech",
    role: "Data Analyst",
    verified: false,
    status: "Active",
  },
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
  // {
  //   title: 'Dashboard',
  //   href: '/dashboard',
  //   icon: 'dashboard',
  //   label: 'Dashboard'
  // },
  {
    title: "Patients",
    href: "/dashboard/patients",
    icon: "users",
    label: "Patients",
  },
  {
    title: "Calendar",
    href: "/dashboard/calendar",
    icon: "calendar",
    label: "Calendar",
  },
  // {
  //   title: "Messages",
  //   href: "/dashboard/calendar",
  //   icon: "message",
  //   label: "Messages",
  // },
  {
    title: "Tasks",
    href: "/dashboard/tasks",
    icon: "tasks",
    label: "Tasks",
  },
  // {
  //   title: "Analytics",
  //   href: "/dashboard/calendar",
  //   icon: "activity",
  //   label: "Analytics",
  // },
  // {
  //   title: "Billing",
  //   href: "/dashboard/calendar",
  //   icon: "billing",
  //   label: "Billing",
  // },
  // {
  //   title: "Inventory",
  //   href: "/dashboard/calendar",
  //   icon: "archive",
  //   label: "Inventory",
  // },
  {
    title: "Charts",
    href: "/dashboard/charts",
    icon: "clipboard",
    label: "Charts",
  },
  {
    title: "Prescription",
    href: "/dashboard/prescription",
    icon: "pill",
    label: "Prescription",
  },
  {
    title: "Labs",
    href: "/dashboard/labs",
    icon: "labs",
    label: "Labs",
  },
  {
    title: "Images",
    href: "/dashboard/images",
    icon: "microscope",
    label: "Images",
  },
  {
    title: "Documents",
    href: "/dashboard/documents",
    icon: "document",
    label: "Documents",
  },
  {
    title: "Injections",
    href: "/dashboard/injections",
    icon: "injection",
    label: "Injections",
  },
  {
    title: "Referrals",
    href: "/dashboard/referral",
    icon: "refer",
    label: "Referrals",
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: "user",
    label: "Profile",
  },
];

export const roles = ["Manager", "Provider"];

export const patientItems = (userDetailsId: string): PatientItem[] => [
  {
    title: "Patient Details",
    href: `/dashboard/patients/${userDetailsId}/patientDetails`,
    label: "Patient Details",
  },
  {
    title: "Appointments",
    href: `/dashboard/patients/${userDetailsId}/appointments`,
    label: "Appointments",
  },
  {
    title: "Messages",
    href: `/dashboard/patients/${userDetailsId}/messages`,
    label: "Messages",
  },
  {
    title: "Tasks",
    href: `/dashboard/patients/${userDetailsId}/tasks`,
    label: "Tasks",
  },
  {
    title: "Recalls",
    href: `/dashboard/patients/${userDetailsId}/recalls`,
    label: "Recalls",
  },
  {
    title: "Alerts",
    href: `/dashboard/patients/${userDetailsId}/alerts`,
    label: "Alerts",
  },
  {
    title: "Quick Notes",
    href: `/dashboard/patients/${userDetailsId}/quick_notes`,
    label: "Quick Notes",
  },
  {
    title: "Dashboard",
    href: `/dashboard/patients/${userDetailsId}/dashboard`,
    label: "Dashboard",
  },
  {
    title: "Diagnoses",
    href: `/dashboard/patients/${userDetailsId}/diagnoses`,
    label: "Diagnoses",
  },
  {
    title: "Medications",
    href: `/dashboard/patients/${userDetailsId}/medications`,
    label: "Medications",
  },
  {
    title: "Allergies",
    href: `/dashboard/patients/${userDetailsId}/allergies`,
    label: "Allergies",
  },
  {
    title: "Vitals",
    href: `/dashboard/patients/${userDetailsId}/vitals`,
    label: "Vitals",
  },
  {
    title: "Injections",
    href: `/dashboard/patients/${userDetailsId}/injections`,
    label: "Injections",
  },
  {
    title: "Vaccines",
    href: `/dashboard/patients/${userDetailsId}/vaccines`,
    label: "Vaccines",
  },
  {
    title: "Encounters",
    href: `/dashboard/patients/${userDetailsId}/encounters`,
    label: "Encounters",
  },
  {
    title: "Lab Records",
    href: `/dashboard/patients/${userDetailsId}/lab_Records`,
    label: "Lab Records",
  },
  {
    title: "Images",
    href: `/dashboard/patients/${userDetailsId}/images`,
    label: "Images",
  },
  {
    title: "Documents",
    href: `/dashboard/patients/${userDetailsId}/documents`,
    label: "Documents",
  },
  {
    title: "Referrals",
    href: `/dashboard/patients/${userDetailsId}/referrals`,
    label: "Referrals",
  },
  {
    title: "Audit Trails",
    href: `/dashboard/patients/${userDetailsId}/audit_trails`,
    label: "Audit Trails",
  },
  {
    title: "Amendments",
    href: `/dashboard/patients/${userDetailsId}/ammendments`,
    label: "Amendments",
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

export const reminderOptions = [
  "On Due Date",
  "1 Day Before",
  "2 Days Before",
  "3 Days Before",
];

export const priority = [
  "low",
  "medium",
  "high"
]

export const categoryOptions = [
  { value: "ancillary_appointments", label: "Ancillary Appointments" },
  { value: "appointment", label: "Appointment" },
  { value: "billing", label: "Billing" },
  { value: "cancel_subscription", label: "Cancel Subscription" },
  { value: "follow_up", label: "Follow Up" },
];

export const status = [
  { value:"PENDING" , label: "Pending" },
  { value:"IN_PROGRESS" , label: "In Progress" },
  { value:"Completed" , label: "Completed" },
  { value:"Cancelled" , label: "Cancelled" }
]