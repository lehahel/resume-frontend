import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getResumes,
  deleteResume,
  downloadResume,
} from "../../services/ResumeService";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("User изменился:", user);
    console.log("Локация:", location);
    if (!user) return;

    const shouldRefetchCreate = location.state?.fromCreate;
    const shouldRefetchUpdate = location.state?.fromUpdate;

    (async () => {
      try {
        console.log("Fetching resumes for user id:", user.id);
        const data = await getResumes();
        console.log("Resumes fetched:", data);

        const normalized = data.map((r) => ({
          ...r,
          id: r.id ?? r.Id,
        }));
        setResumes(normalized);
      } catch (e) {
        console.error("Ошибка получения резюме:", e);
      } finally {
        setLoading(false);
      }
    })();

    if (shouldRefetchCreate || shouldRefetchUpdate) {
      window.history.replaceState({}, document.title);
    }
  }, [user, location.pathname, location]);

  const onDelete = async (id) => {
    if (window.confirm("Удалить резюме?")) {
      await deleteResume(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const onDownload = async (id) => {
    try {
      const blob = await downloadResume(id);

      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Ошибка скачивания:", e);
      alert("Не удалось скачать резюме");
    }
  };

  if (!user) return <p>Не авторизованы</p>;
  if (loading) return <p>Загрузка…</p>;
  if (!resumes.length) return <p>Резюме не найдены</p>;

  return (
    <div className="profile-container">
      <h1 className="profile-header">Мои резюме</h1>
      <div className="resume-list">
        {resumes.map((r) => (
          <div key={r.id} className="resume-info">
            <div className="resume-details">
              <p className="resume-name">
                {r.lastName} {r.firstName}
              </p>
              <p className="resume-employment">
                {r.employment || "Не указана должность"}
              </p>
              <p className="resume-workSchedule">
                {r.workSchedule || "Не указаны дни работы"}
              </p>
            </div>
            <p className="resume-position">
              {r.position || "Не указана позиция"}
            </p>
            <div className="resume-actions">
              <button
                className="resume-btn"
                onClick={() =>
                  navigate("/create", { state: { resumeToEdit: r } })
                }
              >
                Редактировать
              </button>
              <button className="resume-btn" onClick={() => onDownload(r.id)}>
                Скачать
              </button>
              <button
                className="resume-btn delete-btn"
                onClick={() => onDelete(r.id)}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
