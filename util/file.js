const fs = require('fs');

const deleteFile = (filepath) =>{
	
	if(filepath != '/images/usericon.png' && filepath != '/images/education.png'){
		fs.unlink('.'+filepath, (err)=>{
			if(err){
				console.log(err);
			}
		})
	}
}

exports.deleteFile = deleteFile;