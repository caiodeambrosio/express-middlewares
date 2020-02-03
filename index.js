const express = require("express");
const server = express();

const projects = [];

function checkProjectBody(req, res, next) {
  if (!req.body.title) {
    return res.status(400).json({ error: "title field is required" });
  } else if (!req.body.id) {
    return res.status(400).json({ error: "id field is required" });
  } else if (projects.some(project => project.id === req.body.id)) {
    return res.status(400).json({ error: "id already exists" });
  }

  req.body.id = String(req.body.id);
  req.body.title = String(req.body.title);

  return next();
}

function checkTaskBody(req, res, next) {
  if (!req.body.title) {
    return res.status(400).json({ error: "title field is required" });
  }

  return next();
}

function checkProjectExists(req, res, next) {
  const { id } = req.params;

  if (!projects.some(project => project.id === id)) {
    return res.status(400).json({ error: "Project id does not exists" });
  }

  return next();
}

function logRequestQuantity(req, res, next) {
  console.count("Número de requisições");
  return next();
}

server.use(express.json());

server.use(logRequestQuantity);

server.get("/projects", (req, res) => {
  res.json(projects);
});

server.post("/projects", checkProjectBody, (req, res) => {
  const { id, title } = req.body;

  projects.push({ id, title, tasks: [] });

  return res.json(projects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(project => project.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.post(
  "/projects/:id/tasks",
  checkProjectExists,
  checkTaskBody,
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id == id);

    project.tasks.push(title);

    return res.json(project);
  }
);

server.listen(3000);
