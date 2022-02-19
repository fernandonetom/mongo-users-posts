require('dotenv').config();
require('./database/mongodb');

const app = require('./app');
const { createFolderIfNotExists } = require('./utils/fs');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  createFolderIfNotExists(process.env.UPLOAD_PATH);

  console.log(`Server started on http://localhost:${port}`);
});
