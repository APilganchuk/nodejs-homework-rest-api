const { BadRequest } = require("http-errors");
const Joi = require("joi");
const { User } = require("../../models");

const joiSchema = Joi.object({
  subscription: Joi.string(),
});

const updateSubscription = async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }

    const { user } = req;
    const { _id } = user;
    const { subscription } = req.body;
    const updateSubscription = await User.findByIdAndUpdate(
      _id,
      {
        subscription,
      },
      { new: true }
    );

    const { email, subscription: subscr } = updateSubscription;

    res.json({
      status: "success",
      user: { email, subscription: subscr },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = updateSubscription;
