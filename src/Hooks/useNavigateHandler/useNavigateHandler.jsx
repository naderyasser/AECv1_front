import React, { useTransition } from "react";
import { useNavigate } from "react-router-dom";

export const useNavigateHandler = () => {
  const Navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const onNavigate = (path, options) => {
    startTransition(() => {
      Navigate(path, options);
    });
  };
  return {
    onNavigate,
    isPending,
  };
};
