import { tryCatch } from "../../Utils/TryAndCatchHandler/TryAndCatchHandler";
import axiosInstance from "../../axiosConfig/axiosInstance";

export class Section {
  constructor({ title, description, is_done, course, AccessToken }) {
    this.title = title;
    this.description = description;
    this.is_done = is_done;
    this.course = course;
    this.AccessToken = AccessToken;
  }

  #getAllParams() {
    return { ...this };
  }

  async Add() {
    const { error, data } = await tryCatch(async () => {
      return await axiosInstance.post("/sections/", {
        ...this.#getAllParams(),
        order_id: 1,
      });
    });

    if (error) {
      return { error };
    }
    return { data };
  }

  async Update({ id }) {
    const { error, data } = await tryCatch(async () => {
      return await axiosInstance.put(`/sections/${id}/`, {
        ...this.#getAllParams(),
        order_id: 1,
      });
    });

    if (error) {
      return { error };
    }
    return { data };
  }

  static async Delete({ id }) {
    return tryCatch(async () => {
      return axiosInstance.delete(`/sections/${id}/`);
    });
  }
}
