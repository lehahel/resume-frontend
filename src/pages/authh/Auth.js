import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Profile from "../../components/profile/Profile";
import "./Auth.css";

const Auth = () => {
  const { user, login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    login: "",
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  if (user) {
    return (
      <div className="auth-container">
        <Profile user={user} />
      </div>
    );
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("→ handleSubmit", isLogin ? "login" : "register", form);
    setError("");

    try {
      if (isLogin) {
        await login({ login: form.login, password: form.password });
      } else {
        await register({
          name: form.name,
          email: form.email,
          password: form.password,
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Ошибка запроса");
    }
  };

  return (
    <div className="auth-container">
      <nav className="auth-nav">
        <span
          className={`auth-nav__link ${isLogin ? "active" : ""}`}
          onClick={() => setIsLogin(true)}
        >
          Войти
        </span>
        <span
          className={`auth-nav__link ${!isLogin ? "active" : ""}`}
          onClick={() => setIsLogin(false)}
        >
          Зарегистрироваться
        </span>
      </nav>

      <form className="auth-form" onSubmit={handleSubmit}>
        {isLogin ? (
          <>
            <label htmlFor="login">E-mail или Имя</label>
            <input
              id="login"
              name="login"
              value={form.login}
              onChange={handleChange}
              placeholder="Введите e-mail или имя"
              required
            />
          </>
        ) : (
          <>
            <label htmlFor="name">Имя</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Введите имя"
              required
            />
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Введите e-mail"
              required
            />
          </>
        )}

        <label htmlFor="password">Пароль</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Введите пароль"
          required
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-btn">
          {isLogin ? "Войти" : "Зарегистрироваться"}
        </button>
      </form>
    </div>
  );
};

export default Auth;
