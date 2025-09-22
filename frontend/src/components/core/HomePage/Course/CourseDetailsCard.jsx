import React from "react"
import copy from "copy-to-clipboard"
import { toast } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"

import { addToCart } from "../../../../slices/cartSlice"
import { ACCOUNT_TYPE } from "../../../../utils/constanst"
import Img from "../../../common/Img"

function CourseDetailsCard({ course = {}, setConfirmationModal, handleBuyCourse }) {
     console.log("👉 course inside CourseDetailsCard:", course)
  const { user } = useSelector((state) => state.auth)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Safe destructuring with defaults
  const {
    thumbnail: courseThumbnail = "",
    Price: CurrentPrice = "",
    _id: courseId = "",
    courseName = "",
    studentEnrolled = [],   // ⚡ matches API response, not `studentsEnrolled`
    instructions = [],
  } = course

  const handleShare = () => {
    copy(window.location.href)
    toast.success("Link copied to the clipboard")
  }

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("Bro, you are an Instructor. You can't buy the course.")
      return
    }
    if (token) {
      dispatch(addToCart(course))
      return
    }
    setConfirmationModal?.({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-richblack-700 p-4 text-richblack-5">
      {/* Course Image */}
      <Img
        src={courseThumbnail}
        alt={courseName}
        className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
      />

      <div className="px-4">
        {/* Price */}
        <div className="space-x-3 pb-4 text-3xl font-semibold">
          Rs. {CurrentPrice}
        </div>

        {/* Buy/Add to cart */}
        <div className="flex flex-col gap-4">
          <button
            className="yellowButton  "
            onClick={
              user && studentEnrolled.includes(user?._id)
                ? () => navigate("/dashboard/enrolled-courses")
                : handleBuyCourse
            }
          >
            {user && studentEnrolled.includes(user?._id)
              ? "Go To Course"
              : "Buy Now"}
          </button>

          {(!user || !studentEnrolled.includes(user?._id)) && (
            <button onClick={handleAddToCart} className="blackButton outline-none">
              Add to Cart
            </button>
          )}
        </div>

        {/* Guarantee */}
        <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
          30-Day Money-Back Guarantee
        </p>

        {/* Requirements */}
        <div>
          <p className="my-2 text-xl font-semibold">Course Requirements :</p>
          <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
            {instructions.map((item, i) => (
              <p className="flex gap-2" key={i}>
                <BsFillCaretRightFill />
                <span>{item}</span>
              </p>
            ))}
          </div>
        </div>

        {/* Share */}
        <div className="text-center">
          <button
            className="mx-auto flex items-center gap-2 py-6 text-yellow-100"
            onClick={handleShare}
          >
            <FaShareSquare size={15} /> Share
          </button>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailsCard
