const localPort = 3000;
const mongo = 'mongodb://localhost:27017/news-explorer';
const jwtSecret = 'eb28135ebcfc17578f96d4d65b6c7871f2c803be4180c165061d5c2db621c51b';
const salt = 10;

module.exports = {
  localPort,
  mongo,
  jwtSecret,
  salt,
};
