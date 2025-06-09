export const UpdateAccessToken = ({ access, refresh }) => {
  const User = localStorage.getItem("User");
  if (User) {
    localStorage.setItem(
      "User",
      JSON.stringify({
        ...JSON.parse(User),
        token: {
          access,
          refresh,
        },
      })
    );
  }
};
