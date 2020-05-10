const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');		//importing session package for making session
const MongodbStore = require('connect-mongodb-session')(session);		//creating a mongodbStore method for creating session store
const multer = require('multer');	//importing multer for download and uploading files date
const flash = require('connect-flash');	//importing flash for flashing some information to the front-end
const helmet = require('helmet');
const compression = require('compression');


//setting ejs template engine
app.set('view engine', 'ejs');	//setting view engine as ejs
app.set('views', 'views');		//setting views folder is views , that is where views are

//importing router
const authRouter = require('./route/auth/auth');
const adminRouter = require('./route/admin/admin');
const teacherRouter = require('./route/teacher/teacher');
const nonadminRouter = require('./route/nonadmin/nonadmin');
const downloads= require('./route/downloads/downloads');
const config = require('./route/config/config');
const restRoutes = require('./RESTroutes/RESTroutes');
//-------------------------

//importing database connection
const dbconnection = require('./util/dbconnection').dbconnection;
//------------------------

//importing usermade modules
const rootDir = require('./util/path');

if (!fs.existsSync(path.join(rootDir,'images'))) {

   fs.mkdir('images', (err)=>{
 		if(err){
		console.log(err);
		} else {
		 fs.mkdir('images/batches', (err)=>{
 		if(err){
		console.log(err);
		} else {
		console.log('directory is created');
		}
	});
	 fs.mkdir('images/student', (err)=>{
 		if(err){
		console.log(err);
		} else {
		console.log('directory is created');
		}
	});
	  fs.mkdir('images/teacher', (err)=>{
 		if(err){
		console.log(err);
		} else {
		console.log('directory is created');
		}
	});
	   fs.mkdir('images/user', (err)=>{
 		if(err){
		console.log(err);
		} else {
		console.log('directory is created');
		}
	});
		console.log('directory is created');
		}
	});

}
//-------------------------
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//making public folder publicly accessble
app.use(express.static(path.join(rootDir, 'public')));
//---------------------------
// making image as static folder
app.use('/images',express.static(path.join(rootDir, 'images')));

//---------------------------
app.use((req, res, next)=>{
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PETCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	if(req.method == 'OPTIONS'){
		return res.sendStatus(200);
	}
	next()
})


//making fileStorage for multer files
const fileStorage = multer.diskStorage({
	destination: (req, file, cb) =>{
		let dest = 'images';
		console.log(req.body.imageinfo);
		if(req.body.imageinfo){
			dest = 'images/' + req.body.imageinfo;
			
		}
		console.log(req.body);
		cb(null, dest);
	},
	filename: (req, file, cb)=>{
		const date = new Date();
		const fileName = date.getFullYear()+'_'+date.getMinutes()+'_'+date.getTime() + file.originalname;
		cb(null, fileName);
	}
});
//making file filter
const fileFilter = (req, file, cb) =>{
	if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg'){
		req.invalidimage = false;
		cb(null, true);		//valid image
	} else {
		req.invalidimage = true;
		cb(null, false);		//invalid image
	}
}
//passing multer as middleware
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).fields([{name: 'profileimageinput', maxCount: 1}, {name:'uploadimage', maxCount:1}, {name: 'studentimage', maxCount:1}, {name:'teacherimage', maxCount:1}]));
//setting store for storing session
const URL1 = 'mongodb://127.0.0.1:27017/expressJs';
const URL2 = 'mongodb+srv://nitin:nitin123@cluster0-jx9oe.mongodb.net/expressJs?retryWrites=true&w=majority';
const store = new MongodbStore({
	uri:URL2,
	collection: 'sessions'
});
//making session middleware
app.use(session({secret:'nitin', resave: false, saveUninitialized: false, store: store}));

//making flash as middleware
app.use(flash());

//making middleware for routing

app.use('/auth',authRouter);
app.use(nonadminRouter);
app.use('/admin', adminRouter);
app.use('/admin/particularbatch', teacherRouter);
app.use('/downloads', downloads);
// app.use((error, req, res, next)=>{
// 	res.send('SErver Error, SOrry of Unconvienice');
// });
app.use('/config', config);
app.use('/rest',restRoutes);

app.use((req, res, next)=>{
	if(req.url === '/favicon.ico' || req.url === '/scripts/lib/underscore-min.map' || req.url === '/scripts/lib/backbone-min.map'){
		res.status(204).send('n');
		return;
	}
	const error = new Error('404 Page Not Found');
	error.data = {
			pageTitle:'404 Page Not Found',
			heading:error.message,
			img:'/img/404Error.png',
			message:'Page you are trying to visit, is not found. Please go back!',
			alt:'error'
		};
		error.type = 'WEB';
	return next(error);
});

app.use((error, req, res, next)=>{
	console.log(error)
	console.log(error.message + 'IS THE ERROR MESSAAGE');
	console.log(error.statusCode + 'IS THE ERROR STATUSCODE');

	if(error.type === 'WEB')
		return res.render('infoPages/infopage',{pageTitle:error.data.pageTitle, heading:error.data.heading, img: error.data.img,alt:error.data.alt,message:error.data.message, redirect:false});

	// console.log(error.type + 'IS THE TYPE');
	if(!error.statusCode){
		error.statusCode = 500;
	}
	if(error.statusCode == 500){
		error.message = 'Internal Server Error !';
	}
	return res.status(error.statusCode).json({message: error.message, data:error.data, status: error.statusCode});
	
})

dbconnection(()=>{
	app.listen(process.env.PORT || 3001, ()=>{
		console.log(`APP IS RUNNING ON ${process.env.PORT || '3001'} PORT`);
	});
});
