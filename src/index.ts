import express from 'express';
import at from './routes/at.js';

const app = express();

const PORT = process.env.PORT ?? 3000;

app.use('/at', at);

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
