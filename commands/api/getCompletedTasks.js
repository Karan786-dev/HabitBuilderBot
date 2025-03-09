/*CMD
  command: getCompletedTasks
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

let completedTasks = Bot.getProp({name: "completedTasks"+userID,type: "json"})

WebApp.render({
    content: {
        data: completedTasks
    }
})
