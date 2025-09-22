import React from "react";
import HighlightText from "./HighlightText";
import CTAButton from "../HomePage/Button"
import know_your_progress from "../../../assets/Images/Know_your_progress.png"
import compare_with_others from "../../../assets/Images/Compare_with_others.png"
import plan_your_lesson from "../../../assets/Images/Plan_your_lessons.png"

const LearningLanguageSection =()=>{
    return(
        <div className="mt-[150px]">
            <div className="flex flex-col gap-5 items-center">

                <div className="text-center font-semibold text-4xl">
                    Your Swiss Knife for
                    <HighlightText text={"Learning any language"}/>
                </div>
                <div className="text-center text-richblack-600 mx-auto text-base font-medium w-[55%]">
                    Using spin making learning multiple language easy,with 20+ language realistic voice-over, process tracking, custom schedule and more.
                </div>

                <div className="flex flex-row items-center justify-center mt-5">
                    <img src={know_your_progress} alt="know_your_progress image" className="object-contain -mr-32" />
                    <img src={compare_with_others} alt="know_your_progress image" className="object-contain" />
                    <img src={plan_your_lesson} alt="know_your_progress image" className="object-contain -ml-36" />
                </div>

                <div className="w-fit mb-32">
                    <CTAButton active={true} linkto={"/signup"}>
                        <div>Learn more</div>
                    </CTAButton>
                </div>
            </div>
        </div>
    )
}

export default LearningLanguageSection;