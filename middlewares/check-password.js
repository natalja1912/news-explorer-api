const checkPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password || !password.trim()) {
    res.status(400).send({ message: 'Поле password должно быть заполнено' });
  }
  if (password.trim().length < 8) {
    res.status(400).send({ message: 'Поле password должно содержать не менее 8 символов' });
  }
  next();
};

module.exports = checkPassword;
