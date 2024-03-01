const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 3000;

// Apply CORS headers to every request
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  // Allow credentials to be shared, might be needed depending on the use case
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Dynamic proxy configuration
app.use('/api', (req, res, next) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    res.status(400).send('URL query parameter is required');
    return;
  }

  // Instead of creating middleware inside request handler,
  // modify the target dynamically for each request
  const proxyMiddleware = createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: {
      [`^/api`]: "",
    },
    router: () => targetUrl, // Dynamically set target based on request
  });

  proxyMiddleware(req, res, next);
});

app.listen(PORT, () =>
  console.log(`Proxy server running on http://localhost:${PORT}`)
);
