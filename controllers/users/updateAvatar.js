const fs = require("fs/promises");
const path = require("path");
const { User } = require("../../models");

const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { path: tempDir, originalname } = req.file;
    const [extension] = originalname.split(".").reverse();
    const filename = `${_id}_main-img.${extension}`;
    const uploadDir = path.join(
      __dirname,
      "../../",
      "public\\avatars",
      filename
    );

    await fs.rename(tempDir, uploadDir);
    const image = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL: image });

    res.json({
      status: "success",
      code: 200,
      message: "update avatar success",
      avatarURL: image,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = updateAvatar;
