const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

const post_profilepicture = async (req, res) => {
  const firebaseConfig = {
    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  };

  initializeApp(firebaseConfig);
  const storage = getStorage();

  try {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const storageRef = ref(
      storage,
      `profilepicture/${req.body.username}/${req.file.originalname}-${uniqueSuffix}`
    );

    const metadata = {
      contentType: req.file.mimetype,
    };

    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );

    const downloadURL = await getDownloadURL(snapshot.ref);

    return res.status(200).json({
      message: "Profile Picture Successfully Uploaded!",
      profilePictureLink: downloadURL,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

module.exports = {
  post_profilepicture,
};
