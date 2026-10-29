import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors({ origin: '*' }));

const BOT_TOKEN = process.env.BOT_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;
const DISCORD_API = 'https://discord.com/api/v10';

app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/stats', async (req, res) => {
  try {
    const { data } = await axios.get(
      `${DISCORD_API}/guilds/${GUILD_ID}?with_counts=true`,
      { headers: { Authorization: `Bot ${BOT_TOKEN}` } }
    );
    res.json({
      online: data.approximate_presence_count || 0,
      total: data.approximate_member_count || 0,
      voice: 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/feed', async (req, res) => {
  try {
    const { data } = await axios.get(
      `${DISCORD_API}/channels/${CHANNEL_ID}/messages?limit=5`,
      { headers: { Authorization: `Bot ${BOT_TOKEN}` } }
    );
    const posts = data.filter(m => !m.author?.bot && m.content).map(m => ({
      author: m.author.username,
      content: m.content,
      timestamp: m.timestamp
    }));
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// التصدير ده عشان Cloudflare يشغله
export default app;