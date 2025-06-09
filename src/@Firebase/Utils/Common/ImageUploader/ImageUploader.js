import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../Config";
import { v4 } from "uuid";
import axios from "axios";

export const ImageUploader = async ({
  path,
  files,
  useBunny = false,
  onProgress,
}) => {
  try {
    // Get the user token from localStorage
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const token = userData?.data?.token?.access || userData?.data?.token;

    // Determine which base URL to use based on the environment variable
    const useProduction = import.meta.env.VITE_USE_PRODUCTION === "true";
    const baseUrl = useProduction
      ? import.meta.env.VITE_PRODUCTION_API_BASE_URL
      : import.meta.env.VITE_API_BASE_URL;

    const imageUploading = files.map(async (file) => {
      const dataUrlRegex =
        /^data:([a-zA-Z0-9+\/-]+\/[a-zA-Z0-9+\/-]+)?(;[a-zA-Z-]+=[a-zA-Z0-9-]+)*(;base64)?,[a-zA-Z0-9+/=]*$/;

      if (
        file instanceof File ||
        file instanceof Blob ||
        dataUrlRegex.test(file)
      ) {
        // Use BunnyCDN endpoint if specified
        if (useBunny) {
          const formData = new FormData();
          formData.append("file", file);

          const response = await axios.post(
            `${baseUrl}/bunnycdn/upload-image/`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
              onUploadProgress: (progressEvent) => {
                if (onProgress && typeof onProgress === "function") {
                  const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                  );
                  onProgress(percentCompleted);
                }
              },
            }
          );

          // Reset progress when done
          if (onProgress && typeof onProgress === "function") {
            onProgress(0);
          }

          return {
            URL: response.data.url,
            filePath: response.data.url,
          };
        } else {
          // Original Firebase upload logic
          const filePath = `${path}/${(file.name || "DATA_URL") + v4()}`;
          const fileRef = ref(storage, filePath);
          await uploadBytes(fileRef, file);
          const URL = await getDownloadURL(fileRef);
          return {
            URL,
            filePath,
          };
        }
      } else {
        return {
          URL: file,
        };
      }
    });
    return await Promise.all(imageUploading);
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};
