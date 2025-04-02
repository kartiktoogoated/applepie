import { emailQueue } from "./queue";

emailQueue.process(async (job) => {
    console.log("Processing job:", job.data);
    //Simulate sending an email or another heavy task
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return Promise.resolve();
});

console.log("Worker is running...");