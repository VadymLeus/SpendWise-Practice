const db = require("../config/db");

// Додавання запису
const addRecord = async (userId, type, name, category, amount, description) => {
  const table = type === "income" ? "incomes" : "expenses";
  const query = `
    INSERT INTO ${table} (user_id, name, category, amount, description) 
    VALUES (?, ?, ?, ?, ?)
  `;
  await db.execute(query, [userId, name, category, amount, description]);
};

// Отримання всіх записів користувача
const getAllRecordsByUserId = async (userId) => {
  const query = `
    SELECT 'income' AS type, id, name, category, amount, description, date_time 
    FROM incomes WHERE user_id = ?
    UNION ALL
    SELECT 'expense' AS type, id, name, category, amount, description, date_time 
    FROM expenses WHERE user_id = ?
    ORDER BY date_time DESC
  `;
  const [rows] = await db.execute(query, [userId, userId]);
  return rows;
};

// Оновлення запису
const updateRecordById = async (id, type, name, category, amount, description, dateTime) => {
  const table = type === "income" ? "incomes" : "expenses";
  const query = `
    UPDATE ${table}
    SET name = ?, category = ?, amount = ?, description = ?, date_time = ?
    WHERE id = ?
  `;
  await db.execute(query, [name, category, amount, description, dateTime, id]);
};

// Видалення запису
const deleteRecordById = async (id, type) => {
  const table = type === "income" ? "incomes" : "expenses";
  const query = `DELETE FROM ${table} WHERE id = ?`;
  await db.execute(query, [id]);
};

module.exports = {addRecord, getAllRecordsByUserId, updateRecordById, deleteRecordById};
