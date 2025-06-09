export const switchUserRole = (newRole, navigateImmediately = true) => {
  // Validate the role
  if (!["admin", "student", "instructor"].includes(newRole.toLowerCase())) {
    console.error("Invalid role specified for switching");
    return;
  }

  // Store the new role in localStorage
  localStorage.setItem("role", newRole.toLowerCase());

  // Navigate to the appropriate route only if navigateImmediately is true
  if (navigateImmediately) {
    window.location.href = `/${newRole.toLowerCase()}`;
  }

  return newRole.toLowerCase();
};
