import React from "react";
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import timelinelogo from "../../../assets/Images/TimelineImage.png"


const timeline =[
    {
        Logo:Logo1,
        Heading : "Leadership",
        Description:"Fully committed to the success company",
    },
    {
        Logo:Logo2,
        Heading : "Leadership",
        Description:"Fully committed to the success company",
    },
    {
        Logo:Logo3,
        Heading : "Leadership",
        Description:"Fully committed to the success company",
    },
    {
        Logo:Logo4,
        Heading : "Leadership",
        Description:"Fully committed to the success company",
    },

]

const TimelineSection=()=>{
    return(
        <div className="w-full">
            {/* Main container: stack column on mobile, row on large screens. Reduced mobile gap. */}
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-48 items-center">
                
                {/* Timeline List (Left/Top Section) */}
                {/* Full width on mobile, 45% on large screens (lg:w-[45%]) */}
                <div className="flex flex-col w-full lg:w-[45%]">
                    {
                        timeline.map((element ,index)=>{
                            return(
                                // Added padding-bottom to separate items and made it relative for the line
                                <div className="flex flex-row gap-6 pb-6 relative" key={index}> 
                                    {/* Vertical Line between items (A common timeline visual feature, only visible for non-last items) */}
                                    {index < timeline.length - 1 && (
                                        <div className="absolute left-[25px] top-[50px] h-[calc(100%-50px)] w-[1px] bg-richblack-300"></div>
                                    )}

                                    {/* Logo Container */}
                                    <div className="min-w-[50px] h-[50px] bg-white flex items-center justify-center rounded-full shadow-md z-10">
                                        <img src={element.Logo} alt="" className="p-2"/>
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col justify-center">
                                        <h2 className="font-semibold text-[18px]">{element.Heading}</h2>
                                        {/* Added text color to Description for consistency, assuming richblack-700 */}
                                        <p className="text-base text-richblack-700">{element.Description}</p>
                                    </div>
                                </div>
                            )
                        })
                    }       
                </div>

                {/* Timeline Image and Stats Block (Right/Bottom Section) */}
                <div className="relative shadow-blue-200 w-full lg:w-fit mt-10 lg:mt-0">
                    {/* Image: ensured it scales responsively */}
                    <img src={timelinelogo} alt="timeline img" className="w-full h-auto object-cover rounded-lg" />

                    {/* Stats Block: Positioning adjusted for mobile/desktop */}
                    <div className="
                        absolute bg-caribbeangreen-700 flex flex-row text-white uppercase py-5 md:py-10 rounded-lg
                        
                        /* Mobile Positioning: Centered at the bottom, slightly overlapping */
                        bottom-0 left-1/2 -translate-x-1/2 translate-y-[20%] w-[90%] 
                        
                        /* Desktop Positioning: Original effect relative to image */
                        lg:translate-y-[-10%] lg:translate-x-[-5%] lg:w-fit lg:bottom-auto lg:left-auto lg:top-[85%]
                        
                        /* Ensure items stack/wrap on smaller screens and center items */
                        flex-wrap justify-center items-center
                    ">
                        
                        {/* Stat 1: Use w-1/2 on mobile to ensure two columns, reset on medium/large */}
                        <div className="flex flex-row gap-5 items-center border-r border-caribbeangreen-300 px-3 md:px-7 py-2 md:py-0 w-1/2 md:w-fit justify-center">
                           <p className="text-3xl font-bold">10</p>
                           <p className="text-caribbeangreen-300 text-sm">Years of Experience</p>
                        </div>

                        {/* Stat 2: Use w-1/2 on mobile */}
                        <div className="flex gap-5 items-center px-3 md:px-6 py-2 md:py-0 w-1/2 md:w-fit justify-center">
                         <p className="text-3xl font-bold">250</p>
                         <p className="text-caribbeangreen-300 text-sm">type of Courses</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Added a spacer to prevent the absolutely positioned Stats Block from overlapping the content below it */}
            <div className="h-[100px] lg:h-0"></div>
        </div>
    )
}
export default TimelineSection;