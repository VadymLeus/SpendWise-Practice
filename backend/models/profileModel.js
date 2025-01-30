const db = require("../config/db");
const bcrypt = require("bcryptjs");

// Отримання інформації про користувача
const getUserInfo = async (userId) => {
  const [rows] = await db.execute("SELECT username, email FROM users WHERE id = ?", [userId]);
  return rows.length > 0 ? rows[0] : null;
};

// Отримання кількості доходів користувача
const getIncomeCount = async (userId) => {
  const [rows] = await db.execute("SELECT COUNT(*) as count FROM incomes WHERE user_id = ?", [userId]);
  return rows[0].count;
};

// Отримання кількості витрат користувача
const getExpenseCount = async (userId) => {
  const [rows] = await db.execute("SELECT COUNT(*) as count FROM expenses WHERE user_id = ?", [userId]);
  return rows[0].count;
};

// Отримання даних користувача для зміни пароля
const getUserById = async (userId) => {
  const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [userId]);
  return rows.length > 0 ? rows[0] : null;
};

// Оновлення пароля користувача
const updatePassword = async (userId, hashedPassword) => {
  await db.execute("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId]);
};

// Оновлення email користувача
const updateEmail = async (userId, newEmail) => {
  await db.execute("UPDATE users SET email = ? WHERE id = ?", [newEmail, userId]);
};

// Видалення всіх записів користувача
const deleteUserRecords = async (userId) => {
  await db.execute("DELETE FROM incomes WHERE user_id = ?", [userId]);
  await db.execute("DELETE FROM expenses WHERE user_id = ?", [userId]);
  await db.execute("DELETE FROM users WHERE id = ?", [userId]);
};

module.exports = { getUserInfo, getIncomeCount, getExpenseCount, getUserById, updatePassword, updateEmail, deleteUserRecords};