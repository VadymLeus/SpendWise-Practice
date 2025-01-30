const db = require('../config/db');

// Перевірка існування користувача за email
const findUserByEmail = async (email) => {
  const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0]; // Повернути перший результат або undefined
};

// Створення нового користувача
const createUser = async (username, email, hashedPassword, hashedCodeword) => {
  const sql = 'INSERT INTO users (username, email, password, codeword) VALUES (?, ?, ?, ?)';
  const [result] = await db.execute(sql, [username, email, hashedPassword, hashedCodeword]);
  return result.insertId; // Повернути ID створеного користувача
};

// Отримання інформації про користувача за ID
const findUserById = async (id) => {
  const [rows] = await db.execute("SELECT id, username, email FROM users WHERE id = ?", [id]);
  return rows[0]; // Повернути перший результат або undefined
};

// Видалення користувача та пов'язаних даних
const deleteUserById = async (id) => {
  await db.execute("DELETE FROM incomes WHERE user_id = ?", [id]);
  await db.execute("DELETE FROM expenses WHERE user_id = ?", [id]);
  await db.execute("DELETE FROM users WHERE id = ?", [id]);
};

module.exports = {findUserByEmail, createUser, findUserById, deleteUserById};
