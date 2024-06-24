import { createQueue } from "kue";

const queue = createQueue();

const BLACKLISTED_NUMS = ["4153518780", "4153518781"];

const sendNotification = (phoneNumber, message, job, done) => {
  job.progress(0, 100);

  if (BLACKLISTED_NUMS.includes(phoneNumber)) {
    done(new Error(`Phone number ${phoneNumber} is blacklisted`));
    return;
  }

  job.progress(50, 100);
  console.log(
    `Sending notification to ${phoneNumber}, with message: ${message}`
  );

  setTimeout(() => {
    // Track job progress at 100% and mark as done
    job.progress(100, 100);
    done();
  }, 1000); // 1 second delay for demonstration
};

queue.process("push_notification_code_2", 2, (job, done) => {
  sendNotification(job.data.phoneNumber, job.data.message, job, done);
});

queue.on("error", (err) => {
  console.log("Oops... ", err);
});
