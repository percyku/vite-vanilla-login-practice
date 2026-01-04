import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap";
import "./assets/scss/all.scss";
import Auth from "../Auth";

console.log("Dashboard Initialized");

const API_URL = "http://localhost:8080/";
// const API_URL = "http://percyku1919.tplinkdns.com:9098/";
const loading = document.querySelector(".loading");

// --- Auth Check ---
// const userStr = localStorage.getItem("user");
// if (userStr) {
//   const user = JSON.parse(userStr);
//   // Update welcome message
//   const welcomeMsg = document.querySelector("#welcome-msg");
//   if (welcomeMsg) {
//     welcomeMsg.textContent = `Welcome back, ${user.name || "User"}!`;
//   }
//   // Update sidebar info
//   const sidebarName = document.querySelector("#sidebar-user-name");
//   const sidebarAvatar = document.querySelector("#user-avatar-initials");

//   if (sidebarName)
//     sidebarName.textContent = user.name || user.email.split("@")[0];
//   if (sidebarAvatar)
//     sidebarAvatar.textContent = (user.name || user.email)
//       .charAt(0)
//       .toUpperCase();
// }

// const user = userStr
//   ? JSON.parse(userStr)
//   : {
//       userName: "User",
//       email: "user@example.com",
//       lastNmae: "",
//       firstName: "",
//     };

const user = {
  userName: "User",
  email: "user@example.com",
  lastName: "",
  firstName: "",
};

const sidebarName = document.querySelector("#sidebar-user-name");
const sidebarAvatar = document.querySelector("#user-avatar-initials");

if (sidebarName)
  sidebarName.textContent = user.name || user.email.split("@")[0];
if (sidebarAvatar)
  sidebarAvatar.textContent = (user.name || user.email || "U")
    .charAt(0)
    .toUpperCase();

// 2. Navigation Logic
const navDashboard = document.getElementById("nav-dashboard");
const navProfile = document.getElementById("nav-profile");
const sectionDashboard = document.getElementById("section-dashboard");
const sectionProfile = document.getElementById("section-profile");
const pageTitle = document.getElementById("page-title");

function showSection(sectionId) {
  if (sectionId === "dashboard") {
    sectionDashboard.classList.remove("d-none");
    sectionProfile.classList.add("d-none");
    navDashboard.classList.add("active");
    navProfile.classList.remove("active");
    if (pageTitle) pageTitle.textContent = "Overview";
  } else if (sectionId === "profile") {
    sectionDashboard.classList.add("d-none");
    sectionProfile.classList.remove("d-none");
    navDashboard.classList.remove("active");
    navProfile.classList.add("active");
    if (pageTitle) pageTitle.textContent = "Edit Profile";
    populateProfileForm();
  }
}

if (navDashboard) {
  navDashboard.addEventListener("click", (e) => {
    e.preventDefault();
    showSection("dashboard");
  });
}

if (navProfile) {
  navProfile.addEventListener("click", (e) => {
    e.preventDefault();
    showSection("profile");
  });
}

// 3. Profile Form Logic
const profileEmail = document.getElementById("profile-email");
const profileLastName = document.getElementById("profile-lastname");
const profileFirstName = document.getElementById("profile-firstname");
const profileNickName = document.getElementById("profile-nickname");
const profilePassword = document.getElementById("profile-password");
const profilePonfirmPassword = document.getElementById(
  "profile-confirm-password"
);

function populateProfileForm() {
  if (profileEmail) {
    profileEmail.value = user.email || "";
  }
  if (profileNickName) {
    profileNickName.value = user.userName || "";
  }
  if (profileFirstName) {
    profileFirstName.value = user.firstName || "";
  }
  if (profileLastName) {
    profileLastName.value = user.lastName || "";
  }
}

// Handle Form Submit (Mock)
const profileForm = document.getElementById("profile-form");
if (profileForm) {
  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let password = profilePassword.value;
    let confirmPassword = profilePonfirmPassword.value;

    if (profileNickName.value === "") {
      alert("Nick Name is not emtpy");
      return;
    }
    if (profileFirstName.value === "") {
      alert("Fitst Name is not emtpy");
      return;
    }
    if (profileLastName.value === "") {
      alert("Last Name is not emtpy");
      return;
    }

    let logoutFlag = false;
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
      }

      logoutFlag = true;
    }

    try {
      loading.style.display = "flex";
      let res = await Auth.updateUser(
        profileEmail.value,
        password,
        profileNickName.value,
        profileFirstName.value,
        profileLastName.value
      );

      if (res.status === 200) {
        if (logoutFlag) {
          try {
            let res = await Auth.logout();
            alert(
              "Update User Info Successful! but you need to login again because of changing your password"
            );
          } catch (error) {
            console.log(error.response.data);
            alert("Gettign some problem,please reload");
          } finally {
            loading.style.display = "none";
            window.location.href = "index.html";
          }
        } else {
          alert("Update User Info Successful!");
          user.email = res.data.email;
          user.userName = res.data.userName;
          user.lastName = res.data.lastName;
          user.firstName = res.data.firstName;
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading.style.display = "none";
    }
  });
}

// --- Logout Logic ---
const logoutBtn = document.querySelector("#logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    if (confirm("Are you sure you want to sign out?")) {
      try {
        let res = await Auth.logout();
        console.log(res.data);
        window.location.href = "index.html";
      } catch (error) {
        console.log(error.response.data);
        axios.defaults.withCredentials = false;
        alert("Gettign some problem,please reload");
      } finally {
        window.location.href = "index.html";
      }
    }
  });
}

async function init() {
  try {
    const res = await Auth.checkUserLoginOrNot();

    if (res.status === 200) {
      document.querySelector(
        "#welcome-msg"
      ).innerHTML = `${res.data.userName} welcome`;
      user.email = res.data.email;
      user.userName = res.data.userName;
      user.lastName = res.data.lastName;
      user.firstName = res.data.firstName;
    } else {
      window.location.href = "index.html";
    }
  } catch (error) {
    console.log(error);
    confirm("Please login!");
    window.location.href = "index.html";
  }
}
init();
