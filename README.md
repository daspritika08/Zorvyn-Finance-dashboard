# Zorvyn-Finance-dashboard
isplays total balance, income, and expenses through summary cards.
Finance Dashboard UI
A responsive, client-side finance management dashboard built for tracking income, expenses, and visual analytics. This project was developed as a technical assessment to demonstrate modern CSS layouts, JavaScript state management, and data visualization.

Key Features
Dashboard Overview: Real-time calculation of Total Balance, Income, and Expenses.

Transaction Management: Full CRUD (Create, Read, Update, Delete) functionality for financial records.

Data Visualization: Integration with Chart.js to provide Monthly Balance trends and Expense distribution (Doughnut chart).

Dark Mode: A custom-themed dark interface that persists across page reloads.

Responsive Design: A mobile-first approach featuring a toggleable sidebar and adaptive grid layouts.

Local Persistence: Data is saved to the browser's localStorage, ensuring no data loss on refresh.

Tech Stack
HTML5: Semantic structure for accessibility.

CSS3: Custom properties (variables), Flexbox, and CSS Grid for layout.

JavaScript (Vanilla): Functional logic for data handling and DOM manipulation.

Chart.js: External library for rendering high-performance data charts.

Google Fonts & Material Icons: For clean typography and iconography.

Getting Started
Clone the repository or download the source files.

Ensure your file structure contains:

index.html

style.css

script.js

An images/ folder for transaction category icons.

Open index.html in any modern web browser.

Project Structure
State Management: The application maintains a central state for transactions, filters, and user preferences.

Theme Engine: A light/dark toggle system that modifies root CSS variables.

Modular Rendering: Separate functions handle the updating of the transaction list, summary cards, and chart data to keep the logic organized.

Future Enhancements
Implementation of a backend API for multi-device synchronization.

Export functionality (CSV/PDF) for financial reports.

Extended filtering by custom date ranges and keyword tags.

Author
Pritika Das
B.Tech Computer Science (Cyber Security)
