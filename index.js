const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 3000;

// Handle preflight requests
app.options('/api', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.sendStatus(204); // No Content
});

// Apply CORS headers to every request
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// Dynamic proxy configuration
app.use('/api', (req, res, next) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    res.status(400).send('URL query parameter is required');
    return;
  }

  const proxyMiddleware = createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: {
      [`^/api`]: "",
    },
    preserveHeaderKeyCase: true, // Preserve headers case-sensitive
    onProxyReq: (proxyReq, req) => {
      // Log for debugging
      console.log(`Proxying request to: ${targetUrl}`);
    },
  });

  proxyMiddleware(req, res, next);
});

app.listen(PORT, () =>
  console.log(`Proxy server running on http://localhost:${PORT}`)
);
