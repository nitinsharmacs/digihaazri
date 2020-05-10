
const routeCookie = (req, res, currentwindow) => {
	let route = {
		currentwindow: currentwindow,
		previouswindow: null
	};
	let routeString;
	let routeCookie;
	const cookie = req.get('Cookie');
	const cookiearray = cookie.split(';');
	if(cookiearray.length>0){
		routeCookie = cookiearray.find(array=>{
			if(array.trim().split('=')[0] == 'route'){
				return array;
			}
		});

		console.log('Route COOKIE' + routeCookie);
		if(routeCookie){
			routeString = routeCookie.split('=')[1];
			console.log('ROUTE STINNG' + routeString);
		}
		if(routeString){
			route = JSON.parse(routeString);
		}
	}
	if(route.currentwindow){
		if(route.currentwindow != currentwindow){
			route.previouswindow = route.currentwindow;
			route.currentwindow = currentwindow;
			routeString = JSON.stringify(route);
			console.log('HII NITIN 1' + routeString);
			res.setHeader('Set-Cookie', 'route='+routeString);
		} else {
			console.log('HII NITIN 2');
			route.currentwindow = currentwindow;
			routeString = JSON.stringify(route);
			res.setHeader('Set-Cookie', 'route='+routeString);
		}
		
	} else {
		console.log('HII NITIN 3');	
			route.currentwindow = currentwindow;
			routeString = JSON.stringify(route);
			res.setHeader('Set-Cookie', 'route='+routeString);
	}

	return route;

};


module.exports = routeCookie;