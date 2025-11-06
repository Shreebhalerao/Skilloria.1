import React from "react";
import { FooterLink2 } from "../../data/footer-links";
import { Link } from "react-router-dom";
// Added Fa icons for standard social media links
import { ImGithub, ImLinkedin2 } from "react-icons/im";
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";


// Images
import logo from "../../assets/Logo/logo.png";

// footer data
const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources = [
  "Articles",
  "Blog",
  "Chart Sheet",
  "Code challenges",
  "Docs",
  "Projects",
  "Videos",
  "Workspaces",
];
const Plans = ["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums", "Chapters", "Events"];



const Footer = () => {
  return (
    // Outer container: Removed fixed mx-7 and used mx-auto w-11/12 for better fluid responsiveness
    <div className="bg-richblack-800 mx-auto w-11/12 rounded-t-xl mt-10">
      
      {/* Top Half of Footer: Main Links Section */}
      <div className="flex flex-col lg:flex-row gap-8 items-start justify-between w-11/12 max-w-maxContent text-richblack-400 leading-6 mx-auto relative py-14">
        
        {/* Main Sections Wrapper (Divided by a line) */}
        <div className="border-b w-full flex flex-col lg:flex-row pb-5 border-richblack-700">

          {/* Section 1: Company, Resources, Plans/Community (Left Half on Desktop) */}
          {/* Uses flex-wrap for mobile grid, lg:w-[50%] for desktop two-column layout */}
          <div className="w-full lg:w-[50%] flex flex-wrap flex-row justify-between lg:border-r lg:border-richblack-700 pr-5 gap-y-10">
            
            {/* Column 1.1: Company & Social Icons */}
            {/* w-1/2 on mobile for two-column layout, lg:w-[30%] on desktop */}
            <div className="w-1/2 lg:w-[30%] flex flex-col gap-3 pr-2 lg:pr-0">
              
              {/* Logo: Fixed alignment and sizing */}
              <img src={logo} alt="Skilloria Logo" className="object-contain w-[120px] mb-2" />
              
              <h1 className="text-richblack-50 font-semibold text-[16px] mt-2">Company</h1>
              
              <div className="flex flex-col gap-2">
                {["About", "Careers", "Affiliates"].map((ele, i) => (
                  <div
                    key={i}
                    className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                  >
                    <Link to={ele.toLowerCase()}>{ele}</Link>
                  </div>
                ))}
              </div>
              
              {/* Social Icons - Using Fa icons */}
              <div className="flex gap-4 text-lg text-richblack-300 mt-2">
                <FaFacebook className="w-5 cursor-pointer hover:text-blue-600 transition-colors" />
                <FaGoogle className="w-5 cursor-pointer hover:text-red-600 transition-colors" />
                <FaTwitter className="w-5 cursor-pointer hover:text-blue-400 transition-colors" />
                <FaYoutube className="w-5 cursor-pointer hover:text-red-700 transition-colors" />
              </div>
            </div>

            {/* Column 1.2: Resources & Support */}
            <div className="w-1/2 lg:w-[30%] flex flex-col gap-3 pr-2 lg:pr-0">
              <h1 className="text-richblack-50 font-semibold text-[16px]">Resources</h1>
              <div className="flex flex-col gap-2">
                {Resources.map((ele, index) => (
                  <div
                    key={index}
                    className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                  >
                    <Link to={ele.split(" ").join("-").toLowerCase()}>
                      {ele}
                    </Link>
                  </div>
                ))}
              </div>
              
              <h1 className="text-richblack-50 font-semibold text-[16px] mt-7">Support</h1>
              
              <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                <Link to={"/help-center"}>Help Center</Link>
              </div>
            </div>

            {/* Column 1.3: Plans & Community */}
            {/* Added w-1/2 on mobile to maintain layout integrity */}
            <div className="w-1/2 lg:w-[30%] flex flex-col gap-3 pr-2 lg:pr-0">
              <h1 className="text-richblack-50 font-semibold text-[16px]">Plans</h1>
              <div className="flex flex-col gap-2">
                {Plans.map((ele, index) => (
                  <div
                    key={index}
                    className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                  >
                    <Link to={ele.split(" ").join("-").toLowerCase()}>
                      {ele}
                    </Link>
                  </div>
                ))}
              </div>
              
              <h1 className="text-richblack-50 font-semibold text-[16px] mt-7">Community</h1>
              <div className="flex flex-col gap-2">
                {Community.map((ele, index) => (
                  <div
                    key={index}
                    className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                  >
                    <Link to={ele.split(" ").join("-").toLowerCase()}>
                      {ele}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* Section 2: Dynamically generated links (Right Half on Desktop) */}
          {/* Added pt-8 for mobile spacing from the divider */}
          <div className="w-full lg:w-[50%] flex flex-wrap flex-row justify-between pl-0 lg:pl-5 pt-8 lg:pt-0 gap-y-10">
            {FooterLink2.map((ele, i) => {
              return (
                // Use w-1/2 on mobile, w-[30%] on desktop for dynamic links
                <div key={i} className="w-1/2 lg:w-[30%] flex flex-col gap-3 pr-2 lg:pr-0">
                  <h1 className="text-richblack-50 font-semibold text-[16px]">
                    {ele.title}
                  </h1>
                  <div className="flex flex-col gap-2 mt-2">
                    {ele.links.map((link, index) => {
                      return (
                        <div
                          key={index}
                          className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                        >
                          <Link to={link.link}>{link.title}</Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>


      {/* Bottom Footer: Policy Links and Copyright */}
      {/* Used flex-col on mobile, flex-row on desktop for stacking. Added top border and adjusted padding. */}
      <div className="flex flex-col lg:flex-row items-center justify-between w-11/12 max-w-maxContent text-richblack-400 mx-auto pb-8 pt-6 text-sm border-t border-richblack-700">
        
        {/* Policy Links (Left) */}
        <div className="flex flex-row flex-wrap justify-center lg:justify-start">
          {BottomFooter.map((ele, ind) => {
            return (
              <div
                key={ind}
                className={` ${BottomFooter.length - 1 === ind ? "" : "border-r border-richblack-700 "}
                  px-3 cursor-pointer hover:text-richblack-50 transition-all duration-200 py-1`}
              >
                <Link to={ele.split(" ").join("-").toLocaleLowerCase()}>
                  {ele}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Copyright (Center) - Removed unicode whitespace (`ㅤ`) */}
        <div className="text-center mt-4 lg:mt-0 flex flex-wrap justify-center items-center">
            <span>Made By </span>
            <Link to='https://github.com/Shreebhalerao' target="_blank" className="text-white hover:underline mx-1"
            >
              Shreeraj Bhalerao
            </Link>
            <span> | © 2025 Skilloria</span>
        </div>

        {/* Social Icons (Right) */}
        <div className="flex items-center mt-4 lg:mt-0">
          <a href="https://www.linkedin.com/in/shreeraj-bhalerao-4bb096294" className="text-richblack-400 p-3 hover:bg-richblack-700 rounded-full duration-300 hover:text-richblack-50" target="_blank" rel="noopener noreferrer">
            <ImLinkedin2 size={17} />
          </a>
          <a href="https://github.com/Shreebhalerao" className="text-richblack-400 p-3 hover:bg-richblack-700 rounded-full duration-300 hover:text-richblack-50" target="_blank" rel="noopener noreferrer">
            <ImGithub size={17} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;