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
├── config/                           # Configuration files
│   └── database.js                   # Database connection
├── model/                            # MongoDB models
├── routes/                           # Route handlers
│   ├── adminRoutes.js                # Admin route handlers
│   ├── frontRoutes.js                # Frontend route handlers
│   ├── user-page-routes.js           # User page routes
│   ├── appointment-handling-routes.js # Appointment routes
│   ├── status-page-routes.js         # Status page routes
│   └── testingEmailRoutes.js         # Email testing routes
├── scripts/                          # Utility scripts
│   └── admin-creation.js             # Admin account setup script
├── utils/                            # Helper utilities
│   └── sendMailer.js                 # Email/mailer service
├── views/                            # HTML/template views
├── Public/                           # Static assets (CSS, JS, images)
├── app.js                            # Express app entry point
├── package.json                      # Node.js dependencies
├── .gitignore
└── README.md
```

---

## License

This project is private and intended for internal use by Barangay 496 only. Unauthorized access, distribution, or reproduction is not permitted.