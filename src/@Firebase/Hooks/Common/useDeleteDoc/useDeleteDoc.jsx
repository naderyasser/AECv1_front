import { useCallback, useState } from "react";
import { getFirebaseErrorMessageInArabic } from "../../../__lib__/ErrorTranslator";
import { db } from "../../../Config";
import { deleteDoc, doc } from "firebase/firestore";

export const useDeleteDoc = ({ __collection__, docId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const onDelete = useCallback(async (data) => {
    setLoading(true);
    try {
      const docRef = doc(db, __collection__, docId);
      await deleteDoc(docRef, data);
      return "تم الازالة بنجاح";
    } catch (err) {
      if (err.code) {
        setError(getFirebaseErrorMessageInArabic(err.code));
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);
  return { onDelete, error, loading };
};
