import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import { createSection, updateSection } from "../../../../../../services/operations/courseDetailsAPI";
import { setCourse, setEditCourse, setStep } from "../../../../../../slices/courseSlice";

import IconBtn from "../../../../../common/IconBtn";
import NestedView from "./NestedView";

export default function CourseBuilderForm() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const { course, step } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [editSectionName, setEditSectionName] = useState(null);

  // Debugging step changes
  useEffect(() => {
    console.log("🟢 Current step in CourseBuilderForm:", step);
  }, [step]);

  const onSubmit = async (data) => {
    setLoading(true);
    let result;

    try {
      if (editSectionName) {
        result = await updateSection(
          { sectionName: data.sectionName, sectionId: editSectionName, courseId: course._id },
          token
        );
      } else {
        result = await createSection(
          { sectionName: data.sectionName, courseId: course._id },
          token
        );
      }

      if (result?.course) {
        dispatch(setCourse(result.course));
        setEditSectionName(null);
        setValue("sectionName", "");
        toast.success("Section updated successfully!");
      } else {
        toast.error("Failed to update course. Please try again.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "");
  };

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };

  const goToNext = () => {
    console.log("➡️ goToNext clicked");
    dispatch(setStep(3)); // ✅ Force step to 3
  };

  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  };

  return (
    <div className="space-y-8 rounded-2xl border border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>

      {/* Section form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="sectionName" className="text-sm text-richblack-5">
            Section Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="sectionName"
            disabled={loading}
            placeholder="Add a section to build your course"
            {...register("sectionName", { required: true })}
            className="form-style w-full"
          />
          {errors.sectionName && (
            <span className="ml-2 text-xs text-pink-200">Section name is required</span>
          )}
        </div>

        <div className="flex items-end gap-x-4">
          <IconBtn type="submit" disabled={loading} text={editSectionName ? "Edit Section" : "Create Section"} outline>
            <IoAddCircleOutline size={20} className="text-yellow-50" />
          </IconBtn>

          {editSectionName && (
            <button type="button" onClick={cancelEdit} className="text-sm text-richblack-300 underline">
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {course?.courseContent?.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      )}

      {/* Navigation */}
      <div className="flex justify-end gap-x-3">
        <button
          onClick={goBack}
          className="rounded-md bg-richblack-300 py-2 px-4 font-semibold text-richblack-900"
        >
          Back
        </button>

        <IconBtn type="button" disabled={loading} text="Next" onClick={goToNext}>
          <MdNavigateNext />
        </IconBtn>
      </div>
    </div>
  );
}
