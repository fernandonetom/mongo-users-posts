const express = require('express');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const verifyToken = require('./auth/auth.middleware');
const authRoute = require('./auth/auth.routes');
const postsRoute = require('./posts/posts.routes');
const userRoute = require('./user/user.routes');
const { createError } = require('./utils/createErrors');
const handleErrors = require('./utils/handleErrors');
const swaggerDocs = require('../swagger.json');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/auth', authRoute);
app.use('/users', userRoute);
app.use('/uploads', express.static(path.join(__dirname, `../${process.env.UPLOAD_PATH}`)));

/* PROTECTED ROUTES */
app.use(verifyToken);
app.use('/posts', postsRoute);

app.use((req, res, next) => {
  next(createError(404));
});

app.use(handleErrors);

module.exports = app;
