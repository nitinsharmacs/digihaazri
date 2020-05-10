const getRedirectToLogin = (req, res, next) => {
	return res.redirect('/auth/login');
}

module.exports = {
	getRedirectToLogin:getRedirectToLogin
}