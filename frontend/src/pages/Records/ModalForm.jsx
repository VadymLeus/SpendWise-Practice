import React from "react";
import styles from "./Records.module.css";

const ModalForm = ({ isOpen, onClose, formData, onInputChange, onSubmit, recordType, categories, onDeleteRecord }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose}></div>

      {/* Модальне вікно */}
      <div className={styles.modal}>
        <h2>{formData.id ? "Редагувати запис" : "Додати запис"}</h2>
        <form onSubmit={onSubmit}>
          <div>
            <label>Назва</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              required
            />
          </div>
          <div>
            <label>Категорія</label>
            <select
              name="category"
              value={formData.category}
              onChange={onInputChange}
              required
            >
              <option value="">Виберіть категорію</option>
              {categories[recordType]?.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Сума</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={onInputChange}
              required
            />
          </div>
          <div>
            <label>Опис</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onInputChange}
            ></textarea>
          </div>
          <div>
            <label>Дата і час</label>
            <input
              type="datetime-local"
              name="date_time"
              value={formData.date_time}
              onChange={onInputChange}
              required
            />
          </div>
          <div className={styles.modalButtons}>
            <button type="submit">Зберегти</button>
            <button type="button" onClick={onClose}>
              Скасувати
            </button>
            {formData.id && (
              <button
                type="button"
                onClick={onDeleteRecord}
              >
                Видалити
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default ModalForm;