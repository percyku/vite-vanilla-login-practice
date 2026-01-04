import axios from "axios";

axios.defaults.xsrfHeaderName = "X-XSRF-TOKEN";
axios.defaults.xsrfCookieName = "XSRF-TOKEN";
axios.defaults.withCredentials = true;

const API_URL = "http://localhost:8080/";
// const API_URL = "http://192.168.0.176:8080/";
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

  loginGoogle() {
    return `${API_URL}oauth2/authorization/google`;
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

  register(email, password) {
    return axios.post(`${API_URL}registerUser`, {
      email: email,
      password: password,
    });
  }

  updateUser(email, password, usernName, firstName, lastName) {
    let token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];

    let userData = {
      email: email,
      password: password,
      first_name: firstName,
      last_name: lastName,
      username: usernName,
    };
    console.log(userData);
    return axios.post(`${API_URL}updateUser`, userData, {
      headers: {
        //   Authorization: baToken,
        "X-XSRF-TOKEN": token,
      },
    });
  }
}

export default new Auth();
