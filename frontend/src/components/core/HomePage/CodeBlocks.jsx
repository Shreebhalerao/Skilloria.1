import React from "react";
import CTAButton from "../HomePage/Button"
import HighlightText from "./HighlightText";
import {FaArrowRight} from "react-icons/fa"
import { TypeAnimation } from "react-type-animation";


const CodeBlocks =({position, heading, subheading, ctabtn1 ,ctabtn2,codeblock,backgroundGradient , codeColor})=>{
    return(
        // Default to flex-col on mobile, switch to the 'position' (lg:flex-row/reverse) on large screens
        // Adjusted vertical margin for better mobile spacing (my-10 on small, my-20 on large)
        <div className={`flex flex-col ${position} my-10 lg:my-20 justify-between gap-10 items-center lg:items-stretch min-h-[400px]`}>
            {/* section 1: Text Content */} 
            {/* w-full on mobile, w-[50%] on large screens */}
            <div className="w-full lg:w-[50%] flex flex-col gap-8 p-4 lg:p-0">
                {heading}
                <div className="text-richblack-300 font-bold">
                    {subheading}
                </div>

                <div className="flex gap-7 mt-7">
                    <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                        <div className="flex gap-2 items-center">
                            {ctabtn1.btnText}
                            <FaArrowRight/>
                        </div>
                    </CTAButton>

                    <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}> 
                            {ctabtn2.btnText}
                    </CTAButton>
                </div>
            </div>

            {/* section 2: Code Editor */} 
            {/* w-full on mobile, fixed width on large screens */}
            <div className="h-fit code-border border border-richblack-700 rounded-xl flex flex-row py-3 text-[10px] sm:text-sm leading-[18px] sm:leading-6 relative w-full lg:w-[470px]">

                {/* Line Numbers */}
                <div className="text-center flex flex-col w-[10%] select-none text-richblack-400 font-inter font-bold">
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                    <p>7</p>
                    <p>8</p>
                    <p>9</p>
                    <p>10</p>
                    <p>11</p>
                </div>
                
                {/* Code Animation Area */}
                <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-1`}>
                    <div className={`${backgroundGradient}`}></div>
                        <TypeAnimation
                        sequence={[codeblock ,10000 ,""]}
                        repeat={Infinity}
                        cursor={true}
                        style={
                            {
                                whiteSpace:"pre-line",
                                display:"block" ,
                                // Removed fixed font size to rely on responsive Tailwind classes (text-[10px] sm:text-sm)
                            }
                        }
                        omitDeletionAnimation={true}
                        />
                </div>
            </div>

        </div>
    )
}
export default CodeBlocks;