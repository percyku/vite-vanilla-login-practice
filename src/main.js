import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/scss/all.scss";
import "bootstrap/dist/js/bootstrap.min.js";
import Auth from "../Auth";

// --- DOM Elements ---
const loading = document.querySelector(".loading");
const loginSection = document.querySelector("#login-section");
const registerSection = document.querySelector("#register-section");
const showRegisterLink = document.querySelector("#show-register");
const showLoginLink = document.querySelector("#show-login");

console.log("Auth App Initialized");

// --- Toggle Logic ---
function toggleForms(showLogin) {
  if (showLogin) {
    registerSection.classList.add("d-none");
    loginSection.classList.remove("d-none");
    loginSection.classList.add("fade-in");
  } else {
    loginSection.classList.add("d-none");
    registerSection.classList.remove("d-none");
    registerSection.classList.add("fade-in");
  }
}

showRegisterLink.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms(false);
});

showLoginLink.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms(true);
});

// --- Login Logic ---
document.querySelector("#login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const submitBtn = document.querySelector('#login-form button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;

  if (email && password) {
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Signing in...';

    console.log(`Attempting login with: ${email}`);

    try {
      loading.style.display = "flex";
      let res = await Auth.login(email, password);
      console.log(res);
      if (res.status === 200) {
        alert(`Login successful for ${email}!\n(Backend integration pending)`);
        window.location.href = "dashboard.html";
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading.style.display = "none";
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  }
});

// --- Registration Logic ---
document
  .querySelector("#register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector("#reg-email").value;
    const password = document.querySelector("#reg-password").value;
    const confirmPassword = document.querySelector(
      "#reg-confirm-password"
    ).value;
    const terms = document.querySelector("#terms").checked;

    const submitBtn = document.querySelector(
      '#register-form button[type="submit"]'
    );
    const originalBtnText = submitBtn.innerHTML;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!terms) {
      alert("You must agree to the terms!");
      return;
    }

    if (email && password) {
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Creating Account...';

      console.log(`Attempting registration for: ${email}`);

      try {
        let res = await Auth.register(email, password);
        console.log(res);
        if (res.status === 200 && res.data === "register ok") {
          alert(
            `Account created successfully for ${email}!\nLogging you in...`
          );
          window.location.href = "index.html";
        }
      } catch (error) {
        console.log(error);

        if (error.status === 409) {
          submitBtn.innerHTML = error.response.data;
        } else {
          submitBtn.innerHTML = "register fail";
        }
      } finally {
        submitBtn.disabled = false;
      }
    }
  });

// --- Social Login ---
document.querySelector("#google-login").addEventListener("click", () => {
  // alert("Google Login clicked (Implementation pending backend)");
  window.location.href = Auth.loginGoogle();
});

document.querySelector("#github-login").addEventListener("click", () => {
  // alert("Github Login clicked (Implementation pending backend)");
  window.location.href = Auth.loginGitHub();
});

async function init() {
  loading.style.display = "flex";
  try {
    const res = await Auth.checkUserLoginOrNot();

    if (res.status === 200) {
      window.location.href = "dashboard.html";
    } else {
      alert(res.data);
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.style.display = "none";
  }
}
init();
