const { addRecord, getAllRecordsByUserId, updateRecordById, deleteRecordById } = require("../models/recordModel");

// Додавання запису (дохід або витрата)
const addRecordController = async (req, res) => {
  const { userId, type, name, category, amount, description } = req.body;

  if (!userId || !type || !name || !amount) {
    return res.status(400).json({ message: "Заповніть обов'язкові поля" });
  }

  try {
    await addRecord(userId, type, name, category, amount, description);
    res.status(201).json({ message: `${type === "income" ? "Дохід" : "Витрата"} додано` });
  } catch (error) {
    console.error("Помилка додавання запису:", error.message);
    res.status(500).json({ message: "Помилка додавання запису" });
  }
};

// Отримання всіх записів користувача
const getRecordsController = async (req, res) => {
  const { id } = req.params;

  try {
    const records = await getAllRecordsByUserId(id);
    res.status(200).json(records);
  } catch (error) {
    console.error("Помилка при отриманні записів:", error.message);
    res.status(500).json({ message: "Помилка при отриманні записів" });
  }
};

// Оновлення запису (дохід або витрата)
const updateRecordController = async (req, res) => {
  const { id, type, name, category, amount, description, date_time } = req.body;

  if (!id || !type || !name || !amount) {
    return res.status(400).json({ message: "Заповніть обов'язкові поля" });
  }

  try {
    await updateRecordById(id, type, name, category, amount, description, date_time);
    res.status(200).json({ message: "Запис оновлено" });
  } catch (error) {
    console.error("Помилка оновлення запису:", error.message);
    res.status(500).json({ message: "Помилка оновлення запису" });
  }
};

// Видалення запису (дохід або витрата)
const deleteRecordController = async (req, res) => {
  const { id, type } = req.body;

  if (!id || !type) {
    return res.status(400).json({ message: "Відсутні обов'язкові дані" });
  }

  try {
    await deleteRecordById(id, type);
    res.status(200).json({ message: "Запис видалено" });
  } catch (error) {
    console.error("Помилка видалення запису:", error.message);
    res.status(500).json({ message: "Помилка видалення запису" });
  }
};

module.exports = { addRecordController, getRecordsController, updateRecordController, deleteRecordController};
