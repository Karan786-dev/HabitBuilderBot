/*CMD
  command: getTodayTasks
  help: 
  need_reply: 
  auto_retry_time: 
  folder: api
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

if (!options) {
    return WebApp.render({
        content: {
            ok: false,
            message: "Invalid Params"
        },
        mime_type: "application/json"
    });
}

let userID = options.userID;
let todayDate = options.date;

if (!userID || !todayDate) {
    return WebApp.render({
        content: {
            ok: false,
            message: "Missing userID or date"
        },
        mime_type: "application/json"
    });
}

let [date, month, year] = todayDate.split("-");
let dayName = new Date(year, parseInt(month) - 1, date).toLocaleDateString('en-US', { weekday: 'long' });

let allHabits = Bot.getProp({ name: "habits" + userID }) || [];
let completedTasks = Bot.getProp({ name: "completedTasks" + userID }) || {};

let todayCompletedTasks = completedTasks[todayDate] || [];

if (todayCompletedTasks.length === allHabits.filter(habit => {return habit.selectedDays.includes(dayName)}).length) {
    return WebApp.render({
        content: {
            ok: false,
            habitsList: [],
            message: "No tasks left for today!",
            dayName
        },
        mime_type: "application/json"
    });
}

let todayCompletedTasksIds = todayCompletedTasks.map(v => {return v.habitID})

let remainingTasks = allHabits.filter(habit => {
    const isForToday = habit.selectedDays.includes(dayName);
    
    const isNotCompleted = !todayCompletedTasksIds.includes(habit.habitID);
    
    return isForToday && isNotCompleted;
});

return WebApp.render({
    content: {
        ok: true,
        habitsList: remainingTasks,
        completedTasks: completedTasks
    },
    mime_type: "application/json"
});
