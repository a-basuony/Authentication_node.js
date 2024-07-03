# install:

    npm install --save connect-flash

    app.js =>
        const flash = require('connect-flash')
        app.use(flash())

    auth.js (controller) =>

        1- getLogin

```javascript
// exports.getLogin = (req, res, next) => {
res.render("auth/login", {
  // path: "/login",
  // pageTitle: "Login",
  errorMessage: req.flash("error"),
});
// };
```

        2- postLogin

```javascript
// exports.postLogin = (req, res, next) => {
//   const { email, password } = req.body;
// User.findOne({ email })
//     .then((user) => {
if (!user) {
  req.flash("error", "invalid email or password");
  //   return res.redirect("/login");
}
//             bcrypt.compare(password, user.password).then((doMatch) => {
//         if (doMatch) {
//           req.session.isLoggedIn = true;
//           req.session.user = user;
//           return req.session.save((err) => {
//             console.log(err);
//             res.redirect("/");
//           });
//         }
//         res.redirect("/login");
//       });
//     })
//     .catch((err) => console.log(err));
// };
```

### Improving User Experience with Error Messages

Currently, when users encounter issues like entering invalid credentials or trying to create an account with an already existing email, they are simply redirected without any error messages. To enhance the user experience, we need to display these error messages. Here’s how to achieve this:

#### Problem: Handling Redirects with Error Messages

When redirecting after an error, such as an invalid login, the new request doesn't carry the error information. We need a way to store this information temporarily and display it on the redirected page.

#### Solution: Using Sessions and Flash Messages

To store error messages temporarily, we can use sessions. Specifically, we use the `connect-flash` package which allows us to flash a message to the session and automatically remove it after it has been displayed.

### Steps to Implement Flash Messages

1. **Install `connect-flash`**:

   ```bash
   npm install --save connect-flash
   ```

2. **Initialize `connect-flash` in `app.js`**:
   Import and use `connect-flash` after initializing the session middleware.

   ```javascript
   const flash = require("connect-flash");
   app.use(flash());
   ```

3. **Flash an Error Message**:
   In your `auth.js` route handler, flash an error message when an error occurs, such as an invalid login.

   ```javascript
   if (!user) {
     req.flash("error", "Invalid email or password.");
     return res.redirect("/login");
   }
   ```

4. **Pass Flash Messages to Views**:
   Create a middleware to pass flash messages and authentication status to all views.

   ```javascript
   app.use((req, res, next) => {
     res.locals.isAuthenticated = req.session.isLoggedIn;
     res.locals.csrfToken = req.csrfToken();
     res.locals.errorMessage = req.flash("error");
     next();
   });
   ```

5. **Display Error Messages in the View**:
   Update your views to display the error message if it exists. For example, in `login.ejs`:
   ```html
   <% if (errorMessage.length > 0) { %>
   <div class="alert alert-danger"><%= errorMessage[0] %></div>
   <% } %>
   ```

### Summary

- **Enhancing User Experience**: By providing immediate feedback through error messages, users understand what went wrong and how to correct it.
- **Using `connect-flash`**: This package simplifies storing temporary messages in the session, which get removed once they are used.
- **Middleware for Globals**: Setting up a middleware ensures that essential information like CSRF tokens and flash messages are available in every view, improving maintainability and consistency across the application.

This approach ensures users get relevant feedback, improving the overall usability and security of the application.
