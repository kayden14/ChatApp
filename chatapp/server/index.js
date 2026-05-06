import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import roomsRouter from './routes/rooms.js';
import messagesRouter from './routes/messages.js';
import profilesRouter from './routes/profiles.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://keziahchatapp.netlify.app'
  ]
}));
app.use(express.json());

app.use('/api/rooms', roomsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/profiles', profilesRouter);

app.get('/', (req, res) => res.json({ message: 'ChatApp API running ✅' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));