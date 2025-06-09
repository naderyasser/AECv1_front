export const getToken = () => {
  const User = localStorage.getItem("User");
  if (User) {
    return JSON.parse(User).token;
  }
};
