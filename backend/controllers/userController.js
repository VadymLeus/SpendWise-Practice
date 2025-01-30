const bcrypt = require("bcryptjs");
const { findUserByEmail, createUser, findUserById, deleteUserById} = require("../models/userModel");

// Реєстрація користувача
const registerUser = async (req, res) => {
  const { username, email, password, codeword } = req.body;

  if (!username || !email || !password || !codeword) {
    return res.status(400).json({ message: "Пожалуйста, заполните все поля" });
  }

  try {
    // Перевірка на існування користувача з таким email
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Пользователь с таким email уже существует" });
    }

    // Хешування пароля та кодового слова
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedCodeword = await bcrypt.hash(codeword, 10);

    // Створення нового користувача
    const userId = await createUser(username, email, hashedPassword, hashedCodeword);

    res.status(201).json({ 
      message: "Реєстрація успішна", 
      userId 
    });
  } catch (error) {
    console.error("Помилка під час реєстрації користувача:", error.message);
    res.status(500).json({ message: "Помилка реєстрації" });
  }
};

// Вхід користувача
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Будь ласка, заповніть усі поля" });
  }

  try {
    // Перевірка існування користувача
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Такого користувача не існує" });
    }

    // Сравнение пароля
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Неправильний пароль" });
    }

    res.status(200).json({
      message: "Вхід успішний",
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Помилка під час входу користувача:", error.message);
    res.status(500).json({ message: "Помилка входу" });
  }
};

// Отримання інформації про користувача
const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ message: "Користувач не знайдений" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Помилка під час отримання користувача:", error.message);
    res.status(500).json({ message: "Помилка отримання даних користувача" });
  }
};

// Видалення користувача
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteUserById(id);
    res.status(200).json({ message: "Користувача та пов'язані дані успішно видалено" });
  } catch (error) {
    console.error("Помилка під час видалення користувача:", error.message);
    res.status(500).json({ message: "Помилка видалення користувача" });
  }
};

module.exports = { registerUser, loginUser, getUser, deleteUser };
