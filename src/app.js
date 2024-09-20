import compression from 'compression';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import { trim_all } from 'request_trimmer';
import { UniqueConstraintError } from 'sequelize';
import logger from './helpers/logger.helper';
import response from './helpers/response.helper';
import { specs, swaggerUi } from './helpers/swagger.helper';

const app = express();

app.use(
  cors(),
  compression(),
  express.json(),
  trim_all,
);

// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

if (process.env.NODE_ENV != 'production') {
  app.use(morgan('dev'));
}

// app routes
app.use(require('./routes/book.route'));
app.use(require('./routes/member.route'));

// error handler
app.use(function (error, req, res, next) {
  if (error instanceof UniqueConstraintError) {
    return response({ res, code: 409 });
  }

  logger.error(
    JSON.stringify({
      trace: error.stack,
      user: req.user ?? {},
      body: req.body ?? {},
    }),
  );

  if (process.env.NODE_ENV != 'production') {
    console.log(error);
  }

  return response({ res, code: 500 });
});

app.use(function (req, res, next) {
  return response({ res, code: 404 });
});

app.listen(
  process.env.PORT, () => {
    console.log('Server started on port', process.env.PORT);
  }
);