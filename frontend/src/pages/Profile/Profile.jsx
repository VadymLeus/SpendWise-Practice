import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import clsx from "clsx";
import styles from "./Profile.module.css";

const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>Підтвердження видалення</h3>
        <p>Ви впевнені, що хочете видалити свій акаунт? Ця дія є незворотною.</p>
        <div className={styles.modalButtons}>
          <button onClick={onConfirm} className={clsx(styles.button, styles.buttonDelete)}>
            Видалити
          </button>
          <button onClick={onClose} className={styles.button}>
            Скасувати
          </button>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [userData, setUserData] = useState({});
  const [oldPassword, setOldPassword] = useState("");
  const [codeword, setCodeword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [activeTab, setActiveTab] = useState("password");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    axios
      .get(`http://localhost:5000/api/profile/${user.id}`)
      .then((response) => setUserData(response.data))
      .catch(() => toast.error("Помилка завантаження даних профілю."));
  }, [user, navigate]);

  const validatePasswordChange = () => {
    if (!oldPassword || !codeword || !newPassword) {
      toast.error("Будь ласка, заповніть усі поля");
      return false;
    }
    if (oldPassword === newPassword) {
      toast.error("Новий пароль не повинен збігатися зі старим");
      return false;
    }
    return true;
  };

  const validateEmailChange = () => {
    if (!oldEmail || !codeword || !newEmail) {
      toast.error("Будь ласка, заповніть усі поля");
      return false;
    }
    if (oldEmail === newEmail) {
      toast.error("Новий email не повинен збігатися зі старим");
      return false;
    }
    return true;
  };

  const handleChangePassword = async () => {
    if (!validatePasswordChange()) return;
    try {
      const response = await axios.post("http://localhost:5000/api/profile/change-password", {
        userId: user.id,
        oldPassword,
        codeword,
        newPassword,
      });
      toast.success(response.data.message);
      setOldPassword("");
      setCodeword("");
      setNewPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Помилка зміни паролю.");
    }
  };

  const handleChangeEmail = async () => {
    if (!validateEmailChange()) return;
    try {
      const response = await axios.post("http://localhost:5000/api/profile/change-email", {
        userId: user.id,
        oldEmail,
        newEmail,
        codeword,
      });
      toast.success(response.data.message);
      setOldEmail("");
      setNewEmail("");
      setCodeword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Помилка зміни email.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/profile/${user.id}`);
      localStorage.removeItem("user");
      toast.success("Акаунт успішно видалено.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Помилка видалення акаунта.");
    }
  };

  if (!user) return null;

  return (
    <div className={styles.profileContainer}>
      <ToastContainer />
      <form className={styles.profileForm}>
        <h2 className={styles.title}>Профіль користувача</h2>
        <p className={styles.infoText}>Ім'я користувача: {userData.username}</p>
        <p className={styles.infoText}>Email: {userData.email}</p>
        <p className={styles.infoText}>Записів у доходах: {userData.incomes}</p>
        <p className={styles.infoText}>Записів у витратах: {userData.expenses}</p>

        <div className={styles.tabs}>
          <button
            type="button"
            onClick={() => setActiveTab("password")}
            className={clsx(styles.tabButton, activeTab === "password" && styles.activeTab)}
          >
            Зміна паролю
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("email")}
            className={clsx(styles.tabButton, activeTab === "email" && styles.activeTab)}
          >
            Зміна email
          </button>
        </div>

        {activeTab === "password" && (
          <>
            <h3 className={styles.subtitle}>Зміна паролю</h3>
            <input type="password" placeholder="Старий пароль" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className={styles.input} />
            <input type="text" placeholder="Кодове слово" value={codeword} onChange={(e) => setCodeword(e.target.value)} className={styles.input} />
            <input type="password" placeholder="Новий пароль" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={styles.input} />
            <button type="button" onClick={handleChangePassword} className={styles.button}>
              Змінити пароль
            </button>
          </>
        )}

        {activeTab === "email" && (
          <>
            <h3 className={styles.subtitle}>Зміна email</h3>
            <input type="email" placeholder="Старий email" value={oldEmail} onChange={(e) => setOldEmail(e.target.value)} className={styles.input} />
            <input type="text" placeholder="Кодове слово" value={codeword} onChange={(e) => setCodeword(e.target.value)} className={styles.input} />
            <input type="email" placeholder="Новий email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className={styles.input} />
            <button type="button" onClick={handleChangeEmail} className={styles.button}>
              Змінити email
            </button>
          </>
        )}

        <p className={styles.backToHome} onClick={() => navigate("/")}>Повернутися на головну сторінку</p>

        <h3 className={styles.subtitleDelete}>Видалення акаунта</h3>
        <button type="button" onClick={() => setIsModalOpen(true)} className={clsx(styles.button, styles.buttonDelete)}>
          Видалити акаунт
        </button>
      </form>

      <ConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleDeleteAccount} />
    </div>
  );
};

export default Profile;