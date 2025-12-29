import axios from "axios";

axios.defaults.xsrfHeaderName = "X-XSRF-TOKEN";
axios.defaults.xsrfCookieName = "XSRF-TOKEN";
axios.defaults.withCredentials = true;

// const API_URL = "http://localhost:8080/";
const API_URL = "http://percyku1919.tplinkdns.com:9098/";

class Auth {
  checkUserLoginOrNot() {
    return axios.get(`${API_URL}welcome`);
  }

  login(email, password) {
    const baToken = "Basic " + window.btoa(email + ":" + password);
    axios.defaults.withCredentials = true;
    return axios.post(
      `${API_URL}loginUser`,
      {},
      {
        headers: {
          Authorization: baToken,
        },
      }
    );
  }

  loginGitHub() {
    return `${API_URL}oauth2/authorization/github`;
  }

  logout() {
    let token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];
    return axios.post(
      `${API_URL}logoutUser`,
      {},
      {
        headers: {
          //   Authorization: baToken,
          "X-XSRF-TOKEN": token,
        },
      }
    );
  }
}

export default new Auth();
