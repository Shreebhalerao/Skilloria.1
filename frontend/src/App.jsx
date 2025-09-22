import { Route, Routes } from "react-router-dom"
import { useSelector } from "react-redux"
import Home from "./pages/Home"
import NavBar from "./components/common/NavBar"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import VerifyEmail from "./pages/VerifyEmail"
import MyProfile from "./components/core/HomePage/Dashboard/MyProfile"
import Settings from "./components/core/HomePage/Dashboard/Settings/Settings"
import Catalog from "./pages/Catalog"
import CourseDetails from "./pages/CourseDetails"
import ProtectedRoute from "./components/core/HomePage/Auth/ProtectedRoute"
import Dashboard from "./pages/Dashboard"
import Cart from "./components/core/HomePage/Dashboard/Cart/Cart"
import Contact from "./pages/Contact"
import AddCourse from "./components/core/HomePage/Dashboard/AddCourse/AddCourse"
import About from "./pages/About"
import MyCourses from "./components/core/HomePage/Dashboard/MyCourses"
import EditCourse from "./components/core/HomePage/Dashboard/EditCourse/EditCourse"
import Instructor from "./components/core//HomePage/Dashboard/Instructor"
import ForgotPassword from "./pages/ForgotPassword"
import OpenRoute from "./components/core/HomePage/Auth/OpenRoute"
import UpdatePassword from "./pages/UpdatePassword";
import EnrolledCourses from "./components/core/HomePage/Dashboard/EnrolledCourses"
import ViewCourse from "./pages/ViewCourse"
import VideoDetails from "./components/core/HomePage/ViewCourse/VideoDetails"


import { ACCOUNT_TYPE } from "./utils/constanst"

import { HiArrowNarrowUp } from "react-icons/hi"

export default function App() {
  const { user } = useSelector((state) => state.auth)

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
         <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/catalog/:CatalogName" element={<Catalog />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />



        <Route
          path="forgot-password" element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />


         <Route
          path="update-password/:token" element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Common Dashboard Routes */}
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="settings" element={<Settings />} />

          {/* Student Routes */}
          <Route path="cart" element={<Cart />} />
          <Route path="enrolled-courses" element={<EnrolledCourses />} />




          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="instructor" element={<Instructor />} />
              <Route path="add-course" element={<AddCourse />} />
              <Route path="my-courses" element={<MyCourses />} />

              <Route path="edit-course/:courseId" element={<EditCourse />} />
            </>
          )}


          

           
        </Route>




        {/* For the watching course lectures */}
        <Route
          element={
            <ProtectedRoute>
              <ViewCourse />
            </ProtectedRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <Route
              path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
              element={<VideoDetails />}
            />
          )}
        </Route>
      </Routes>
    </div>
  )
}
