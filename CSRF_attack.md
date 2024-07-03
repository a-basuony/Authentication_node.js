### Understanding CSRF Attacks and Protection in Simple Terms

#### What is a CSRF Attack?

**CSRF** (Cross-Site Request Forgery) is when a bad actor tricks a user into making an unwanted request to your web application, using the user's own credentials.

#### How Does a CSRF Attack Work?

1. **User Logs In**:

   - A user logs into your website (e.g., a banking app), creating a session with a special cookie that keeps them logged in.

2. **User is Tricked**:

   - The user is tricked into visiting a fake website (e.g., through a link in an email).
   - This fake site has hidden forms or scripts that send requests to your real website.

3. **Fake Requests Sent**:

   - The fake site sends a request to your real website, using the user's session cookie.
   - Your website thinks this request is from the legitimate user and processes it, such as transferring money or placing an order.

4. **Unwanted Actions Happen**:
   - The user unknowingly performs actions they didn't intend, like sending money to the attacker.

#### Why is CSRF Effective?

- The attack works because your website trusts the user's session cookie, even though the request came from a different site.
- The user doesn't realize anything is happening because the attack is hidden.

#### How to Protect Against CSRF?

**CSRF Tokens**:

- A CSRF token is a secret, unique value that your server generates for each session.
- This token is included in forms and requests within your website.

#### How CSRF Tokens Work:

1. **Generate Token**:

   - When the user loads a form (e.g., a transfer money form), your server includes a CSRF token in that form.

2. **Include Token in Requests**:

   - When the user submits the form, the token is sent back to the server with the request.

3. **Validate Token**:
   - Your server checks the token to ensure the request came from your website.
   - If the token is missing or incorrect, the server rejects the request.

#### Simple Example:

1. **User Logs In**:

   - User logs into your banking app and gets a session cookie.

2. **Fake Website**:

   - User visits a fake website that looks like your banking app.
   - The fake site has a hidden form that sends a transfer money request to your real website.

3. **Without Protection**:

   - Your real website sees the session cookie and processes the transfer money request.

4. **With CSRF Token**:
   - The fake site cannot generate the correct CSRF token.
   - Your real website rejects the request because the CSRF token is missing or wrong.

By using CSRF tokens, you ensure that only requests coming from your actual website, with the correct token, are processed, preventing attackers from making unauthorized requests.

### install: csurf (npm install --save csurf)

    - app.js =>
        const csrf = require("csurf")
        const csrfProtection = csrf()

        app.use(csrfProtection)

    - shop.js =>
        getIndex =>
            res.render('shop/index', {
                csrfToken: req.csrfToken() // generate a token and store it in csrfToken to use it in view
            })
        navigation =>
            logout form => You need to add this to ensure that your sessions don't get stolen.
                <input type="hidden" name="_csrf" value="<%= csrfToken %>"/>  // value=> the generated token
                    - must name attribute should be _csrf
                    - must value to hold the generated token
                    - we must have to do to add that input in all our forms it is not optional
                        (navigation, add-to-cart, edit-product, login, signup, product, cart, index.ejs in shop)

    - Adding CSRF Token to All Views, instead of shop.js to add csrfToken in every rendered view (res.render())
        -Instead of adding csrfToken to each render function, use a middleware to set it for all views:
            app.use((req, res, next) => {
                res.locals.isAuthenticated = req.session.isLoggedIn
                res.locals.csrfToken = req.csrfToken();
                next();
            });

---

### CSRF Protection in Simple Terms

#### What is CSRF?

**CSRF (Cross-Site Request Forgery)** is a type of attack where a malicious website tricks a user into performing unwanted actions on another website where the user is authenticated.

#### How Does CSRF Work?

1. **User Logs In**: A user logs into your site, establishing a session with a cookie.
2. **User Visits Malicious Site**: The user is tricked into visiting a malicious site.
3. **Malicious Requests**: The malicious site sends requests to your server using the user's session cookie.
4. **Unwanted Actions**: The user's session is used to perform actions they didn't intend.

#### How to Protect Against CSRF?

**CSRF Tokens**: These are unique tokens generated for each session and included in forms on your site. They ensure requests come from your site and not a malicious one.

### Steps to Implement CSRF Protection

1. **Install `csurf` Package**:

   ```bash
   npm install --save csurf
   ```

2. **Set Up CSRF Middleware**:

   In your `app.js` file:

   ```javascript
   const csrf = require("csurf");
   const csrfProtection = csrf();

   // After initializing session
   app.use(csrfProtection);
   ```

3. **Include CSRF Token in Views**:

   In your controller (e.g., `getIndex`):

   ```javascript
   res.render("index", { csrfToken: req.csrfToken() });
   ```

4. **Add CSRF Token to Forms**:

   In your EJS template (e.g., `navigation.ejs`):

   ```html
   <form action="/logout" method="POST">
     <input type="hidden" name="_csrf" value="<%= csrfToken %>" />
     <button type="submit">Logout</button>
   </form>
   ```

5. **Ensure Token is in All Forms**:

   - For every form that changes data, include the CSRF token as a hidden input.
   - Example for a login form:
     ```html
     <form action="/login" method="POST">
       <input type="hidden" name="_csrf" value="<%= csrfToken %>" />
       <input type="text" name="email" />
       <input type="password" name="password" />
       <button type="submit">Login</button>
     </form>
     ```

6. **Simplify Adding CSRF Token to All Views**:

   Instead of adding `csrfToken` to each render function, use a middleware to set it for all views:

   ```javascript
   app.use((req, res, next) => {
     res.locals.csrfToken = req.csrfToken();
     next();
   });
   ```

### Summary

- **Install and set up `csurf` package** to generate and check CSRF tokens.
- **Include CSRF tokens in all forms** that perform actions affecting the backend.
- **Use middleware to automatically provide the token** to all views, making it easier to include in forms.

By following these steps, you can protect your application from CSRF attacks, ensuring that only legitimate requests from your site are processed.

### Ensuring CSRF Token and Authentication Status on Every Page

To make sure the CSRF token and authentication status are available on every page, you can set up a middleware in your `app.js` file. This middleware will attach the CSRF token and authentication status to the local variables accessible in your views. Here's how you can do it:

1. **Set Up Middleware in `app.js`**:
   Add a middleware function to attach the CSRF token and authentication status to the response locals.

   ```javascript
   // Add this middleware after extracting the user and before defining your routes
   app.use((req, res, next) => {
     res.locals.isAuthenticated = req.session.isLoggedIn;
     res.locals.csrfToken = req.csrfToken();
     next();
   });
   ```

2. **Use CSRF Token in Forms**:
   Update your forms in the views to include the CSRF token as a hidden input. This is crucial for every form that sends data via POST requests.

   **Example for Navigation (logout form)**:

   ```html
   <form action="/logout" method="POST">
     <input type="hidden" name="_csrf" value="<%= csrfToken %>" />
     <button type="submit">Logout</button>
   </form>
   ```

   **Example for Login Form**:

   ```html
   <form action="/login" method="POST">
     <input type="hidden" name="_csrf" value="<%= csrfToken %>" />
     <input type="email" name="email" required />
     <input type="password" name="password" required />
     <button type="submit">Login</button>
   </form>
   ```

   **Example for Add to Cart Form**:

   ```html
   <form action="/cart" method="POST">
     <input type="hidden" name="_csrf" value="<%= csrfToken %>" />
     <input type="hidden" name="productId" value="<%= product._id %>" />
     <button type="submit">Add to Cart</button>
   </form>
   ```

3. **Repeat for All Forms**:
   Make sure every form that performs a sensitive action (e.g., login, signup, add to cart, delete item) includes the CSRF token. Here’s how to do it in various views:

   **Admin Edit Product Form**:

   ```html
   <form action="/admin/edit-product" method="POST">
     <input type="hidden" name="_csrf" value="<%= csrfToken %>" />
     <!-- Other form fields -->
   </form>
   ```

   **Delete Product Form**:

   ```html
   <form action="/admin/delete-product" method="POST">
     <input type="hidden" name="_csrf" value="<%= csrfToken %>" />
     <input type="hidden" name="productId" value="<%= product._id %>" />
     <button type="submit">Delete</button>
   </form>
   ```

   **Order Now Button**:

   ```html
   <form action="/create-order" method="POST">
     <input type="hidden" name="_csrf" value="<%= csrfToken %>" />
     <button type="submit">Order Now</button>
   </form>
   ```

### Testing the Implementation

1. **Check All Pages**: Make sure every page with a form includes the CSRF token.
2. **Submit Forms**: Test submitting each form to ensure the CSRF protection works.
3. **Inspect Elements**: Use browser developer tools to inspect the forms and ensure the hidden input for CSRF token is present.

### Conclusion

Adding CSRF protection ensures that only legitimate requests from your site's forms can alter data. This is essential for securing your application and preventing malicious actions. By following these steps, you ensure that every form and route in your application is protected from CSRF attacks.
