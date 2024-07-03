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
