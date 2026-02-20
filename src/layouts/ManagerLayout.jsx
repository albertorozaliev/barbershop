import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const linkBase =
  "block px-8 py-4 text-lg text-gray-500 hover:text-pink-600 rounded-md";
const linkActive =
  "bg-white text-pink-600 font-medium shadow-sm";

export default function ManagerLayout({ children }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("isAuth");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-[310px] bg-green-200/60 flex flex-col">
        <div className="h-16" />

        <nav className="mt-6 space-y-2">
          <NavLink
            to="/m/projects"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            Проекты
          </NavLink>

          <NavLink
            to="/m/clients"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            Клиенты
          </NavLink>

          <NavLink
            to="/m/reports"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            Отчеты
          </NavLink>


          <NavLink
  to="/m/notifications"
  className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
>
  Уведомления
</NavLink>
        </nav>

        {/* Support */}
        <div className="mt-auto px-8 pb-8">
          <div className="text-gray-500 text-lg mb-4">
            Техническая<br />поддержка:
          </div>
          <div className="text-gray-400 text-lg leading-7">
            8 (861) 200-10-10<br />
            8 800 222-17-30
          </div>

          <button
            onClick={logout}
            className="mt-10 inline-flex items-center justify-center px-8 py-3 rounded-lg bg-pink-500 text-white font-semibold shadow hover:bg-pink-600"
          >
            Выход
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 px-10 pt-10">
        {/* Top title */}
        <div className="relative">
          <div className="text-center text-3xl font-extrabold tracking-wide text-black">
            ПАНЕЛЬ МЕНЕДЖЕРА
          </div>

          <div className="absolute right-0 top-1 text-gray-400 text-xl font-semibold">
            ArtProject-CRM
          </div>
        </div>

        <div className="mt-6 border-b" />

        <div className="pt-8">{children}</div>
      </main>
    </div>
  );
}
