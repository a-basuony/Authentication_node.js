Certainly! Here is a comprehensive README file for your Node.js application:

---

# Node.js Authentication and Authorization Application

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This is a Node.js application that demonstrates user authentication and authorization. It allows users to register, log in, reset passwords, and manage products. The application includes role-based access control to ensure that only authorized users can perform certain actions.

## Features

### User Authentication

- **Registration:** Users can create a new account.
- **Login:** Users can log in using their email and password.
- **Password Reset:** Users can reset their password if they forget it.

### User Authorization

- **Role-Based Access Control:** Different roles (e.g., admin, user) have different permissions.
- **Protected Routes:** Only authenticated users can access certain routes.
- **Ownership Checks:** Users can only edit or delete their own products.

### Product Management

- **Add Product:** Users can add new products.
- **Edit Product:** Users can edit products they have created.
- **Delete Product:** Users can delete products they have created.
- **View Products:** Users can view all products.

### Email Notifications

- **Password Reset Email:** Sends an email to users with a link to reset their password.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/node-auth-app.git
   cd node-auth-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:** Create a `.env` file in the root directory and add the following variables:

   ```
   PORT=3000
   MONGODB_URI=your-mongodb-uri
   SESSION_SECRET=your-session-secret
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-password
   ```

4. **Run the application:**
   ```bash
   npm start
   ```

## Usage

### Registration

- Navigate to `/register`.
- Fill out the registration form and submit.

### Login

- Navigate to `/login`.
- Enter your email and password to log in.

### Password Reset

- Navigate to `/reset`.
- Enter your email to receive a password reset link.
- Click the link in the email and set a new password.

### Product Management

- After logging in, navigate to `/admin/add-product` to add a new product.
- Navigate to `/admin/products` to view and manage your products.
- Edit or delete products as needed.

## Environment Variables

| Variable Name    | Description                             |
| ---------------- | --------------------------------------- |
| `PORT`           | Port number for the server to listen on |
| `MONGODB_URI`    | URI for connecting to MongoDB           |
| `SESSION_SECRET` | Secret key for session management       |
| `EMAIL_USER`     | Email address for sending notifications |
| `EMAIL_PASS`     | Password for the email address          |

## Folder Structure

```
node-auth-app/
│
├── app.js
├── package.json
├── .env
├── controllers/
│   ├── authController.js
│   ├── adminController.js
│   └── shopController.js
├── models/
│   ├── user.js
│   └── product.js
├── routes/
│   ├── auth.js
│   ├── admin.js
│   └── shop.js
├── views/
│   ├── auth/
│   │   ├── login.ejs
│   │   ├── register.ejs
│   │   ├── reset.ejs
│   │   └── new-password.ejs
│   ├── admin/
│   │   ├── add-product.ejs
│   │   ├── edit-product.ejs
│   │   └── products.ejs
│   └── shop/
│       └── product-list.ejs
└── public/
    └── css/
        └── main.css
```

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- EJS
- Nodemailer
- bcryptjs
- express-session
- connect-mongodb-session

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss your ideas.

## License

This project is licensed under the MIT License.

---

Feel free to customize this README to better fit the specifics of your application.
