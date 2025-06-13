import { apiAuth } from "../api/axios";


export const loginRequest = async ({ login, password }) => {
  const res = await apiAuth.post("login", { Login: login, Password: password });
  return res.data.user;
};


export const registerRequest = async ({ name, email, password }) => {
  const res = await apiAuth.post("register", {
    Name: name,
    Email: email,
    Password: password,
  });
  return res.data.user;
};


export const logoutRequest = async () => {
  await apiAuth.post("logout");
};


export const checkAuthRequest = async () => {
  const res = await apiAuth.get("check");

  return res.data.username;
};
