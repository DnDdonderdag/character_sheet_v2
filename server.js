const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from current folder or 'public' if you use it
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
