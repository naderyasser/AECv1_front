import { useCallback, useEffect, useState } from "react";
import { getFirebaseErrorMessageInArabic } from "../../../__lib__/ErrorTranslator";
import { db } from "../../../Config";
import { doc, getDoc } from "firebase/firestore";

export const useGetDoc = ({ __collection__, docId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);
  const [data, setData] = useState(undefined);

  const onGetDoc = useCallback(async () => {
    setLoading(true);
    try {
      const docRef = doc(db, __collection__, docId);
      const res = await getDoc(docRef, data);
      if (!res.exists()) {
        setError("لم يتم العثور علي العنصر");
        return;
      }
      setData({ ...res.data(), id: res.id });
      return res.data();
    } catch (err) {
      if (err.code) {
        setError(getFirebaseErrorMessageInArabic(err.code));
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [docId, __collection__]);

  useEffect(() => {
    onGetDoc();
  }, [onGetDoc]);
  return { data, error, loading };
};
