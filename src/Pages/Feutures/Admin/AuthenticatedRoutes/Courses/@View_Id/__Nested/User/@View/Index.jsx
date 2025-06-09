import React from "react";
import CourseView from "../../../../../../../Student/AuthenticatedRoutes/Course/@View/index";

function Index() {
  // You can pass custom dimensions here for the admin view
  return (
    <CourseView containerWidth="95%" menuWidth="19rem" customGap="0.8rem" />
  );
}

export default Index;
