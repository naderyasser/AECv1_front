import { ImageUploader } from "../../@Firebase/Utils/Common/ImageUploader/ImageUploader";
import { tryCatch } from "../../Utils/TryAndCatchHandler/TryAndCatchHandler";
import axiosInstance from "../../axiosConfig/axiosInstance";

export class Course {
  constructor({
    image,
    title,
    level,
    price,
    language,
    category,
    subCategory,
    description,
    AccessToken,
    userId,
    id,
    courseFiles = [],
    removedAttachments = [],
  }) {
    this.image = image;
    this.title = title;
    this.level = level;
    this.price = price;
    this.language = language;
    this.category = category;
    this.subCategory = subCategory;
    this.description = description;
    this.AccessToken = AccessToken;
    this.userId = userId;
    this.id = id;
    this.course_attachment = courseFiles;
    this.removedAttachments = removedAttachments;
  }
  #getAllParams() {
    return { ...this };
  }

  // Helper method to upload multiple files
  async #uploadCourseFiles(onProgress) {
    if (!this.course_attachment || this.course_attachment.length === 0) {
      return [];
    }

    try {
      const uploadedFiles = await ImageUploader({
        path: "CourseFiles",
        files: this.course_attachment,
        useBunny: true,
        onProgress: (progress) => {
          if (typeof onProgress === "function") onProgress(progress * 0.7);
        },
      });

      // Format attachments to match the required structure
      return uploadedFiles.map(({ URL }, index) => {
        const file = this.course_attachment[index];
        const fileName = URL.id ? file.title : file.name;
        const fileType = URL.id ? file.type : this.#getFileType(fileName);

        return {
          title: fileName,
          type: fileType,
          url: URL.id ? URL.url : URL,
        };
      });
    } catch (error) {
      console.error("Error uploading course files:", error);
      throw error;
    }
  }

  // Helper to determine file type - now used in the refactored structure
  #getFileType(filePath) {
    const extension = filePath.split(".").pop().toLowerCase();
    if (["doc", "docx", "pdf", "xls", "xlsx", "txt"].includes(extension))
      return "document";
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) return "image";
    if (["mp4", "avi", "mov", "wmv"].includes(extension)) return "video";
    return "other";
  }

  async Add(onProgress) {
    // Upload course image
    const [{ URL: imageURL }] = await ImageUploader({
      path: "Courses",
      files: [this.image],
      onProgress: (progress) => {
        if (onProgress) onProgress(progress * 0.3); // Allocate 30% of progress to image upload
      },
    });

    // Upload course files if any
    const courseAttachments = await this.#uploadCourseFiles((progress) => {
      if (onProgress) onProgress(30 + progress); // Start from 30% (after image upload)
    });

    if (onProgress) onProgress(95); // Almost done, just saving to database now

    const { error, data } = await tryCatch(async () => {
      return await axiosInstance.post("/courses/", {
        ...this.#getAllParams(),
        image: imageURL,
        user: this.userId,
        sub_category: this.subCategory,
        course_attachment: courseAttachments, // Use course_attachment instead of attachments
      });
    });

    if (onProgress) onProgress(0); // Reset progress or set to 100 to indicate completion

    if (error) {
      return { error };
    }
    return { data };
  }

  async Update(onProgress) {
    let imageURL = this.image;
    const courseId = this.id;

    if (this.image instanceof File) {
      const [{ URL }] = await ImageUploader({
        path: "Courses",
        files: [this.image],
        onProgress: (progress) => {
          if (onProgress) onProgress(progress * 0.3);
        },
      });
      imageURL = URL;
    }

    // Upload any new course files (only files that are File objects)
    const newFiles = Array.isArray(this.course_attachment)
      ? this.course_attachment.filter((file) => file instanceof File)
      : [];

    let courseAttachments = [];

    if (newFiles.length > 0) {
      courseAttachments = await this.#uploadCourseFiles((progress) => {
        if (onProgress) onProgress(30 + progress * 0.6); // Start from 30%, allocate 60% to file uploads function
      });
    }

    if (onProgress) onProgress(90); // Almost done, just saving to database nowis a function

    // For existing files that are not File objects, preserve them
    // But exclude any that are in the removedAttachments array
    const existingAttachments = Array.isArray(this.course_attachment)
      ? this.course_attachment
          .filter((file) => !(file instanceof File))
          .filter((file) => !this.removedAttachments.includes(file.id))
          .map((file) => {
            if (typeof file === "string") return { url: file };
            if (file && file.url)
              return {
                url: file.url,
                id: file.id,
                title: file.title,
                type: file.type,
              };
            return file;
          })
      : [];

    // Use existing attachments if no new files are uploaded
    const finalAttachments =
      newFiles.length > 0 ? courseAttachments : existingAttachments;

    const updatedData = {
      title: this.title,
      description: this.description,
      level: this.level,
      price: this.price,
      language: this.language,
      category: this.category,
      sub_category: this.subCategory,
      image: imageURL,
      user: this.userId,
      course_attachment: finalAttachments,
    };

    const { error, data } = await tryCatch(async () => {
      return await axiosInstance.put(`/courses/${courseId}/`, updatedData);
    });

    if (onProgress) onProgress(0); // Reset progress when donesure onProgress is a function

    if (error) {
      return { error };
    }

    return { data };
  }

  static async Delete({ id }) {
    return tryCatch(async () => {
      return axiosInstance.delete(`/courses/${id}/`);
    });
  }
}
