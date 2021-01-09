require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/index');
const limiter = require('./middlewares/rare-limiter');
const errorHandler = require('./middlewares/error-handler');
const { localPort, mongo } = require('./utils/config');

const { NODE_ENV, PORT, MONGO_URL } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect((NODE_ENV === 'production' ? MONGO_URL : mongo), {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const corsOptions = {
  credentials: true,
};

app.use(requestLogger);

app.use(cors(corsOptions));

app.use(limiter);

app.use(helmet());

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen((NODE_ENV === 'production' ? PORT : localPort), () => {
  console.log(`App listening on port ${localPort}`);
});
