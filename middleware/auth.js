const auth = (req, res, next) =>{
	if(req.session.logined){
		return next();
	}

	return res.redirect('/');
}

exports.auth = auth;