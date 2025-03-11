import { NavItem, PatientItem } from "@/types";
import { InsuranceType } from "@/types/insuranceInterface";

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
    badgeIcon: "arrowUp",
    badgeColor: "blue",
    badgeLabel: "5 new",
  },
  {
    title: "Calendar",
    href: "/dashboard/provider/calendar",
    icon: "calendar",
    label: "Calendar",
    badgeIcon: "arrowUp",
    badgeColor: "warning",
    badgeLabel: "5 new",
  },
  {
    title: "Messages",
    href: "/dashboard/provider/messages",
    icon: "message",
    label: "Messages",
    badgeIcon: "arrowUp",
    badgeColor: "blue",
    badgeLabel: "5 new",
  },
  {
    title: "Tasks",
    href: "/dashboard/provider/tasks",
    icon: "tasks",
    label: "Tasks",
    badgeIcon: "arrowUp",
    badgeColor: "blue",
    badgeLabel: "5 new",
  },
  {
    title: "Analytics",
    href: "/dashboard/provider/analytics",
    icon: "activity",
    label: "Analytics",
    badgeIcon: "arrowUp",
    badgeColor: "blue",
    badgeLabel: "5 new",
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
    badgeIcon: "arrowUp",
    badgeColor: "blue",
    badgeLabel: "5 new",
  },
  {
    title: "Prescription",
    href: "/dashboard/provider/prescription",
    icon: "pill",
    label: "Prescription",
    badgeIcon: "arrowUp",
    badgeColor: "blue",
    badgeLabel: "5 new",
  },
  {
    title: "Labs",
    href: "/dashboard/provider/labs",
    icon: "labs",
    label: "Labs",
    badgeIcon: "arrowUp",
    badgeColor: "blue",
    badgeLabel: "5 new",
  },
  {
    title: "Images",
    href: "/dashboard/provider/images",
    icon: "microscope",
    label: "Images",
    badgeIcon: "arrowUp",
    badgeColor: "blue",
    badgeLabel: "5 new",
  },
  {
    title: "Documents",
    href: "/dashboard/provider/documents",
    icon: "document",
    label: "Documents",
    badgeIcon: "arrowUp",
    badgeColor: "blue",
    badgeLabel: "5 new",
  },
  {
    title: "Injections",
    href: "/dashboard/provider/injections",
    icon: "injection",
    label: "Injections",
    badgeIcon: "arrowUp",
    badgeColor: "blue",
    badgeLabel: "5 new"
  },
  {
    title: "Referrals",
    href: "/dashboard/provider/referral",
    icon: "refer",
    label: "Referrals",
    badgeIcon: "arrowUp",
    badgeColor: "blue",
    badgeLabel: "15 new"
  },
  // {
  //   title: "Profile",
  //   href: "/dashboard/provider/profile",
  //   icon: "user",
  //   label: "Profile",
  // },
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
  {
    title: "Messages",
    href: `/dashboard/provider/patient/${userDetailsId}/messages`,
    label: "Messages",
  },
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
    title: "Notes",
    href: `/dashboard/provider/patient/${userDetailsId}/notes`,
    label: "Notes",
  },
  {
    title: "Dashboard",
    href: `/dashboard/provider/patient/${userDetailsId}/dashboard`,
    label: "Dashboard",
  },
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

export const priority = ["low", "medium", "high"];

export const categoryOptions = [
  { value: "ancillary_appointments", label: "Ancillary Appointments" },
  { value: "appointment", label: "Appointment" },
  { value: "billing", label: "Billing" },
  { value: "cancel_subscription", label: "Cancel Subscription" },
  { value: "follow_up", label: "Follow Up" },
];

export const status = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
];

export const labOrderStatus = [
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "ended", label: "Ended" },
];

export const taskStatus = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "Completed", label: "Completed" },
]; 

export const injectionStatus = [
  { value: "Pending", label: "Pending" },
  { value: "active", label: "Active" },
]; 

export const US_STATES = [
  { name: "Alabama" },
  { name: "Alaska" },
  { name: "Arizona" },
  { name: "Arkansas" },
  { name: "California" },
  { name: "Colorado" },
  { name: "Connecticut" },
  { name: "Delaware" },
  { name: "Florida" },
  { name: "Georgia" },
  { name: "Hawaii" },
  { name: "Idaho" },
  { name: "Illinois" },
  { name: "Indiana" },
  { name: "Iowa" },
  { name: "Kansas" },
  { name: "Kentucky" },
  { name: "Louisiana" },
  { name: "Maine" },
  { name: "Maryland" },
  { name: "Massachusetts" },
  { name: "Michigan" },
  { name: "Minnesota" },
  { name: "Mississippi" },
  { name: "Missouri" },
  { name: "Montana" },
  { name: "Nebraska" },
  { name: "Nevada" },
  { name: "New Hampshire" },
  { name: "New Jersey" },
  { name: "New Mexico" },
  { name: "New York" },
  { name: "North Carolina" },
  { name: "North Dakota" },
  { name: "Ohio" },
  { name: "Oklahoma" },
  { name: "Oregon" },
  { name: "Pennsylvania" },
  { name: "Rhode Island" },
  { name: "South Carolina" },
  { name: "South Dakota" },
  { name: "Tennessee" },
  { name: "Texas" },
  { name: "Utah" },
  { name: "Vermont" },
  { name: "Virginia" },
  { name: "Washington" },
  { name: "West Virginia" },
  { name: "Wisconsin" },
  { name: "Wyoming" },
];

export const timeZonesList = [
  { value: "America/Adak", label: "Adak" },
  { value: "America/Anchorage", label: "Anchorage" },
  { value: "America/Juneau", label: "Juneau" },
  { value: "America/Metlakatla", label: "Metlakatla" },
  { value: "America/Nome", label: "Nome" },
  { value: "America/Sitka", label: "Sitka" },
  { value: "America/Yakutat", label: "Yakutat" },
  { value: "America/Dawson", label: "Dawson" },
  { value: "America/Dawson_Creek", label: "Dawson Creek" },
  { value: "America/Creston", label: "Creston" },
  { value: "America/Whitehorse", label: "Whitehorse" },
  { value: "America/Phoenix", label: "Phoenix" },
  { value: "America/Fort_Nelson", label: "Fort Nelson" },
  { value: "America/Vancouver", label: "Vancouver" },
  { value: "America/Los_Angeles", label: "Los Angeles" },
  { value: "America/Tijuana", label: "Tijuana" },
  { value: "America/Hermosillo", label: "Hermosillo" },
  { value: "America/Boise", label: "Boise" },
  { value: "America/Denver", label: "Denver" },
  { value: "America/Inuvik", label: "Inuvik" },
  { value: "America/Yellowknife", label: "Yellowknife" },
  { value: "America/Cambridge_Bay", label: "Cambridge Bay" },
  { value: "America/Ojinaga", label: "Ojinaga" },
  { value: "America/Edmonton", label: "Edmonton" },
  { value: "America/Mazatlan", label: "Mazatlan" },
  { value: "America/Chihuahua", label: "Chihuahua" },
  { value: "America/Belize", label: "Belize" },
  { value: "America/Guatemala", label: "Guatemala" },
  { value: "America/Costa_Rica", label: "Costa Rica" },
  { value: "America/Managua", label: "Managua" },
  { value: "America/Regina", label: "Regina" },
  { value: "America/El_Salvador", label: "El Salvador" },
  { value: "America/Swift_Current", label: "Swift Current" },
  { value: "America/Tegucigalpa", label: "Tegucigalpa" },
  { value: "America/Rio_Branco", label: "Rio Branco" },
  { value: "America/Eirunepe", label: "Eirunepe" },
  { value: "America/Cancun", label: "Cancun" },
  { value: "America/Atikokan", label: "Atikokan" },
  { value: "America/Panama", label: "Panama" },
  { value: "America/Jamaica", label: "Jamaica" },
  { value: "America/Bogota", label: "Bogota" },
  { value: "America/Lima", label: "Lima" },
  { value: "America/Bahia_Banderas", label: "Bahia Banderas" },
  { value: "America/Chicago", label: "Chicago" },
  { value: "America/New_York", label: "New York" },
  { value: "America/Indiana/Indianapolis", label: "Indianapolis" },
  { value: "America/Indiana/Knox", label: "Knox" },
  { value: "America/Indiana/Winamac", label: "Winamac" },
  { value: "America/Detroit", label: "Detroit" },
  { value: "America/North_Dakota/Center", label: "Center" },
  { value: "America/North_Dakota/New_Salem", label: "New Salem" },
  { value: "America/Grand_Turk", label: "Grand Turk" },
  { value: "America/Havana", label: "Havana" },
  { value: "America/Asuncion", label: "Asuncion" },
  { value: "America/Santiago", label: "Santiago" },
  { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires" },
  { value: "America/Sao_Paulo", label: "Sao Paulo" },
  { value: "America/Caracas", label: "Caracas" },
  { value: "America/Puerto_Rico", label: "Puerto Rico" },
  { value: "America/Guayaquil", label: "Guayaquil" },
];

// * Insurance

// Is Insured
export const insuranceType = [
    "Not Insured",
    "Private Commercial type",
    "Others",
];

// Insurance Type
export const insuranceTypes: InsuranceType[] = [
  {
    type: "Medicare",
  },
  {
    type: "Medicaid",
  },
  {
    type: "Tricare Champus",
  },
  {
    type: "Champva",
  },
  {
    type: "Feka BLK Lung",
  },
  {
    type: "Group Health Plan",
  },
  {
    type: "Other",
  },
];
