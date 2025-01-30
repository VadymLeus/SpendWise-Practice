import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Login.module.css";

const MAX_TOASTS = 2; // Максимальна кількість одночасних сповіщень
let toastQueue = []; // Черга для зберігання ID сповіщень

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const addToast = (message, type = "info") => {
    // Перевірка, чи не максимальна кількість сповіщень
    if (toastQueue.length >= MAX_TOASTS) {
      const firstToast = toastQueue.shift(); // Видалення першого сповіщення з черги
      toast.dismiss(firstToast);
    }
    // Додавання нового сповіщення
    const toastId = toast[type](message);
    toastQueue.push(toastId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      addToast("Будь ласка, заповніть усі поля", "error");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/users/login", { email, password });
      localStorage.setItem("user", JSON.stringify(response.data.user));
      addToast("Вхід виконано успішно!", "success");
      navigate("/");
    } catch (error) {
      addToast(error.response?.data?.message || "Сталася невідома помилка", "error");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2>Вхід</h2>
        <input
          type="email"
          placeholder="Email - xxxx@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Пароль - xxxxxxXx"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.button}> Ввійти </button>
        <a href="/register" className={styles.registerLink}> Ще незареєстровані?</a>
        <a href="/" className={styles.registerLink}> Перейти на головну </a>
      </form>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
      />
    </div>
  );
};

export default Login;
