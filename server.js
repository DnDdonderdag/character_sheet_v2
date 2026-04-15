const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = 3000;

function loadUsersFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const users = {};

    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) {
        continue;
      }

      const separatorIndex = line.indexOf(":");
      if (separatorIndex === -1) {
        continue;
      }

      const username = line.slice(0, separatorIndex).trim();
      const password = line.slice(separatorIndex + 1).trim();

      if (!username || !password) {
        continue;
      }

      users[username] = password;
    }

    return users;
  } catch (error) {
    console.error("Could not load users file:", error);
    return {};
  }
}

// User credentials loaded from users.txt (username:password per line)
const users = loadUsersFromFile(path.join(__dirname, "users.txt"));

// Ensure saves directory exists
const savesDir = path.join(__dirname, "character_saves");
if (!fs.existsSync(savesDir)) {
  fs.mkdirSync(savesDir, { recursive: true });
}

// Ensure templates directory exists
const templatesDir = path.join(__dirname, "layoutTemplates");
if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true });
}

app.set('trust proxy', true);
app.use(express.json()); // Parse JSON request bodies
app.use(express.static(__dirname));

// Redirect /index.html to root
app.get('/index.html', (req, res) => {
  res.redirect(301, '/');
});

// Authentication endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }
  
  // Check credentials
  if (users[username] && users[username] === password) {
    res.json({ success: true, username });
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
});

// Save character endpoint
app.post('/api/character/save', (req, res) => {
  const { username, password, filename, data } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: "Authentication required" });
  }
  
  // Verify credentials
  if (!users[username] || users[username] !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  
  // Validate data structure
  if (!data || typeof data !== 'object') {
    return res.status(400).json({ error: "Invalid character data" });
  }
  
  if (!data.elements || !data.values) {
    return res.status(400).json({ error: "Missing required fields in character data" });
  }
  
  // Check file size (5MB limit)
  const dataStr = JSON.stringify(data);
  if (dataStr.length > 5 * 1024 * 1024) {
    return res.status(413).json({ error: "File too large (max 5MB)" });
  }
  
  // Create user directory if needed
  const userDir = path.join(savesDir, username);
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
  
  // Sanitize filename
  const safeFilename = filename.replace(/[^a-zA-Z0-9\-_.]/g, '');
  const filepath = path.join(userDir, safeFilename + '.char');
  
  try {
    fs.writeFileSync(filepath, dataStr);
    res.json({ success: true, message: "Character saved successfully", filename: safeFilename });
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ error: "Failed to save character" });
  }
});

// Load character endpoint
app.get('/api/character/load', (req, res) => {
  const { username, password, filename } = req.query;
  
  if (!username || !password) {
    return res.status(400).json({ error: "Authentication required" });
  }
  
  // Verify credentials
  if (!users[username] || users[username] !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  
  const userDir = path.join(savesDir, username);
  const safeFilename = filename.replace(/[^a-zA-Z0-9\-_.]/g, '');
  const filepath = path.join(userDir, safeFilename + '.char');
  
  // Security check: ensure path stays within userDir
  if (!filepath.startsWith(userDir)) {
    return res.status(403).json({ error: "Access denied" });
  }
  
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: "Character file not found" });
  }
  
  try {
    const data = fs.readFileSync(filepath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error("Load error:", error);
    res.status(500).json({ error: "Failed to load character" });
  }
});

// List user's saved characters
app.get('/api/character/list', (req, res) => {
  const { username, password } = req.query;
  
  if (!username || !password) {
    return res.status(400).json({ error: "Authentication required" });
  }
  
  // Verify credentials
  if (!users[username] || users[username] !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  
  const userDir = path.join(savesDir, username);
  
  if (!fs.existsSync(userDir)) {
    return res.json({ files: [] });
  }
  
  try {
    const files = fs.readdirSync(userDir)
      .filter(f => f.endsWith('.char'))
      .map(f => f.replace('.char', ''));
    res.json({ files });
  } catch (error) {
    console.error("List error:", error);
    res.status(500).json({ error: "Failed to list characters" });
  }
});

// Admin endpoint: list all user credentials (requested behavior)
app.get('/api/admin/users', (req, res) => {
  const { username, password } = req.query;

  if (!username || !password) {
    return res.status(400).json({ error: "Authentication required" });
  }

  if (username !== "admin" || users[username] !== password) {
    return res.status(403).json({ error: "Admin credentials required" });
  }

  const userList = Object.entries(users).map(([user, pass]) => ({
    username: user,
    password: pass,
  }));

  res.json({ users: userList });
});

// List templates endpoint (no authentication required)
app.get('/api/templates/list', (req, res) => {
  if (!fs.existsSync(templatesDir)) {
    return res.json({ files: [] });
  }
  
  try {
    const files = fs.readdirSync(templatesDir)
      .filter(f => f.endsWith('.char'))
      .map(f => f.replace('.char', ''));
    res.json({ files });
  } catch (error) {
    console.error("Template list error:", error);
    res.status(500).json({ error: "Failed to list templates" });
  }
});

// Load template endpoint (no authentication required)
app.get('/api/templates/load', (req, res) => {
  const { filename } = req.query;
  
  if (!filename) {
    return res.status(400).json({ error: "Filename required" });
  }
  
  const safeFilename = filename.replace(/[^a-zA-Z0-9\-_.]/g, '');
  const filepath = path.join(templatesDir, safeFilename + '.char');
  
  // Security check: ensure path stays within templatesDir
  if (!filepath.startsWith(templatesDir)) {
    return res.status(403).json({ error: "Access denied" });
  }
  
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: "Template not found" });
  }
  
  try {
    const data = fs.readFileSync(filepath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error("Template load error:", error);
    res.status(500).json({ error: "Failed to load template" });
  }
});

// Error handler - must come before generic handlers
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

io.on('connection', (socket) => {
  console.log(`Nieuwe verbinding: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});