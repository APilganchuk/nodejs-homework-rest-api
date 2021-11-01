const Joi = require("joi");
const { BadRequest } = require("http-errors");

const joiSchema = Joi.object({
  email: Joi.string().email().required(),
});

const { User } = require("../../models");

const { sendEmail } = require("../../helpers");

const resendEmail = async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);
    const { email } = req.body;
    if (error) {
      throw new BadRequest("missing required field email");
    }
    const user = await User.findOne({ email });
    if (user && !user.verify) {
      const { verifyToken } = user;

      const resendVerificationEmail = {
        to: email,
        from: "opilganchuk@gmail.com",
        subject: "Verification email (repeat) ",
        html: `<b>Hello my friend!</b>
            <a target="_blank" href="http://localhost:3000/api/users/verify/${verifyToken}">
              Press for finish register!
            </a>`,
      };

      sendEmail(resendVerificationEmail);

      res.json({
        message: "Verification email sent",
      });

      return;
    }

    throw new BadRequest("Verification has already been passed");
  } catch (error) {
    next(error);
  }
};

module.exports = resendEmail;
