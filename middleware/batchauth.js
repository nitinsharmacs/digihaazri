const batchauth = (req, res, next)=>{
	if(req.session.batchInfo){
		//batch is logined
		next();
	} else {
		//batch is not logined
		res.redirect('/admin/batch');
	}
}
exports.batchauth = batchauth;