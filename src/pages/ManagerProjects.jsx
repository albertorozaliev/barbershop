import React, { useEffect, useMemo, useState } from "react";
import ManagerLayout from "../layouts/ManagerLayout";

const API_BASE = "http://localhost:4000";
const PAGE_SIZE = 4;

const STATUS_OPTIONS = ["В работе", "Завершен", "Просрочен"];

function onlyDigits(s) {
  return (s || "").toString().replace(/\s+/g, "");
}

function validateCreate({ name, client, budget }) {
  const errors = {};
  const n = name.trim();
  const c = client.trim();
  const b = budget.trim();

  if (n.length < 2) errors.name = "Введите название (минимум 2 символа)";
  if (n.length > 80) errors.name = "Название слишком длинное (макс. 80)";
  if (c.length < 2) errors.client = "Введите клиента (минимум 2 символа)";
  if (c.length > 80) errors.client = "Клиент слишком длинный (макс. 80)";

  const digits = onlyDigits(b);
  if (!digits) errors.budget = "Введите бюджет";
  else if (!/^\d+$/.test(digits)) errors.budget = "Бюджет должен быть числом";
  else {
    const num = Number(digits);
    if (!Number.isFinite(num) || num <= 0) errors.budget = "Бюджет должен быть > 0";
    if (num > 999999999) errors.budget = "Слишком большой бюджет";
  }

  return errors;
}

function validateEdit({ name, client, manager, percent, status, budget }) {
  const errors = {};
  const n = name.trim();
  const c = client.trim();
  const m = manager.trim();
  const p = percent.toString().trim();
  const s = status.trim();
  const b = budget.trim();

  if (n.length < 2) errors.name = "Мин. 2 символа";
  if (n.length > 80) errors.name = "Макс. 80 символов";

  if (c.length < 2) errors.client = "Мин. 2 символа";
  if (c.length > 80) errors.client = "Макс. 80 символов";

  if (m.length < 2) errors.manager = "Мин. 2 символа";
  if (m.length > 80) errors.manager = "Макс. 80 символов";

  if (!/^\d+$/.test(p)) errors.percent = "0–100";
  else {
    const num = Number(p);
    if (num < 0 || num > 100) errors.percent = "0–100";
  }

  if (!STATUS_OPTIONS.includes(s)) errors.status = "Недопустимый статус";

  const digits = onlyDigits(b);
  if (!digits) errors.budget = "Введите бюджет";
  else if (!/^\d+$/.test(digits)) errors.budget = "Бюджет должен быть числом";
  else {
    const num = Number(digits);
    if (!Number.isFinite(num) || num <= 0) errors.budget = "Бюджет должен быть > 0";
    if (num > 999999999) errors.budget = "Слишком большой бюджет";
  }

  return errors;
}

export default function ManagerProjects() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadErr, setLoadErr] = useState("");

  // CREATE modal
  const [createOpen, setCreateOpen] = useState(false);
  const [cName, setCName] = useState("");
  const [cClient, setCClient] = useState("");
  const [cBudget, setCBudget] = useState("");
  const [cErr, setCErr] = useState({});
  const [cSaving, setCSaving] = useState(false);
  const [cSaveErr, setCSaveErr] = useState("");

  // EDIT modal
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [eName, setEName] = useState("");
  const [eClient, setEClient] = useState("");
  const [eManager, setEManager] = useState("");
  const [ePercent, setEPercent] = useState("0");
  const [eStatus, setEStatus] = useState("В работе");
  const [eBudget, setEBudget] = useState("");
  const [eErr, setEErr] = useState({});
  const [eSaving, setESaving] = useState(false);
  const [eSaveErr, setESaveErr] = useState("");

  const loadProjects = async (searchValue = q) => {
    setLoading(true);
    setLoadErr("");
    try {
      const url = new URL(`${API_BASE}/api/projects`);
      if (searchValue.trim()) url.searchParams.set("q", searchValue.trim());
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setLoadErr("Не удалось загрузить проекты");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await loadProjects(q);
      setPage(1);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

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

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  // --- CREATE
  const openCreate = () => {
    setCreateOpen(true);
    setCName("");
    setCClient("");
    setCBudget("");
    setCErr({});
    setCSaveErr("");
  };

  const closeCreate = () => {
    if (cSaving) return;
    setCreateOpen(false);
  };

  const onCreate = async () => {
    setCSaveErr("");
    const errors = validateCreate({ name: cName, client: cClient, budget: cBudget });
    setCErr(errors);
    if (Object.keys(errors).length) return;

    setCSaving(true);
    try {
      const username = localStorage.getItem("username") || "manager";

      const res = await fetch(`${API_BASE}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cName.trim(),
          client: cClient.trim(),
          budget: cBudget.trim(),
          username,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      await loadProjects(q);
      setCreateOpen(false);
    } catch (e) {
      setCSaveErr(e.message || "Не удалось создать проект");
    } finally {
      setCSaving(false);
    }
  };

  // --- EDIT
  const openEdit = async (id) => {
    setEditOpen(true);
    setEditId(id);
    setEErr({});
    setESaveErr("");

    try {
      const res = await fetch(`${API_BASE}/api/projects/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const p = await res.json();

      setEName(p.name ?? "");
      setEClient(p.client ?? "");
      setEManager(p.manager ?? "");
      setEPercent(String(p.percent ?? 0));
      setEStatus(p.status ?? "В работе");

      // budget in DB may be "100000 руб." -> keep digits for editing
      const b = (p.budget ?? "").toString();
      setEBudget(onlyDigits(b) || "");
    } catch (e) {
      setESaveErr("Не удалось загрузить данные проекта");
    }
  };

  const closeEdit = () => {
    if (eSaving) return;
    setEditOpen(false);
  };

  const onUpdate = async () => {
    setESaveErr("");
    const errors = validateEdit({
      name: eName,
      client: eClient,
      manager: eManager,
      percent: ePercent,
      status: eStatus,
      budget: eBudget,
    });
    setEErr(errors);
    if (Object.keys(errors).length) return;

    setESaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/projects/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: eName.trim(),
          client: eClient.trim(),
          manager: eManager.trim(),
          percent: Number(ePercent),
          status: eStatus,
          budget: eBudget.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      await loadProjects(q);
      setEditOpen(false);
    } catch (e) {
      setESaveErr(e.message || "Не удалось обновить проект");
    } finally {
      setESaving(false);
    }
  };

  return (
    <ManagerLayout>
      {/* Search + Add (высота как кнопка, стиль как у тебя) */}
      <div className="flex gap-6 items-stretch">
        <div className="bg-sky-100/70 rounded-xl px-6 py-5 w-[320px] flex flex-col justify-center">
          <div className="text-xl font-extrabold mb-2 text-black">Поиск:</div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full bg-transparent outline-none text-base text-black border-b border-slate-300 focus:border-slate-500"
            placeholder=""
          />
        </div>

        <button
          onClick={openCreate}
          className="bg-sky-100/70 rounded-xl px-6 py-5 w-[320px] flex items-center justify-between"
        >
          <div className="text-xl font-extrabold text-black">Добавить проект</div>
          <div className="w-11 h-11 rounded-xl border-4 border-black flex items-center justify-center text-3xl font-black text-black">
            +
          </div>
        </button>
      </div>

      {/* Table header */}
      <div className="mt-8 grid grid-cols-[1.1fr_1.2fr_1.2fr_.8fr_.9fr_.8fr] gap-6 text-gray-400 text-xl font-semibold px-2">
        <div className="leading-6">Название<br />проекта</div>
        <div>Клиент</div>
        <div>Менеджер</div>
        <div>% Выполнения</div>
        <div>Статус</div>
        <div>Бюджет</div>
      </div>
      <div className="mt-2 border-b" />

      {/* Rows (клик открывает edit) */}
      <div className="divide-y">
        {loading ? (
          <div className="py-14 text-center text-gray-500">Загрузка...</div>
        ) : loadErr ? (
          <div className="py-14 text-center text-red-600">{loadErr}</div>
        ) : pageRows.length === 0 ? (
          <div className="py-14 text-center text-gray-500">Нет проектов</div>
        ) : (
          pageRows.map((p) => (
            <button
  type="button"
  key={p.id}
  onClick={() => openEdit(p.id)}
  className="w-full text-left bg-transparent"
>
  <div className="grid grid-cols-[1.1fr_1.2fr_1.2fr_.8fr_.9fr_.8fr] gap-6 py-10 px-2 items-center bg-white hover:bg-slate-50 transition">
                <div className="font-extrabold text-lg text-gray-900">{p.name}</div>
                <div className="text-gray-900">{p.client}</div>
                <div className="text-gray-900">{p.manager}</div>
                <div className="text-3xl text-gray-400">{p.percent}</div>
                <div className="text-lg text-gray-900">{p.status}</div>
                <div className="text-lg text-gray-900">{p.budget}</div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-10">
        <div className="inline-flex items-center justify-between gap-2" style={{ width: 163, height: 24 }}>
          <button onClick={goPrev} disabled={page === 1} className="w-6 h-6 flex items-center justify-center text-gray-500 disabled:opacity-40">
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
              >
                {p}
              </button>
            ))}
          </div>
          <button onClick={goNext} disabled={page === totalPages} className="w-6 h-6 flex items-center justify-center text-gray-500 disabled:opacity-40">
            ›
          </button>
        </div>
      </div>

      {/* CREATE MODAL */}
      {createOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeCreate();
          }}
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

          <div className="relative w-[820px] max-w-[94vw] bg-white rounded-xl shadow-lg px-16 py-14">
            <div className="grid grid-cols-[260px_1fr] gap-8">
              <div className="space-y-7 text-gray-900">
                <div className="h-12 flex items-center">Название проекта</div>
                <div className="h-12 flex items-center">Клиент</div>
                <div className="h-12 flex items-center">Бюджет</div>
              </div>

              <div className="border-2 border-dashed border-green-700/60 rounded-xl p-6 space-y-6">
                <div>
                  <input
                    value={cName}
                    onChange={(e) => setCName(e.target.value)}
                    placeholder="Введите текст"
                    className={[
                      "w-full h-12 border rounded-lg px-4 outline-none",
                      cErr.name ? "border-red-400" : "border-slate-300",
                    ].join(" ")}
                    disabled={cSaving}
                  />
                  {cErr.name ? <div className="mt-1 text-sm text-red-600">{cErr.name}</div> : null}
                </div>

                <div>
                  <input
                    value={cClient}
                    onChange={(e) => setCClient(e.target.value)}
                    placeholder="Введите текст"
                    className={[
                      "w-full h-12 border rounded-lg px-4 outline-none",
                      cErr.client ? "border-red-400" : "border-slate-300",
                    ].join(" ")}
                    disabled={cSaving}
                  />
                  {cErr.client ? <div className="mt-1 text-sm text-red-600">{cErr.client}</div> : null}
                </div>

                <div>
                  <input
                    value={cBudget}
                    onChange={(e) => setCBudget(e.target.value)}
                    placeholder="Введите текст"
                    className={[
                      "w-full h-12 border rounded-lg px-4 outline-none",
                      cErr.budget ? "border-red-400" : "border-slate-300",
                    ].join(" ")}
                    disabled={cSaving}
                  />
                  {cErr.budget ? <div className="mt-1 text-sm text-red-600">{cErr.budget}</div> : null}
                </div>
              </div>
            </div>

            {cSaveErr ? <div className="mt-6 text-center text-red-600">{cSaveErr}</div> : null}

            <div className="mt-10 flex justify-center">
              <button
                onClick={onCreate}
                disabled={cSaving}
                className="bg-green-800 text-white font-bold px-16 py-2 rounded-lg shadow disabled:opacity-60"
              >
                {cSaving ? "Создание..." : "Создать"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* EDIT MODAL (как на макете) */}
      {editOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeEdit();
          }}
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

          <div className="relative w-[980px] max-w-[96vw] bg-white rounded-xl shadow-lg px-16 py-14">
            <div className="grid grid-cols-[320px_1fr] gap-10">
              <div className="space-y-6 text-gray-900 text-xl">
                <div className="h-12 flex items-center">Название проекта</div>
                <div className="h-12 flex items-center">Клиент</div>
                <div className="h-12 flex items-center">Менеджер</div>
                <div className="h-12 flex items-center">% Выполнения</div>
                <div className="h-12 flex items-center">Статус</div>
                <div className="h-12 flex items-center">Бюджет</div>
              </div>

              <div className="border-2 border-dashed border-green-700/60 rounded-xl p-6 space-y-6">
                <div>
                  <input
                    value={eName}
                    onChange={(e) => setEName(e.target.value)}
                    className={[
                      "w-full h-12 border rounded-lg px-4 outline-none text-center font-semibold",
                      eErr.name ? "border-red-400" : "border-slate-300",
                    ].join(" ")}
                    disabled={eSaving}
                  />
                  {eErr.name ? <div className="mt-1 text-sm text-red-600">{eErr.name}</div> : null}
                </div>

                <div>
                  <input
                    value={eClient}
                    onChange={(e) => setEClient(e.target.value)}
                    className={[
                      "w-full h-12 border rounded-lg px-4 outline-none text-center font-semibold",
                      eErr.client ? "border-red-400" : "border-slate-300",
                    ].join(" ")}
                    disabled={eSaving}
                  />
                  {eErr.client ? <div className="mt-1 text-sm text-red-600">{eErr.client}</div> : null}
                </div>

                <div>
                  <input
                    value={eManager}
                    onChange={(e) => setEManager(e.target.value)}
                    className={[
                      "w-full h-12 border rounded-lg px-4 outline-none text-center font-semibold",
                      eErr.manager ? "border-red-400" : "border-slate-300",
                    ].join(" ")}
                    disabled={eSaving}
                  />
                  {eErr.manager ? <div className="mt-1 text-sm text-red-600">{eErr.manager}</div> : null}
                </div>

                <div>
                  <input
                    value={ePercent}
                    onChange={(e) => setEPercent(e.target.value)}
                    className={[
                      "w-full h-12 border rounded-lg px-4 outline-none text-center font-semibold",
                      eErr.percent ? "border-red-400" : "border-slate-300",
                    ].join(" ")}
                    disabled={eSaving}
                  />
                  {eErr.percent ? <div className="mt-1 text-sm text-red-600">{eErr.percent}</div> : null}
                </div>

                <div>
                  <select
  value={eStatus}
  onChange={(e) => setEStatus(e.target.value)}
  className={[
    "w-full h-12 border rounded-lg px-4 outline-none text-center font-semibold bg-white text-black",
    eErr.status ? "border-red-400" : "border-slate-300",
  ].join(" ")}
  disabled={eSaving}
>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {eErr.status ? <div className="mt-1 text-sm text-red-600">{eErr.status}</div> : null}
                </div>

                <div>
                  <input
                    value={eBudget}
                    onChange={(e) => setEBudget(e.target.value)}
                    className={[
                      "w-full h-12 border rounded-lg px-4 outline-none text-center font-semibold",
                      eErr.budget ? "border-red-400" : "border-slate-300",
                    ].join(" ")}
                    disabled={eSaving}
                  />
                  {eErr.budget ? <div className="mt-1 text-sm text-red-600">{eErr.budget}</div> : null}
                </div>
              </div>
            </div>

            {eSaveErr ? <div className="mt-6 text-center text-red-600">{eSaveErr}</div> : null}

            <div className="mt-10 flex justify-center">
              <button
                onClick={onUpdate}
                disabled={eSaving}
                className="bg-green-800 text-white font-bold px-24 py-2 rounded-lg shadow disabled:opacity-60"
              >
                {eSaving ? "Сохранение..." : "Изменить"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </ManagerLayout>
  );
}