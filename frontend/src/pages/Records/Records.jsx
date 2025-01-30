import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import styles from "./Records.module.css";
import SearchAndFilter from "./SearchAndFilter";
import RecordsTable from "./RecordsTable";
import ModalForm from "./ModalForm";
import { categories } from "./constants";

const Records = () => {
  const [records, setRecords] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [recordType, setRecordType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    amount: "",
    description: "",
    date_time: "",
  });

  const [searchIncome, setSearchIncome] = useState("");
  const [searchExpense, setSearchExpense] = useState("");
  const [incomeFilter, setIncomeFilter] = useState({ operator: ">", amount: "" });
  const [expenseFilter, setExpenseFilter] = useState({ operator: ">", amount: "" });
  const [incomeDateFilter, setIncomeDateFilter] = useState({ startDate: "", endDate: "" });
  const [expenseDateFilter, setExpenseDateFilter] = useState({ startDate: "", endDate: "" });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;

    const fetchRecords = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/records/${user.id}`);
        setRecords(response.data);
      } catch (error) {
        console.error("Помилка отримання записів:", error.message);
      }
    };

    fetchRecords();
  }, [user]);

  if (!user) {
    return (
      <div className={styles.unauthContainer}>
        <header className={styles.header}>
          <div className={styles.logo}>SpendWise</div>
          <div className={styles.authButtons}>
            <button className={styles.button} onClick={() => navigate("/login")}>
              Увійти
            </button>
            <button className={`${styles.button} ${styles.registerButton}`} onClick={() => navigate("/register")}>
              Зареєструватися
            </button>
          </div>
        </header>
        <main className={styles.mainContent}>
          <h1 className={styles.title}>Скористайтесь нашим сервісом</h1>
        </main>
      </div>
    );
  }

  const openModal = (type, record = null) => {
    setRecordType(type);
    if (record) {
      setFormData({
        id: record.id,
        name: record.name,
        category: record.category,
        amount: record.amount,
        description: record.description,
        date_time: formatDateForInput(record.date_time),
      });
    } else {
      setFormData({ name: "", category: "", amount: "", description: "", date_time: "" });
    }
    setModalIsOpen(true);
  };

  const formatDateForInput = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        userId: user.id,
        type: recordType,
        ...formData,
      };

      if (formData.id) {
        await axios.put("http://localhost:5000/api/records", data);
      } else {
        await axios.post("http://localhost:5000/api/records", data);
      }

      setModalIsOpen(false);
      const response = await axios.get(`http://localhost:5000/api/records/${user.id}`);
      setRecords(response.data);

      toast.success("Запис успішно збережено!", { position: "top-right" });
    } catch (error) {
      console.error("Помилка збереження запису:", error.message);
      toast.error("Помилка при збереженні запису.", { position: "top-right" });
    }
  };

  const handleDeleteRecord = async () => {
    if (window.confirm("Ви впевнені, що хочете видалити цей запис?")) {
      try {
        await axios.delete("http://localhost:5000/api/records", {
          data: { id: formData.id, type: recordType },
        });
        const response = await axios.get(`http://localhost:5000/api/records/${user.id}`);
        setRecords(response.data);
        setModalIsOpen(false);
      } catch (error) {
        console.error("Помилка видалення запису:", error.message);
      }
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const filterByAmount = (records, filter) => {
    const { operator, amount } = filter;
    if (!amount) return records;
    const numericAmount = parseFloat(amount);

    return records.filter((record) => {
      const recordAmount = parseFloat(record.amount);
      switch (operator) {
        case ">":
          return recordAmount > numericAmount;
        case "<":
          return recordAmount < numericAmount;
        case ">=":
          return recordAmount >= numericAmount;
        case "<=":
          return recordAmount <= numericAmount;
        default:
          return true;
      }
    });
  };

  const filterByDate = (records, startDate, endDate) => {
    if (!startDate && !endDate) return records;

    return records.filter((record) => {
      const recordDate = new Date(record.date_time);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && recordDate < start) return false;
      if (end && recordDate > end) return false;

      return true;
    });
  };

  const filteredIncomeRecords = filterByDate(
    filterByAmount(
      records.filter(
        (record) =>
          record.type === "income" &&
          (record.name.toLowerCase().includes(searchIncome.toLowerCase()) ||
            record.category.toLowerCase().includes(searchIncome.toLowerCase()))
      ),
      incomeFilter
    ),
    incomeDateFilter.startDate,
    incomeDateFilter.endDate
  );

  const filteredExpenseRecords = filterByDate(
    filterByAmount(
      records.filter(
        (record) =>
          record.type === "expense" &&
          (record.name.toLowerCase().includes(searchExpense.toLowerCase()) ||
            record.category.toLowerCase().includes(searchExpense.toLowerCase()))
      ),
      expenseFilter
    ),
    expenseDateFilter.startDate,
    expenseDateFilter.endDate
  );

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.headerLeft}>SpendWise</div>
        <div className={styles.headerRight}>
          <button className={styles.profileButton} onClick={() => navigate("/profile")}>
            Вітаємо, {user?.username}!
          </button>
          <button className={styles.logoutButton} onClick={() => { localStorage.removeItem("user"); window.location.href = "/"; }}>
            Вийти
          </button>
        </div>
      </header>
      <ToastContainer />
      <h3 className={styles.sectionTitle}>Доходи</h3>
      <SearchAndFilter
        searchValue={searchIncome}
        onSearchChange={setSearchIncome}
        filterOperator={incomeFilter.operator}
        onFilterOperatorChange={(value) => setIncomeFilter({ ...incomeFilter, operator: value })}
        filterAmount={incomeFilter.amount}
        onFilterAmountChange={(value) => setIncomeFilter({ ...incomeFilter, amount: value })}
        startDate={incomeDateFilter.startDate}
        onStartDateChange={(value) => setIncomeDateFilter({ ...incomeDateFilter, startDate: value })}
        endDate={incomeDateFilter.endDate}
        onEndDateChange={(value) => setIncomeDateFilter({ ...incomeDateFilter, endDate: value })}
        onAddRecord={() => openModal("income")}
        buttonLabel={<><FaPlus style={{ marginRight: "8px" }} /> Додати дохід</>}
        buttonClass={styles.income}
      />
      <RecordsTable
        records={filteredIncomeRecords}
        onEditRecord={(record) => openModal(record.type, record)}
        truncateText={truncateText}
      />

      <h3 className={styles.sectionTitle}>Витрати</h3>
      <SearchAndFilter
        searchValue={searchExpense}
        onSearchChange={setSearchExpense}
        filterOperator={expenseFilter.operator}
        onFilterOperatorChange={(value) => setExpenseFilter({ ...expenseFilter, operator: value })}
        filterAmount={expenseFilter.amount}
        onFilterAmountChange={(value) => setExpenseFilter({ ...expenseFilter, amount: value })}
        startDate={expenseDateFilter.startDate}
        onStartDateChange={(value) => setExpenseDateFilter({ ...expenseDateFilter, startDate: value })}
        endDate={expenseDateFilter.endDate}
        onEndDateChange={(value) => setExpenseDateFilter({ ...expenseDateFilter, endDate: value })}
        onAddRecord={() => openModal("expense")}
        buttonLabel={<><FaPlus style={{ marginRight: "8px" }} /> Додати витрату</>}
        buttonClass={styles.expense}
      />
      <RecordsTable
        records={filteredExpenseRecords}
        onEditRecord={(record) => openModal(record.type, record)}
        truncateText={truncateText}
      />

      <ModalForm
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        recordType={recordType}
        categories={categories}
        onDeleteRecord={handleDeleteRecord}
      />
    </div>
  );
};

export default Records;