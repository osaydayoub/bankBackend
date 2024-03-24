import cron from "node-cron";
import axios from "axios";
// Maybe make the schedule time a variable and save last update time somewhere to make sure if the server restarts it doesnt affect the schedule

// Schedule the task to run every week
cron.schedule("*/14 * * * *", () => {
  const wakeUp = async () => {
    try {
      const res = await axios.get("https://bank-api-v2.onrender.com/test");
      console.log("Hello!");
    } catch (error) {
      console.log("error in wakeUp");
    }
  };
  wakeUp();
});
