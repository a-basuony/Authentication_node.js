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
