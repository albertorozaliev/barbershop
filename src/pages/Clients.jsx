// src/pages/Clients.jsx
import React, { useEffect, useMemo, useState } from "react";
import LeaderLayout from "../layouts/LeaderLayout";

const PAGE_SIZE = 4;
const API_BASE = "http://localhost:4000";

// простая валидация
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
// телефон: разрешаем +, пробелы, скобки, дефисы; считаем валидным если 10–15 цифр
const isValidPhone = (v) => {
  const digits = String(v || "").replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
};

export default function Clients() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  // modal + form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    company: "",
    contact: "",
    email: "",
    phone: "",
    status: "Активный",
    activeProjects: 0,
  });

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadErr, setLoadErr] = useState("");

  const [creating, setCreating] = useState(false);
  const [createErr, setCreateErr] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: "", phone: "" });

  // загрузка данных (поиск идёт через API)
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setLoadErr("");
      try {
        const url = new URL(`${API_BASE}/api/clients`);
        if (q.trim()) url.searchParams.set("q", q.trim());

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!cancelled) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setLoadErr("Не удалось загрузить клиентов");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [q]);

  // страницы
  const totalPages = useMemo(() => Math.max(1, Math.ceil(rows.length / PAGE_SIZE)), [rows.length]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [rows, page]);

  const pages = useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages]);

  const onSearchChange = (e) => {
    setQ(e.target.value);
    setPage(1);
  };

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  const openModal = () => {
    setCreateErr("");
    setFieldErrors({ email: "", phone: "" });
    setForm({
      company: "",
      contact: "",
      email: "",
      phone: "",
      status: "Активный",
      activeProjects: 0,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const setField = (key) => (e) => {
    const v = e.target.value;

    setForm((prev) => ({
      ...prev,
      [key]: key === "activeProjects" ? Number(v || 0) : v,
    }));

    // inline-валидация
    if (key === "email") {
      setFieldErrors((prev) => ({
        ...prev,
        email: v.trim().length === 0 || isValidEmail(v) ? "" : "Некорректный email",
      }));
    }
    if (key === "phone") {
      setFieldErrors((prev) => ({
        ...prev,
        phone: v.trim().length === 0 || isValidPhone(v) ? "" : "Некорректный телефон",
      }));
    }
  };

  const validateBeforeCreate = () => {
    const emailErr = form.email.trim() && !isValidEmail(form.email) ? "Некорректный email" : "";
    const phoneErr = form.phone.trim() && !isValidPhone(form.phone) ? "Некорректный телефон" : "";
    setFieldErrors({ email: emailErr, phone: phoneErr });

    if (emailErr || phoneErr) return false;
    return true;
  };

  const onCreate = async () => {
    setCreateErr("");

    if (!validateBeforeCreate()) return;

    setCreating(true);
    try {
      // Если пока НЕ хочешь писать в БД — закомментируй fetch и просто closeModal()
      const res = await fetch(`${API_BASE}/api/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      closeModal();

      // обновим список
      const url = new URL(`${API_BASE}/api/clients`);
      if (q.trim()) url.searchParams.set("q", q.trim());
      const listRes = await fetch(url.toString());
      const list = await listRes.json();
      setRows(Array.isArray(list) ? list : []);
    } catch (e) {
      setCreateErr(String(e.message || e));
    } finally {
      setCreating(false);
    }
  };

  const inputBase =
    "w-full h-10 rounded-md border px-4 text-slate-800 placeholder:text-slate-400 bg-white outline-none focus:ring-2 focus:ring-green-100";
  const inputOk = "border-slate-300 focus:border-slate-500";
  const inputBad = "border-red-400 focus:border-red-500";

  return (
    <LeaderLayout>
      {/* Top row: search + add client */}
      <div className="flex gap-6 items-stretch">
        {/* Search block */}
        <div className="flex-1 bg-sky-100/70 rounded-xl px-8 py-6">
          <div className="text-2xl font-extrabold mb-3 text-black">Поиск:</div>

          <input
            value={q}
            onChange={onSearchChange}
            className="w-[520px] max-w-full bg-transparent outline-none text-lg text-black focus:text-black placeholder:text-black border-b border-slate-300 focus:border-slate-500"
            placeholder=""
          />
        </div>

        {/* Add client block */}
        <button
          type="button"
          onClick={openModal}
          className="w-[240px] bg-sky-100/70 rounded-xl px-5 py-6 flex items-center justify-between hover:bg-sky-100"
        >
          <span className="text-lg font-extrabold text-black">Добавить клиента</span>

          <span className="w-9 h-9 rounded-lg border-4 border-black flex items-center justify-center">
            <span className="text-2xl leading-none font-bold text-black">+</span>
          </span>
        </button>
      </div>

      {/* Table header */}
      <div className="mt-8 grid grid-cols-[.95fr_1.1fr_1.15fr_.9fr_.7fr_.9fr] gap-6 text-gray-400 text-xl font-semibold px-2">
        <div className="leading-6">
          Название
          <br />
          компании
        </div>
        <div>Контактное лицо</div>
        <div>Email</div>
        <div>Телефон</div>
        <div>Статус</div>
        <div className="leading-6">
          Активные
          <br />
          проекты
        </div>
      </div>

      <div className="mt-2 border-b" />

      {/* Rows (max 4 per page) */}
      <div className="divide-y">
        {loading ? (
          <div className="py-14 text-center text-gray-500">Загрузка...</div>
        ) : loadErr ? (
          <div className="py-14 text-center text-red-600">{loadErr}</div>
        ) : pageRows.length === 0 ? (
          <div className="py-14 text-center text-gray-500">Ничего не найдено</div>
        ) : (
          pageRows.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-[.95fr_1.1fr_1.15fr_.9fr_.7fr_.9fr] gap-6 py-10 px-2 items-center"
            >
              <div className="font-extrabold text-lg text-gray-800">{c.company}</div>
              <div className="font-extrabold text-gray-800">{c.contact}</div>
              <div className="font-extrabold text-gray-800">{c.email}</div>
              <div className="text-lg text-gray-400">{c.phone}</div>
              <div className="text-lg text-gray-800">{c.status}</div>
              <div className="text-3xl text-gray-800">{c.activeProjects}</div>
            </div>
          ))
        )}
      </div>

      {/* Pagination (163x24, only existing pages) */}
      <div className="mt-10">
        <div className="inline-flex items-center justify-between gap-2" style={{ width: 163, height: 24 }}>
          <button
            onClick={goPrev}
            disabled={page === 1}
            className="w-6 h-6 flex items-center justify-center text-gray-500 disabled:opacity-40"
            aria-label="prev"
          >
            ‹
          </button>

          <div className="flex items-center gap-2 text-gray-500 text-sm">
            {pages.map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={[
                  "w-6 h-6 rounded flex items-center justify-center",
                  p === page ? "text-gray-800 font-semibold" : "hover:text-gray-700",
                ].join(" ")}
                aria-label={`page-${p}`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={page === totalPages}
            className="w-6 h-6 flex items-center justify-center text-gray-500 disabled:opacity-40"
            aria-label="next"
          >
            ›
          </button>
        </div>
      </div>

      {/* Modal (aligned rows + validation) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
          <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" onClick={closeModal} />

          <div className="relative w-[820px] max-w-[92vw] bg-white rounded-lg shadow-xl p-10">
            {/* ✅ фикс "съехали строки": одинаковая сетка для всех полей (label + input в одной строке) */}
            <div className="grid grid-cols-[260px_1fr] gap-x-8 gap-y-5 items-center">
              <div className="text-right text-lg text-gray-800">Название компании</div>
              <input
                value={form.company}
                onChange={setField("company")}
                placeholder="Введите текст"
                className={`${inputBase} ${inputOk}`}
              />

              <div className="text-right text-lg text-gray-800">Контактное лицо</div>
              <input
                value={form.contact}
                onChange={setField("contact")}
                placeholder="Введите текст"
                className={`${inputBase} ${inputOk}`}
              />

              <div className="text-right text-lg text-gray-800">Email</div>
              <div>
                <input
                  value={form.email}
                  onChange={setField("email")}
                  placeholder="example@mail.com"
                  className={`${inputBase} ${fieldErrors.email ? inputBad : inputOk}`}
                />
                {fieldErrors.email && (
                  <div className="mt-1 text-sm text-red-600">{fieldErrors.email}</div>
                )}
              </div>

              <div className="text-right text-lg text-gray-800">Телефон</div>
              <div>
                <input
                  value={form.phone}
                  onChange={setField("phone")}
                  placeholder="+7 (999) 123-45-67"
                  className={`${inputBase} ${fieldErrors.phone ? inputBad : inputOk}`}
                />
                {fieldErrors.phone && (
                  <div className="mt-1 text-sm text-red-600">{fieldErrors.phone}</div>
                )}
              </div>

              <div className="text-right text-lg text-gray-800">Статус</div>
              <select
                value={form.status}
                onChange={setField("status")}
                className={`${inputBase} ${inputOk}`}
              >
                <option value="Активный">Активный</option>
                <option value="Неактивный">Неактивный</option>
                <option value="На паузе">На паузе</option>
              </select>

              <div className="text-right text-lg text-gray-800">Активные проекты</div>
              <input
                value={form.activeProjects}
                onChange={setField("activeProjects")}
                type="number"
                min={0}
                placeholder="0"
                className={`${inputBase} ${inputOk}`}
              />
            </div>

            {createErr && <div className="mt-6 text-center text-red-600 font-medium">{createErr}</div>}

            <div className="flex justify-center mt-10 gap-4">
              <button
                type="button"
                className="px-10 h-10 rounded-md bg-gray-200 text-gray-800 font-semibold"
                onClick={closeModal}
              >
                Отмена
              </button>

              <button
                type="button"
                disabled={
                  creating ||
                  (form.email.trim() && !isValidEmail(form.email)) ||
                  (form.phone.trim() && !isValidPhone(form.phone))
                }
                className="px-16 h-10 rounded-md bg-green-800 text-white font-semibold shadow disabled:opacity-60"
                onClick={onCreate}
              >
                {creating ? "Создание..." : "Создать"}
              </button>
            </div>

            <div className="mt-4 text-center text-xs text-gray-400">
              Email: формат name@domain.tld • Телефон: 10–15 цифр (можно +, пробелы, скобки, дефисы)
            </div>
          </div>
        </div>
      )}
    </LeaderLayout>
  );
}
