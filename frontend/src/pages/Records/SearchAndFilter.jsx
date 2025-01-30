import React from "react";
import styles from "./Records.module.css";

const SearchAndFilter = ({
  searchValue,
  onSearchChange,
  filterOperator,
  onFilterOperatorChange,
  filterAmount,
  onFilterAmountChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onAddRecord,
  buttonLabel,
  buttonClass,
}) => {
  return (
    <div className={styles.searchRow}>
      {/* Пошук за назвою або категорією */}
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Назва або категорія"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      {/* Фільтр за сумою */}
      <select
        className={styles.filterDropdown}
        value={filterOperator}
        onChange={(e) => onFilterOperatorChange(e.target.value)}
      >
        <option value=">">&gt;</option>
        <option value="<">&lt;</option>
        <option value=">=">&ge;</option>
        <option value="<=">&le;</option>
      </select>
      <input
        type="number"
        className={styles.SumsearchInput}
        placeholder="Сума"
        value={filterAmount}
        onChange={(e) => onFilterAmountChange(e.target.value)}
      />

      {/* Фільтр за датами */}
      <input
        type="date"
        className={styles.dateInput}
        placeholder="Початок"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
      />
      <input
        type="date"
        className={styles.dateInput}
        placeholder="Кінець"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
      />

      {/* Кнопка добавления записи */}
      <button className={`${styles.button} ${buttonClass}`} onClick={onAddRecord}>
        {buttonLabel}
      </button>
    </div>
  );
};

export default SearchAndFilter;