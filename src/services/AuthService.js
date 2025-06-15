import { apiAuth } from "../api/axios";


export const loginRequest = async ({ login, password }) => {
  try {
    const res = await apiAuth.post("login", { Login: login, Password: password });
    return res.data.user;
  } catch (error) {
    if (error.response?.status === 401) {
      alert("Неверный логин или пароль");
    }
    throw error;
  }
};


export const registerRequest = async ({ name, email, password }) => {
  try {
    const res = await apiAuth.post("register", {
      Name: name,
      Email: email,
      Password: password,
    });
    return res.data.user;
  } catch (error) {
    if (error.response?.status === 400) {
      alert("Такой email уже зарегистрирован");
    }
    throw error;
  }
};


export const logoutRequest = async () => {
  await apiAuth.post("logout");
};


export const checkAuthRequest = async () => {
  const res = await apiAuth.get("check");

  return res.data.username;
};
