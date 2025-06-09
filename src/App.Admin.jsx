import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { Footer } from "./Components/Layout/Index";
import { lazy, useEffect } from "react";
import { LazyPageWrapper } from "./Components/Common/Index";
import { ProtectedRoute } from "./Utils/ProtectedRoute/ProtectedRoute";
import { useAuth } from "./Context/UserDataProvider/UserDataProvider";
import { useAxiosTracker } from "./Hooks/useAxiosTracker/useAxiosTracker";
import { Progress } from "@chakra-ui/react";
const Login = lazy(() => import("./Pages/Feutures/Admin/Auth/Login/Index"));
const Main = lazy(() =>
  import("./Pages/Feutures/Admin/AuthenticatedRoutes/Index")
);
const Applications = lazy(() =>
  import("./Pages/Feutures/Admin/AuthenticatedRoutes/Applications/@View/Index")
);
const Users = lazy(() =>
  import("./Pages/Feutures/Admin/AuthenticatedRoutes/Users/@View/Index")
);
const Courses = lazy(() =>
  import("./Pages/Feutures/Admin/AuthenticatedRoutes/Courses/@View/Index")
);
const AddCourse = lazy(() =>
  import("./Pages/Feutures/Admin/AuthenticatedRoutes/Courses/@Add/Index")
);
const UpdateCourse = lazy(() =>
  import("./Pages/Feutures/Admin/AuthenticatedRoutes/Courses/@Update/Index")
);
const UserProfile = lazy(() =>
  import("./Pages/Feutures/Admin/AuthenticatedRoutes/Profile/Index")
);
const Course = lazy(() =>
  import("./Pages/Feutures/Admin/AuthenticatedRoutes/Courses/@View_Id/Index")
);
const CourseSections = lazy(() =>
  import(
    "./Pages/Feutures/Admin/AuthenticatedRoutes/Courses/@View_Id/__Nested/Sections/@View/Index"
  )
);
const CourseSectionAdd = lazy(() =>
  import(
    "./Pages/Feutures/Admin/AuthenticatedRoutes/Courses/@View_Id/__Nested/Sections/@Add/Index"
  )
);
const CourseSectionUpdate = lazy(() =>
  import(
    "./Pages/Feutures/Admin/AuthenticatedRoutes/Courses/@View_Id/__Nested/Sections/@Update/Index"
  )
);

const Categories = lazy(() =>
  import("./Pages/Feutures/Admin/AuthenticatedRoutes/Categories/@View/Index")
);
const SubCategories = lazy(() =>
  import("./Pages/Feutures/Admin/AuthenticatedRoutes/SubCategories/@View/Index")
);

const CourseQuizes = lazy(() =>
  import(
    "./Pages/Feutures/Admin/AuthenticatedRoutes/Courses/@View_Id/__Nested/Quizes/@View/Index"
  )
);
const CourseQuiz = lazy(() =>
  import(
    "./Pages/Feutures/Admin/AuthenticatedRoutes/Courses/@View_Id/__Nested/Quizes/@View_Id/Index"
  )
);
const CourseQuizAdd = lazy(() =>
  import(
    "./Pages/Feutures/Admin/AuthenticatedRoutes/Courses/@View_Id/__Nested/Quizes/@Add/Index"
  )
);
const CourseQuizUpdate = lazy(() =>
  import(
    "./Pages/Feutures/Admin/AuthenticatedRoutes/Courses/@View_Id/__Nested/Quizes/@Update/Index"
  )
);
const CourseQuizQuestionsAdd = lazy(() =>
  import(
    "./Pages/Feutures/Admin/AuthenticatedRoutes/Courses/@View_Id/__Nested/Quizes/@View_Id/__Nested/AddQuestionsAssignment/Index"
  )
);
const CourseQuizQuestionsUpdate = lazy(() =>
  import(
    "./Pages/Feutures/Admin/AuthenticatedRoutes/Courses/@View_Id/__Nested/Quizes/@View_Id/__Nested/UpdateQuestionAssignment/Index"
  )
);
const CourseQuizQuestions = lazy(() =>
  import(
    "./Pages/Feutures/Admin/AuthenticatedRoutes/Courses/@View_Id/__Nested/Quizes/@View_Id/__Nested/Questions/Index"
  )
);
const AssigmentsTypes = lazy(() =>
  import(
    "./Pages/Feutures/Admin/AuthenticatedRoutes/AssigmentsTypes/@View/Index"
  )
);
const CourseLessons = lazy(() =>
  import(
    "./Pages/Feutures/Admin/AuthenticatedRoutes/Courses/@View_Id/__Nested/Lessons/@View/Index"
  )
);
const CourseLesson = lazy(() =>
  import(
    "./Pages/Feutures/Admin/AuthenticatedRoutes/Courses/@View_Id/__Nested/Lessons/@View_Id/Index"
  )
);
const CourseLessonAdd = lazy(() =>
  import(
    "./Pages/Feutures/Admin/AuthenticatedRoutes/Courses/@View_Id/__Nested/Lessons/@Add/Index"
  )
);
const CourseLessonUpdate = lazy(() =>
  import(
    "./Pages/Feutures/Admin/AuthenticatedRoutes/Courses/@View_Id/__Nested/Lessons/@Update/Index"
  )
);
const CourseAttachments = lazy(() =>
  import(
    "./Pages/Feutures/Admin/AuthenticatedRoutes/Courses/@View_Id/__Nested/Attachments/@View/Index"
  )
);
const CourseMembers = lazy(() =>
  import(
    "./Pages/Feutures/Admin/AuthenticatedRoutes/Courses/@View_Id/__Nested/Members/@View/Index"
  )
);
const CourseUserView = lazy(() =>
  import(
    "./Pages/Feutures/Admin/AuthenticatedRoutes/Courses/@View_Id/__Nested/User/@View/Index"
  )
);

const Analytics = lazy(() =>
  import("./Pages/Feutures/Admin/AuthenticatedRoutes/Analytics/Index")
);

const AboutUsPage = lazy(() => import("./Pages/Landing/AboutUsPage"));

function App() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const isLoading = useAxiosTracker();
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
          <Route
            path="login"
            element={
              <ProtectedRoute
                navigate={{
                  to: "/",
                }}
                condition={!user.data}
              >
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute
                condition={user.data}
                navigate={{
                  to: "/login",
                }}
              >
                <Main />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<UserProfile />} />
            <Route path="Analytics" element={<Analytics />} />
            <Route path="/user" element={<UserProfile />} />
            <Route path="applications" element={<Applications />} />
            <Route path="*" element={<div style={{ minHeight: "100vh" }} />} />
            <Route path="Users" element={<Users />} />
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
            <Route path="categories" element={<Categories />} />
            <Route path="sub-categories" element={<SubCategories />} />
            <Route path="assigments-types" element={<AssigmentsTypes />} />
          </Route>
        </Routes>
        <Footer />
      </LazyPageWrapper>
    </>
  );
}

export default App;
