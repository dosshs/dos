const ReportPost = require("../../models/Content Interaction/Post/ReportPost");
const AppError = require("../../Utilities/appError");
const catchAsync = require("../../Utilities/catchAsync");

const postReportPost = catchAsync(async (req, res, next) => {
  const { userId, postId, reportCategory, reportContent } = req.body;
  const report = new ReportPost({
    userId,
    postId,
    reportCategory,
    reportContent,
  });

  await report.save();

  return res.status(200).json({
    message: "Post Reported Successfully",
    report,
  });
});

const getReport = catchAsync(async (req, res, next) => {
  const { reportId } = req.params;

  const report = await ReportPost.findById(reportId);

  if (report) {
    return res.status(200).json({
      report,
    });
  } else {
    return next(
      new AppError("Report does not exist or already have been solved.", 404)
    );
  }
});

const getReports = catchAsync(async (req, res, next) => {
  const reports = await ReportPost.find();

  if (reports) {
    return res.status(200).json({
      reports,
    });
  } else {
    return next(new AppError("No Reports Found.", 404));
  }
});

const deleteReport = catchAsync(async (req, res, next) => {
  const { reportId } = req.params;

  const deletedReport = await ReportPost.findByIdAndDelete(reportId);

  if (deletedReport) {
    return res.status(200).json({
      message: "Report deleted successfully",
    });
  } else {
    return next(new AppError("Report does not exist", 404));
  }
});

module.exports = {
  postReportPost,
  getReport,
  getReports,
  deleteReport,
};
