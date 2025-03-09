/*CMD
  command: todayTasks.html
  help: 
  need_reply: 
  auto_retry_time: 
  folder: pages
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Habit Builder</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Ubuntu:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-color: #78318d;
            --secondary-color: #f7e2e2;
            --accent-color: #a45eb4;
        }

        body, html {
            background: linear-gradient(135deg, var(--primary-color) 0%, #5a1d6b 100%);
            height: 100%;
            width: 100%;
            margin: 0;
            font-family: "Inter", sans-serif;
            overflow: hidden;
        }

        .section_1 {
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .heading {
            font-weight: 700;
            color: var(--secondary-color);
            font-size: 24px;
            letter-spacing: 0.5px;
        }

        .section_2 {
            background-color: var(--secondary-color);
            height: calc(100vh - 80px);
            border-radius: 40px 40px 0 0;
            padding: 40px 25px;
            box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.1);
        }

        .heading_2 {
            font-weight: 600;
            color: var(--primary-color);
            font-size: 20px;
            margin-bottom: 30px;
        }

        ul {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }

        li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            margin: 10px 0;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }

        li:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        .tick-button {
            background: none;
            border: none;
            font-size: 1.5em;
            cursor: pointer;
            color: var(--primary-color);
            transition: all 0.3s ease;
        }

        .tick-button:hover {
            color: var(--accent-color);
            transform: scale(1.1);
        }

        .tick-button:active {
            transform: scale(0.9);
        }

        #date-time {
            font-weight: 500;
            color: var(--primary-color);
            font-size: 16px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="section_1">
        <p class="heading">Your Daily Tasks</p>
    </div>
    <div class="section_2">
        <div id="date-time"></div>
        <ul id="task-list"></ul>
    </div>

    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <script>
        const taskList = document.getElementById('task-list')
        const dateTimeElement = document.getElementById('date-time')
        let habits = []
        let tg = window.Telegram.WebApp
        tg.ready()
        const userID = tg.initDataUnsafe.user?.id

        function renderTasks() {
            taskList.innerHTML = ''
            habits.forEach(habit => {
                const li = document.createElement('li')
                li.innerHTML = `
                    <span>${habit.habitTarget}</span>
                    <button class="tick-button" data-id="${habit.habitID}">✔️</button>
                `;
                li.id = `li-${habit.habitID}`
                taskList.appendChild(li)
            })
        }

        taskList.addEventListener('click', async function (event) {
            if (event.target.classList.contains('tick-button')) {
                const habitID = event.target.getAttribute('data-id')
                const habit = habits.find(t => t.habitID == habitID)

                if (habit) {
                    const now = new Date()
                    const day = now.getDate()
                    const month = now.getMonth() + 1
                    const year = now.getFullYear()

                    try {
                        const request = await fetch(`https://api.bots.business/v2/bots/<%bot.id%>/web-app/completeTask`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                userID,
                                habitID,
                                date: `${day}-${month}-${year}`
                            })
                        })

                        if (request.ok) {
                            const result = await request.json()
                            fetchTasks()
                            tg.showAlert(result.message)
                            document.getElementById(`li-${habitID}`).style.display = "none"
                        } else {
                            tg.showAlert("Failed to mark task as completed.")
                        }
                    } catch (error) {
                        console.error("Error:", error)
                        tg.showAlert("An error occurred. Please try again.")
                    }
                }
            }
        });

        function updateDateTime() {
            const now = new Date()
            const options = {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            }
            const formattedDateTime = now.toLocaleDateString('en-US', options)
            dateTimeElement.textContent = formattedDateTime
        }

        async function fetchTasks() {
            const now = new Date()
            const day = now.getDate()
            const month = now.getMonth() + 1
            const year = now.getFullYear()

            try {
                const request = await fetch(`https://api.bots.business/v2/bots/<%bot.id%>/web-app/getTodayTasks`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userID,
                        date: `${day}-${month}-${year}`
                    })
                })

                if (request.ok) {
                    const result = await request.json()
                    if (!result.ok) {
                        try {tg.showAlert(result.message)}
                        catch (error){console.error(error)}
                        tg.close()
                        return 
                    }
                    habits = result.habitsList || []
                    renderTasks()
                } else {
                    tg.showAlert("Failed to fetch today's tasks.")
                }
            } catch (error) {
                console.error("Error:", error)
                tg.showAlert("An error occurred. Please try again.")
            }
        }

        setInterval(updateDateTime, 1000)
        updateDateTime()
        fetchTasks()
    </script>
</body>
</html>
