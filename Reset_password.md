### crypto

node.js has build-in crypto library: for creating secure random values

```javascript
const crypto = require("crypto");
```

### Password Reset Implementation in Node.js

Here's a detailed guide on implementing a password reset functionality in a Node.js application using Express, Mongoose, and Nodemailer.

### 1. Add Reset View

Create a new view file for password reset in your views folder (e.g., `reset.ejs`).

```html
<!-- views/reset.ejs -->
<form action="/reset" method="POST">
  <input type="hidden" name="_csrf" value="<%= csrfToken %>" />
  <div>
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required />
  </div>
  <button type="submit">Reset Password</button>
</form>
```

### 2. Add Controller Actions

Update your `authController.js` with new actions for rendering the reset view and handling the reset request.

```javascript
const crypto = require("crypto");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key: "YOUR_SENDGRID_API_KEY",
    },
  })
);

// Render the reset password view
exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: req.flash("error"),
  });
};

// Handle the reset password request
exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex"); // `buffer` contains 32 random bytes
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        transporter.sendMail({
          to: req.body.email,
          from: "shop@nodecomplete.com",
          subject: "Password Reset",
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
```

````javascript
crypto.randomBytes(32, (err, buffer) => {})
crypto.randomBytes(size, callback)

size: The number of bytes to generate. In this case, 32.
callback: A callback function that is called with two arguments:
err: An error object if an error occurred, or null if there was no error.
buffer: A Buffer object containing the random bytes.

The crypto.randomBytes function is part of Node.js's built-in crypto module, which provides cryptographic functionality.
This function is used to generate cryptographically strong pseudorandom data.
This function is used to create very secure and unpredictable random data that can be used for cryptographic purposes.

##### -------------

const token = buffer.toString('hex');

The Buffer object in Node.js is used to handle binary data. The toString('hex') method converts the contents of the Buffer into a hexadecimal string.
Converts the random bytes in the buffer to a hexadecimal string. This string is then used as a token for the password reset functionality. This ensures that the token is unique and secure.

Example:
const buffer = Buffer.from([1, 2, 3, 4]);
console.log(buffer.toString('hex')); // Output: '01020304'



### 3. Add Routes

Update your `authRoutes.js` to include new routes for rendering the reset view and handling the reset request.

```javascript
const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

module.exports = router;
````

### 4. Update User Model

Add fields for the reset token and its expiration in your user model (e.g., `user.js`).

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
});

module.exports = mongoose.model("User", userSchema);
```

### 5. Update Login View

Add a link to the reset password page in your login view (e.g., `login.ejs`).

```html
<!-- views/login.ejs -->
<a href="/reset">Reset Password</a>
```

### 6. Test the Implementation

1. Start your server and navigate to the login page.
2. Click the "Reset Password" link to go to the reset page.
3. Enter an email address and submit the form.
4. Check the specified email address for the reset email with the reset link.
5. Click the link to be directed to the page where you can set a new password (implementing the page to set a new password is the next step).

### Summary

This implementation covers creating a reset view, setting up routes, generating a secure token, sending a reset email, and updating the user model. Ensure you replace `YOUR_SENDGRID_API_KEY` with your actual SendGrid API key.
