const ReportPost = require("../../models/Content Interaction/ReportPost");

const postReportPost = async (req, res) => {
  const { userId, postId, reportCategory, reportContent } = req.body;
  const report = new ReportPost({
    userId,
    postId,
    reportCategory,
    reportContent,
  });
  try {
    await report.save();

    return res.status(200).json({
      message: "Post Reported Successfully",
      report,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const getReport = async (req, res) => {
  const { reportId } = req.params;
  try {
    const report = await ReportPost.findById(reportId);

    if (report) {
      return res.status(200).json({
        report,
      });
    } else {
      return res.status(404).json({
        message: "Report does not exist or already have been solved.",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await ReportPost.find();

    if (reports) {
      return res.status(200).json({
        reports,
      });
    } else {
      return res.status(404).json({
        message: "No reports found.",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const deleteReport = async (req, res) => {
  const { reportId } = req.params;
  try {
    const deletedReport = await ReportPost.findByIdAndDelete(reportId);

    if (deletedReport) {
      return res.status(200).json({
        message: "Report deleted successfully",
      });
    } else {
      return res.status(404).json({
        message: "Report does not exist",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

module.exports = {
  postReportPost,
  getReport,
  getReports,
  deleteReport,
};
