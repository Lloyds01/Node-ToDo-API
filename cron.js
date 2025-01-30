
const cron = require("node-cron")
const User = require("./models/User")
const Todo = require("./models/Todo")


const cleanupOldTodos = async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
    try {
      const result = await Todo.deleteMany({
        completed: true,
        updatedAt: { $lt: thirtyDaysAgo }
      });
      console.log(`Cleaned up ${result.deletedCount} old completed todos`);
    } catch (error) {
      console.error("Error in cleanup task:", error);
    }
  };

  cron.schedule("0 0 * * *", () => {
    console.log("Running daily cleanup task");
    cleanupOldTodos();
  });

  cron.schedule("* * * * *", () => {
    console.log("Running cleanup task every minute");
    cleanupOldTodos();
  });