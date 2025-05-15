const express = require('express');
const path = require('path');

const app = express();
const port = 5000;

// Serve static files from current folder
app.use(express.static(path.join(__dirname)));

// Default route (optional)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});