const currentdate = () =>{
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep','Oct' ,'Nov', 'Dec'];
	const date = new Date();
	let afterday;
	if(date.getDate() == 1){
		afterday = 'st';
	} else if(date.getDate() == 2) {
		afterday = 'nd';
	} else if(date.getDate() == 3){
		afterday = 'rd';
	} else {
		afterday = 'th';
	}

	const dateToSend = date.getDate()+afterday+' '+months[date.getMonth()]+', '+ date.getFullYear();
	return dateToSend;
};

const currenttime = () =>{
	const date = new Date();
	let amOrpm;
	let hours;
	let minutes;
	let seconds;
	if((date.getHours()/12)>=1){
		// then there is PM
		amOrpm = 'PM';
	} else {
		// then there is AM
		amOrpm = 'AM';
	}
	hours = date.getHours()%12; 
	hours = hours?hours:'12';
	minutes = date.getMinutes();
	minutes = minutes?minutes:'00';
	minutes = minutes>9?minutes:'0'+minutes;
	seconds = date.getSeconds();
	seconds = seconds?seconds:'00';
	seconds = seconds>9?seconds:'0'+seconds;
	let time = hours + ':' + minutes + ':' + seconds +' '+ amOrpm; 
	// console.log(hours + minutes+amOrpm);
	return time;
}

module.exports = {
	currentdate:currentdate,
	currenttime:currenttime
};

