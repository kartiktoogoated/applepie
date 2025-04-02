import express from 'express';
import { emailQueue } from './jobs/queue';

const app = express();
app.use(express.json());

app.post('/send-email', async (req, res) => {
    const { to, subject, body} = req.body;
    const job = await emailQueue.add({ to, subject, body});
     res.json({ message: "Job added to the queue", jobId: job.id});
})

app.listen(3004, () => {
    console.log('Server is running on port 3004');
});