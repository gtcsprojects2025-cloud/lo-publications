// // src/components/admin/AdminSidebar.tsx
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { 
//   LayoutDashboard, 
//   BookOpen, 
//   Users, 
//   FileText, 
//   MessageSquare, 
//   LogOut, 
//   Menu, 
//   X 
// } from "lucide-react";
// import { createClient } from "@/lib/supabase/server";
// const navItems = [
//   { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
//   { name: "Blog Posts", href: "/admin/blog", icon: FileText },
//   { name: "Team Members", href: "/admin/team", icon: Users },
//   { name: "Books", href: "/admin/books", icon: BookOpen },
//   { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
//   { name: "Submissions", href: "/admin/submissions", icon: FileText },
// ];

// export default function AdminSidebar() {
//   const [isOpen, setIsOpen] = useState(false);

//   const handleLogout = async () => {
//     const supabase = createClient();
//     await supabase.auth.signOut();
//     window.location.href = "/admin/login";
//   };

//   return (
//     <>
//       {/* Mobile Toggle */}
//       <button
//         className="md:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-lg shadow-md"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         {isOpen ? <X size={24} /> : <Menu size={24} />}
//       </button>

//       {/* Sidebar */}
//       <aside
//         className={`fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-xl transform transition-transform duration-300 md:translate-x-0 ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         } md:relative md:translate-x-0`}
//       >
//         <div className="p-6 border-b">
//           <h1 className="text-2xl font-bold text-red-900">LO Admin</h1>
//           <p className="text-sm text-gray-500 mt-1">Content Management</p>
//         </div>

//         <nav className="p-4 space-y-2">
//           {navItems.map((item) => (
//             <Link
//               key={item.name}
//               href={item.href}
//               className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-900 transition"
//               onClick={() => setIsOpen(false)}
//             >
//               <item.icon size={20} />
//               <span className="font-medium">{item.name}</span>
//             </Link>
//           ))}

//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-900 transition mt-8 text-left"
//           >
//             <LogOut size={20} />
//             <span className="font-medium">Logout</span>
//           </button>
//         </nav>
//       </aside>

//       {/* Overlay for mobile */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-30 md:hidden"
//           onClick={() => setIsOpen(false)}
//         />
//       )}
//     </>
//   );
// }






// src/components/admin/AdminSidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  FileText, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react";

const navItems = [
  { id: "dashboard", name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { id: "blog", name: "Blog Posts", href: "/admin/blog", icon: FileText },
  { id: "team", name: "Team Members", href: "/admin/team", icon: Users },
  { id: "books", name: "Books", href: "/admin/books", icon: BookOpen },
  { id: "testimonials", name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { id: "submissions", name: "Manuscript Submissions", href: "/admin/submissions", icon: FileText },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard"); // default

  const handleItemClick = (id: string) => {
    setActiveSection(id);
    setIsOpen(false); // close on mobile
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-lg shadow-md border border-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-2xl transform transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="p-6 border-b mt-30 md:mt-20">
          <h1 className="text-2xl font-bold text-red-900">LO Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Content Dashboard</p>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => handleItemClick(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                activeSection === item.id
                  ? "bg-red-50 text-red-900"
                  : "text-gray-700 hover:bg-red-50 hover:text-red-900"
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}

          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-900 transition-colors mt-8 text-left font-medium text-gray-700"
            onClick={() => alert("Logout coming tomorrow with auth!")}
          >
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}