
const cron = require("node-cron")
const Todo = require("./models/Todo")


const cleanupOldTodos = async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 1);
  
    try {
      const result = await Todo.deleteMany({
        completed: false,
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