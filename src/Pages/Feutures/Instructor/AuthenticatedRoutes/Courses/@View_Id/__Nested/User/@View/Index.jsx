import React from "react";
import CourseView from "../../../../../../../Student/AuthenticatedRoutes/Course/@View/index";

function Index() {
  // Similar to the Admin view, but with slightly different dimensions for Instructor view
  return <CourseView containerWidth="90%" menuWidth="20rem" customGap="1rem" />;
}

export default Index;
