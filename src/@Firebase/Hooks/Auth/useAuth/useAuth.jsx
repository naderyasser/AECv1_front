import { useEffect, useReducer } from "react";
import { GetUserDataReducer, INITIAL_STATE } from "./Reducer/GetUserReducer";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../Config";
import { doc, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
export const useAuth = () => {
  const [user, dispatch] = useReducer(GetUserDataReducer, INITIAL_STATE);

  const GetUserAditionalData = async (user) => {
    const userDoc = doc(db, "Users", user.uid);
    onSnapshot(userDoc, (userRes) => {
      if (userRes.exists()) {
        const data = Object.assign(user, userRes.data(), {
          accountType: "User",
        });
        dispatch({
          type: "FETCH_SUCCESS",
          payload: data,
        });
        return data;
      } else {
        signOut(auth);
      }
    });
  };

  const GetUserData = (user) => {
    dispatch({
      type: "FETCH_START",
    });
    if (user) {
      GetUserAditionalData(user);
    } else {
      dispatch({
        type: "FETCH_SUCCESS",
        payload: undefined,
      });
    }
  };
  const onGetUserData = () => {
    dispatch({
      type: "FETCH_START",
    });
    if (user) {
      GetUserAditionalData(user);
    } else {
      dispatch({
        type: "FETCH_SUCCESS",
        payload: undefined,
      });
    }
  };

  const HandleError = (error) => {
    dispatch({
      type: "FETCH_ERROR",
      payload: error,
    });
  };

  const HandleRender = () => {
    dispatch({
      type: "FETCH_RENDER",
    });
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, GetUserData, HandleError);
    return () => {
      unSubscribe();
    };
  }, [user.render]);

  return { user, HandleRender, onGetUserData };
};
