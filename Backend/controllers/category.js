const Category = require("../models/Category");


//create the category
exports.createCategory = async(req,res)=>{
  try {
    //fetch the data
    const {name , description}= req.body;
    //validation
    if(!name || !description){
        return res.status(400).json({
            success:false,
            message:"All the fields are mandotory plz fill all the details"
        });
    }
    //create the category
    const categoryDetails = await Category.create({name:name ,description:description},);
    //return the response
    console.log(categoryDetails);
    return res.status(200).json({
        success:true,
        message:"new category created succesfully",
    });
  } catch (err) {
    return res.status(500).json({
        success:false,
        message:"unalble to create the category",
        err:err.message,
    });
  }
}

//to show the all categories
exports.showAllCategories = async (req,res)=>{
    try {
        //find the all cataegories
        const AllCategories =await Category.find({},{ name: true, description: true });
        //return the responce
        return res.status(200).json({
            success:true,
             data:AllCategories,
            message:'All categeories fetch succesfully'
        });
    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"unalble to create the category",
            err:err.message,
        });
    }
}

//category page details 
exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    // 1️⃣ Get the selected category with courses + instructor populated
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: {
          path: "instructor",
          select: "firstName lastName email",
        },
      })
      .exec();

    // No category found
    if (!selectedCategory) {
      console.log("there is no category present");
      return res.status(404).json({
        success: false,
        message: "No category found related to this ID",
      });
    }

    // No courses in this category
    if (selectedCategory.courses.length === 0) {
      console.log("there are no courses present");
      return res.status(404).json({
        success: false,
        message: "No courses present in this category",
      });
    }

    const selectedCourses = selectedCategory.courses;

    // 2️⃣ Get courses from other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    }).populate({
      path: "courses",
      match: { status: "Published" },
      populate: {
        path: "instructor",
        select: "firstName lastName email",
      },
    });

    let differentCourses = [];
    for (const category of categoriesExceptSelected) {
      differentCourses.push(...category.courses);
    }

    // 3️⃣ Get the top-selling courses across all categories
    const allCategories = await Category.find().populate({
      path: "courses",
      match: { status: "Published" },
      populate: {
        path: "instructor",
        select: "firstName lastName email",
      },
    });

    const allCourses = allCategories.flatMap((category) => category.courses);

    // Make sure "sold" exists in your schema, otherwise use "studentEnrolled.length"
    const mostSellingCourses = allCourses
      .sort((a, b) => (b.sold || 0) - (a.sold || 0))
      .slice(0, 10);

    // 4️⃣ Return clean response
    return res.status(200).json({
      success: true,
      selectedCategory: {
        _id: selectedCategory._id,
        name: selectedCategory.name,
        description: selectedCategory.description,
      },
      selectedCourses,
      differentCourses,
      mostSellingCourses,
    });
  } catch (err) {
    console.error("Error in categoryPageDetails:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch category page details",
      error: err.message,
    });
  }
};
