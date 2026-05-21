# Barangay Management System

A full-stack Barangay Management System designed to digitize and streamline barangay operations. This system supports document requests, complaint submissions, and appointment scheduling, serving over 500+ residents.

---

## Project Overview

The platform modernizes the interaction between residents and barangay offices by providing secure online access to essential services. It includes dedicated portals for Residents, Barangay Staff, and Barangay Officials, each with appropriate role-based permissions.

---

### Main Website Interface

![Main Website](https://raw.githubusercontent.com/AlFrancis-Dagaang/Barangay-496-Website/main/Public/images/brgy-front.png)

### Verification Page

![Verification Page](https://raw.githubusercontent.com/AlFrancis-Dagaang/Barangay-496-Website/main/Public/images/brgy-ver.png)

---

## Features

### Resident Features
- Request barangay documents (e.g., Indigency, Clearance, Residency)
- Submit complaints with optional attachments
- Book appointments with barangay staff or officials
- Track request and complaint status

### Staff and Admin Features
- Process and manage document requests
- View, update, and respond to complaints
- Manage appointment schedules
- Generate and print barangay documents

### Security and Authentication
- Secure login system built with Node.js
- Role-Based Access Control (RBAC) for residents, staff, and officials
- Protected routes and validated user inputs

---

## Tech Stack

**Frontend**
- HTML
- CSS
- JavaScript

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB

---

## Project Structure

```
Barangay-496-Website/
├── Public/                           # Static assets (CSS, JS, images)
├── model/                            # MongoDB models
├── views/                            # HTML/template views
├── app.js                            # Express app entry point
├── index.html                        # Main HTML entry
├── database.js                       # Database connection
├── adminRoutes.js                    # Admin route handlers
├── frontRoutes.js                    # Frontend route handlers
├── user-page-routes.js               # User page routes
├── appointment-handling-routes.js    # Appointment routes
├── status-page-routes.js             # Status page routes
├── testingEmailRoutes.js             # Email testing routes
├── sendMailer.js                     # Email/mailer service
├── admin-creation.js                 # Admin account setup script
├── existing-data-base-creation.js    # Database seeding script
├── Barangay-Certificate.pdf          # Sample certificate template
├── package.json                      # Node.js dependencies
└── .gitignore
```

---

## Installation and Setup

```bash
# Clone the repository
git clone https://github.com/AlFrancis-Dagaang/Barangay-496-Website.git

# Navigate to project folder
cd Barangay-496-Website

# Install dependencies
npm install

# Start the server
npm start
```

---

## License

This project is open source and available under the [MIT License](LICENSE).
