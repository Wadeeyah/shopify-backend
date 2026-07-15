const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("InsightFlow Backend Running");
});

app.get("/api/shopify/install", (req, res) => {
  res.json({
    success: true,
    message: "Install route works"
  });
});

app.get("/api/shopify/callback", (req, res) => {
  res.json({
    success: true,
    message: "Callback route works"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});