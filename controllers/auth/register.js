const { BadRequest, Conflict } = require("http-errors");
const { joiSchema } = require("../../models/user");
const bcrypt = require("bcryptjs");

const { User } = require("../../models");

const register = async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw new Conflict("Email in use");
    }

    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const result = await User.create({ email, password: hashPassword });
    const { subscription } = result;

    res.status(201).json({
      status: "success",
      code: 201,
      message: "Register success",
      user: { email, subscription },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = register;
