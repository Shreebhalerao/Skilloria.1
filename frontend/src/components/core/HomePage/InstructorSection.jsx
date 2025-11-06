import React from "react";
import Instuctor from "../../../assets/Images/Instructor.png"
import HighlightText from "./HighlightText";
import CTAButton from "../HomePage/Button"
import { FaArrowRight } from "react-icons/fa";

const InstructorSection =()=>{
    return(
        // Added padding for mobile screen edges and adjusted vertical margins
        <div className="mt-12 mb-20 lg:mt-16 p-4">
            {/* Default to flex-col on mobile, switch to flex-row on large screens. Adjusted gap for mobile. */}
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center justify-center">
                
                {/* Image Container (Left/Top) */}
                {/* w-full on mobile, w-[50%] on desktop */}
                <div className="w-full lg:w-[50%]">
                    {/* Image is now full width and maintains aspect ratio, added a subtle visual shadow/effect */}
                    <img 
                        src={Instuctor} 
                        alt="Instructor"
                        className="w-full h-auto object-cover rounded-xl shadow-2xl shadow-blue-500/50" 
                    />
                </div>

                {/* Text Content Container (Right/Bottom) */}
                {/* w-full on mobile, w-[50%] on desktop. Adjusted flex-col structure */}
                <div className="w-full lg:w-[50%] flex flex-col gap-5 lg:gap-10">
                    
                    {/* Heading */}
                    {/* Heading width made w-full on mobile for better flow */}
                    <div className="text-4xl font-semibold w-full lg:w-[50%]">
                        Become an
                        <HighlightText text={"Instructor"}/>
                    </div>
                    
                    {/* Description */}
                    {/* w-full on mobile, w-[70%] on desktop */}
                    <p className="font-medium mt-4 text-[16px] w-full lg:w-[70%] text-richblack-300">
                        Instructors from around the world teach millions of students on Skilloria. We provide the tools and skills to teach what you love.
                    </p>
                    
                    {/* CTA Button */}
                    <div className="w-fit mt-8">
                        <CTAButton active={true} linkto={"/signup"}>
                            <div className="flex flex-row gap-2 items-center">
                                Start Teaching Today
                                <FaArrowRight/>
                            </div>
                        </CTAButton>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default InstructorSection;