const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res, next) => {
	if (!req.file) {
    	return next();
	}
  sharp.cache(false)
	sharp(req.file.path)
    .resize({ width: 500, height: 750 })
    .toFile(path.join('images', `compressed_${req.file.filename}`))
    .then(() => {
      fs.unlink(req.file.path, (err) => {
        req.file.path = path.join('images', `compressed_${req.file.filename}`);
        next();
      });
    })
    .catch(error => {
		console.log(error);
		return next();
	});
};