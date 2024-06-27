const sharp = require('sharp');
const fs = require('fs');

module.exports = async (req, res, next) => {
	if (!req.file) {
    	return next()
	};
	try {
		await sharp(req.file.path)
		.resize({ width: 500, height: 750 })
		.toFile(req.file.newFilePath) 
		
		fs.unlink(req.file.path, (error) => {
			if(error) console.log(error);
		});
		next();
		} 	
	catch(error) {
		res.status(403).json({ error });
	}
};