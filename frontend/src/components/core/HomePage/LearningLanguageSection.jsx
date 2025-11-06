import React from "react";
import HighlightText from "./HighlightText";
import CTAButton from "../HomePage/Button"
import know_your_progress from "../../../assets/Images/Know_your_progress.png"
import compare_with_others from "../../../assets/Images/Compare_with_others.png"
import plan_your_lesson from "../../../assets/Images/Plan_your_lessons.png"

const LearningLanguageSection =()=>{
    return(
        // Reduced top margin for better mobile flow (mt-20 on small, mt-[150px] on large)
        <div className="mt-20 lg:mt-[150px]">
            <div className="flex flex-col gap-5 items-center">

                {/* Heading */}
                <div className="text-center font-semibold text-4xl">
                    Your Swiss Knife for
                    <HighlightText text={"Learning any language"}/>
                </div>
                
                {/* Subheading/Description */}
                {/* w-full for mobile, w-[55%] centered on large screens */}
                <div className="text-center text-richblack-600 mx-auto text-base font-medium w-11/12 lg:w-[55%] p-2">
                    Using spin making learning multiple language easy, with 20+ language realistic voice-over, process tracking, custom schedule and more.
                </div>

                {/* Image Stacking Section */}
                {/* Changed to flex-col on mobile, flex-row on large screens to fix overlap issue. */}
                <div className="flex flex-col lg:flex-row items-center mt-5 lg:mt-0"> 
                    
                    {/* Image 1: Know Your Progress */}
                    {/* Removed negative margin on mobile. Added lg: for desktop overlap. Added shadow and rounded corners */}
                    <img 
                        src={know_your_progress} 
                        alt="know_your_progress image" 
                        className="object-contain w-full lg:w-[350px] lg:-mr-32 z-20 shadow-2xl rounded-xl" 
                    />
                    
                    {/* Image 2: Compare With Others */}
                    {/* Added shadow and rounded corners. Added vertical margin for mobile spacing */}
                    <img 
                        src={compare_with_others} 
                        alt="compare_with_others image" 
                        className="object-contain w-full lg:w-[350px] z-10 my-4 lg:my-0 shadow-2xl rounded-xl" 
                    />
                    
                    {/* Image 3: Plan Your Lesson */}
                    {/* Removed negative margin on mobile. Added lg: for desktop overlap. Added shadow and rounded corners */}
                    <img 
                        src={plan_your_lesson} 
                        alt="plan_your_lesson image" 
                        className="object-contain w-full lg:w-[350px] lg:-ml-36 z-30 shadow-2xl rounded-xl" 
                    />
                </div>

                {/* CTA Button */}
                <div className="w-fit mb-32 mt-8 lg:mt-0"> {/* Adjusted margin top for mobile flow */}
                    <CTAButton active={true} linkto={"/signup"}>
                        <div>Learn more</div>
                    </CTAButton>
                </div>
            </div>
        </div>
    )
}

export default LearningLanguageSection;