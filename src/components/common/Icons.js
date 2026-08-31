// IT DIGITAL HUB - Standardized Modern SVG Icon Library (Lucide style)
// High-performance, zero-latency vector icons

const createSvg = (pathD, viewBox = "0 0 24 24", extraProps = {}) => {
  return function IconComponent({ className = "w-5 h-5", size, color = "currentColor", strokeWidth = 2, ...props }) {
    const style = size ? { width: size, height: size } : {};
    return React.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: viewBox,
        fill: "none",
        stroke: color,
        strokeWidth: strokeWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className,
        style: style,
        ...extraProps,
        ...props
      },
      Array.isArray(pathD)
        ? pathD.map((d, i) => React.createElement("path", { key: i, d: d }))
        : React.createElement("path", { d: pathD })
    );
  };
};

export const Icons = {
  // Navigation & Core
  Dashboard: createSvg([
    "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
    "M9 22V12h6v10"
  ]),
  User: createSvg([
    "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2",
    "M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
  ]),
  Users: createSvg([
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2",
    "M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    "M23 21v-2a4 4 0 0 0-3-3.87",
    "M16 3.13a4 4 0 0 1 0 7.75"
  ]),
  BookOpen: createSvg([
    "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",
    "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
  ]),
  CheckCircle: createSvg([
    "M22 11.08V12a10 10 0 1 1-5.93-9.14",
    "M22 4L12 14.01l-3-3"
  ]),
  Award: createSvg([
    "M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z",
    "M8.21 13.89L7 23l5-3 5 3-1.21-9.12"
  ]),
  FileText: createSvg([
    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
    "M14 2v6h6",
    "M16 13H8",
    "M16 17H8",
    "M10 9H8"
  ]),
  Download: createSvg([
    "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
    "M7 10l5 5 5-5",
    "M12 15V3"
  ]),
  Upload: createSvg([
    "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
    "M17 8l-5-5-5 5",
    "M12 3v12"
  ]),
  Calendar: createSvg([
    "M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z",
    "M16 2v4",
    "M8 2v4",
    "M3 10h18"
  ]),
  Bell: createSvg([
    "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9",
    "M13.73 21a2 2 0 0 1-3.46 0"
  ]),
  Briefcase: createSvg([
    "M20 7h-4V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z",
    "M8 4h8v3H8z",
    "M2 13h20"
  ]),
  BarChart: createSvg([
    "M12 20V10",
    "M18 20V4",
    "M6 20v-4"
  ]),
  PieChart: createSvg([
    "M21.21 15.89A10 10 0 1 1 8 2.83",
    "M22 12A10 10 0 0 0 12 2v10z"
  ]),
  MessageSquare: createSvg([
    "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
  ]),
  Settings: createSvg([
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
  ]),
  LogOut: createSvg([
    "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
    "M16 17l5-5-5-5",
    "M21 12H9"
  ]),
  Search: createSvg([
    "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z",
    "M21 21l-4.35-4.35"
  ]),
  Shield: createSvg([
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
  ]),
  Eye: createSvg([
    "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z",
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
  ]),
  EyeOff: createSvg([
    "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24",
    "M1 1l22 22"
  ]),
  Check: createSvg("M20 6L9 17l-5-5"),
  X: createSvg(["M18 6L6 18", "M6 6l12 12"]),
  Plus: createSvg(["M12 5v14", "M5 12h14"]),
  Edit: createSvg([
    "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",
    "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
  ]),
  Trash: createSvg([
    "M3 6h18",
    "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
    "M10 11v6",
    "M14 11v6"
  ]),
  ChevronRight: createSvg("M9 18l6-6-6-6"),
  ChevronDown: createSvg("M6 9l6 6 6-6"),
  ArrowRight: createSvg(["M5 12h14", "M12 5l7 7-7 7"]),
  GraduationCap: createSvg([
    "M22 10v6M2 10l10-5 10 5-10 5z",
    "M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"
  ]),
  Cpu: createSvg([
    "M4 4h16v16H4z",
    "M9 9h6v6H9z",
    "M9 1v3", "M15 1v3", "M9 20v3", "M15 20v3",
    "M20 9h3", "M20 14h3", "M1 9h3", "M1 14h3"
  ]),
  Database: createSvg([
    "M12 3c-4.97 0-9 1.343-9 3v12c0 1.657 4.03 3 9 3s9-1.343 9-3V6c0-1.657-4.03-3-9-3z",
    "M3 10.5c0 1.657 4.03 3 9 3s9-1.343 9-3",
    "M3 15c0 1.657 4.03 3 9 3s9-1.343 9-3"
  ]),
  Globe: createSvg([
    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z",
    "M2 12h20",
    "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
  ]),
  Sparkles: createSvg([
    "M12 3l1.912 5.885L20 10.5l-5.088 3.615L16.824 20 12 16.385 7.176 20l1.912-5.885L4 10.5l6.088-1.615z"
  ]),
  AlertTriangle: createSvg([
    "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
    "M12 9v4",
    "M12 17h.01"
  ]),
  Star: createSvg([
    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
  ]),
  Filter: createSvg([
    "M22 3H2l8 9.46V19l4 2v-8.54L22 3z"
  ]),
  Printer: createSvg([
    "M6 9V2h12v7",
    "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
    "M6 14h12v8H6z"
  ]),
  Phone: createSvg([
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
  ]),
  Mail: createSvg([
    "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z",
    "M22 6l-10 7L2 6"
  ]),
  MapPin: createSvg([
    "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z",
    "M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
  ]),
  Menu: createSvg(["M3 12h18", "M3 6h18", "M3 18h18"])
};

if (typeof window !== 'undefined') {
  window.Icons = Icons;
}

