import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Creater.css";
import { updateResume } from "../../services/ResumeService";
import { useResume } from "../../context/ResumeContext";
import ThemeCard from "../../components/templatess/ThemeCard";
import type1 from "./../../img/shab/1.png";
import type2 from "./../../img/shab/2.png";
import type3 from "./../../img/shab/3.png";
import type4 from "./../../img/shab/4.png";
import type5 from "./../../img/shab/5.png";
import { useAuth } from "./../../context/AuthContext";

const Creater = () => {
  const { user } = useAuth();
  const { createResumeData, updateResumeData } = useResume();

  const navigate = useNavigate();
  const location = useLocation();
  const resumeToEdit = location.state?.resumeToEdit || null;
  const isEditing = Boolean(resumeToEdit);

  const [step, setStep] = useState("form");
  const [resumeData, setResumeData] = useState({
    id: null,
    firstName: "",
    lastName: "",
    middleName: "",
    position: "",
    employment: "",
    desiredSalary: "",
    workSchedule: "",
    noPatronymic: false,
    birthDate: "",
    phoneNumber: "",
    email: "",
    isReadyForTrips: false,
    city: "",
    canRelocate: "",
    citizenship: "",
    maritalStatus: "",
    gender: "Мужской",
    hasChildren: false,
    workExperiences: [],
    educations: [],
    driverLicenses: {
      A: false,
      B: false,
      C: false,
      D: false,
      BE: false,
      CE: false,
      DE: false,
      Tm: false,
      Tb: false,
    },
    hasMedicalBook: false,
    photo: null,
    theme: null,
    languages: "",
    personalQualities: "",
  });
  const [selectedTheme, setSelectedTheme] = useState(null);

  const formRefs = useRef({});

  useEffect(() => {
    if (isEditing) {
      console.log("useEffect isEditing resumeToEdit:", resumeToEdit);
      const safeResume = {
        ...resumeToEdit,
        id: resumeToEdit.id ?? resumeToEdit.Id ?? null,
        firstName: resumeToEdit.firstName || "",
        lastName: resumeToEdit.lastName || "",
        middleName: resumeToEdit.middleName || "",
        position: resumeToEdit.position || "",
        employment: resumeToEdit.employment || "",
        desiredSalary: resumeToEdit.desiredSalary || "",
        workSchedule: resumeToEdit.workSchedule || "",
        noPatronymic: resumeToEdit.noPatronymic || false,
        birthDate: resumeToEdit.birthDate || "",
        phoneNumber: resumeToEdit.phoneNumber || "",
        email: resumeToEdit.email || "",
        isReadyForTrips: resumeToEdit.isReadyForTrips || false,
        city: resumeToEdit.city || "",
        canRelocate: resumeToEdit.canRelocate || "",
        citizenship: resumeToEdit.citizenship || "",
        maritalStatus: resumeToEdit.maritalStatus || "",
        gender: resumeToEdit.gender || "Мужской",
        hasChildren: resumeToEdit.hasChildren || false,
        workExperiences:
          Array.isArray(resumeToEdit.workExperiences) &&
          resumeToEdit.workExperiences.length > 0
            ? resumeToEdit.workExperiences
            : [
                {
                  organization: "",
                  workExpPosition: "",
                  startDate: null,
                  endDate: null,
                  setIsCurrent: false,
                  responsibilities: "",
                },
              ],
        educations:
          Array.isArray(resumeToEdit.educations) &&
          resumeToEdit.educations.length > 0
            ? resumeToEdit.educations
            : [
                {
                  institution: "",
                  faculty: "",
                  specialty: "",
                  graduationYear: 0,
                  studyForm: "",
                },
              ],
        driverLicenses: resumeToEdit.driverLicenses || {
          A: false,
          B: false,
          C: false,
          D: false,
          BE: false,
          CE: false,
          DE: false,
          Tm: false,
          Tb: false,
        },
        photo: resumeToEdit.photo || null,
        personalQualities: resumeToEdit.personalQualities || "",
        languages: resumeToEdit.languages || "",
      };
      setResumeData(safeResume);
      setStep("form");
    }
  }, [isEditing, resumeToEdit]);

  const buildIsoDate = (year, month) => {
    if (!year) return null;

    if (typeof year === "string") {
      if (!/^\d{4}$/.test(year)) return null;
      year = Number(year);
    } else if (typeof year !== "number" || year < 1900 || year > 2100) {
      return null;
    }

    let m;
    if (typeof month === "string") {
      m =
        {
          январь: 1,
          февраль: 2,
          март: 3,
          апрель: 4,
          май: 5,
          июнь: 6,
          июль: 7,
          август: 8,
          сентябрь: 9,
          октябрь: 10,
          ноябрь: 11,
          декабрь: 12,
        }[month.toLowerCase()] || 1;
    } else {
      m = Number(month) >= 1 && Number(month) <= 12 ? Number(month) : 1;
    }

    return `${year}-${String(m).padStart(2, "0")}-01T00:00:00.000Z`;
  };

  const collectResumeData = () => {
    let canRelocateBool = null;
    if (resumeData.canRelocate === "Возможен") canRelocateBool = "true";
    else if (resumeData.canRelocate === "Невозможен") canRelocateBool = "false";

    let birthDateIso = null;
    if (resumeData.birthDate) {
      const bd = new Date(resumeData.birthDate);
      birthDateIso = isNaN(bd.getTime()) ? null : bd.toISOString().split('T')[0];
    }

    const mappedWorkExperiences = resumeData.workExperiences.length
      ? resumeData.workExperiences
          .map((we) => ({
            organization: we.organization || "",
            workExpPosition: we.workExpPosition || "",
            startDate: we.startDate || null,
            endDate: we.endDate || null,
            responsibilities: we.responsibilities || "",
          }))
          .filter(
            (we) =>
              we.organization.trim() !== "" &&
              we.workExpPosition.trim() !== "" &&
              we.startDate !== null &&
              we.responsibilities.trim() !== ""
          )
      : [];

    const mappedEducations = resumeData.educations.length
      ? resumeData.educations
          .map((ed) => ({
            institution: ed.institution || "",
            faculty: ed.faculty || "",
            specialty: ed.specialty || "",
            graduationYear: Number(ed.graduationYear) || 0,
            studyForm: ed.studyForm || "",
          }))
          .filter(
            (ed) =>
              ed.institution.trim() !== "" &&
              ed.specialty.trim() !== "" &&
              ed.graduationYear > 0
          )
      : [];

    const city =
      resumeData.city && resumeData.city.trim() !== ""
        ? resumeData.city
        : "Город не указан";
    const citizenship =
      resumeData.citizenship && resumeData.citizenship.trim() !== ""
        ? resumeData.citizenship
        : "Не указано";
    const title =
      (resumeData.lastName || "Фамилия") +
      " " +
      (resumeData.firstName || "Имя") +
      " - резюме";

    const id =
      resumeData.id !== undefined && resumeData.id !== null
        ? resumeData.id
        : resumeToEdit?.id ?? resumeToEdit?.Id ?? null;

    return {
      id: id,
      title: title,
      isPublic: true,

      lastName: resumeData.lastName || "",
      firstName: resumeData.firstName || "",
      middleName: resumeData.middleName || "",
      noPatronymic: resumeData.noPatronymic || false,
      birthDate: birthDateIso,

      phoneNumber: resumeData.phoneNumber || "",
      email: resumeData.email || "",

      position: resumeData.position || "",
      employment: resumeData.employment || "",
      desiredSalary: +(resumeData.desiredSalary || 0),
      workSchedule: resumeData.workSchedule || "",
      isReadyForTrips: !!resumeData.isReadyForTrips,

      city: city,
      canRelocate: canRelocateBool !== null ? canRelocateBool : false,
      citizenship: citizenship,
      maritalStatus: resumeData.maritalStatus || "",
      gender: resumeData.gender || "Мужской",
      hasChildren: !!resumeData.hasChildren,

      workExperiences: mappedWorkExperiences,
      educations: mappedEducations,
      driverLicenses: driverLicenses.join(""),
      hasMedicalBook: !!resumeData.hasMedicalBook,
      photo: resumeData.photo || null,
      // photo:
      //   resumeData.photo && !resumeData.photo.startsWith("data:")
      //     ? resumeData.photo
      //     : null,
      theme: selectedTheme,
      languages: resumeData.languages || "",
      personalQualities: resumeData.personalQualities || "",
    };
  };

  const handleSelectTheme = async (theme) => {
    setSelectedTheme(theme);
    setStep("ready");

    const resumeDataToSave = collectResumeData();

    const themeNameMap = {
      "Шаблон 1": "modern",
      "Шаблон 2": "classic",
      "Шаблон 3": "creative",
      "Шаблон 4": "professional",
      "Шаблон 5": "elegant",
    };

    resumeDataToSave.theme = themeNameMap[theme.name] || "creative";

    if (user?.id) {
      try {
        // const formData = new FormData();

        // for (const key in resumeDataToSave) {
        //   if (
        //     key !== "photo" &&
        //     resumeDataToSave[key] !== undefined &&
        //     resumeDataToSave[key] !== null
        //   ) {
        //     if (
        //       Array.isArray(resumeDataToSave[key]) ||
        //       (typeof resumeDataToSave[key] === "object" &&
        //         !(resumeDataToSave[key] instanceof File))
        //     ) {
        //       const jsonString = JSON.stringify(resumeDataToSave[key]);
        //       console.log(`Appending key: ${key} with JSON:`, jsonString);
        //       formData.append(key, jsonString);
        //     } else {
        //       console.log(
        //         `Appending key: ${key} with value:`,
        //         resumeDataToSave[key]
        //       );
        //       formData.append(key, resumeDataToSave[key]);
        //     }
        //   }
        // }

        const jsonData = {};
        for (const key in resumeDataToSave) {
          if (
            key !== "photo" &&
            resumeDataToSave[key] !== undefined &&
            resumeDataToSave[key] !== null
          ) {
            jsonData[key] = resumeDataToSave[key];
          }
        }

        // if (photoFile && photoFile instanceof File) {
        //   formData.append("PhotoFile", photoFile);
        // }

        const savedResume = await createResumeData(jsonData);
        console.log("Резюме успешно сохранено!", savedResume);
        if (savedResume) {
          console.log("Setting resumeData with savedResume:", savedResume);

          setResumeData((prev) => ({
            ...prev,
            ...savedResume,
            id: savedResume.id ?? savedResume.Id ?? prev.id,
            theme: resumeDataToSave.theme,
          }));
        }
      } catch (e) {
        alert("Ошибка сохранения резюме: " + e.message);
      }
    }
  };
  const themes = [
    { id: 1, name: "Шаблон 1", image: type1 },
    { id: 2, name: "Шаблон 2", image: type2 },
    { id: 3, name: "Шаблон 3", image: type3 },
    { id: 4, name: "Шаблон 4", image: type4 },
    { id: 5, name: "Шаблон 5", image: type5 },
  ];

  const [noPatronymic, setNoPatronymic] = useState(false);
  const [gender, setGender] = useState("Мужской");
  const [isReadyForTrips, setIsReadyForTrips] = useState(false);

  const [hasChildren, setHasChildren] = useState(false);
  const [isCurrent, setIsCurrent] = useState(false);

  const [driverLicenses, setDriverLicenses] = useState([]);

  const handleDriverLicenseChange = (e) => {
    const { name, checked } = e.target;
    setDriverLicenses((prev) => {
      if (checked) {
        if (!prev.includes(name)) return [...prev, name];
        return prev;
      } else {
        return prev.filter((item) => item !== name);
      }
    });
  };
  const [hasMedicalBook, setHasMedicalBook] = useState(false);

  const { uploadResumePhotoData } = useResume();

  const [photoFile, setPhotoFile] = useState(null);

  const handlePhotoClick = () => {
    document.getElementById("file-upload").click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoFile(file);

    try {
      if (resumeData.id) {
        const updatedResume = await uploadResumePhotoData(resumeData.id, file);
        setResumeData((prev) => ({
          ...prev,
          photo: updatedResume.photo,
        }));
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setResumeData((prev) => ({
            ...prev,
            photo: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("Ошибка загрузки фото:", error);
      alert("Не удалось загрузить фото. Попробуйте еще раз.");
    }
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleMedicalBookChange = () => {
    setHasMedicalBook(!hasMedicalBook);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setResumeData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setResumeData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = collectResumeData();
    console.log("Submitting update with payload:", payload);

    const errors = [];
    // Required fields (nullable=False)
    if (!payload.lastName || payload.lastName.trim() === "") {
      errors.push("Фамилия обязательна");
    }
    if (!payload.firstName || payload.firstName.trim() === "") {
      errors.push("Имя обязательно");
    }
    if (!payload.birthDate) {
      errors.push("Дата рождения обязательна");
    }
    if (!payload.email || payload.email.trim() === "") {
      errors.push("Email обязателен");
    }
    if (!payload.position || payload.position.trim() === "") {
      errors.push("Должность обязательна");
    }
    if (!payload.employment || payload.employment.trim() === "") {
      errors.push("Занятость обязательна");
    }
    if (!payload.workSchedule || payload.workSchedule.trim() === "") {
      errors.push("График работы обязателен");
    }
    if (!payload.city || payload.city.trim() === "") {
      errors.push("Город обязателен");
    }
    if (!payload.citizenship || payload.citizenship.trim() === "") {
      errors.push("Гражданство обязательно");
    }

    if (errors.length > 0) {
      alert("Пожалуйста, исправьте ошибки:\n" + errors.join("\n"));
      return;
    }

    if (isEditing) {
      try {
        const jsonData = {};
        for (const key in payload) {
          if (
            key !== "photo" &&
            payload[key] !== undefined && 
            payload[key] !== null
          ) {
            jsonData[key] = payload[key];
          }
        }
        await updateResume(payload.id, jsonData);
        navigate("/authh");
      } catch (err) {
        console.error("Save error:", err);
        if (err.response && err.response.data) {
          const data = err.response.data;
          let message = "Не удалось сохранить изменения.";
          if (typeof data === "string") {
            message = data;
          } else if (data.errors) {
            message = Object.values(data.errors).flat().join("\n");
          } else if (data.title) {
            message = data.title;
          }
          alert(message);
        } else {
          alert("Не удалось сохранить изменения.");
        }
      }
    } else {
      setStep("themes");
    }
  };

  useEffect(() => {
    if (step === "form" && resumeData) {
      setNoPatronymic(!!resumeData.noPatronymic);
      setIsReadyForTrips(!!resumeData.isReadyForTrips);
      setGender(resumeData.gender || "Мужской");
      setHasChildren(!!resumeData.hasChildren);
      setHasMedicalBook(!!resumeData.hasMedicalBook);
    }
  }, [step, resumeData]);

  return (
    <>
      {step === "form" && (
        <main className="main__creater">
          <section>
            <h1>Основная информация</h1>
            <form
              autoComplete="off"
              className="main-info-form"
              onSubmit={handleSubmit}
            >
              <div className="photo-box" onClick={handlePhotoClick}>
                <input
                  type="file"
                  className="photo-input"
                  onChange={handlePhotoChange}
                  style={{ display: "none" }}
                  accept="image/*"
                  id="file-upload"
                />

                {resumeData.photo ? (
                  <img src={resumeData.photo} alt="Загруженное изображение" />
                ) : (
                  <div className="caption">Предоставьте фотографию</div>
                )}
              </div>
              <div className="main-info-fields">
                <input
                  placeholder="Фамилия *"
                  type="text"
                  name="lastName"
                  value={resumeData.lastName || ""}
                  onChange={handleInputChange}
                  required
                />
                <input
                  placeholder="Имя *"
                  type="text"
                  name="firstName"
                  value={resumeData.firstName || ""}
                  onChange={handleInputChange}
                  required
                />
                <input
                  placeholder="Отчество"
                  name="middleName"
                  type="text"
                  value={resumeData.middleName || ""}
                  onChange={handleInputChange}
                />
                <div className="checkbox-group">
                  <input
                    id="noPatronymics"
                    type="checkbox"
                    name="noPatronymic"
                    checked={noPatronymic}
                    onChange={(e) => {
                      setNoPatronymic(e.target.checked);
                      setResumeData((prev) => ({
                        ...prev,
                        noPatronymic: e.target.checked,
                      }));
                    }}
                  />
                  <label htmlFor="noPatronymics"> Нет отчества </label>
                </div>
                <input
                  placeholder="Дата рождения *"
                  type="date"
                  name="birthDate"
                  value={resumeData.birthDate ? new Date(resumeData.birthDate).toISOString().split('T')[0] : ""}
                  onChange={handleInputChange}
                />
                <input
                  placeholder="Номер телефона"
                  type="text"
                  name="phoneNumber"
                  value={resumeData.phoneNumber || ""}
                  onChange={handleInputChange}
                />
                <input
                  placeholder="Адрес эл. почты"
                  type="text"
                  name="email"
                  value={resumeData.email || ""}
                  onChange={handleInputChange}
                />
                <input
                  placeholder="Должность "
                  type="text"
                  name="position"
                  value={resumeData.position || ""}
                  onChange={handleInputChange}
                />
                <select
                  name="employment"
                  value={resumeData.employment || ""}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>
                    Занятость
                  </option>
                  <option>Полная</option>
                  <option>Частичная</option>
                  <option>Проектная</option>
                  <option>Временная</option>
                </select>
                <select
                  name="workSchedule"
                  value={resumeData.workSchedule || ""}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>
                    График работы
                  </option>
                  <option>Полный день</option>
                  <option>Сменный</option>
                  <option>Гибкий</option>
                  <option>Удалённая работа</option>
                  <option>Вахтовый метод</option>
                </select>
                <input
                  placeholder="Желаемая зарплата "
                  type="text"
                  name="desiredSalary"
                  value={resumeData.desiredSalary || ""}
                  onChange={handleInputChange}
                />
                <div className="checkbox-group">
                  <input
                    id="noPatronymic"
                    type="checkbox"
                    checked={isReadyForTrips}
                    onChange={(e) => {
                      setIsReadyForTrips(e.target.checked);
                      setResumeData((prev) => ({
                        ...prev,
                        isReadyForTrips: e.target.checked,
                      }));
                    }}
                  />
                  <label htmlFor="noPatronymic">
                    {" "}
                    Готовность к командировкам{" "}
                  </label>
                </div>
              </div>
            </form>
          </section>

          <section>
            <h2>Личная информация</h2>
            <form autoComplete="off" className="personal-info-form">
              <input
                placeholder="Город проживания *"
                type="text"
                name="city"
                value={resumeData.city}
                onChange={handleInputChange}
              />
              <select
                name="canRelocate"
                value={resumeData.canRelocate}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Переезд
                </option>
                <option>Возможен</option>
                <option>Невозможен</option>
              </select>
              <select
                name="citizenship"
                value={resumeData.citizenship}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Гражданство *
                </option>
                <option>Россия</option>
                <option>Другая страна</option>
              </select>

              <div className="radio-group">
                <h3>Пол *</h3>
                <label className="radio-btn">
                  <input
                    type="radio"
                    name="gender"
                    value="Мужской"
                    checked={resumeData.gender === "Мужской"}
                    onChange={handleInputChange}
                  />
                  <span>Мужской</span>
                </label>
                <label className="radio-btn">
                  <input
                    type="radio"
                    name="gender"
                    value="Женский"
                    checked={resumeData.gender === "Женский"}
                    onChange={handleInputChange}
                  />
                  <span>Женский</span>
                </label>
              </div>

              <input
                placeholder="Семейное положение"
                type="text"
                className="custom-inputt"
                name="maritalStatus"
                value={resumeData.maritalStatus}
                onChange={handleInputChange}
              />
              <div className="checkbox-groupp">
                <input
                  id="haveChildren"
                  type="checkbox"
                  name="hasChildren"
                  onChange={(e) => {
                    setHasChildren(e.target.checked);
                    setResumeData((prev) => ({
                      ...prev,
                      hasChildren: e.target.checked,
                    }));
                  }}
                  checked={resumeData.hasChildren}
                />
                <label htmlFor="haveChildren"> Есть дети </label>
              </div>
            </form>
          </section>

          <section>
            <details className="details">
              <summary>Опыт работы</summary>
              <form autoComplete="off" className="work-experience-form">
                <header>
                  <button aria-label="Закрыть">
                    <i className="fas fa-times"></i>
                  </button>
                </header>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Организация"
                    name="organization"
                    value={resumeData.workExperiences[0]?.organization || ""}
                    onChange={(e) => {
                      const newWorkExperiences = [
                        ...resumeData.workExperiences,
                      ];
                      newWorkExperiences[0] = {
                        ...newWorkExperiences[0],
                        organization: e.target.value,
                      };
                      setResumeData((prev) => ({
                        ...prev,
                        workExperiences: newWorkExperiences,
                      }));
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Должность"
                    name="workExpPosition"
                    value={resumeData.workExperiences[0]?.workExpPosition || ""}
                    onChange={(e) => {
                      const newWorkExperiences = [
                        ...resumeData.workExperiences,
                      ];
                      newWorkExperiences[0] = {
                        ...newWorkExperiences[0],
                        workExpPosition: e.target.value,
                      };
                      setResumeData((prev) => ({
                        ...prev,
                        workExperiences: newWorkExperiences,
                      }));
                    }}
                  />
                </div>
                <div className="form-group dates">
                  <div className="date-group">
                    <h3 className="label-text">Период работы с</h3>
                    <input
                      type="month"
                      name="startDate"
                      className="custom-input"
                      value={
                        resumeData.workExperiences[0]?.startDate
                          ? new Date(resumeData.workExperiences[0].startDate)
                              .toISOString()
                              .substring(0, 7)
                          : ""
                      }
                      onChange={(e) => {
                        const newWorkExperiences = [
                          ...resumeData.workExperiences,
                        ];
                        newWorkExperiences[0] = {
                          ...newWorkExperiences[0],
                          startDate: e.target.value
                            ? new Date(
                                e.target.value + "-01T00:00:00.000Z"
                              ).toISOString()
                            : null,
                        };
                        setResumeData((prev) => ({
                          ...prev,
                          workExperiences: newWorkExperiences,
                        }));
                      }}
                    />
                  </div>
                  <span>—</span>
                  <div className="date-group">
                    <h3 className="label-text">по</h3>
                    <input
                      type="month"
                      name="endDate"
                      className="custom-input"
                      value={
                        resumeData.workExperiences[0]?.endDate
                          ? new Date(resumeData.workExperiences[0].endDate)
                              .toISOString()
                              .substring(0, 7)
                          : ""
                      }
                      onChange={(e) => {
                        const newWorkExperiences = [
                          ...resumeData.workExperiences,
                        ];
                        newWorkExperiences[0] = {
                          ...newWorkExperiences[0],
                          endDate: e.target.value
                            ? new Date(
                                e.target.value + "-01T00:00:00.000Z"
                              ).toISOString()
                            : null,
                        };
                        setResumeData((prev) => ({
                          ...prev,
                          workExperiences: newWorkExperiences,
                        }));
                      }}
                    />
                  </div>
                  <label className="checkbox-groupp">
                    <input
                      type="checkbox"
                      checked={isCurrent}
                      onChange={(e) => {
                        setIsCurrent(e.target.checked);
                        const newWorkExperiences = [
                          ...resumeData.workExperiences,
                        ];
                        newWorkExperiences[0] = {
                          ...newWorkExperiences[0],
                          endDate: e.target.checked
                            ? null
                            : newWorkExperiences[0].endDate,
                        };
                        setResumeData((prev) => ({
                          ...prev,
                          workExperiences: newWorkExperiences,
                        }));
                      }}
                    />
                    по настоящее время
                  </label>
                </div>
                <textarea
                  placeholder="Должностные обязанности"
                  rows="4"
                  name="responsibilities"
                  value={resumeData.workExperiences[0]?.responsibilities || ""}
                  onChange={(e) => {
                    const newWorkExperiences = [...resumeData.workExperiences];
                    newWorkExperiences[0] = {
                      ...newWorkExperiences[0],
                      responsibilities: e.target.value,
                    };
                    setResumeData((prev) => ({
                      ...prev,
                      workExperiences: newWorkExperiences,
                    }));
                  }}
                ></textarea>
              </form>
            </details>
          </section>

          <section>
            <details className="details">
              <summary>Образование</summary>
              <form autoComplete="off" className="education-form">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Учебное заведение"
                    name="institution"
                    value={resumeData.educations[0]?.institution || ""}
                    onChange={(e) => {
                      const newEducations = [...resumeData.educations];
                      newEducations[0] = {
                        ...newEducations[0],
                        institution: e.target.value,
                      };
                      setResumeData((prev) => ({
                        ...prev,
                        educations: newEducations,
                      }));
                    }}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Специальность"
                    name="specialty"
                    value={resumeData.educations[0]?.specialty || ""}
                    onChange={(e) => {
                      const newEducations = [...resumeData.educations];
                      newEducations[0] = {
                        ...newEducations[0],
                        specialty: e.target.value,
                      };
                      setResumeData((prev) => ({
                        ...prev,
                        educations: newEducations,
                      }));
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Факультет"
                    name="faculty"
                    value={resumeData.educations[0]?.faculty || ""}
                    onChange={(e) => {
                      const newEducations = [...resumeData.educations];
                      newEducations[0] = {
                        ...newEducations[0],
                        faculty: e.target.value,
                      };
                      setResumeData((prev) => ({
                        ...prev,
                        educations: newEducations,
                      }));
                    }}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Год окончания"
                    className="custom-input"
                    name="graduationYear"
                    value={
                      resumeData.educations[0]?.graduationYear !== undefined &&
                      resumeData.educations[0]?.graduationYear !== null
                        ? String(resumeData.educations[0].graduationYear)
                        : ""
                    }
                    onChange={(e) => {
                      const newEducations = [...resumeData.educations];
                      newEducations[0] = {
                        ...newEducations[0],
                        graduationYear: e.target.value,
                      };
                      setResumeData((prev) => ({
                        ...prev,
                        educations: newEducations,
                      }));
                    }}
                  />
                  <select
                    name="studyForm"
                    value={resumeData.educations[0]?.studyForm || ""}
                    onChange={(e) => {
                      const newEducations = [...resumeData.educations];
                      newEducations[0] = {
                        ...newEducations[0],
                        studyForm: e.target.value,
                      };
                      setResumeData((prev) => ({
                        ...prev,
                        educations: newEducations,
                      }));
                    }}
                  >
                    <option value="" disabled>
                      Форма обучения
                    </option>
                    <option>Очная</option>
                    <option>Заочная</option>
                    <option>Очно-заочная(вечерняя)</option>
                  </select>
                </div>
              </form>
            </details>
          </section>

          <section>
            <h2>Дополнительная информация</h2>
            <form autoComplete="off" className="additional-info-form">
              <input
                placeholder="Владение иностранными языками"
                type="text"
                name="languages"
                value={resumeData.languages}
                onChange={handleInputChange}
              />

              <div className="checkbox-group">
                <h3>Водительские права:</h3>
                <label className="checkbox-btn">
                  <input
                    type="checkbox"
                    name="A"
                    checked={driverLicenses.includes("A")}
                    onChange={handleDriverLicenseChange}
                  />
                  <span>A</span>
                </label>
                <label className="checkbox-btn">
                  <input
                    type="checkbox"
                    name="B"
                    checked={driverLicenses.includes("B")}
                    onChange={handleDriverLicenseChange}
                  />
                  <span>B</span>
                </label>
                <label className="checkbox-btn">
                  <input
                    type="checkbox"
                    name="C"
                    checked={driverLicenses.includes("C")}
                    onChange={handleDriverLicenseChange}
                  />
                  <span>C</span>
                </label>
                <label className="checkbox-btn">
                  <input
                    type="checkbox"
                    name="D"
                    checked={driverLicenses.includes("D")}
                    onChange={handleDriverLicenseChange}
                  />
                  <span>D</span>
                </label>
                <label className="checkbox-btn">
                  <input
                    type="checkbox"
                    name="BE"
                    checked={driverLicenses.includes("BE")}
                    onChange={handleDriverLicenseChange}
                  />
                  <span>BE</span>
                </label>
                <label className="checkbox-btn">
                  <input
                    type="checkbox"
                    name="CE"
                    checked={driverLicenses.includes("CE")}
                    onChange={handleDriverLicenseChange}
                  />
                  <span>CE</span>
                </label>
                <label className="checkbox-btn">
                  <input
                    type="checkbox"
                    name="DE"
                    checked={driverLicenses.includes("DE")}
                    onChange={handleDriverLicenseChange}
                  />
                  <span>DE</span>
                </label>
                <label className="checkbox-btn">
                  <input
                    type="checkbox"
                    name="Tm"
                    checked={driverLicenses.includes("Tm")}
                    onChange={handleDriverLicenseChange}
                  />
                  <span>Tm</span>
                </label>
                <label className="checkbox-btn">
                  <input
                    type="checkbox"
                    name="Tb"
                    checked={driverLicenses.includes("Tb")}
                    onChange={handleDriverLicenseChange}
                  />
                  <span>Tb</span>
                </label>
              </div>

              <div className="checkbox-groupp">
                <input
                  id="havemedic"
                  type="checkbox"
                  checked={hasMedicalBook}
                  onChange={handleMedicalBookChange}
                />
                <label htmlFor="havemedic"> Есть медицинская книжка </label>
              </div>
              <textarea
                placeholder="Личные качества"
                rows="4"
                name="personalQualities"
                value={resumeData.personalQualities}
                onChange={handleInputChange}
              ></textarea>
            </form>
          </section>
          <button className="btn-submit" type="submit" onClick={handleSubmit}>
            Далее
          </button>
        </main>
      )}

      {!isEditing && step === "themes" && (
        <div className="templates-wrapper">
          {themes.map((tpl) => (
            <ThemeCard
              key={tpl.id}
              theme={tpl}
              onClick={() => handleSelectTheme(tpl)}
            />
          ))}
        </div>
      )}

      {!isEditing && step === "ready" && (
        <div className="resume-ready">
          <h2>Ваше резюме готово!</h2>
          <div className="resume-ready__actions">
            <button className="btn" onClick={() => navigate("/authh")}>
              В профиль
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Creater;
