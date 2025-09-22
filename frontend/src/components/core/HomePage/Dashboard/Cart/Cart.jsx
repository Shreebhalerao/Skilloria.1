import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { ACCOUNT_TYPE } from "../../../../../utils/constanst"
import RenderCartCourses from "./RenderCartCourses"
import RenderTotalAmount from "./RenderTotalAmount"

export default function Cart() {
  const { total, totalItems } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)

  if (user?.accountType !== ACCOUNT_TYPE.STUDENT) {
    return <Navigate to="/dashboard/my-profile" />
  }

  return (
    <>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5 font-boogaloo text-center sm:text-left">
        Cart
      </h1>
      <p className="border-b border-b-richblack-400 pb-2 font-semibold text-richblack-400">
        {totalItems} Courses in Cart
      </p>
      {total > 0 ? (
        <div className="mt-8 flex flex-col-reverse items-start gap-x-10 gap-y-6 lg:flex-row">
          <RenderCartCourses />
          <RenderTotalAmount />
        </div>
      ) : (
        <p className="mt-14 text-center text-3xl text-richblack-100">
          Your cart is empty
        </p>
      )}
    </>
  )
}
