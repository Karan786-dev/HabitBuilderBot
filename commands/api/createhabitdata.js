/*CMD
  command: createhabitdata
  help: 
  need_reply: false
  auto_retry_time: 
  folder: api

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

if (!options){
    WebApp.render({
      content: {
        message: "Invalid Params"
      },
      mime_type: "application/json"
    })
    return
}


let habitID = Math.floor(Math.random() * 90000) + 10000
let userID = options.userID 
let habitTarget = options.habitTarget 
let selectedDays = options.selectedDays
  
let userHabits = Bot.getProp({
  name: "habits"+userID,
}) || []

userHabits.push(
  {
    habitID,
    habitTarget,
    selectedDays,
  }
)

Bot.setProp({
  name: "habits"+userID,
  value: userHabits,
  type: "json"
})
  
WebApp.render({
  content: {
    message: "New Habit Created!"
  }
})
