const fs = require('fs');

exports.removeIfFileExists = (path) => {
  try {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
  } catch (error) {
    console.log('Error on file delete');
  }
};

exports.createFolderIfNotExists = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);

    console.log(`${path} Created Successfully.`);
  }
};
