import React, { useRef, useState } from "react"
import { AiOutlineCaretDown } from "react-icons/ai"
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import useOnClickOutside from "./../../../../hooks/useOnClickOutside"
import { logout } from "../../../../services/operations/authAPI"
import Img from "./../../../common/Img"

export default function ProfileDropDown() {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useOnClickOutside(ref, () => setOpen(false))

  console.log("User from Redux:", user)


  if (!user) return null

  return (
    <div className="relative flex" ref={ref}>
      {/* Profile image + cart */}
      <div
        className="flex items-center gap-x-1 cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Img
          src={user?.image}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-[30px] rounded-full object-cover"
        />
        <AiOutlineCaretDown className="text-sm text-richblack-100" />
      </div>

      {/* Dropdown menu */}
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-[118%] right-0 z-[1000] divide-y divide-richblack-700 overflow-hidden rounded-md border border-richblack-700 bg-richblack-800"
        >
          {/* Dashboard link */}
          <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}>
            <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25">
              <VscDashboard className="text-lg" />
              Dashboard
            </div>
          </Link>

          {/* Logout option */}
          <div
            onClick={() => {
              dispatch(logout(navigate))
              setOpen(false)
            }}
            className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25 cursor-pointer"
          >
            <VscSignOut className="text-lg" />
            Logout
          </div>
        </div>
      )}
    </div>
  )
}
