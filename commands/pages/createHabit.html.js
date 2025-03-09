/*CMD
  command: createHabit.html
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

    #habitGoal {
        background: transparent;
        border: none;
        border-bottom: 2px solid var(--primary-color);
        width: 100%;
        padding: 15px 0;
        margin: 30px 0;
        font-size: 18px;
        color: var(--primary-color);
        transition: all 0.3s ease;
        outline: none;
    }

    #habitGoal:focus {
        border-bottom-color: var(--accent-color);
        box-shadow: 0 2px 0 var(--accent-color);
    }

    #habitGoal::placeholder {
        color: rgba(120, 49, 141, 0.6);
        font-weight: 500;
    }

    .heading_3 {
        font-weight: 600;
        color: var(--primary-color);
        font-size: 16px;
        margin: 40px 0 20px;
    }

    .selectDays ul {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 8px;
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .selectDays ul li {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
        border: 2px solid var(--primary-color);
        border-radius: 12px;
        color: var(--primary-color);
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .selectDays ul li.selected {
        background: var(--primary-color);
        color: var(--secondary-color);
        transform: scale(0.95);
        box-shadow: 0 3px 10px rgba(120, 49, 141, 0.3);
    }



    .submitButton {
        margin-top: 40px;
        width: 100%;
        padding: 16px;
        background: var(--primary-color);
        border: none;
        border-radius: 12px;
        color: var(--secondary-color);
        font-size: 18px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(120, 49, 141, 0.3);
    }

    .submitButton:hover {
        background: var(--accent-color);
        transform: translateY(-2px);
    }

    .submitButton:active {
        transform: translateY(0);
    }

    @media (max-width: 380px) {
        .selectDays ul li {
            height: 45px;
            font-size: 14px;
        }
    }
    </style>
</head>
<body>
    <div class="section_1">
        <p class="heading">Create New Habit</p>
    </div>
    <div class="section_2">
        <form id="habbitForm" onsubmit="submitForm(event)">
            <p class="heading_2">Build Your New Routine</p>
            <input placeholder="e.g. Practice guitar daily" type="text" name="habitGoal" id="habitGoal">
            <p class="heading_3">Select Practice Days</p>
            <div class="selectDays">
                <ul class="daysList">
                    <li id="Monday">Mon</li>
                    <li id="Tuesday">Tue</li>
                    <li id="Wednesday">Wed</li>
                    <li id="Thursday">Thu</li>
                    <li id="Friday">Fri</li>
                    <li id="Saturday">Sat</li>
                    <li id="Sunday">Sun</li>
                </ul>
            </div>
            <button class="submitButton" type="submit">Create Habit</button>
        </form>
    </div>

    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <script>
    let selectedDays = [];
    const daysList = document.querySelectorAll('.daysList li');

    daysList.forEach(day => {
        day.addEventListener('click', function() {
            this.classList.toggle('selected');
            const dayID = this.id;
            
            if (selectedDays.includes(dayID)) {
                selectedDays = selectedDays.filter(d => d !== dayID);
            } else {
                selectedDays.push(dayID);
            }
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });

    async function submitForm(event) {
        event.preventDefault();
        const tg = window.Telegram.WebApp;
        const userID = tg.initDataUnsafe.user?.id;
        const habitTarget = document.getElementById('habitGoal').value.trim();

        if (!habitTarget || !selectedDays.length) {
            tg.showAlert("Please fill in all required fields");
            document.getElementById('habitGoal').focus();
            return;
        }

        try {
            const response = await fetch("https://api.bots.business/v2/bots/<%bot.id%>/web-app/createhabitdata?", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userID, habitTarget, selectedDays })
            });

            if (response.ok) {
                const result = await response.json();
                tg.showAlert(result.message);
                setTimeout(() => tg.close(), 1500);
            } else {
                tg.showAlert("Failed to create habit. Please try again.");
            }
        } catch (error) {
            console.error('Error:', error);
            tg.showAlert("Connection error. Please check your internet.");
        }
    }
    </script>
</body>
</html>
