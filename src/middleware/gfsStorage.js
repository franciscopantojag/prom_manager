const { createGridFsStorage } = require('../lib/createGridFsStorage');

exports.gfsStorage = (req, res, next) => {
  let gridFsStorage = null;
  try {
    gridFsStorage = createGridFsStorage();
  } catch (error) {
    console.log(error);
  }
  if (gridFsStorage) {
    req.gridFsStorage = gridFsStorage;
  }

  return next();
};
