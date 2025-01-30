const bcrypt = require("bcryptjs");
const { getUserInfo, getIncomeCount, getExpenseCount, getUserById, updatePassword, updateEmail, deleteUserRecords} = require("../models/profileModel");

// Отримання даних про користувача
const getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const userInfo = await getUserInfo(userId);

    if (!userInfo) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    const incomes = await getIncomeCount(userId);
    const expenses = await getExpenseCount(userId);

    res.status(200).json({
      username: userInfo.username,
      email: userInfo.email,
      incomes,
      expenses,
    });
  } catch (error) {
    console.error("Помилка при отриманні профілю користувача:", error.message);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

// Зміна пароля
const changePassword = async (req, res) => {
  const { userId, oldPassword, newPassword, codeword } = req.body;

  if (!userId || !oldPassword || !newPassword || !codeword) {
    return res.status(400).json({ message: "Будь ласка, заповніть усі поля" });
  }

  try {
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    const isCodewordMatch = await bcrypt.compare(codeword, user.codeword);

    if (!isPasswordMatch || !isCodewordMatch) {
      return res.status(401).json({ message: "Старий пароль або кодове слово невірне" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await updatePassword(userId, hashedNewPassword);

    res.status(200).json({ message: "Пароль успішно змінено" });
  } catch (error) {
    console.error("Помилка при зміні пароля:", error.message);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

// Зміна email
const changeEmail = async (req, res) => {
  const { userId, oldEmail, newEmail, codeword } = req.body;

  if (!userId || !oldEmail || !newEmail || !codeword) {
    return res.status(400).json({ message: "Будь ласка, заповніть усі поля" });
  }

  try {
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    const isEmailMatch = oldEmail === user.email;
    const isCodewordMatch = await bcrypt.compare(codeword, user.codeword);

    if (!isEmailMatch || !isCodewordMatch) {
      return res.status(401).json({ message: "Старий email або кодове слово невірне" });
    }

    await updateEmail(userId, newEmail);

    res.status(200).json({ message: "Email успішно змінено" });
  } catch (error) {
    console.error("Помилка при зміні email:", error.message);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

// Видалення акаунта та всіх записів
const deleteAccount = async (req, res) => {
  const { userId } = req.params;

  try {
    await deleteUserRecords(userId);
    res.status(200).json({ message: "Акаунт та всі дані успішно видалено" });
  } catch (error) {
    console.error("Помилка при видаленні акаунта:", error.message);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

module.exports = { getUserProfile, changePassword, changeEmail, deleteAccount };