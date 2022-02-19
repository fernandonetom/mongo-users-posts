require('dotenv').config();
const mongoose = require('mongoose');

mongoose
  // .set('useCreateIndex', true)
  .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

module.exports = mongoose;
