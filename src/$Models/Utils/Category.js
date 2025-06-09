import { tryCatch } from "../../Utils/TryAndCatchHandler/TryAndCatchHandler";
import axiosInstance from "../../axiosConfig/axiosInstance";

class BaseCategory {
  constructor({ title }) {
    this.title = title;
  }

  async Add(endpoint) {
    return tryCatch(() => axiosInstance.post(endpoint, { title: this.title }));
  }

  async Update(id, endpoint) {
    return tryCatch(() =>
      axiosInstance.put(`${endpoint}/${id}/`, { title: this.title })
    );
  }

  static async Delete(id, endpoint) {
    return tryCatch(() => axiosInstance.delete(`${endpoint}/${id}/`));
  }
}

export class Category extends BaseCategory {
  async Add() {
    return super.Add("/categories/");
  }

  async Update(id) {
    return super.Update(id, "/categories");
  }

  static async Delete(id) {
    return super.Delete(id, "/categories");
  }
}

export class SubCategory extends BaseCategory {
  async Add() {
    return super.Add("/sub-categories/");
  }

  async Update(id) {
    return super.Update(id, "/sub-categories");
  }

  static async Delete(id) {
    return super.Delete(id, "/sub-categories");
  }
}
