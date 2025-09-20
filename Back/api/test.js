module.exports = (req, res) => {
  res.status(200).json({
    message: 'Test endpoint funcionando',
    environment: process.env.NODE_ENV,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    timestamp: new Date().toISOString(),
    headers: req.headers,
  });
};
