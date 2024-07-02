### What is Authentication?

Authentication is the process of verifying the identity of a user accessing an application. It ensures that only authenticated users can perform certain actions, while anonymous users (visitors who are not logged in) have restricted access. For example, anyone can view products, but only logged-in users can create, manage, or place orders.

### Why is Authentication Needed?

Authentication differentiates between anonymous and logged-in users, enabling the application to:

- Provide public access to certain features (e.g., viewing products).
- Restrict access to sensitive actions (e.g., creating or managing products, placing orders) to authenticated users.

### How is Authentication Implemented?

1. **Sign-Up**:

   - Users sign up by providing their email and password.
   - This information is stored in the database.

2. **Login Request**:

   - Users send a login request with their email and password.

3. **Credential Verification**:

   - The server checks if the email and password match the records in the database.

4. **Session Creation**:

   - If credentials are valid, the server creates a session for the user.
   - The session is essential to maintain the user's authenticated state across multiple HTTP requests, which are inherently stateless.

5. **Response and Cookie Storage**:

   - The server returns a success response (HTTP 200) and stores a session cookie on the client's browser.
   - This cookie is sent with every subsequent request to maintain the session.

6. **Access Control**:
   - For each request, the server checks the session cookie to determine if the user is logged in.
   - Authenticated users are granted access to restricted routes and resources.

### Example in Traditional Web Applications

In traditional web applications (e.g., those using EJS or Handlebars for templating), session-based authentication is commonly used. This involves rendering views and managing sessions to ensure that users stay logged in as they navigate through different parts of the application.

### Summary

Authentication involves verifying user identities to control access to various parts of a web application. It typically involves user sign-up, login, credential verification, session creation, and access control using cookies and sessions. This ensures a secure and user-friendly experience, restricting sensitive actions to authenticated users only.

Authentication is the process of verifying the identity of a user or system. In the context of web development, particularly with Node.js and full-stack JavaScript, authentication ensures that users accessing your application are who they claim to be. This is a critical aspect of web security and user management.

### Types of Authentication

1. **Basic Authentication**: The user's credentials (username and password) are sent with each request. It is simple but not very secure, especially if not used over HTTPS.

2. **Token-Based Authentication**: Involves the use of tokens (like JWT - JSON Web Tokens). Upon successful login, the server issues a token to the client. The client then includes this token in the header of subsequent requests. Tokens can be verified without requiring the server to store session data, making it stateless.

3. **Session-Based Authentication**: The server creates a session for a user upon login and stores session information on the server. The session ID is sent to the client as a cookie, which the client includes in subsequent requests. The server uses this ID to retrieve the session data and verify the user.

4. **OAuth**: A protocol for token-based authentication and authorization. It is commonly used for allowing users to log in with their accounts from other services (e.g., Google, Facebook).

5. **Multi-Factor Authentication (MFA)**: Requires multiple forms of verification to log in, such as a password plus a code sent to a user's phone.

### Implementing Authentication in Node.js

Here’s a high-level overview of how you might implement authentication in a Node.js application:

1. **Setting Up**: Use frameworks like Express.js for handling requests and middleware.

2. **User Registration**: Create endpoints to handle user registration. Hash and store passwords securely using libraries like `bcrypt`.

3. **Login**: Create login endpoints to verify user credentials. If valid, generate and send a token (for token-based authentication) or create a session.

4. **Protect Routes**: Middleware to protect certain routes, ensuring only authenticated users can access them. For token-based, verify tokens. For session-based, check session IDs.

### Example: Token-Based Authentication with JWT

**Dependencies:**

- Express
- bcrypt
- jsonwebtoken

**Setup:**

```javascript
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const secretKey = "your-secret-key";

app.use(express.json());

const users = []; // Simulated user database

// User registration endpoint
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).send("User registered");
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Protected route example
app.get("/protected", authenticateToken, (req, res) => {
  res.send("This is a protected route");
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

### Best Practices

- **Secure Storage**: Never store passwords in plain text. Always hash them before storing.
- **HTTPS**: Always use HTTPS to encrypt data in transit.
- **Token Expiry**: Set expiry times for tokens to limit their lifespan in case of exposure.
- **Session Management**: Properly manage sessions and invalidate them on logout.
- **Environment Variables**: Store sensitive information like secret keys in environment variables.

## By implementing robust authentication mechanisms, you ensure that only authorized users can access your application's resources, enhancing overall security and user trust.

### Encrypting passwords

1- install : npm install --save bcryptjs

In the previous lecture, we added a basic authentication and signup flow but encountered a major security flaw: storing passwords in plain text. This is highly insecure because if the database is compromised or accessed by unauthorized personnel, user passwords are exposed.

To secure passwords, we need to encrypt them using a one-way hashing method, making it impossible to reverse-engineer the original password. This way, even if the database is accessed, only the hashed version of the password is visible, not the actual password.

### Steps to Implement Secure Password Storage:

1. **Install bcryptjs**:

   - Stop the server.
   - Install the package using `npm install --save bcryptjs`.
   - Restart the server.

2. **Use bcryptjs for Hashing**:

   - Import bcryptjs in the authentication controller: `const bcrypt = require('bcryptjs');`
   - In the signup process, instead of storing the password directly, use bcrypt to hash the password.

3. **Hashing Process**:

   - Use `bcrypt.hash(password, 12)` where `12` is the salt value specifying the number of hashing rounds (a value of 12 is considered highly secure).
   - The `hash` method returns a promise. Use a `.then` block to handle the hashed password once the hashing is complete.
   - Store the hashed password in the database instead of the plain text password.

4. **Test the Implementation**:
   - Sign up with a new email to create a new user.
   - Check the database to confirm that the stored password is a hashed value, not the original password.

This approach ensures that user passwords are stored securely, protecting them even if the database is compromised. The hashed password cannot be decrypted, thus safeguarding the original passwords.

For further improvements, ensure that error handling is added to notify users if the signup fails due to duplicate emails or other issues.

<!-- Example -->

```javascript
// User registration (signup) endpoint
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).send("User registered");
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send("Internal server error");
  }
});

// User login (signin) endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }
    const match = await bcrypt.compare(password, user.password); // Comparing the hashed password
    if (match) {
      res.status(200).send("Login successful");
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Internal server error");
  }
});
```

Certainly! If you want to use `email` instead of `username` for user registration and login in your Express application with Mongoose and `bcrypt`, here’s how you can do it:

### Updated User Registration (`/register`) Endpoint

1. **Endpoint**: `POST /register`
2. **Changes**:
   - Modify the request body to accept `email` and `password`.
   - Hash the `password` using `bcrypt.hash(password, 10)`.
   - Create a new `User` instance with the hashed password and email.
   - Save the user to MongoDB with `newUser.save()`.

Here’s how you can update the endpoint:

```javascript
const bcrypt = require("bcrypt");
const User = require("./models/User"); // Assuming you have a User model

// User registration endpoint with email
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with hashed password and email
    const newUser = new User({ email, password: hashedPassword });

    // Save the new user to the database
    await newUser.save();

    // Send a successful registration response
    res.status(201).send("User registered");
  } catch (err) {
    // Handle errors
    console.error("Error registering user:", err);
    res.status(500).send("Internal server error");
  }
});
```

### Updated User Login (`/login`) Endpoint

1. **Endpoint**: `POST /login`
2. **Changes**:
   - Modify the request body to accept `email` and `password`.
   - Find the user in MongoDB using `User.findOne({ email })`.
   - Compare the provided `password` with the stored hashed password using `bcrypt.compare()`.

Here’s how you can update the login endpoint:

```javascript
// User login endpoint with email
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });

    // If user not found, return Unauthorized
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    // Compare passwords
    const match = await bcrypt.compare(password, user.password);

    // If passwords match, return OK
    if (match) {
      res.status(200).send("Login successful");
    } else {
      // If passwords don't match, return Unauthorized
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    // Handle errors
    console.error("Error during login:", err);
    res.status(500).send("Internal server error");
  }
});
```

### Summary

- **Registration**: Uses `email` and `password` for creating a new user. Hashes the `password` using `bcrypt.hash()` before saving it to the database.
- **Login**: Uses `email` and `password` for authenticating users. Retrieves the user by `email` from the database and compares the provided `password` with the hashed password using `bcrypt.compare()`.

Ensure your `User` model and database schema are updated to store and query users by `email`. This approach enhances security by securely handling passwords and integrating them with your Express and Mongoose application. Adjust error handling and response messages based on your application's specific requirements and best practices.
