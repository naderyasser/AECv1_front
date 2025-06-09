import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { Footer } from "./Components/Layout/Index";
import { lazy, useEffect } from "react";
import { LazyPageWrapper } from "./Components/Common/Index";
import { ProtectedRoute } from "./Utils/ProtectedRoute/ProtectedRoute";
import { useAuth } from "./Context/UserDataProvider/UserDataProvider";
import { useAxiosTracker } from "./Hooks/useAxiosTracker/useAxiosTracker";
import { Progress } from "@chakra-ui/react";

const Register = lazy(() =>
  import("./Pages/Feutures/Instructor/Auth/Register2/Index")
);
const Login = lazy(() =>
  import("./Pages/Feutures/Instructor/Auth/Login/Index")
);
const ApplicationStatus = lazy(() =>
  import("./Pages/Feutures/Instructor/Auth/ApplicationStatus/Index")
);
const Main = lazy(() =>
  import("./Pages/Feutures/Instructor/AuthenticatedRoutes/Index")
);
const UserProfile = lazy(() =>
  import("./Pages/Feutures/Instructor/AuthenticatedRoutes/UserProfile/Index")
);

// Course Management Routes
const Applications = lazy(() =>
  import(
    "./Pages/Feutures/Instructor/AuthenticatedRoutes/Applications/@View/Index"
  )
);
const Courses = lazy(() =>
  import("./Pages/Feutures/Instructor/AuthenticatedRoutes/Courses/@View/Index")
);
const AddCourse = lazy(() =>
  import("./Pages/Feutures/Instructor/AuthenticatedRoutes/Courses/@Add/Index")
);
const UpdateCourse = lazy(() =>
  import(
    "./Pages/Feutures/Instructor/AuthenticatedRoutes/Courses/@Update/Index"
  )
);
const Course = lazy(() =>
  import(
    "./Pages/Feutures/Instructor/AuthenticatedRoutes/Courses/@View_Id/Index"
  )
);
const CourseSections = lazy(() =>
  import(
    "./Pages/Feutures/Instructor/AuthenticatedRoutes/Courses/@View_Id/__Nested/Sections/@View/Index"
  )
);
const CourseSectionAdd = lazy(() =>
  import(
    "./Pages/Feutures/Instructor/AuthenticatedRoutes/Courses/@View_Id/__Nested/Sections/@Add/Index"
  )
);
const CourseSectionUpdate = lazy(() =>
  import(
    "./Pages/Feutures/Instructor/AuthenticatedRoutes/Courses/@View_Id/__Nested/Sections/@Update/Index"
  )
);

// Quiz Related Routes
const CourseQuizes = lazy(() =>
  import(
    "./Pages/Feutures/Instructor/AuthenticatedRoutes/Courses/@View_Id/__Nested/Quizes/@View/Index"
  )
);
const CourseQuiz = lazy(() =>
  import(
    "./Pages/Feutures/Instructor/AuthenticatedRoutes/Courses/@View_Id/__Nested/Quizes/@View_Id/Index"
  )
);
const CourseQuizAdd = lazy(() =>
  import(
    "./Pages/Feutures/Instructor/AuthenticatedRoutes/Courses/@View_Id/__Nested/Quizes/@Add/Index"
  )
);
const CourseQuizUpdate = lazy(() =>
  import(
    "./Pages/Feutures/Instructor/AuthenticatedRoutes/Courses/@View_Id/__Nested/Quizes/@Update/Index"
  )
);
const CourseQuizQuestionsAdd = lazy(() =>
  import(
    "./Pages/Feutures/Instructor/AuthenticatedRoutes/Courses/@View_Id/__Nested/Quizes/@View_Id/__Nested/AddQuestionsAssignment/Index"
  )
);
const CourseQuizQuestionsUpdate = lazy(() =>
  import(
    "./Pages/Feutures/Instructor/AuthenticatedRoutes/Courses/@View_Id/__Nested/Quizes/@View_Id/__Nested/UpdateQuestionAssignment/Index"
  )
);
const CourseQuizQuestions = lazy(() =>
  import(
    "./Pages/Feutures/Instructor/AuthenticatedRoutes/Courses/@View_Id/__Nested/Quizes/@View_Id/__Nested/Questions/Index"
  )
);

// Lesson Related Routes
const CourseLessons = lazy(() =>
  import(
    "./Pages/Feutures/Instructor/AuthenticatedRoutes/Courses/@View_Id/__Nested/Lessons/@View/Index"
  )
);
const CourseLesson = lazy(() =>
  import(
    "./Pages/Feutures/Instructor/AuthenticatedRoutes/Courses/@View_Id/__Nested/Lessons/@View_Id/Index"
  )
);
const CourseLessonAdd = lazy(() =>
  import(
    "./Pages/Feutures/Instructor/AuthenticatedRoutes/Courses/@View_Id/__Nested/Lessons/@Add/Index"
  )
);
const CourseLessonUpdate = lazy(() =>
  import(
    "./Pages/Feutures/Instructor/AuthenticatedRoutes/Courses/@View_Id/__Nested/Lessons/@Update/Index"
  )
);

// Additional Course Routes
const CourseAttachments = lazy(() =>
  import(
    "./Pages/Feutures/Instructor/AuthenticatedRoutes/Courses/@View_Id/__Nested/Attachments/@View/Index"
  )
);
const CourseMembers = lazy(() =>
  import(
    "./Pages/Feutures/Instructor/AuthenticatedRoutes/Courses/@View_Id/__Nested/Members/@View/Index"
  )
);
const CourseUserView = lazy(() =>
  import(
    "./Pages/Feutures/Instructor/AuthenticatedRoutes/Courses/@View_Id/__Nested/User/@View/Index"
  )
);

// Analytics
const Analytics = lazy(() =>
  import("./Pages/Feutures/Instructor/AuthenticatedRoutes/Analytics/Index")
);

const AboutUsPage = lazy(() => import("./Pages/Landing/AboutUsPage"));

function App() {
  const { pathname } = useLocation();
  const isLoading = useAxiosTracker();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      {isLoading && (
        <Progress
          pos="fixed"
          top="0"
          w="100%"
          h="5px"
          zIndex="1000"
          size="xs"
          isIndeterminate
        />
      )}
      <LazyPageWrapper>
        <Routes>
          {" "}
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route
            path="application-status/:status"
            element={<ApplicationStatus />}
          />
          <Route path="/" element={<Main />}>
            <Route index element={<UserProfile />} />
            <Route path="Analytics" element={<Analytics />} />
            <Route path="/user" element={<UserProfile />} />
            <Route path="applications" element={<Applications />} />
            <Route path="*" element={<div style={{ minHeight: "100vh" }} />} />

            <Route path="courses">
              <Route index element={<Courses />} />
              <Route path="add" element={<AddCourse />} />
              <Route path=":id/update" element={<UpdateCourse />} />
              <Route path=":id" element={<Course />}>
                <Route index element={<CourseSections />} />
                <Route path="sections" element={<CourseSections />} />
                <Route path="sections/add" element={<CourseSectionAdd />} />
                <Route
                  path="sections/:sectionId/update"
                  element={<CourseSectionUpdate />}
                />
                <Route path="quizes" element={<CourseQuizes />} />
                <Route path="quizes/:quizId" element={<CourseQuiz />}>
                  <Route path="questions" element={<CourseQuizQuestions />} />
                  <Route
                    path="questions/:questionId/UpdateQuestions"
                    element={<CourseQuizQuestionsUpdate />}
                  />
                  <Route
                    path="AddQuestions"
                    element={<CourseQuizQuestionsAdd />}
                  />
                </Route>
                <Route path="quizes/add" element={<CourseQuizAdd />} />
                <Route
                  path="quizes/:quizId/update"
                  element={<CourseQuizUpdate />}
                />
                <Route path="lessons" element={<CourseLessons />} />
                <Route path="lessons/:lessonId" element={<CourseLesson />} />
                <Route path="lessons/add" element={<CourseLessonAdd />} />
                <Route
                  path="lessons/:lessonId/update"
                  element={<CourseLessonUpdate />}
                />
                <Route path="attachments" element={<CourseAttachments />} />
                <Route path="members" element={<CourseMembers />} />
                <Route path="userView" element={<CourseUserView />} />
                <Route path="*" element />
              </Route>
            </Route>
          </Route>
        </Routes>
        <Footer />
      </LazyPageWrapper>
    </>
  );
}

export default App;
