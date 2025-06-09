import {
  collection,
  collectionGroup,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useMemo, useReducer, useState } from "react";
import { db } from "../../../Config";
import {
  GetCollectionCountReducer,
  INITIAL_STATE,
} from "./Reducer/GetCollectionCountReducer";
export const useCollectionCount = ({
  __collection__,
  whereQueries = [],
  isCollectionGroup,
}) => {
  const [collectionData, dispach] = useReducer(
    GetCollectionCountReducer,
    INITIAL_STATE
  );

  const memoWhereQueries = useMemo(
    () => whereQueries,
    [JSON.stringify(whereQueries)]
  );
  let collectionRef;
  if (isCollectionGroup) {
    collectionRef = collectionGroup(db, __collection__);
  }
  if (!isCollectionGroup) {
    collectionRef = collection(db, __collection__);
  }
  const createQuery = () => {
    let q = query(collectionRef);
    memoWhereQueries.forEach(({ field, operator, value }) => {
      if (value) {
        q = query(q, where(field, operator, value));
      }
    });

    return q;
  };

  const [queryRef, setQueryRef] = useState(createQuery());
  useEffect(() => {
    setQueryRef(createQuery());
  }, [memoWhereQueries]);

  const GetCollectionData = async () => {
    try {
      dispach({
        type: "FETCH_START",
      });
      const CollectionCount = await getCountFromServer(queryRef);
      dispach({
        type: "FETCH_SUCCESS",
        payload: CollectionCount?.data()?.count,
      });
    } catch (err) {
      dispach({
        type: "FETCH_ERROR",
        payload: err.message,
      });
    }
  };
  const HandleRender = () => {
    GetCollectionData();
  };
  useEffect(() => {
    GetCollectionData();
  }, [queryRef]);
  return { ...collectionData, HandleRender };
};
