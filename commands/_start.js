/*CMD
  command: /start
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

let createHabitUrl = WebApp.getUrl({ command: "createHabitHtml" })
let todaysTaskUrl = WebApp.getUrl({ command: "todayTasks" })
let historyUrl = WebApp.getUrl({ command: "habitHistory" })

let keyboard = [
    [{ text: "🆕 Create a Habit", web_app: { url: createHabitUrl } }],
    [{ text: "📊 Today's Tasks", web_app: { url: todaysTaskUrl } }],
    [{ text: "📈 View Progress", web_app: { url: historyUrl } }],
]

let text = `
👋 Hello *` + user.first_name + `* Welcome to the *Habit Tracker Bot*! 🚀

With this bot, you can:
✅ *Track your daily habits*
📊 *View your progress*
🎯 *Stay consistent and achieve your goals*

Use the menu buttons below to get started! 👇`

Api.sendMessage({
    text: text,
    reply_markup: {
        inline_keyboard: keyboard
    },
    parse_mode: "MARKDOWN",
    on_error: "/errorHandling",
})
