import { createQueue } from "kue";
import { expect } from "chai";
import sinon from "sinon";
import createPushNotificationsJobs from "./8-job";

const queue = createQueue();

describe("createPushNotificationsJobs", () => {
  let spy;

  before(() => {
    queue.testMode.enter(true);
  });

  beforeEach(() => {
    queue.testMode.clear();
    spy = sinon.spy(console, "log");
  });

  afterEach(() => {
    spy.restore();
  });

  after(() => {
    queue.testMode.exit();
  });

  it("displays an error message if jobs is not an array", () => {
    expect(() => createPushNotificationsJobs({}, queue)).to.throw(
      "Jobs is not an array"
    );
  });

  it("creates two new jobs to the queue", () => {
    const jobs = [
      {
        phoneNumber: "4153118782",
        message: "This is the code 4321 to verify your account",
      },
      {
        phoneNumber: "4153718781",
        message: "This is the code 4562 to verify your account",
      },
    ];
    createPushNotificationsJobs(jobs, queue);
    expect(queue.testMode.jobs.length).to.equal(2);
  });

  it("displays the correct message when a job is created", (done) => {
    const jobs = [
      {
        phoneNumber: "4159518782",
        message: "This is the code 4321 to verify your account",
      },
    ];
    createPushNotificationsJobs(jobs, queue);
    const job = queue.testMode.jobs[0];

    job.on("complete", () => {
      expect(spy.calledWith(`Notification job ${job.id} completed`)).to.be.true;
      done();
    });

    job.emit("complete");
  });

  it("displays the correct message for job progress", (done) => {
    const jobs = [
      {
        phoneNumber: "4159518782",
        message: "This is the code 4321 to verify your account",
      },
    ];
    createPushNotificationsJobs(jobs, queue);
    const job = queue.testMode.jobs[0];

    job.on("progress", (progress) => {
      expect(spy.calledWith(`Notification job ${job.id} ${progress}% complete`))
        .to.be.true;
      done();
    });

    job.emit("progress", 75);
  });

  it("displays the correct error message when a job fails with an error", (done) => {
    const jobs = [
      {
        phoneNumber: "4159518782",
        message: "This is the code 4321 to verify your account",
      },
    ];
    createPushNotificationsJobs(jobs, queue);
    const job = queue.testMode.jobs[0];

    job.on("failed", (error) => {
      expect(
        spy.calledWith(`Notification job ${job.id} failed: ${error.message}`)
      ).to.be.true;
      done();
    });

    job.emit("failed", new Error("This job failed"));
  });
});
