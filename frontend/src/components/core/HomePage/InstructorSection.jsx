import React from "react";
import Instuctor from "../../../assets/Images/Instructor.png"
import HighlightText from "./HighlightText";
import CTAButton from "../HomePage/Button"
import { FaArrowRight } from "react-icons/fa";

const InstructorSection =()=>{
    return(
        <div className="mt-16">
             <div className="flex flex-row gap-20 items-center">
                <div className="w-[50%]">
                    <img src={Instuctor} alt=""
                    className="shadow-white"
                     />
                </div>

                <div className="w-[50%] flex-col gap-10">
                    <div className="text-4xl font-semibold w-[50%]">
                        Become an
                        <HighlightText text={"Instructor"}/>
                    </div>
                    <p className="font-medium mt-8 text-[16px] w-[70%] text-richblack-300">Instructor from around the world teach millions of student on  Skilloria. we provide the toold and skills to teach what you love</p>
                    
                        <div className="w-fit mt-8">
                            <CTAButton active={true} linkto={"/signup"}>
                                <div className="flex flex-row gap-2 items-center">
                                    Start learning Today
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