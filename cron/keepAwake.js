import cron from "node-cron";

// Maybe make the schedule time a variable and save last update time somewhere to make sure if the server restarts it doesnt affect the schedule

// Schedule the task to run every week
cron.schedule("*/1 * * * *", () => {
  console.log("Hello!");
});
