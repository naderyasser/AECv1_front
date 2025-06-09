import { addDoc, collection } from "firebase/firestore/lite";
import { useCallback, useState } from "react";
import { getFirebaseErrorMessageInArabic } from "../../../__lib__/ErrorTranslator";
import { db } from "../../../Config";

export const useAddDoc = ({ __collection__ }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const onAdd = useCallback(async (data) => {
    setLoading(true);
    try {
      const collectionRef = collection(db, __collection__);
      await addDoc(collectionRef, data);
      return "تم الاضافة بنجاح";
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
  return { onAdd, error, loading };
};
