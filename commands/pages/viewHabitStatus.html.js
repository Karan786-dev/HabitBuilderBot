/*CMD
  command: viewHabitStatus.html
  help: 
  need_reply: false
  auto_retry_time: 
  folder: pages

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Completed Tasks</title>
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
            overflow-y: auto;
        }

        .month-container {
            margin-bottom: 30px;
        }

        .month-heading {
            font-weight: 600
            color: var(--primary-color);
            font-size: 20px;
            margin-bottom: 15px;
        }

        .task-list {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }

        .task-item {
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

        .task-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        .task-name {
            font-weight: 500;
            color: var(--primary-color);
        }

        .task-date {
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="section_1">
        <p class="heading">Completed Tasks</p>
    </div>
    <div class="section_2" id="monthly-tasks"></div>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <script>
        let tg = window.Telegram.WebApp
        tg.ready()
        const userID = tg.initDataUnsafe.user?.id
        const monthlyTasksContainer = document.getElementById('monthly-tasks')
        let completedTasks;

                    fetch(`https://api.bots.business/v2/bots/<%bot.id%>/web-app/getCompletedTasks`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                userID,
                            })
                        }).then(async (result)=>{
                            result = await result.json()
                            renderMonthlyTasks(groupTasksByMonth(result.data))
                            console.log(result.data)
                        })


        function groupTasksByMonth(completedTasks) {
            const groupedTasks = {}

            for (const date in completedTasks) {
                const [day, month, year] = date.split('-')
                const monthKey = `${month}-${year}` // Group by month and year

                if (!groupedTasks[monthKey]) {
                    groupedTasks[monthKey] = []
                }

                completedTasks[date].forEach(task => {
                    groupedTasks[monthKey].push({
                        ...task,
                        date: date
                    })
                })
            }

            return groupedTasks
        }

        function renderMonthlyTasks(groupedTasks) {
            monthlyTasksContainer.innerHTML = ''

            for (const monthKey in groupedTasks) {
                const monthTasks = groupedTasks[monthKey]

                // Create month container
                const monthContainer = document.createElement('div')
                monthContainer.classList.add('month-container')

                // Add month heading
                const monthHeading = document.createElement('div')
                monthHeading.classList.add('month-heading')
                monthHeading.textContent = `Month: ${monthKey}`
                monthContainer.appendChild(monthHeading)

                // Add task list
                const taskList = document.createElement('ul')
                taskList.classList.add('task-list')

                monthTasks.forEach(task => {
                    const taskItem = document.createElement('li')
                    taskItem.classList.add('task-item')

                    // Task name
                    const taskName = document.createElement('div')
                    taskName.classList.add('task-name')
                    taskName.textContent = task.habitTarget

                    // Task date
                    const taskDate = document.createElement('div')
                    taskDate.classList.add('task-date')
                    taskDate.textContent = `Completed on: ${task.date}`

                    taskItem.appendChild(taskName)
                    taskItem.appendChild(taskDate)
                    taskList.appendChild(taskItem)
                })

                monthContainer.appendChild(taskList)
                monthlyTasksContainer.appendChild(monthContainer)
            }
        }

        
    </script>
</body>
</html>
