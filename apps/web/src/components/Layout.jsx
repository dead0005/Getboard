import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, ListTodo, RefreshCw, Link2Off } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function Layout() {
  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/questions", icon: ListTodo, label: "Questions" },
    { to: "/unmatched", icon: Link2Off, label: "Unmatched" },
    { to: "/sync", icon: RefreshCw, label: "Sync" }
  ];
  return <div className="flex h-screen bg-gray-100">
      {
    /* Sidebar */
  }
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Get<span className="text-blue-600">Board</span></h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => <NavLink
    key={item.to}
    to={item.to}
    className={({ isActive }) => cn(
      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
      isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
    )}
  >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>)}
        </nav>
      </aside>

      {
    /* Main Content */
  }
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>;
}
export {
  Layout
};
