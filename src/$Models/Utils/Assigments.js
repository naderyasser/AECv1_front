import { ImageUploader } from "../../@Firebase/Utils/Common/ImageUploader/ImageUploader";
import { tryCatch } from "../../Utils/TryAndCatchHandler/TryAndCatchHandler";
import axiosInstance from "../../axiosConfig/axiosInstance";

class AssigmentType {
  constructor({ name }) {
    this.name = name;
  }
  async Add() {
    const { error, data } = await tryCatch(async () => {
      return await axiosInstance.post("/assignment-types/", {
        name: this.name,
      });
    });
    if (error) {
      return {
        error,
      };
    }
    return {
      data,
    };
  }
  async Update(id) {
    const { error, data } = await tryCatch(async () => {
      return await axiosInstance.put(`/assignment-types/${id}/`, {
        name: this.name,
      });
    });

    if (error) {
      return { error };
    }

    return { data };
  }

  static async Delete({ id }) {
    return tryCatch(async () => {
      return axiosInstance.delete(`/assignment-types/${id}/`);
    });
  }
}

export class Question {
  constructor(props) {
    Object.assign(this, props);
  }

  static async AddQuestions({ id, questions = [], onProgress }) {
    const QuestionsSend = await Promise.all(
      questions.map(async (question) => {
        const DataSend = {
          question: question.question,
          answer: question.options.find((item) => {
            return item.key === question.correctAnswer;
          }).value,
          choices: question.options.map((option) => {
            return {
              title: option.value,
              is_correct: option.key === question.correctAnswer,
              ...option,
            };
          }),
          attachments: [],
        };
        if (question.attachment) {
          const [{ URL }] = await ImageUploader({
            path: "Questions-Attachments",
            files: [question.attachment],
            useBunny: true,
            onProgress,
          });
          DataSend.attachments = [
            {
              type: "image",
              title: question.attachment.name,
              url: URL,
            },
          ];
        }
        return DataSend;
      })
    );
    const { error, data } = await tryCatch(async () => {
      return await axiosInstance.post("/bulk-questions/", {
        assignment: id,
        questions: QuestionsSend,
      });
    });
    if (error) {
      return {
        error,
      };
    }
    return {
      data,
    };
  }

  static async UpdateQuestion({ id, question, onProgress }) {
    const DataSend = {
      question: question.question,
      answer: question.options.find((item) => {
        return item.key === question.correctAnswer;
      }).value,
      choices: question.options.map((option) => {
        return {
          title: option.value,
          is_correct: option.key === question.correctAnswer,
          ...option,
        };
      }),
      attachments: [],
      assignment: question.assignment,
    };

    if (question.attachment) {
      const [{ URL }] = await ImageUploader({
        path: "Questions-Attachments",
        files: [question.attachment],
        useBunny: true,
        onProgress,
      });
      DataSend.attachments = [
        {
          type: "image",
          title: question.attachment.name,
          url: URL,
        },
      ];
    }

    const { error, data } = await tryCatch(async () => {
      return await axiosInstance.put(`/questions/${id}/`, DataSend);
    });

    if (error) {
      return {
        error,
      };
    }
    return {
      data,
    };
  }

  static async DeleteQuestion({ id }) {
    return tryCatch(async () => {
      return axiosInstance.delete(`/questions/${id}/`);
    });
  }
}

export class Assigment {
  static Type = AssigmentType;
  constructor(props) {
    Object.assign(this, props);
  }
  #getAllParams() {
    return { ...this };
  }
  async Add() {
    const { error, data } = await tryCatch(async () => {
      return await axiosInstance.post("/assignments/", this.#getAllParams());
    });
    if (error) {
      return {
        error,
      };
    }
    return {
      data,
    };
  }
  async Update(id) {
    const { error, data } = await tryCatch(async () => {
      return await axiosInstance.put(
        `/assignments/${id}/`,
        this.#getAllParams()
      );
    });

    if (error) {
      return { error };
    }

    return { data };
  }

  static async Delete({ id }) {
    return tryCatch(async () => {
      return axiosInstance.delete(`/assignments/${id}/`);
    });
  }

  static async GetAll({ section_id }) {
    return tryCatch(async () => {
      const response = await axiosInstance.get(
        `/assignments/section/${section_id}/`
      );
      return response;
    });
  }
}
