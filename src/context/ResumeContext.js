import { createContext, useContext, useState, useEffect } from "react";
import {
  getResumes,
  createResume,
  updateResume as apiUpdate,
  deleteResume,
  uploadResumePhoto,
} from "../services/ResumeService";

const ResumeContext = createContext(null);

export const ResumeProvider = ({ children }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getResumes();

        const normalized = data.map((r) => ({
          ...r,
          id: r.id ?? r.Id,
        }));
        setResumes(normalized);
      } catch (e) {
        console.error("Failed to fetch resumes:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const createResumeData = async (payload) => {
    const created = await createResume(payload);
    setResumes((prev) => [...prev, created]);
    return created;
  };

  const updateResumeData = async (id, payload) => {
    const updated = await apiUpdate(id, payload);

    const normalized = {
      ...updated,
      id: updated.id ?? updated.Id,
    };
    setResumes((prev) => prev.map((r) => (r.id === id ? normalized : r)));
    return normalized;
  };

  const uploadResumePhotoData = async (id, photoFile) => {
    const updatedResume = await uploadResumePhoto(id, photoFile);
    setResumes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, photo: updatedResume.photo } : r))
    );
    return updatedResume;
  };

  const deleteResumeData = async (id) => {
    await deleteResume(id);
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <ResumeContext.Provider
      value={{
        resumes,
        loading,
        createResumeData,
        updateResumeData,
        uploadResumePhotoData,
        deleteResumeData,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used within ResumeProvider");
  return ctx;
};
