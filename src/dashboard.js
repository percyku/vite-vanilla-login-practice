import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap";
import "./assets/scss/all.scss";
import Auth from "../Auth";

console.log("Dashboard Initialized");

const API_URL = "http://localhost:8080/";
// const API_URL = "http://percyku1919.tplinkdns.com:9098/";
// --- Auth Check ---
const userStr = localStorage.getItem("user");

// if (!userStr) {
//     alert('You must be logged in to view this page!')
//     window.location.href = '/'
// } else {
//     const user = JSON.parse(userStr)
//     // Update welcome message
//     const welcomeMsg = document.querySelector('#welcome-msg')
//     if (welcomeMsg) {
//         welcomeMsg.textContent = `Welcome back, ${user.name || 'User'}!`
//     }
//     // Update sidebar info
//     const sidebarName = document.querySelector('#sidebar-user-name')
//     const sidebarAvatar = document.querySelector('#user-avatar-initials')

//     if (sidebarName) sidebarName.textContent = user.name || user.email.split('@')[0]
//     if (sidebarAvatar) sidebarAvatar.textContent = (user.name || user.email).charAt(0).toUpperCase()
// }

// --- Logout Logic ---
const logoutBtn = document.querySelector("#logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    if (confirm("Are you sure you want to sign out?")) {
      // localStorage.removeItem("user");
      // window.location.href = "index.html";

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

    console.log(res);
    if (res.status !== 200) {
      window.location.href = "index.html";
    } else {
      document.querySelector("#welcome-msg").innerHTML = `${res.data}`;
    }
  } catch (error) {
    console.log(error);
    //   confirm("Please login!");
    //   window.location.href = "index.html";
  }
}
init();
