const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
});

// CORS setup with allowed origins
const allowedOrigins = ['http://yourdomain.com', 'http://anotherdomain.com'];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// Validate target URL middleware
const allowedHosts = ['example.com', 'api.example.com'];
const validateTargetUrl = (req, res, next) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('URL query parameter is required');
  }
  try {
    const url = new URL(targetUrl);
    if (!allowedHosts.includes(url.hostname)) {
      return res.status(403).send('Forbidden: Invalid target URL');
    }
    req.targetUrl = targetUrl; // Store validated URL for use by proxy middleware
    next();
  } catch (err) {
    return res.status(400).send('Invalid URL');
  }
};

// Create proxy middleware instance with timeout
const proxyMiddleware = createProxyMiddleware({
  changeOrigin: true,
  timeout: 5000, // 5 seconds for upstream server
  proxyTimeout: 5000, // 5 seconds for proxy connection
  preserveHeaderKeyCase: true,
  pathRewrite: (path, req) => path.replace(/^\/api/, ""),
  onProxyReq: (proxyReq, req) => {
    console.log(`Proxying request to: ${req.targetUrl}`);
  },
});

// Apply rate limiting and target URL validation to /api
app.use('/api', apiLimiter, validateTargetUrl, (req, res, next) => {
  req.url = req.targetUrl; // Set the target URL for the proxy middleware
  proxyMiddleware(req, res, next);
});

// Start the server
app.listen(PORT, () =>
  console.log(`Proxy server running on http://localhost:${PORT}`)
);
