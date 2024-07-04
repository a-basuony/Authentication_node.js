const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const User = require("../models/user");

const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "invalid email!");
        return res.redirect("/login");
      }
      bcrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        }
        req.flash("error", "invalid password!");
        res.redirect("/login");
      });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash(
          "error",
          "E-mail exists already, please pick a different one."
        );
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12) // the number of hashing rounds (higher is more secure but slower) (a value of 12 is considered highly secure).
        .then((hashedPassword) => {
          return User.create({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
        });
    })

    .then((result) => {
      res.redirect("/login");
      return transporter.sendMail({
        to: email,
        from: "Ahmed@gmail.com",
        subject: "Signup succeeded!",
        html: "<h1>You successfully signed up!</h1>",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    // A hexadecimal string containing random bytes.
    // toString('hex') method converts the contents of the Buffer into a hexadecimal string.
    //A Buffer object containing the random bytes.

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account found with this email!");
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
          from: "Ahmed@gmail.com",
          subject: "Password Reset",
          html: `
          <p>You requested a password reset.</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          <p>If you didn't request a password reset, please ignore this email.</p>
        `,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
