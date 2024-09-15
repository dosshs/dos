const Branch = require("../../models/User/Branch");
const Department = require("../../models/User/Department");
const Course = require("../../models/User/Course");
const Section = require("../../models/User/Section");
const AppError = require("../../Utilities/appError");
const catchAsync = require("../../Utilities/catchAsync");

const createDetail = catchAsync(async (req, res, next) => {
  const { identifier } = req.query;
  const {
    branchName,
    departmentName,
    courseName,
    shorthand,
    sectionName,
    branchId,
    courseId,
  } = req.body;

  let detail;

  if (identifier === "branch") {
    const branchFind = await Branch.find({
      branchName,
    });

    if (branchFind.length > 0)
      return next(new AppError("Branch already exists", 400));
    else
      detail = new Branch({
        branchName,
      });
  } else if (identifier === "department") {
    const departmentFind = await Department.find({
      departmentName,
    });

    if (departmentFind.length > 0)
      return next(new AppError("Department already exists", 400));
    else
      detail = new Department({
        departmentName,
        shorthand,
        branchId,
      });
  } else if (identifier === "course") {
    const courseFind = await Course.find({
      courseName,
    });

    if (courseFind.length > 0)
      return next(new AppError("Course already exists", 400));
    else
      detail = new Course({
        courseName,
        shorthand,
        branchId,
      });
  } else if (identifier === "section") {
    const sectionFind = await Section.find({
      sectionName,
    });

    if (sectionFind.length > 0)
      return next(new AppError("Section already exists", 400));
    else
      detail = new Section({
        sectionName,
        courseId,
        branchId,
      });
  } else {
    return next(new AppError("Invalid identifier", 400));
  }

  await detail.save();

  return res.status(200).json({
    message: "Detail Added Successfully",
    detail,
  });
});

const getDetail = catchAsync(async (req, res, next) => {
  const { identifier, branchId, courseId } = req.query;

  let detail;

  if (identifier === "branch") {
    detail = await Branch.find();
  } else if (identifier === "department") {
    detail = await Department.find();
  } else if (identifier === "course") {
    detail = await Course.find();
  } else if (identifier === "section") {
    if (courseId && branchId) {
      detail = await Section.find({ courseId: courseId, branchId: branchId });
    } else if (courseId) {
      detail = await Section.find({ courseId: courseId });
    } else detail = await Section.find();
  } else {
    return next(new AppError("Invalid identifier", 400));
  }

  return res.status(200).json({
    detail,
  });
});

const updateDetail = catchAsync(async (req, res, next) => {
  const { identifier } = req.query;
  const {
    id,
    branchName,
    departmentName,
    courseName,
    shorthand,
    sectionName,
    branchId,
    courseId,
  } = req.body;

  let detail,
    update = {};

  if (branchName) update.branchName = branchName;
  if (departmentName) update.departmentName = departmentName;
  if (courseName) update.courseName = courseName;
  if (shorthand) update.shorthand = shorthand;
  if (sectionName) update.sectionName = sectionName;
  if (branchId) update.branchId = branchId;
  if (courseId) update.courseId = courseId;

  if (identifier === "branch") {
    detail = await Branch.findOneAndUpdate(
      id ? { _id: id } : { branchName: branchName },
      { $set: update },
      { new: true }
    );
  } else if (identifier === "department") {
    detail = await Department.findOneAndUpdate(
      id ? { _id: id } : { departmentName: departmentName },
      { $set: update },
      { new: true }
    );
  } else if (identifier === "course") {
    detail = await Course.findOneAndUpdate(
      id ? { _id: id } : { courseName: courseName },
      { $set: update },
      { new: true }
    );
  } else if (identifier === "section") {
    detail = await Section.findOneAndUpdate(
      id ? { _id: id } : { sectionName: sectionName },
      { $set: update },
      { new: true }
    );
  } else {
    return next(new AppError("Invalid identifier", 400));
  }

  if (!detail) next(new AppError("Detail not Found", 404));

  return res.status(200).json({
    message: `Successfully updated ${identifier}!`,
    detail,
  });
});

const deleteDetail = catchAsync(async (req, res, next) => {
  const { identifier } = req.query;
  const { id, branchName, departmentName, courseName, sectionName } = req.body;

  let detail,
    query = {};

  if (branchName) query.branchName = branchName;
  if (departmentName) query.departmentName = departmentName;
  if (courseName) query.courseName = courseName;
  if (sectionName) query.sectionName = sectionName;

  if (identifier === "branch") {
    id
      ? (detail = await Branch.findByIdAndDelete(id))
      : (detail = await Branch.findOneAndDelete(query));
  } else if (identifier === "department") {
    id
      ? (detail = await Department.findByIdAndDelete(id))
      : (detail = await Department.findOneAndDelete(query));
  } else if (identifier === "course") {
    id
      ? (detail = await Course.findByIdAndDelete(id))
      : (detail = await Course.findOneAndDelete(query));
  } else if (identifier === "section") {
    id
      ? (detail = await Section.findByIdAndDelete(id))
      : (detail = await Section.findOneAndDelete(query));
  } else {
    return next(new AppError("Invalid identifier", 400));
  }

  if (!detail) next(new AppError("Detail not Found", 404));

  return res.status(200).json({
    message: `${identifier} detail deleted successfully!`,
    detail,
  });
});

module.exports = {
  createDetail,
  getDetail,
  updateDetail,
  deleteDetail,
};
