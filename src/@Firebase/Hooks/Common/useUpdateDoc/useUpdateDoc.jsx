import { useCallback, useState } from "react";
import { getFirebaseErrorMessageInArabic } from "../../../__lib__/ErrorTranslator";
import { db } from "../../../Config";
import { doc, updateDoc } from "firebase/firestore";

export const useUpdateDoc = ({ __collection__, docId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const onUpdate = useCallback(async (data) => {
    setLoading(true);
    try {
      const docRef = doc(db, __collection__, docId);
      await updateDoc(docRef, data);
      return "تم التحديث بنجاح";
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
  return { onUpdate, error, loading };
};
