export const handleTutorButtonClick = () => {
  // Check if user data exists in localStorage
  const userDataString = localStorage.getItem("User");

  if (!userDataString) {
    // If no user is logged in, navigate to instructor register page
    return BaseNavigationHandler("instructor/register");
  }

  try {
    // Parse the user data
    const userData = JSON.parse(userDataString);

    // Check if user has already submitted an application
    if (userData && userData.is_send_application === true) {
      // Navigate to application status page
      return BaseNavigationHandler("instructor/application-status");
    } else {
      // If they're logged in but haven't submitted an application, navigate to instructor register
      return BaseNavigationHandler("instructor/register");
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
    // If there's an error, default to instructor register
    return BaseNavigationHandler("instructor/register");
  }
};

export const BaseNavigationHandler = (path) => {
  // Use the path parameter to determine where to navigate
  window.location.href = path ? `/${path}` : "/";
};
