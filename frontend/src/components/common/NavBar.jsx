import React, { useEffect, useState } from "react";
import logo from "../../assets/Logo/logo.png";
import { Link, matchPath, useLocation } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector } from "react-redux";
import { FaShoppingCart } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import ProfileDropDown from "../core/HomePage/Auth/ProfileDropDown";
import { fetchCourseCategories } from "../../services/operations/courseDetailsAPI";

const NavBar = () => {
  const { token} = useSelector((state) => state.auth ||{});
  const { user } = useSelector((state) => state.auth|| {});
  const { totalItem } = useSelector((state) => state.cart || {});
  const location = useLocation();

  console.log("Token from Redux:", token);
  console.log("User from Redux (in NavBar):", user);

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSubLinks = async () => {
    try {
      setLoading(true);
      const res = await fetchCourseCategories();
      setSubLinks(res);
    } catch (error) {
      console.log("could not fetch the category list", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubLinks();
  }, []);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <nav>
      <div className="flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700">
        <div className="flex w-11/12 max-w-maxContent items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="Logo" width={160} height={42} />
          </Link>

          {/* Navbar links */}
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div className="flex relative items-center gap-2 group">
                    <Link>
                      <p>{link.title}</p>
                    </Link>
                    <IoIosArrowDown />

                    <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-63%] translate-y-[3em] 
                      flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 
                      group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                      <div className="absolute left-[70%] top-[-8px] h-6 w-6 rotate-45 rounded bg-richblack-5"></div>
                      {loading ? (
                        <p className="text-center">Loading</p>
                      ) : subLinks.length ? (
                        <>
                          {subLinks?.map((subLink, i) => (
                            <Link
                              to={`/catalog/${subLink.name
                                .split(" ")
                                .join("-")
                                .toLowerCase()}`}
                              className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                              key={i}
                            >
                              <p>{subLink.name}</p>
                            </Link>
                          ))}
                        </>
                      ) : (
                        <p className="text-center">No courses Found</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Right Section (Login / Signup / Cart / Profile) */}
          <div className="flex gap-4 items-center text-richblack-100">
            {user && user?.accountType !== "instructor" && (
              <Link to="dashboard/cart" className="relative">
                <FaShoppingCart />
                {totalItem > 0 && <span>{totalItem}</span>}
              </Link>
            )}

            {/* If no user logged in -> show login & signup */}
            {!token || !user ? (
              <>
                <Link to="/login">
                  <button className="border border-richblack-700 bg-richblack-800 lg:px-[12px] lg:py-[8px] text-richblack-100 rounded-md">
                    Log In
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="border border-richblack-700 bg-richblack-800 lg:px-[12px] lg:py-[8px] text-richblack-100 rounded-md">
                    Sign Up
                  </button>
                </Link>
              </>
            ) : (
              <ProfileDropDown />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
