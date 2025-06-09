import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../Config";

export class Document {
  static async Get({ id, __collection__ }) {
    try {
      const docRef = doc(db, __collection__, id);
      const res = await getDoc(docRef);
      if (!res.exists()) {
        return {
          isExist: false,
        };
      }
      return {
        ...res.data(),
        id: res.id,
      };
    } catch (err) {
      throw new Error(err.code);
    }
  }
}
