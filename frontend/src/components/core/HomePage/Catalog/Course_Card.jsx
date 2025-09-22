import React, { useEffect, useState } from "react"

import { Link } from "react-router-dom"
import Img from "../../../common/Img"

function Course_Card({ course, Height }) {
 console.log("Course_Card received:", course);
 

    return (
        <div className='hover:scale-[1.03] transition-all duration-200 z-50 '>
      <Link to={`/courses/${course._id}`}>
        <div className="">
          <div className="rounded-lg">
            <Img
              src={course?.thumbnail}
              alt="course thumnail"
              className={`${Height} w-full rounded-xl object-cover `}
            />
          </div>
          <div className="flex flex-col gap-2 px-1 py-3">
            <p className="text-xl text-richblack-5">{course?.courseName}</p>
           <p className="text-caribbeangreen-5">
              Instructor: {course.instructor?.firstName
                ? `${course.instructor.firstName} ${course.instructor.lastName}`
                : "Instructor not available"}
            </p>

            
            <p className="text-xl text-richblack-5">Rs. {course?.Price}</p>
          </div>
        </div>
      </Link>
    </div>
    )
}

export default Course_Card