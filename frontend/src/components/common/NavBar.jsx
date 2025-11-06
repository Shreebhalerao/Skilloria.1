import React, { useEffect, useState } from "react";
import logo from "../../assets/Logo/logo.png";
import { Link, matchPath, useLocation } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector } from "react-redux";

// Icon Imports
import { FaShoppingCart } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { FiMenu } from "react-icons/fi"; // Hamburger Menu
import { AiOutlineClose } from "react-icons/ai"; // Close Menu

// Assuming these external dependencies exist and are correctly implemented elsewhere
import ProfileDropDown from "../core/HomePage/Auth/ProfileDropDown";
import { fetchCourseCategories } from "../../services/operations/courseDetailsAPI";

// Mocking the fetch function result for component completeness in a single-file environment
const mockFetchCourseCategories = async () => {
    // In a real app, this would be the API call. Here we mock data.
    return [
        { name: "Web Development", _id: "101" },
        { name: "Data Science", _id: "102" },
        { name: "Mobile App Development", _id: "103" },
    ];
};

const NavBar = () => {
  // Destructure with default empty objects to prevent errors if state is undefined
  const { token } = useSelector((state) => state.auth || {});
  const { user } = useSelector((state) => state.auth || {});
  const { totalItem } = useSelector((state) => state.cart || {});
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  // New state for controlling the mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false); // State for mobile catalog dropdown

  const fetchSubLinks = async () => {
    try {
      setLoading(true);
      // NOTE: Using mockFetchCourseCategories for robustness in this single-file context
      // Replace with `const res = await fetchCourseCategories();` in your actual project structure
      const res = await mockFetchCourseCategories(); 
      setSubLinks(res);
    } catch (error) {
      console.log("Could not fetch the category list:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubLinks();
  }, []);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  // Utility function to close the menu
  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    setIsCatalogOpen(false);
  };

  return (
    <nav className="border-b-[1px] border-b-richblack-700 bg-richblack-900 sticky top-0 z-50">
      <div className="flex h-14 items-center justify-between w-11/12 max-w-maxContent mx-auto">
        
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" width={160} height={42} />
        </Link>

        {/* Desktop Navbar links (Hidden on small screens) */}
        <ul className="hidden lg:flex gap-x-6 text-richblack-25">
          {NavbarLinks.map((link, index) => (
            <li key={index}>
              {link.title === "Catalog" ? (
                <div className="flex relative items-center gap-2 group">
                  <Link to={link?.path || "#"}> {/* Use Link to route if a path exists, otherwise default */}
                    <p>{link.title}</p>
                  </Link>
                  <IoIosArrowDown className="text-sm transition-transform duration-200 group-hover:rotate-180" />

                  {/* Dropdown Menu - Standard Desktop Styling */}
                  <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-63%] translate-y-[3em] 
                    flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 
                    group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px] shadow-xl">
                    
                    {/* Arrow Pointer */}
                    <div className="absolute left-[70%] top-[-8px] h-4 w-4 rotate-45 rounded-sm bg-richblack-5"></div>
                    
                    {loading ? (
                      <p className="text-center py-2">Loading...</p>
                    ) : subLinks?.length ? (
                      subLinks.map((subLink, i) => (
                        <Link
                          to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                          className="rounded-lg py-2 px-4 transition-all duration-150 hover:bg-richblack-50"
                          key={i}
                        >
                          <p>{subLink.name}</p>
                        </Link>
                      ))
                    ) : (
                      <p className="text-center py-2">No Categories Found</p>
                    )}
                  </div>
                </div>
              ) : (
                <Link to={link?.path}>
                  <p
                    className={`${
                      matchRoute(link?.path)
                        ? "text-yellow-50" // Changed to 50 for better visibility against dark background
                        : "text-richblack-25"
                    } hover:text-richblack-5 transition-colors`}
                  >
                    {link.title}
                  </p>
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Right Section (Cart / Auth / Profile) */}
        <div className="flex gap-3 items-center text-richblack-100">
          
          {/* Cart Icon */}
          {user && user?.accountType !== "Instructor" && (
            <Link to="dashboard/cart" className="relative p-2 hover:bg-richblack-700 rounded-full transition-colors">
              <FaShoppingCart className="text-xl" />
              {totalItem > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-50 text-richblack-900 text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItem}
                </span>
              )}
            </Link>
          )}

          {/* Desktop Auth Buttons / Profile Dropdown (Hidden on small screens) */}
          <div className="hidden lg:flex gap-4 items-center">
            {!token || !user ? (
              <>
                <Link to="/login">
                  <button className="border border-richblack-700 bg-richblack-800 px-3 py-2 text-richblack-100 rounded-md hover:bg-richblack-700 transition-colors">
                    Log In
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="border border-richblack-700 bg-richblack-800 px-3 py-2 text-richblack-100 rounded-md hover:bg-richblack-700 transition-colors">
                    Sign Up
                  </button>
                </Link>
              </>
            ) : (
              // This is where the profile picture and menu appear
              <ProfileDropDown /> 
            )}
          </div>
          
          {/* Mobile Menu Button (Visible on small screens) */}
          <button 
            className="lg:hidden p-2 text-richblack-25 hover:bg-richblack-700 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Open mobile menu"
          >
            <FiMenu className="text-2xl" />
          </button>
        </div>
      </div>
      
      {/* --- Mobile Menu Overlay --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-richblack-900/90 backdrop-blur-sm lg:hidden transition-opacity duration-300">
          
          {/* Menu Drawer */}
          <div className="h-full w-full max-w-xs bg-richblack-800 shadow-2xl p-6 flex flex-col space-y-6">
            
            {/* Header: Logo and Close Button */}
            <div className="flex justify-between items-center pb-4 border-b border-richblack-700">
              <img src={logo} alt="Logo" width={120} height={32} />
              <button onClick={closeMenu} className="text-richblack-5 hover:text-red-500 transition-colors">
                <AiOutlineClose className="text-2xl" />
              </button>
            </div>

            {/* Main Navigation Links */}
            <nav className="flex flex-col space-y-4 text-richblack-25">
              {NavbarLinks.map((link, index) => (
                <div key={index}>
                  {link.title === "Catalog" ? (
                    <div className="flex flex-col">
                      <button 
                        className="flex justify-between items-center py-2 hover:text-richblack-5 transition-colors"
                        onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                      >
                        <p>{link.title}</p>
                        <IoIosArrowDown className={`text-sm transition-transform duration-300 ${isCatalogOpen ? 'rotate-180' : 'rotate-0'}`} />
                      </button>
                      
                      {/* Mobile Catalog Dropdown List */}
                      {isCatalogOpen && (
                        <div className="ml-4 flex flex-col space-y-2 py-2 bg-richblack-700 rounded-lg">
                          {loading ? (
                            <p className="text-center p-2 text-sm">Loading categories...</p>
                          ) : subLinks?.length ? (
                            subLinks.map((subLink, i) => (
                              <Link
                                to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                className="px-4 py-2 text-richblack-25 hover:text-yellow-50 transition-colors text-sm"
                                key={i}
                                onClick={closeMenu}
                              >
                                {subLink.name}
                              </Link>
                            ))
                          ) : (
                            <p className="p-2 text-sm text-richblack-400">No courses Found</p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link to={link?.path} className="py-2 block hover:text-richblack-5 transition-colors" onClick={closeMenu}>
                      <p
                        className={`${
                          matchRoute(link?.path)
                            ? "text-yellow-50 font-semibold"
                            : "text-richblack-25"
                        }`}
                      >
                        {link.title}
                      </p>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
            
            {/* Mobile Auth Buttons / Profile Dropdown */}
            <div className="flex flex-col pt-6 space-y-4 border-t border-richblack-700">
              {!token || !user ? (
                <>
                  <Link to="/login" onClick={closeMenu}>
                    <button className="w-full bg-yellow-50 text-richblack-900 py-2 rounded-md font-semibold hover:bg-yellow-100 transition-colors">
                      Log In
                    </button>
                  </Link>
                  <Link to="/signup" onClick={closeMenu}>
                    <button className="w-full border border-richblack-700 text-richblack-100 py-2 rounded-md font-semibold hover:bg-richblack-700 transition-colors">
                      Sign Up
                    </button>
                  </Link>
                </>
              ) : (
                // Display user profile link if logged in
                <div className="flex items-center gap-2">
                    <ProfileDropDown /> {/* Assumes ProfileDropDown handles its UI responsively */}
                    <span className="text-richblack-5 font-semibold">{user.firstName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;

