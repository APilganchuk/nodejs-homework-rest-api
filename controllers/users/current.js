const getCurrent = async (req, res) => {
  const { user } = req;

  const { email, subscription } = user;

  res.json({
    status: "success",
    user: {
      email,
      subscription,
    },
  });
};

module.exports = getCurrent;
