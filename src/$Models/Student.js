import { tryCatch } from "../Utils/TryAndCatchHandler/TryAndCatchHandler";
import axiosInstance from "../axiosConfig/axiosInstance";
export class Student {
  static async createAccount({ email, name, sex, password, category, phone }) {
    const Request = await tryCatch(async () => {
      return await axiosInstance.post("/register/", {
        email,
        name,
        sex,
        password,
        category,
        phone,
        isInstructor: false,
      });
    });
    return Request;
  }

  static async Login({ email, password }) {
    const Request = await tryCatch(async () => {
      return await axiosInstance.post("/login/", {
        email,
        password,
      });
    });
    return Request;
  }
}
