import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import { getInstructorData } from "../../../../services/operations/profileApI";
import InstructorChart from "./InstructorDashbard/InstructorChart";
import Img from "../../../common/Img";

export default function Instructor() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [instructorData, setInstructorData] = useState([]);
  const [courses, setCourses] = useState([]);

  // get Instructor Data
  useEffect(() => {
    ;(async () => {
      setLoading(true);
      const instructorApiData = await getInstructorData(token);
      const result = await fetchInstructorCourses(token);

      if (Array.isArray(instructorApiData)) {
        setInstructorData(instructorApiData);
      } else {
        setInstructorData([]);
      }

      if (Array.isArray(result)) {
        setCourses(result);
      } else {
        setCourses([]);
      }

      setLoading(false);
    })();
  }, [token]);

  const totalAmount = instructorData?.reduce(
    (acc, curr) => acc + (curr?.totalAmountGenerated || 0),
    0
  );

  const totalStudents = instructorData?.reduce(
    (acc, curr) => acc + (curr?.totalStudentsEnrolled || 0),
    0
  );

  // skeleton loading
  const skItem = () => {
    return (
      <div className="mt-5 w-full flex flex-col justify-between  rounded-xl ">
        <div className="flex border p-4 border-richblack-600 ">
          <div className="w-full">
            <p className="w-[100px] h-4 rounded-xl skeleton"></p>
            <div className="mt-3 flex gap-x-5">
              <p className="w-[200px] h-4 rounded-xl skeleton"></p>
              <p className="w-[100px] h-4 rounded-xl skeleton"></p>
            </div>

            <div className="flex justify-center items-center flex-col">
              <div className="w-[80%] h-24 rounded-xl mt-5 skeleton"></div>
              <div className="w-30 h-30 rounded-full  mt-4 grid place-items-center skeleton"></div>
            </div>
          </div>
          <div className="sm:flex hidden min-w-[250px] flex-col rounded-xl p-6 skeleton"></div>
        </div>

        <div className="flex flex-col gap-y-6  mt-5">
          <div className="flex justify-between">
            <p className="text-lg font-bold text-richblack-5 pl-5">Your Courses</p>
            <Link to="/dashboard/my-courses">
              <p className="text-xs font-semibold text-yellow-50 hover:underline pr-5">
                View All
              </p>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row  gap-6 ">
            <p className=" h-[201px] w-full rounded-xl  skeleton"></p>
            <p className=" h-[201px] w-full rounded-xl  skeleton"></p>
            <p className=" h-[201px] w-full rounded-xl  skeleton"></p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-richblack-5 text-center sm:text-left">
          Hii {user?.firstName} 👋
        </h1>
        <p className="font-medium text-richblack-200 text-center sm:text-left">
          Let's start something new
        </p>
      </div>

      {loading ? (
        <div>{skItem()}</div>
      ) : courses.length > 0 ? (
        <div>
          <div className="my-8 flex flex-col md:flex-row md:h-[450px] space-y-4 md:space-y-0 md:space-x-4">
            {/* Render chart / graph */}
            {totalAmount > 0 || totalStudents > 0 ? (
              <div className="w-64 h-64 sm:w-[320px] sm:h-80 md:w-[360px] md:h-[370px]">
                <InstructorChart courses={instructorData} />
              </div>
            ) : (
              <div className="flex-1 rounded-md bg-richblack-800 p-6">
                <p className="text-lg font-bold text-richblack-5">Visualize</p>
                <p className="mt-4 text-xl font-medium text-richblack-50">
                  Not Enough Data To Visualize
                </p>
              </div>
            )}

            {/* Total Statistics */}
            <div className="flex min-w-[450px] flex-col rounded-md bg-richblack-800 p-6">
              <p className="text-lg font-bold text-richblack-5">Statistics</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-lg text-richblack-200">Total Courses</p>
                  <p className="text-3xl font-semibold text-richblack-50">{courses.length}</p>
                </div>
                <div>
                  <p className="text-lg text-richblack-200">Total Students</p>
                  <p className="text-3xl font-semibold text-richblack-50">{totalStudents}</p>
                </div>
                <div>
                  <p className="text-lg text-richblack-200">Total Income</p>
                  <p className="text-3xl font-semibold text-richblack-50">Rs. {totalAmount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Render 3 courses */}
          <div className="rounded-md bg-richblack-800 p-6">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-richblack-5">Your Courses</p>
              <Link to="/dashboard/my-courses">
                <p className="text-xs font-semibold text-yellow-50 hover:underline">View All</p>
              </Link>
            </div>

            <div className="my-4 flex flex-col sm:flex-row sm:space-x-6 space-y-6 sm:space-y-0">
              {courses.slice(0, 3).map((course) => (
                <div
                  key={course._id}
                  className="sm:w-1/3 flex flex-col items-center justify-center"
                >
                  <Img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-[201px] w-full rounded-2xl object-cover"
                  />

                  <div className="mt-3 w-full">
                    <p className="text-sm font-medium text-richblack-50">{course.courseName}</p>
                    <div className="mt-1 flex items-center space-x-2">
                      <p className="text-xs font-medium text-richblack-300">
                        {(course.studentsEnrolled?.length ?? 0)} students
                      </p>
                      <p className="text-xs font-medium text-richblack-300">|</p>
                      <p className="text-xs font-medium text-richblack-300">Rs. {course.Price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
          <p className="text-center text-2xl font-bold text-richblack-5">
            You have not created any courses yet
          </p>

          <Link to="/dashboard/add-course">
            <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
              Create a course
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}
