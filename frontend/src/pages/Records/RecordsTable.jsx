import React from "react";
import styles from "./Records.module.css";
import { FaEdit } from "react-icons/fa";

const RecordsTable = ({ records, onEditRecord, truncateText }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Назва</th>
          <th>Категорія</th>
          <th>Сума</th>
          <th className="description">Опис</th>
          <th>Дата</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record) => (
          <tr key={record.id}>
            <td>{record.name}</td>
            <td>{record.category}</td>
            <td>{record.amount}</td>
            <td>{truncateText(record.description, 50)}</td>
            <td>{new Date(record.date_time).toLocaleString()}</td>
            <td>
              <button
                className={`${styles.button} ${styles.edit}`}
                onClick={() => onEditRecord(record)}
              >
                <FaEdit style={{ marginRight: "8px" }} />
                Редагувати
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RecordsTable;