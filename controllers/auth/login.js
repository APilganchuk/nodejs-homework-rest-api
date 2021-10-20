const { BadRequest, Unauthorized } = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { joiSchema } = require("../../models/user");

const { User } = require("../../models");

const { SECRET_KEY } = process.env;

const login = async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);
    const { email, password } = req.body;

    if (error) {
      throw new BadRequest(error.message);
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Unauthorized("Email  is wrong");
    }

    const { subscription } = user;

    const isCorrectPassword = bcrypt.compareSync(password, user.password);
    if (!isCorrectPassword) {
      throw new Unauthorized("Password is wrong");
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY);

    await User.findByIdAndUpdate(user._id, { token });

    res.json({
      status: "success",
      code: 200,
      token,
      user: {
        email,
        subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = login;
