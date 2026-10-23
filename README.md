# SkillSwap Campus — Original UI + Local Signup/Login Demo

This edition preserves the supplied landing page, login page, and signup page design. Their original CSS colors/layouts and supplied images are retained. The landing/login/signup links and JavaScript behavior are wired to a browser-local demo account flow. Only the post-login SkillSwap workspace (`dashboard.html`) receives a blue-and-teal theme and uses the supplied campus-learning image in its hero.

## Files

- `index.html` + `home.css` — original welcome page with Log In and Sign Up buttons.
- `login.html` + `style.css` + `script.js` — original login frontend with local account validation.
- `signup.html` + `signup.css` + `signup.js` — original signup frontend with browser-local registration and confirmation message.
- `auth-utils.js` — shared local storage and password-hashing helpers.
- `dashboard.html` + `styles.css` + `dashboard-theme.css` + `app.js` — the SkillSwap workspace; its added theme only affects this page.
- `auth-guard.js` — redirects visitors who are not logged in and handles logout.
- `landing-bg.png`, `campus.png`, `meet.png` — supplied artwork.

## Run locally

Recommended: use VS Code with the Live Server extension. Open this folder in VS Code, right-click `index.html`, and choose **Open with Live Server**. Keep the same localhost URL/origin for every page so browser storage is shared.

Alternatively, from this folder run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Test the flow

1. Open `index.html` and click **Sign Up**.
2. Complete the required fields, make sure both passwords match, and accept the community guidelines.
3. You should see a success message, then be sent to Log In.
4. Log in with the same email and password. A successful login opens `dashboard.html`.
5. Use the arrow/logout button in the dashboard header to return to the landing page.
6. Open **My profile** to see the registered name and skill lists.

A repeated email is rejected. A wrong password shows an error. Google/GitHub login and password reset display an explanatory message because those features need a backend and provider setup.

## Local storage and security

This is an educational frontend demo. Student profile fields and a salted PBKDF2-SHA-256 password hash are saved in this browser's `localStorage`; the raw password is not saved. The current login session uses `sessionStorage`, unless **Remember me** is checked. Accounts do not synchronize to other devices or browsers, and browser storage can be inspected or changed by its user. Do not enter a real password or sensitive student information.

For real campus use, implement server-side authentication, a database, secure HTTP-only session cookies, password reset, OAuth configuration, rate limiting, validation, and moderation. This demo is not production-grade security.

## Reset the demo

In browser Developer Tools → Application/Storage, delete `skillswap-local-accounts-v1`, `skillswap-auth-session-v1`, and keys beginning with `skillswap-campus-demo-v1:`. Also clear the current tab's Session Storage `skillswap-auth-session-v1` if needed.
