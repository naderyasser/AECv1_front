import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { UserDataProvider } from "./Context/UserDataProvider/UserDataProvider";
import { LazyPageWrapper } from "./Components/Common/Index";
import { TabsMenuExpandProvider } from "./Context/TabsMenuExpandProvider/TabsMenuExpandProvider";
import { BaseNavigationHandler } from "./Utils/BaseNavigationHandler/BaseNavigationHandler";
import "./Utils/ApiTest/ApiTest"; // Import API test utility

const Student = lazy(() => import("./App.Student"));
const Admin = lazy(() => import("./App.Admin"));
const Instructor = lazy(() => import("./App.Instructor"));

const route = window.location.pathname.split("/")[1];

const MainRoutes = [
  { href: "admin", Component: Admin, role: "admin" },
  { href: "student", Component: Student, role: "student" },
  { href: "instructor", Component: Instructor, role: "instructor" },
];

// If no route is specified, default to student
if (!route) {
  window.location.href = "/student";
}

const getUserRole = () => {
  const roleFromLocalStorage = localStorage.getItem("role");
  if (roleFromLocalStorage) {
    return roleFromLocalStorage.toLowerCase();
  }

  // Fall back to user data in localStorage
  const User = localStorage.getItem("User");
  if (User) {
    const parsedUser = JSON.parse(User);
    // Store the role in localStorage for future use
    if (parsedUser.role) {
      localStorage.setItem("role", parsedUser.role.toLowerCase());
    }
    return parsedUser.role?.toLowerCase() || "student";
  }

  return "student";
};

// Handle route-role mismatch
const currentRole = getUserRole();
if (route && currentRole && route !== currentRole) {
  // Only redirect if there's an actual mismatch and the user is authenticated
  const User = localStorage.getItem("User");
  if (User) {
    // Check for special paths that should be accessible from any role
    const specialPaths = [
      "register",
      "application-status",
      "application",
      "login",
    ];

    // Get the current path without the base route
    const pathAfterRoute = window.location.pathname.replace(`/${route}`, "");
    const pathSegments = pathAfterRoute.split("/").filter(Boolean);

    // Check if any segment of the current path is in specialPaths
    const isSpecialPath = pathSegments.some((segment) =>
      specialPaths.includes(segment)
    );

    // Also check if this is an instructor application-related page that students can access
    const isInstructorApplicationPage =
      route === "instructor" &&
      (pathSegments.includes("application-status") ||
        pathSegments.includes("register"));

    // Only redirect if not accessing a special path or instructor application page
    if (!isSpecialPath && !isInstructorApplicationPage) {
      BaseNavigationHandler(`./${currentRole}`);
    }
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LazyPageWrapper>
      {MainRoutes.map((Route) => {
        if (route === Route.href) {
          return (
            <ChakraProvider
              toastOptions={{
                defaultProps: {
                  position: "top-right",
                  duration: 3000,
                  isClosable: true,
                },
              }}
              key={Route.href}
            >
              <UserDataProvider>
                <BrowserRouter basename={`/${Route.href}`}>
                  <TabsMenuExpandProvider>
                    <Route.Component />
                  </TabsMenuExpandProvider>
                </BrowserRouter>
              </UserDataProvider>
            </ChakraProvider>
          );
        }
      })}
    </LazyPageWrapper>
  </StrictMode>
);
