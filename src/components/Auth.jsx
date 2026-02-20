import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const USERS = [
  { login: "admin", password: "admin", role: "leader" },      // руководитель
  { login: "manager", password: "manager", role: "manager" }, // менеджер
  { login: "designer", password: "designer", role: "designer" }, // дизайнер
];

export default function Auth() {
  const nav = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setErr("");

    const u = USERS.find(
      (x) => x.login === login.trim() && x.password === password
    );

    if (!u) {
      setErr("Неверный логин или пароль");
      return;
    }

    localStorage.setItem("isAuth", "true");
    localStorage.setItem("role", u.role);
    localStorage.setItem("username", u.login);

    // 🔥 перенаправление по роли
    if (u.role === "manager") nav("/m/projects");
    else if (u.role === "designer") nav("/d/projects");
    else nav("/projects");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="h-14 bg-green-800 text-white flex items-center px-10">
        <div className="font-extrabold text-3xl">ArtProject-CRM</div>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
        <form onSubmit={onSubmit} className="w-[520px]">
          <div className="text-center text-4xl text-green-800 mb-10">
            Авторизация
          </div>

          <div className="border-2 border-dashed border-green-700/70 rounded-xl p-8">
            <div className="grid grid-cols-[140px_1fr] gap-6 items-center">
              <div className="text-green-800 text-2xl">Логин</div>
              <input
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Введите текст"
                className="h-12 border rounded-lg px-4 outline-none"
              />

              <div className="text-green-800 text-2xl">Пароль</div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                className="h-12 border rounded-lg px-4 outline-none"
              />
            </div>
          </div>

          {err ? (
            <div className="mt-4 text-center text-red-600">{err}</div>
          ) : null}

          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="bg-green-800 text-white font-bold px-14 py-3 rounded-xl shadow"
            >
              Войти
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            Руководитель: <b>admin/admin</b> • Менеджер:{" "}
            <b>manager/manager</b> • Дизайнер:{" "}
            <b>designer/designer</b>
          </div>
        </form>
      </div>
    </div>
  );
}