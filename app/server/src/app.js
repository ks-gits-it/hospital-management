const express = require('express');
const routes = require('./router.js');

const app = express();

const PORT = Number(process.env.PORT || 4000);

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', routes);

app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
module.exports = app;
