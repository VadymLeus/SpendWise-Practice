import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Register.module.css';

const MAX_TOASTS = 2;
let toastQueue = [];

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    codeword: '',
  });
  const navigate = useNavigate();

  const addToast = (message, type = 'info') => {
    if (toastQueue.length >= MAX_TOASTS) {
      const firstToast = toastQueue.shift();
      toast.dismiss(firstToast);
    }
    const toastId = toast[type](message);
    toastQueue.push(toastId);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      addToast('Email не відповідає вимогам', 'error');
      return false;
    }
    return true;
  };
  

  const validateForm = () => {
    const { username, email, password, confirmPassword, codeword } = formData;
  
    if (!username || !email || !password || !confirmPassword || !codeword) {
      addToast('Будь ласка, заповніть усі поля', 'error');
      return false;
    }
  
    if (!validateEmail(email)) {
      return false;
    }
  
    if (password !== confirmPassword) {
      addToast('Паролі не співпадють.', 'error');
      return false;
    }
  
    if (!validatePassword(password)) {
      addToast('Пароль не відповідає вимогам.', 'error');
      return false;
    }
  
    return true;
  };
  

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/; // Мінімум 8 символів, одна маленька і велика буква
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:5000/api/users/register', formData);
      addToast(response.data.message || 'Реєстрація пройшла успішно! Тепер увійдіть у свій акаунт.', 'success');
      navigate('/login');
    } catch (error) {
      addToast(error.response?.data?.message || 'Помилка реєстрації.', 'error');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <h2>Реєстрація</h2>
        <input
          type="text"
          name="username"
          placeholder="Ім'я користувача"
          value={formData.username}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email - xxxx@gmail.com"
          value={formData.email}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль - xxxxxxXx"
          value={formData.password}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Підтвердіть пароль"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="text"
          name="codeword"
          placeholder="Кодове слово"
          value={formData.codeword}
          onChange={handleChange}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Зареєструватися</button>
        <a href="/login" className={styles.link}>Вже маєте акаунт? Увійти</a>
        <a href="/" className={styles.link}>Перейти на головну</a>
      </form>
      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar closeOnClick pauseOnHover />
    </div>
  );
};

export default Register;
