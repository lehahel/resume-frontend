import { apiR } from "../api/axios";

export const getResumes = async () => {
  const res = await apiR.get("my");
  const resumes = res.data;
  
  // Fetch photos for each resume
  const resumesWithPhotos = await Promise.all(
    resumes.map(async (resume) => {
      try {
        const photoUrl = await getResumePhoto(resume.id ?? resume.Id);
        return { ...resume, photo: photoUrl };
      } catch (error) {
        console.error(`Failed to fetch photo for resume ${resume.id}:`, error);
        return resume;
      }
    })
  );
  
  return resumesWithPhotos;
};

export const createResume = async (payload) => {
  console.log("Отправляем данные для создания:", payload);
  const config = {};

  if (payload instanceof FormData) {
    config.headers = { "Content-Type": "multipart/form-data" };
  }

  const res = await apiR.post("", payload, config);
  const { Id, UniqueLink } = res.data;

  return {
    id: Id,
    uniqueLink: UniqueLink,
    ...payload,
  };
};

export const updateResume = async (id, payload) => {
  console.log(`Обновляем резюме ${id} с данными:`, payload);
  const config = {};

  if (payload instanceof FormData) {
    config.headers = { "Content-Type": "multipart/form-data" };
  }

  const res = await apiR.put(`${id}`, payload, config);
  const { Id, UniqueLink } = res.data;

  return {
    id: Id,
    uniqueLink: UniqueLink,
    ...payload,
  };
};

export const deleteResume = async (id) => {
  await apiR.delete(`${id}`);
};

export const downloadResume = async (id) => {
  const res = await apiR.get(`${id}/pdf`, {
    responseType: "blob",
  });
  return res.data;
};

export const uploadResumePhoto = async (id, photoFile) => {
  const formData = new FormData();
  formData.append("PhotoFile", photoFile);

  const config = {
    headers: { "Content-Type": "multipart/form-data" },
  };

  const res = await apiR.put(`${id}/photo`, formData, config);
  const photoUrl = await getResumePhoto(id);
  return { ...res.data, photo: photoUrl };
};

export const getResumePhoto = async (id) => {
  const res = await apiR.get(`${id}/photo`, {
    responseType: 'blob'
  });
  return URL.createObjectURL(res.data);
};
