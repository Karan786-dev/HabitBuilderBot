/*CMD
  command: completeTask
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
    WebApp.render({
        content: {
            message: "Invalid Params"
        },
        mime_type: "application/json"
    })
    return
}

let userID = options.userID
let todayDate = options.date
let habitID = options.habitID

let allHabits = Bot.getProp({ name: "habits" + userID }) || []

let completedTasks = Bot.getProp({ name: "completedTasks" + userID, type: "json" }) || {}

let todayCompletedTasks = completedTasks[todayDate] || []

if (!todayCompletedTasks.length) {
    completedTasks[todayDate] = todayCompletedTasks

}



let taskData;

for (let i in allHabits) {
    if (allHabits[i].habitID == habitID) { taskData = allHabits[i]; break }
}


for (let x in completedTasks[todayDate]) {
    if (habitID == completedTasks[todayDate][x].habitID) return WebApp.render({
        content: {
            message: "You Already Completed this task"
        }
    })
}

completedTasks[todayDate].push(taskData)

Bot.setProp({ name: "completedTasks" + userID, value: completedTasks, type: "json" })

WebApp.render({
    content: {
        message: "Task Completed!!!!!!"
    }
})
