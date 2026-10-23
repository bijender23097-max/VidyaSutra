/* SkillSwap Campus — browser-local demo registration */
"use strict";

(function () {
  const signupForm = document.querySelector("#signup-form");
  const passwordInput = document.querySelector("#password");
  const confirmPasswordInput = document.querySelector("#confirm-password");
  const formMessage = document.querySelector("#form-message");

  function showMessage(message, kind = "info") {
    if (!formMessage) return;
    formMessage.textContent = message;
    formMessage.dataset.kind = kind;
    formMessage.classList.add("visible");
  }

  function hideMessage() {
    if (!formMessage) return;
    formMessage.textContent = "";
    formMessage.classList.remove("visible");
    delete formMessage.dataset.kind;
  }

  document.querySelectorAll("[data-toggle-password]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.togglePassword);
      if (!input) return;
      const willShow = input.type === "password";
      input.type = willShow ? "text" : "password";
      button.textContent = willShow ? "Hide" : "Show";
      button.setAttribute("aria-label", `${willShow ? "Hide" : "Show"} ${input.id === "password" ? "password" : "confirm password"}`);
    });
  });

  function validatePasswordMatch() {
    if (!passwordInput || !confirmPasswordInput) return;
    confirmPasswordInput.setCustomValidity(
      confirmPasswordInput.value && confirmPasswordInput.value !== passwordInput.value
        ? "Your passwords do not match."
        : ""
    );
  }

  passwordInput?.addEventListener("input", validatePasswordMatch);
  confirmPasswordInput?.addEventListener("input", validatePasswordMatch);
  signupForm?.addEventListener("input", hideMessage);
  signupForm?.addEventListener("change", hideMessage);

  signupForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideMessage();
    validatePasswordMatch();

    if (!signupForm.checkValidity()) {
      signupForm.reportValidity();
      return;
    }

    const formData = new FormData(signupForm);
    const data = Object.fromEntries(formData.entries());
    const email = SkillSwapAuth.normalizedEmail(data.email);
    const accounts = SkillSwapAuth.readAccounts();

    if (accounts.some((account) => SkillSwapAuth.normalizedEmail(account.email) === email)) {
      showMessage("An account with this email already exists in this browser. Go to Log In instead.", "error");
      return;
    }

    const submitButton = signupForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.innerHTML : "Create Account →";
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Creating your account…";
    }

    try {
      const passwordResult = await SkillSwapAuth.hashPassword(String(data.password));
      const account = {
        id: (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : `student-${Date.now()}`,
        fullName: String(data.fullName || "").trim(),
        email,
        salt: passwordResult.salt,
        passwordHash: passwordResult.passwordHash,
        github: String(data.github || "").trim(),
        linkedin: String(data.linkedin || "").trim(),
        teachSkills: String(data.teachSkills || "").trim(),
        learnSkills: String(data.learnSkills || "").trim(),
        meetingSpot: String(data.meetingSpot || "").trim(),
        customSpot: String(data.customSpot || "").trim(),
        createdAt: new Date().toISOString()
      };

      SkillSwapAuth.writeAccounts([...accounts, account]);
      signupForm.reset();
      showMessage("🎉 Account created successfully and saved in this browser! Taking you to Log In…", "success");
      window.setTimeout(() => { window.location.href = "login.html?registered=1"; }, 1800);
    } catch (error) {
      showMessage(error && error.message ? error.message : "We couldn't save your account. Please try again.", "error");
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    }
  });

  document.querySelectorAll("[data-demo-action]").forEach((control) => {
    control.addEventListener("click", (event) => {
      event.preventDefault();
      showMessage("Google sign-up needs a backend and OAuth setup. This demo saves accounts locally using the email and password fields above.", "info");
      formMessage?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });
})();
