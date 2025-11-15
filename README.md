# Cash Flow Forecast Lab

## Interactive Teaching App for GCSE/BTEC/T Level Business & Finance

---

## Overview
The **Cash Flow Forecast Lab** is an interactive browser app designed to help 15–17 year-old learners understand cash flow forecasting in a safe, low-pressure environment. It focuses on:

- Timing of cash inflows and outflows
- Reading a cash flow forecast
- Spotting problems early

The lab is **SEND-friendly**, written in simple British English, and runs fully in the browser with:

- No login
- No data collection
- No server

---

## Learning Goals Covered
The app supports key outcomes typically required in **BTEC Unit 2** and similar business courses. Learners should be able to:

- **Understand the purpose of a cash flow forecast**
- Identify and describe:
  - Cash inflows (sources of cash coming into the business)
  - Cash outflows (cash leaving the business)
- Understand the impact of timing of inflows and outflows, including:
  - Cash on sale
  - 30 day credit
  - 60 day credit
- Complete a cash flow forecast from given information, including:
  - Opening balance
  - Inflows
  - Outflows
  - Net cash flow
  - Closing balance
- Read and interpret cash flow information:
  - Identify negative months
  - Spot potential cash flow problems
  - Suggest possible solutions
- Understand advantages of using cash flow forecasts to plan for success
- Understand disadvantages and risks, including the impact of not producing or updating a forecast

---

## Target Audience
- **Age range:** about 16 years old
- Little or no prior knowledge of cash flow forecasting
- Weak retention and low confidence with finance and maths
- Mixed SEND profile (including dyslexia and processing difficulties)
- Intended mainly for classroom use:
  - Teacher-led demos
  - Paired tasks
  - Short independent practice

---

## Key Features

### 1. Interactive Definition Builder
- Students construct a clear definition of a cash flow forecast by clicking word tiles.
- Immediate feedback via **Check definition** button.
- Supports literacy and precise wording without requiring long sentences.

### 2. Customisable Forecast Table
- Editable table with options for:
  - Number of months (6, 9, or 12)
  - Opening balance
  - Customer payment terms (0, 30, 60 days)
- Calculates:
  - Total inflows
  - Net cash flow
  - Opening and closing balances
- Highlights negative closing balances.

### 3. Payment Terms and Timing
- Models how customer payment terms affect timing:
  - Cash on sale (0 days)
  - Net 30
  - Net 60
- Students can change terms and see forecast updates.

### 4. Cash Balance Chart with Labels
- SVG line chart showing closing cash balance by month:
  - X-axis: months
  - Y-axis: Cash balance (£)
  - Green for positive, red for negative balances.

### 5. Interpretation and Suggested Solutions
- Detects negative months and lists them.
- Provides prompts such as:
  - Bring customer payments forward
  - Delay large payments
  - Chase late payers
  - Arrange short-term overdraft

### 6. Mini Checks Panel
- **Check 1:** Negative months
- **Check 2:** Payment terms and timing (drag and drop)
- **Check 3:** Advantages and disadvantages (drag and drop)


## File Structure

/
└── index.html    # Full Cash Flow Forecast Lab (HTML, CSS, JS in one file)

  No additional assets or external libraries required.

  ## How to Run

  ### Option 1: Open Locally
  - Save `index.html` to your computer.
  - Double-click to open in a modern browser (Chrome, Edge, Firefox, Safari).
  - Runs fully offline.

  ### Option 2: GitHub Pages
  1. Create a new GitHub repository.
  2. Upload `index.html` to the root.
  3. Go to **Settings → Pages**.
  4. Under “Source”, choose **Deploy from a branch** and select your main branch.
  5. After a short time, the lab will be live at:

## Teaching Suggestions

### Starter Ideas
- Show the definition builder and try the sentence without help, then tidy together.
- Use the Entry preset for a simple example with mostly positive cash flow.

### Main Learning Phase
- Give students a short scenario (e.g., café or T-shirt business).
- Ask them to:
- Enter inflows and outflows
- Choose realistic credit terms
- Identify negative months
- Suggest actions using the Interpretation section

### Plenary or Retrieval
- Use Mini checks:
- Payment terms drag-and-drop
- Advantages/disadvantages sort

### Differentiation
- **Lower ability:** Use presets and small numbers.
- **Higher ability:** Redesign the cash flow plan to remove negative months and justify actions.

---

## Accessibility and SEND Considerations
- Dyslexia-friendly font stack
- High readability, calm colours, and spacing
- No audio, minimal motion
- Large click areas
- Drag-and-drop supported, but teacher-led alternatives available
- Short, consistent wording

---

## Development Notes
- All logic in plain JavaScript (no frameworks)
- Simple CSS with responsive grid
- No network calls; all data cleared on reload
- Safe to host on school networks and VLEs

---

## Licence
Free to use, adapt, and remix for educational use in schools and colleges.
