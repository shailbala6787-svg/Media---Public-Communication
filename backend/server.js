const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

// Fix for Node 18+ fetch throwing "fetch failed" due to IPv6 preference on some PaaS like Render
dns.setDefaultResultOrder('ipv4first');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/press-releases', require('./routes/pressReleases'));
app.use('/api/public-notices', require('./routes/publicNotices'));
app.use('/api/media', require('./routes/media'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/users', require('./routes/users'));
app.use('/api/ai', require('./routes/ai'));

app.get('/', (req, res) => res.json({ message: 'Media & Public Communication API running (Supabase)' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
