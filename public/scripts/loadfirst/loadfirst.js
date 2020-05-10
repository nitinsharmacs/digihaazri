// METHOD to add stack 
const stack = (value, stackname) =>{
	console.log(stackname);
	let sessionstorage;
	let stackobject = {
		stack:[]
	};
	if(value){
		// if there is link
		sessionstorage = window.sessionStorage.getItem(stackname);
		console.log(sessionstorage);
		if(sessionstorage){
			if(sessionstorage.length>0){
				stackobject = JSON.parse(sessionstorage);
				// console.log(stackobject);

				// checking the link present in the stack
				let findlink = stackobject.stack.find(arr=>{
					if(value.toString() === arr.toString()){
						return arr;
					}
				});
				if(!findlink){
					// if link is not present
					stackobject.stack.push(value);
					console.log(stackobject);
					window.sessionStorage.setItem(stackname,JSON.stringify(stackobject));
				}
			}
		} else {
			stackobject.stack.push(value);
			window.sessionStorage.setItem(stackname, JSON.stringify(stackobject));
		}
	}
};

// METHOD FOR add backward stack
const fillbackwardstack = (value) =>{

	if(value){
		let forwardstackstring = window.sessionStorage.getItem('forwardstack');
			if(forwardstackstring){
				if(forwardstackstring.length>0){
				let forwardstack = JSON.parse(forwardstackstring);
				if(forwardstack){
					let len = forwardstack.stack.length;
					if(value != forwardstack.stack[len-1]){
						stack(value, 'backwardstack');
					}
				}
			}
		} else {
			stack(value, 'backwardstack');
		}
		
	}
}

// METHOD FOR add forward stack
const fillforwardstack = (value) =>{
	if(value){
		stack(value, 'forwardstack');
	}
}

