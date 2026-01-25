import {
  BarChart3,
  BellRing,
  CircleGauge,
  Droplets,
  HeartPulse,
  Hospital,
  LayoutDashboard,
  Map,
  Megaphone,
  MessageCircleQuestion,
  MessageSquareText,
  Pill,
  Ribbon,
  SquareActivity,
  Star,
  UserCircle,
  UserCog2,
  Users,
} from "lucide-react";

export const SIDEBAR_NAV_ITEMS = [
  {
    title: "Dashboard",
    icon: CircleGauge,
    url: "#", // No direct navigation
    items: [
      {
        title: "Overview",
        icon: LayoutDashboard,
        url: "/dashboard/overview",
      },
      {
        title: "Analytics",
        icon: BarChart3,
        url: "/dashboard/analytics",
      },
    ],
  },
  {
    title: "Admins",
    icon: UserCog2,
    url: "/admins",
  },
  {
    title: "Users",
    icon: UserCircle,
    url: "/users",
  },
  {
    title: "Facilities",
    icon: Hospital,
    url: "/facilities",
  },
  {
    title: "Diseases & Conditions",
    icon: SquareActivity,
    url: "/diseases_&_conditions",
  },
  {
    title: "Symptoms",
    icon: Ribbon,
    url: "/symptoms",
  },
  {
    title: "Healthy Living",
    icon: HeartPulse,
    url: "/healthy_living",
  },
  {
    title: "Period Tracker",
    icon: Droplets,
    url: "/period_tracker",
  },
  {
    title: "Medication Reminder",
    icon: Pill,
    url: "/medication_reminder",
  },
  {
    title: "Reviews & Ratings",
    icon: Star,
    url: "/reviews_&_ratings",
  },
  {
    title: "Map",
    icon: Map,
    url: "/map",
  },
  // {
  //   title: "User Groupings",
  //   icon: Users,
  //   url: "/user_groupings",
  // },
  {
    title: "Marketing",
    icon: Megaphone,
    url: "/marketing",
  },
  {
    title: "Chats",
    icon: MessageSquareText,
    url: "/chats",
  },
  {
    title: "FAQ",
    icon: MessageCircleQuestion,
    url: "/faq",
  },
  {
    title: "Notifications",
    icon: BellRing,
    url: "/notifications",
  },
];
