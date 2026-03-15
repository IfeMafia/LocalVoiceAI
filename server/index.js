const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Placeholder Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/assistant', require('./routes/assistant.routes'));
app.use('/api/business', require('./routes/business.routes'));
app.use('/api/conversations', require('./routes/conversations.routes'));
app.use('/api/analytics', require('./routes/analytics.routes'));

app.get('/', (req, res) => {
  res.json({ message: 'Voxy backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
