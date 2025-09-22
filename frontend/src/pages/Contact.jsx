import React from "react"

import Footer from "../components/common/Footer"
import ContactDetails from "../components/core//HomePage/ContactPage/ContactDetails"
import ContactForm from "../components/core/HomePage/ContactPage/ContactForm"
 

const Contact = () => {
    return (
        <div>
            <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
                {/* Contact Details */}
                <div className="lg:w-[40%]">
                    <ContactDetails />
                </div>

                {/* Contact Form */}
                <div className="lg:w-[60%]">
                    <ContactForm />
                </div>
            </div>

            {/* Reviws from Other Learner */}
            {/* // <div className=" my-20 px-5 text-white ">
            //     <h1 className="text-center text-4xl font-semibold mt-8">
            //         Reviews from other learners
            //     </h1>
            //     <ReviewSlider />
            // </div> */}

            {/* footer */}
            <div className="mt-7"> </div>
            <Footer />
        </div>
    )
}

export default Contact