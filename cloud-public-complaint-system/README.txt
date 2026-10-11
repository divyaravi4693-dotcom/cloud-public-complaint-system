CIVICCONNECT
Cloud-Based Public Complaint Registration and Tracking System
=============================================================

PROJECT FILES
-------------
index.html  - Page structure and complaint registration/tracking interface
style.css   - Styling, layout, colors, responsive design
script.js   - Form validation, reference ID creation, status lookup, and browser storage

HOW TO RUN
----------
Option 1: Double-click index.html to open it in your web browser.

Option 2: In Visual Studio Code:
1. Open the project folder.
2. Open index.html.
3. If you have the Live Server extension, right-click index.html.
4. Select "Open with Live Server".

FEATURES
--------
- Register a public complaint with contact, category, location, title, and details.
- Generate a complaint reference ID (CC-XXXXXX).
- Track complaints using the reference ID.
- View complaint records and filter by status.
- See summary counts for total, pending, and resolved complaints.
- Responsive layout for desktop and mobile screens.
- Stores demo complaint records in browser localStorage.

IMPORTANT PROJECT LIMITATION
----------------------------
This ZIP is a front-end demonstration for learning and college project use.
It does NOT currently connect to a real cloud service or government system.
Data is saved only in the current browser on the current device. There is no
backend server, cloud database, real staff/admin login, email/SMS notification,
or secure multi-user access. Do not enter sensitive real personal information.

To make it a true cloud-based system, connect a backend and a database such as
AWS (for example, API Gateway + Lambda + DynamoDB) and add authentication,
authorization, validation, and appropriate security controls.
