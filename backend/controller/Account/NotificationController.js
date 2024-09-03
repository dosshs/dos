const Notification = require("../../models/Notification");

const sendNotification = async (req, res) => {
  const { content, userId, username, admin, notificationType } = req.body;

  const notification = new Notification({
    content,
    userId,
    username,
    admin,
    notificationType,
  });

  try {
    await notification.save();

    return res.status(200).json({
      message: "Notification Sent",
      notification,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const getNotification = async (req, res) => {
  const { userId } = req.query;
  try {
    const notifications = await Notification.find({ userId });

    return res.status(200).json({
      notification: notifications,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const deleteNotification = async (req, res) => {
  const { id } = req.query;
  try {
    await Notification.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Notification Deleted",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

module.exports = {
  sendNotification,
  getNotification,
  deleteNotification,
};
