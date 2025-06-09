import {
  collection,
  endBefore,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  where,
  or as OrQuery,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { db } from "../../../Config.js";
import {
  GetDataPaginatedReducer,
  INITIAL_STATE,
} from "./@Reducer/GetPaginatedDataReducer.js";
import { useCollectionCount } from "../useCollectionCount/useCollectionCount.jsx";
export const useGetCollectionWithPaginationInCursors = ({
  size = 6,
  orderByQueries = [{ field: "createdAt", direction: "desc" }],
  whereQueries = [],
  isDependantLoading,
  __collection__,
}) => {
  if (!orderByQueries) {
    orderByQueries = [{ field: "createdAt", direction: "desc" }];
  }
  const [Documnets, dispach] = useReducer(
    GetDataPaginatedReducer,
    INITIAL_STATE
  );
  const DocumnetsCollection = collection(db, __collection__);

  const memoOrderedByQueriesArray = useMemo(
    () => orderByQueries,
    [JSON.stringify(orderByQueries)]
  );
  const memoWhereQueries = useMemo(
    () => whereQueries,
    [JSON.stringify(whereQueries)]
  );

  const createQuery = () => {
    let q = query(DocumnetsCollection, limit(size));

    memoOrderedByQueriesArray.forEach(({ field, direction }) => {
      q = query(q, orderBy(field, direction));
    });

    memoWhereQueries.forEach(({ field, operator, value, or } = {}) => {
      if (
        field !== undefined &&
        value !== undefined &&
        operator !== undefined
      ) {
        if (
          or &&
          or.field !== undefined &&
          or.value !== undefined &&
          or.operator !== undefined
        ) {
          q = query(
            q,
            OrQuery(
              where(field, operator, value),
              where(or.field, or.operator, or.value)
            )
          );
        } else {
          q = query(q, where(field, operator, value));
        }
      }
    });

    return q;
  };

  const [queryRef, setQueryRef] = useState(createQuery());
  useEffect(() => {
    setQueryRef(createQuery());
    dispach({ type: "PAGE_RESET" });
  }, [memoOrderedByQueriesArray, memoWhereQueries]);

  const HandleGetDocumnets = useCallback(async () => {
    if (
      !isDependantLoading &&
      !memoWhereQueries.find((query) => query.value === undefined)
    ) {
      try {
        dispach({ type: "FETCH_START" });
        const res = await getDocs(queryRef);
        dispach({
          type: "FETCH_SUCCESS",
          payload: res.docs,
        });
      } catch (err) {
        dispach({
          type: "FETCH_ERROR",
          payload: err.message,
        });
      }
    } else {
      dispach({
        type: "FETCH_SUCCESS",
        payload: [],
      });
    }
  }, [queryRef]);

  useEffect(() => {
    HandleGetDocumnets();
  }, [HandleGetDocumnets]);

  const HandleGetNextPage = async () => {
    if (Documnets.data.length > 0) {
      const lastVisible = Documnets.data[Documnets.data.length - 1];
      const nextQuery = query(
        createQuery(),
        startAfter(lastVisible),
        limit(size)
      );
      setQueryRef(nextQuery);
      dispach({ type: "NEXT_PAGE" });
    }
  };

  const HandleGetPreviousPage = async () => {
    if (Documnets.data.length > 0) {
      const firstVisible = Documnets.data[0];
      const prevQuery = query(
        createQuery(),
        endBefore(firstVisible),
        limitToLast(size)
      );
      setQueryRef(prevQuery);
      dispach({ type: "PREVIOUS_PAGE" });
    }
  };

  const count = useCollectionCount({
    __collection__,
    whereQueries,
  });
  let pagesNumber = count?.count ? Math.floor(count?.count / size) : 0;
  const isDisabledNext =
    pagesNumber >= Documnets.page || Documnets.error || Documnets.loading;
  const isDisabledPrev = Documnets.page === 0;
  return {
    data: Documnets.data.map((doc) => ({ ...doc.data(), id: doc.id })),
    error: Documnets.error,
    loading: Documnets.loading,
    HandleGetNextPage,
    HandleGetPreviousPage,
    page: Documnets.page,
    isDisabledNext,
    isDisabledPrev,
    count,
    pagesNumber,
  };
};
