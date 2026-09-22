# ECHOO – Scientific Voice Calculator

ECHOO is a scientific calculator you can **talk to**. Say *"3 sin 30"*, *"area of circle with radius 5"* or
*"100 dollars to rupees"* and it shows the answer and reads it back to you.

It was built as a college project to make calculation hands-free and more accessible for people who find
typing on a calculator difficult.

> **Team / Author:** _add your name(s) here_  
> **Course / College:** _add your course and college here_

---

## Features

- **Voice input and spoken answers** using the browser's Web Speech API (microphone button on the keypad).
- **Scientific calculator:** `sin`, `cos`, `tan`, `log`, `ln`, `√`, `π`, `e`, `x²`, `x!`, `x^y`, brackets, backspace, all-clear.
- **14 formulas:** Area, Volume, Perimeter, Speed, Simple Interest, BMI, Percentage, Mean, Median, Mode,
  Variance, Standard Deviation, Z-Score and Covariance.
- **Currency converter** (INR ⇄ USD, EUR, GBP) with **live exchange rates** and the currency code and name in the result.
- **Binary converter:** decimal ⇄ binary, octal and hexadecimal.
- **Right-panel navigation:** a **Back** button (or say *"go back"*) if you open the wrong section.
- **History,** light and dark themes, button sounds, and voice-output settings.

## Tech stack

| Part | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript (no framework) |
| Voice | Web Speech API (`SpeechRecognition` and `speechSynthesis`) |
| Live rates | [Frankfurter API](https://frankfurter.dev) (European Central Bank rates, no key needed) |
| Backend | Python, Django, django-cors-headers, SQLite |
| Testing | In-browser automated test page (`tests.html`) |

---

## How to run

### Frontend (this is all you need for the calculator)

1. Open the project folder in **VS Code**.
2. Install the **Live Server** extension.
3. Right-click `index.html` and choose **Open with Live Server**.
4. Open it in **Google Chrome** (or Edge) and allow microphone access when asked.

> Voice recognition needs a Chromium-based browser and an internet connection.

### Backend (optional Django API)

```bash
pip install django django-cors-headers requests
cd backend
python manage.py migrate
python manage.py runserver
```

The API runs at `http://127.0.0.1:8000/`:

| Endpoint | Purpose |
|---|---|
| `/` | Health check |
| `/api/calculate/?expression=2+3*4` | Evaluate an expression safely |
| `/api/binary/?direction=dec_to_bin&value=10` | Binary conversion |
| `/api/formula/?formula=circle_area&radius=5` | Formula calculations |
| `/api/currency/?amount=100&from=USD&to=INR` | Currency conversion |

---

## Voice commands (examples)

Tap the microphone, then say any of these. Numbers can be spoken as digits or words (*"twenty five"*, *"one hundred"*).

**Arithmetic and functions**

| Say | Result |
|---|---|
| `20 plus 30` | 50 |
| `3 sin 30` | 1.50 |
| `2 cos 90` | 0 |
| `sin 30 + cos 30` | 1.37 |
| `square root of 144` | 12 |
| `2 to the power of 10` | 1024 |
| `5 factorial` | 120 |
| `open bracket 3 plus 4 close bracket times 2` | 14 |

**Formulas**

| Say | Result |
|---|---|
| `area of circle with radius 5` | 78.54 |
| `area of rectangle length 5 width 3` | 15.00 |
| `volume of cylinder radius 3 height 5` | 141.37 |
| `perimeter of triangle 3 4 5` | 12.00 |
| `simple interest principal 1000 rate 5 time 2` | 100.00 |
| `bmi weight 70 height 1.75` | 22.86 |
| `percentage 45 out of 50` | 90.00 |
| `mean of 1 2 3 4 5` | 3.00 |
| `standard deviation of 2 4 4 4 5 5 7 9` | 2.00 |

**Converters**

| Say | Result |
|---|---|
| `100 dollars to rupees` | amount in INR, with currency name |
| `5000 rupees to euros` | amount in EUR |
| `10 decimal to binary` | 1010 |
| `255 decimal to hexadecimal` | FF |
| `ff hexadecimal to decimal` | 255 |

**Controls**

`clear`, `all clear`, `backspace`, `go back`, `radian mode`, `degree mode`, `set decimal places to 4`.

---

## Testing

Open `tests.html` through Live Server (`http://127.0.0.1:5500/tests.html`). It loads the calculator in a hidden
frame, sends it **329 test cases** (voice phrases, every formula shape typed by hand, converters, voice control commands, the Back button
and settings), and shows a pass/fail report. It does not use the microphone or change your saved history, and it
uses fixed currency rates so results are repeatable.

Backend tests (`backend/calculator/tests.py`) have not been written yet.

## Project structure

```
echoo/
├── index.html      # page layout
├── script.js       # calculator logic, voice commands, formulas, converters
├── style.css       # styling, light/dark themes
├── tests.html      # automated test page
├── sounds/         # button click sound
└── backend/        # Django API
    ├── manage.py
    ├── backend/    # project settings
    └── calculator/ # views, urls, models
```

## How the voice commands work

1. The browser converts speech to text (Web Speech API).
2. The text is cleaned up: filler words are removed and spoken words become symbols and digits
   (*"twenty plus thirty"* becomes `20 + 30`).
3. The command is matched against formulas, converters and controls first.
4. Anything else is treated as arithmetic. The expression is checked so that only numbers, operators and approved
   math functions remain, and is then evaluated.
5. The answer is shown and read aloud.

## Limitations

- Voice recognition works best in Chrome or Edge and needs an internet connection.
- Recognition accuracy depends on your accent, microphone and background noise.
- Currency conversion covers INR with USD, EUR and GBP. Live rates are updated on banking days, so weekend
  values are the last business day's. If the rate service can't be reached, saved or approximate rates are used.
- The calculator currently does its calculations in the browser. The Django backend provides a matching API but
  is not yet wired into the frontend.

## Future scope

- Connect the frontend to the Django API.
- More currencies and unit converters (length, weight, temperature).
- Support for more languages in voice input.
- Backend automated tests.
- Deploy online.

## Screenshots

_Add screenshots of the calculator, a voice command result, and the test page here._