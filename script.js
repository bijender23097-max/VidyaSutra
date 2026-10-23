/* Vidya Sutra Campus — Login & Signup Controller */
"use strict";
(function () {
  const auth = window.VidyaSutraAuth;
  if (!auth) return;

  const feedbackEl = document.getElementById("authFeedback");
  function showFeedback(message, type = "error") {
    if (!feedbackEl) return;
    feedbackEl.textContent = message;
    feedbackEl.className = `auth-feedback ${type}`;
    feedbackEl.classList.remove("hidden");
  }

  // Toggle password visibility
  const toggleBtn = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";
      passwordInput.type = isPassword ? "text" : "password";
      toggleBtn.setAttribute("aria-pressed", String(isPassword));
      toggleBtn.textContent = isPassword ? "◎" : "◉";
    });
  }

  // Instant Demo Login helper
  function loginAsDemo(providerName) {
    const demoUser = {
      fullName: providerName ? `Aarav Kumar (${providerName})` : "Aarav Kumar",
      email: "aarav.kumar@kiet.edu",
      teachSkills: "Git & GitHub, Python, C++, HTML & CSS",
      learnSkills: "LLMs, Ethical Hacking, UI/UX Design"
    };
    auth.setSession(demoUser, true);
    window.location.replace("dashboard.html");
  }

  // Check URL params for ?demo=1 or ?required=1
  const params = new URLSearchParams(window.location.search);
  if (params.get("demo") === "1") {
    loginAsDemo();
    return;
  }
  if (params.get("required") === "1") {
    showFeedback("Please log in or click 'Instant Demo Login' to access the workspace.", "error");
  }

  // 1-Click Demo Button
  const demoBtn = document.getElementById("demoLoginBtn");
  if (demoBtn) {
    demoBtn.addEventListener("click", () => loginAsDemo());
  }

  // Social Login Buttons
  document.querySelectorAll("[data-social-provider]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const provider = btn.getAttribute("data-social-provider");
      loginAsDemo(provider);
    });
  });

  // Forgot Password handler
  const forgotLink = document.getElementById("forgotPasswordLink");
  if (forgotLink) {
    forgotLink.addEventListener("click", async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById("email");
      const email = auth.normalizedEmail(emailInput ? emailInput.value : "");
      if (!email) {
        showFeedback("Enter your registered email address first, then click Forgot password.", "error");
        emailInput?.focus();
        return;
      }
      const account = auth.getAccountByEmail(email);
      if (!account) {
        showFeedback("No local account found with that email. Use Sign Up or Instant Demo Login.", "error");
        return;
      }
      const newPass = "vidya123";
      const { salt, passwordHash } = await auth.hashPassword(newPass);
      const accounts = auth.readAccounts().map((acc) =>
        auth.normalizedEmail(acc.email) === email ? { ...acc, salt, passwordHash } : acc
      );
      auth.writeAccounts(accounts);
      if (passwordInput) passwordInput.value = newPass;
      showFeedback(`Password reset to "${newPass}" for this demo. Click Log In to continue!`, "success");
    });
  }

  // Handle Login Form
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = auth.normalizedEmail(document.getElementById("email")?.value);
      const password = document.getElementById("password")?.value || "";
      const remember = Boolean(document.getElementById("remember")?.checked);

      if (!email || !password) {
        showFeedback("Please enter both your email and password.");
        return;
      }

      const account = auth.getAccountByEmail(email);
      if (!account) {
        showFeedback("Account not found. Click 'Sign Up' or 'Instant Demo Login' below.");
        return;
      }

      try {
        const { passwordHash } = await auth.hashPassword(password, account.salt);
        if (passwordHash !== account.passwordHash) {
          showFeedback("Incorrect password. Click 'Forgot password?' to reset it.");
          return;
        }
        auth.setSession({
          fullName: account.fullName,
          email: account.email,
          teachSkills: account.teachSkills,
          learnSkills: account.learnSkills
        }, remember);
        window.location.replace("dashboard.html");
      } catch (err) {
        showFeedback(err.message || "Could not verify login.");
      }
    });
  }

  // Handle Signup Form
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fullName = String(document.getElementById("fullName")?.value || "").trim();
      const email = auth.normalizedEmail(document.getElementById("email")?.value);
      const teachSkills = String(document.getElementById("teachSkills")?.value || "").trim();
      const learnSkills = String(document.getElementById("learnSkills")?.value || "").trim();
      const password = document.getElementById("password")?.value || "";

      if (!fullName || !email || password.length < 6) {
        showFeedback("Please enter your name, a valid email, and a password of at least 6 characters.");
        return;
      }

      if (auth.getAccountByEmail(email)) {
        showFeedback("An account with this email already exists. Please log in instead.");
        return;
      }

      try {
        const { salt, passwordHash } = await auth.hashPassword(password);
        const accounts = auth.readAccounts();
        const newAccount = { fullName, email, teachSkills, learnSkills, salt, passwordHash, createdAt: Date.now() };
        accounts.push(newAccount);
        auth.writeAccounts(accounts);
        auth.setSession({ fullName, email, teachSkills, learnSkills }, true);
        window.location.replace("dashboard.html");
      } catch (err) {
        showFeedback(err.message || "Could not create account.");
      }
    });
  }
})();