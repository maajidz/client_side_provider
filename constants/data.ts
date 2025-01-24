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
    href: "/dashboard/provider/patient",
    icon: "users",
    label: "Patients",
  },
  {
    title: "Calendar",
    href: "/dashboard/provider/calendar",
    icon: "calendar",
    label: "Calendar",
  },
  // {
  //   title: "Messages",
  //   href: "/dashboard/provider/calendar",
  //   icon: "message",
  //   label: "Messages",
  // },
  {
    title: "Tasks",
    href: "/dashboard/provider/tasks",
    icon: "tasks",
    label: "Tasks",
  },
  {
    title: "Analytics",
    href: "/dashboard/provider/analytics",
    icon: "activity",
    label: "Analytics",
  },
  // {
  //   title: "Billing",
  //   href: "/dashboard/provider/calendar",
  //   icon: "billing",
  //   label: "Billing",
  // },
  // {
  //   title: "Inventory",
  //   href: "/dashboard/provider/calendar",
  //   icon: "archive",
  //   label: "Inventory",
  // },
  {
    title: "Charts",
    href: "/dashboard/provider/charts",
    icon: "clipboard",
    label: "Charts",
  },
  {
    title: "Prescription",
    href: "/dashboard/provider/prescription",
    icon: "pill",
    label: "Prescription",
  },
  {
    title: "Labs",
    href: "/dashboard/provider/labs",
    icon: "labs",
    label: "Labs",
  },
  {
    title: "Images",
    href: "/dashboard/provider/images",
    icon: "microscope",
    label: "Images",
  },
  {
    title: "Documents",
    href: "/dashboard/provider/documents",
    icon: "document",
    label: "Documents",
  },
  {
    title: "Injections",
    href: "/dashboard/provider/injections",
    icon: "injection",
    label: "Injections",
  },
  {
    title: "Referrals",
    href: "/dashboard/provider/referral",
    icon: "refer",
    label: "Referrals",
  },
  {
    title: "Profile",
    href: "/dashboard/provider/profile",
    icon: "user",
    label: "Profile",
  },
];

export const roles = ["Manager", "Provider"];

export const patientItems = (userDetailsId: string): PatientItem[] => [
  {
    title: "Patient Details",
    href: `/dashboard/provider/patient/${userDetailsId}/patientDetails`,
    label: "Patient Details",
  },
  {
    title: "Appointments",
    href: `/dashboard/provider/patient/${userDetailsId}/appointments`,
    label: "Appointments",
  },
  // {
  //   title: "Messages",
  //   href: `/dashboard/provider/patient/${userDetailsId}/messages`,
  //   label: "Messages",
  // },
  {
    title: "Tasks",
    href: `/dashboard/provider/patient/${userDetailsId}/tasks`,
    label: "Tasks",
  },
  {
    title: "Recalls",
    href: `/dashboard/provider/patient/${userDetailsId}/recalls`,
    label: "Recalls",
  },
  {
    title: "Alerts",
    href: `/dashboard/provider/patient/${userDetailsId}/alerts`,
    label: "Alerts",
  },
  {
    title: "Quick Notes",
    href: `/dashboard/provider/patient/${userDetailsId}/quick_notes`,
    label: "Quick Notes",
  },
  // {
  //   title: "Dashboard",
  //   href: `/dashboard/provider/patient/${userDetailsId}/dashboard`,
  //   label: "Dashboard",
  // },
  {
    title: "Diagnoses",
    href: `/dashboard/provider/patient/${userDetailsId}/diagnoses`,
    label: "Diagnoses",
  },
  {
    title: "Medications",
    href: `/dashboard/provider/patient/${userDetailsId}/medications`,
    label: "Medications",
  },
  {
    title: "Allergies",
    href: `/dashboard/provider/patient/${userDetailsId}/allergies`,
    label: "Allergies",
  },
  {
    title: "Vitals",
    href: `/dashboard/provider/patient/${userDetailsId}/vitals`,
    label: "Vitals",
  },
  {
    title: "Injections",
    href: `/dashboard/provider/patient/${userDetailsId}/injections`,
    label: "Injections",
  },
  {
    title: "Vaccines",
    href: `/dashboard/provider/patient/${userDetailsId}/vaccines`,
    label: "Vaccines",
  },
  {
    title: "Encounters",
    href: `/dashboard/provider/patient/${userDetailsId}/encounters`,
    label: "Encounters",
  },
  {
    title: "Lab Records",
    href: `/dashboard/provider/patient/${userDetailsId}/lab_records`,
    label: "Lab Records",
  },
  {
    title: "Images",
    href: `/dashboard/provider/patient/${userDetailsId}/images`,
    label: "Images",
  },
  {
    title: "Documents",
    href: `/dashboard/provider/patient/${userDetailsId}/documents`,
    label: "Documents",
  },
  {
    title: "Referrals",
    href: `/dashboard/provider/patient/${userDetailsId}/referrals`,
    label: "Referrals",
  },
  {
    title: "",
    href: `/dashboard`,
    label: "",
  },
  // {
  //   title: "Audit Trails",
  //   href: `/dashboard/patients/${userDetailsId}/audit_trails`,
  //   label: "Audit Trails",
  // },
  // {
  //   title: "Amendments",
  //   href: `/dashboard/patients/${userDetailsId}/ammendments`,
  //   label: "Amendments",
  // },
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