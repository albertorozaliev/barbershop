// server/index.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();
app.use(cors());
app.use(express.json());

// health
app.get("/api/health", async (_, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

/**
 * CLIENTS
 */
app.get("/api/clients", async (req, res) => {
  const q = (req.query.q || "").toString().trim();

  const clients = await prisma.client.findMany({
    where: q
      ? {
          OR: [
            { company: { contains: q, mode: "insensitive" } },
            { contact: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
            { status: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { id: "desc" },
  });

  res.json(clients);
});

app.post("/api/clients", async (req, res) => {
  const { company, contact, email, phone, status, activeProjects } = req.body;

  if (!company || !contact || !email || !phone || !status) {
    return res.status(400).json({ error: "Заполни все обязательные поля" });
  }

  const created = await prisma.client.create({
    data: {
      company,
      contact,
      email,
      phone,
      status,
      activeProjects: Number(activeProjects || 0),
    },
  });

  res.json(created);
});

/**
 * PROJECTS
 */
// получить 1 проект
app.get("/api/projects/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Bad id" });

    const p = await prisma.project.findUnique({ where: { id } });
    if (!p) return res.status(404).json({ error: "Not found" });

    res.json(p);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// обновить проект
app.put("/api/projects/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Bad id" });

    const name = (req.body?.name || "").toString().trim();
    const client = (req.body?.client || "").toString().trim();
    const manager = (req.body?.manager || "").toString().trim();
    const status = (req.body?.status || "").toString().trim();
    const percentRaw = (req.body?.percent ?? "").toString().trim();
    const budgetRaw = (req.body?.budget || "").toString().trim();

    // validation
    if (name.length < 2 || name.length > 80) return res.status(400).json({ error: "Bad name" });
    if (client.length < 2 || client.length > 80) return res.status(400).json({ error: "Bad client" });
    if (manager.length < 2 || manager.length > 80) return res.status(400).json({ error: "Bad manager" });

    const allowed = ["В работе", "Завершен", "Просрочен"];
    if (!allowed.includes(status)) return res.status(400).json({ error: "Bad status" });

    // percent 0..100
    if (!/^\d+$/.test(percentRaw)) return res.status(400).json({ error: "Bad percent" });
    const percent = Number(percentRaw);
    if (percent < 0 || percent > 100) return res.status(400).json({ error: "Percent out of range" });

    // budget numeric
    const budgetDigits = budgetRaw.replace(/\s+/g, "");
    if (!/^\d+$/.test(budgetDigits)) return res.status(400).json({ error: "Bad budget" });
    const budgetNum = Number(budgetDigits);
    if (!Number.isFinite(budgetNum) || budgetNum <= 0 || budgetNum > 999999999) {
      return res.status(400).json({ error: "Budget out of range" });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        name,
        client,
        manager,
        status,
        percent,
        budget: `${budgetNum} руб.`,
      },
    });

    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/api/projects", async (req, res) => {
  const q = (req.query.q || "").toString().trim();

  const projects = await prisma.project.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { client: { contains: q, mode: "insensitive" } },
            { manager: { contains: q, mode: "insensitive" } },
            { status: { contains: q, mode: "insensitive" } },
            { budget: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { id: "desc" },
  });

  res.json(projects);
});
app.post("/api/projects", async (req, res) => {
  try {
    const name = (req.body?.name || "").toString().trim();
    const client = (req.body?.client || "").toString().trim();
    const budgetRaw = (req.body?.budget || "").toString().trim();

    // кто создал (логин)
    const username = (req.body?.username || "").toString().trim();
    if (!username) return res.status(400).json({ error: "username is required" });

    // VALIDATION
    if (name.length < 2) return res.status(400).json({ error: "Project name is too short" });
    if (name.length > 80) return res.status(400).json({ error: "Project name is too long" });

    if (client.length < 2) return res.status(400).json({ error: "Client is too short" });
    if (client.length > 80) return res.status(400).json({ error: "Client is too long" });

    const budgetDigits = budgetRaw.replace(/\s+/g, "");
    if (!/^\d+$/.test(budgetDigits)) return res.status(400).json({ error: "Budget must be a number" });

    const budgetNum = Number(budgetDigits);
    if (!Number.isFinite(budgetNum) || budgetNum <= 0 || budgetNum > 999999999) {
      return res.status(400).json({ error: "Budget out of range" });
    }

    // ✅ создаём проект с авто-полями
    const created = await prisma.project.create({
      data: {
        name,
        client,
        budget: `${budgetNum} руб.`,
        manager: username,      // ✅ кто создал
        status: "В работе",     // ✅ всегда при создании
        percent: 0,             // ✅ всегда при создании
      },
    });

    res.json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/api/projects", async (req, res) => {
  const { name, client, manager, percent, status, budget } = req.body;

  if (!name || !client || !manager || percent === undefined || !status || !budget) {
    return res.status(400).json({ error: "Заполни все обязательные поля" });
  }

  const created = await prisma.project.create({
    data: {
      name,
      client,
      manager,
      percent: Number(percent),
      status,
      budget,
    },
  });

  res.json(created);
});

/**
 * REPORTS
 * GET /api/reports?q=...&from=YYYY-MM-DD&to=YYYY-MM-DD
 */
app.get("/api/reports", async (req, res) => {
  const q = (req.query.q || "").toString().trim();
  const from = (req.query.from || "").toString().trim();
  const to = (req.query.to || "").toString().trim();

  const and = [];

  if (q) {
    and.push({
      OR: [
        { project: { contains: q, mode: "insensitive" } },
        { manager: { contains: q, mode: "insensitive" } },
        { status: { contains: q, mode: "insensitive" } },
      ],
    });
  }

  if (from) {
    and.push({ dt: { gte: new Date(from + "T00:00:00") } });
  }

  if (to) {
    and.push({ dt: { lte: new Date(to + "T23:59:59") } });
  }

  const reports = await prisma.report.findMany({
    where: and.length ? { AND: and } : undefined,
    orderBy: { dt: "desc" },
  });

  res.json(reports);
});
app.post("/api/reports", async (req, res) => {
  try {
    const project = (req.body?.project || "").toString().trim();
    const manager = (req.body?.manager || "").toString().trim();
    const status = (req.body?.status || "").toString().trim();

    // добавь любые дополнительные поля, если они есть в твоей таблице отчётов:
    const comment = (req.body?.comment || "").toString().trim(); // пример

    const allowedStatus = ["В процессе", "С задержкой", "В срок"];

    if (project.length < 2 || project.length > 80) {
      return res.status(400).json({ error: "Bad project" });
    }
    if (manager.length < 2 || manager.length > 80) {
      return res.status(400).json({ error: "Bad manager" });
    }
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ error: "Bad status" });
    }
    if (comment.length > 300) {
      return res.status(400).json({ error: "Comment too long" });
    }

    // ✅ NOW in Moscow:
    // берём строку текущего времени в Москве и превращаем в Date так,
    // чтобы в БД легло значение именно “московского сейчас”.
    const mskNowStr = new Date().toLocaleString("sv-SE", { timeZone: "Europe/Moscow" }); // "YYYY-MM-DD HH:mm:ss"
    const mskNow = new Date(mskNowStr.replace(" ", "T"));

    const created = await prisma.report.create({
      data: {
        dt: mskNow,
        project,
        manager,
        status,

      },
    });

    res.json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});
/**
 * USERS
 * GET /api/users?q=...
 */
app.get("/api/users", async (req, res) => {
  const q = (req.query.q || "").toString().trim();

  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { fullName: { contains: q, mode: "insensitive" } },
            { role: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
            { status: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { id: "desc" },
  });

  res.json(users);
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API: http://localhost:${PORT}`));
