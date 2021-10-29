const { NotFound } = require("http-errors");
const { User } = require("../../models");

const verify = async (req, res, next) => {
  try {
    const { verifyToken } = req.params;

    const user = await User.findOne({ verifyToken });
    if (!user) {
      throw new NotFound("User not found");
    }

    await User.findByIdAndUpdate(user._id, { verify: true, verifyToken: null });

    res.json({
      status: "success",
      code: 200,
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = verify;
