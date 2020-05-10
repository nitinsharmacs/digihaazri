
	const dragItem = document.getElementsByClassName('usercontrolsdiv-img')[0];
		const usercontrolsdiv = document.getElementsByClassName('usercontrolsdiv')[0];
		
		const controls = document.getElementsByClassName('usercontrolsdiv-controls')[0];
		const container = document.querySelector('body');

		const opencloseusercontrol = ()=>{
			if(!controls.getAttribute('class').includes('open'))
			controls.setAttribute('class', controls.getAttribute('class').split(' ')[0]+' open');
		 	else 
		 		controls.setAttribute('class', controls.getAttribute('class').split(' ')[0]);
		 	
		};
		dragItem.addEventListener('dblclick',opencloseusercontrol , false);
		dragItem.addEventListener('touch',opencloseusercontrol , false);
		

    let active = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    container.addEventListener("touchstart", dragStart, false);
    container.addEventListener("touchend", dragEnd, false);
    container.addEventListener("touchmove", drag, false);

    container.addEventListener("mousedown", dragStart, false);
    container.addEventListener("mouseup", dragEnd, false);
    container.addEventListener("mousemove", drag, false);

    function dragStart(e) {

      if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
      } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
      }

      if (e.target.parentNode === dragItem) {
        active = true;
      }
    }

    function dragEnd(e) {
      initialX = currentX;
      initialY = currentY;

      active = false;
    }

    function drag(e) {
      if (active) {
      
        e.preventDefault();
      
        if (e.type === "touchmove") {
          currentX = e.touches[0].clientX - initialX;
          currentY = e.touches[0].clientY - initialY;
        } else {
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, usercontrolsdiv);
      }
    }

    function setTranslate(xPos, yPos, el) {
      el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }


define(['../models/Search/SearchM','../views/Search/SearchV','../models/Notification/NotificationM' ,'../collections/Notification/NotificationC','../views/Notification/NotificationVs', '../models/Popups/MessageboxM', '../views/Popups/MessageboxV'], (SearchM,SearchV,NotificationM,NotificationC,NotificationVs, MessageboxM, MessageboxV)=>{

	// METHOD FOR SENDING REQUESTS TO SERVER
	const toServer = (element, operation, options) => {
		const method = {
			fetch: 'POST',
			save: 'POST',
			delete: 'DELETE'
		};
		return fetch(element.url || element.urlRoot || element, {
			method: method[operation],
			body: options ? options.body : {} || {}
		}).then(res=>res.json());
	};

	// METHOD FOR OPENING MOREMENUES
	const openMoreMenu = (ele) => {
		const moremenudiv = ele.target.parentNode.getElementsByClassName('moremenudiv')[0];
		const moremenu = moremenudiv.getElementsByClassName('moremenu')[0];
		moremenudiv.setAttribute('class', moremenudiv.getAttribute('class').split(' ')[0] + ' show');

		const xValue = ele.clientX - $(moremenu).width();
		yValue = ele.clientY;
		if(ele.clientY > (window.innerHeight- $(moremenu).height()-200)){
			 yValue = ele.clientY - $(moremenu).height();
		}
		//console.log(ele.clientY);
		//console.log(window.innerHeight -  $(moremenu).height())
		$(moremenu).css('transform', `translate3d(${xValue}px, ${yValue}px, 0px)`).fadeIn(200);		
		$('body').css('overflow', 'hidden');
	};

	// METHOD FOR CLOSIING MOREMENU DIV
	const closeMoreMenu = (ele) => {
		$('body').css('overflow', 'auto');

		const moremenudiv = ele.target.parentNode.getElementsByClassName('moremenudiv')[0];
	
		const moremenu = moremenudiv.getElementsByClassName('moremenu')[0];
			$(moremenu).fadeOut(200)
		setTimeout(()=> {
			moremenudiv.setAttribute('class', moremenudiv.getAttribute('class').split(' ')[0]);
		}, 200);
		$('body').css('overflow', 'auto');
	};


	// Adding search component
	const searchM = new SearchM();		
	const searchV = new SearchV({model:searchM, el:'.desktopsearch'});
	searchV.render();
	// Adding Notification component 

	const notificationc = new NotificationC();
	notificationc.url = window.location.href.includes('particularbatch')?notificationc.url:'/config/user/notifications';
	notificationc.delUrl = window.location.href.includes('particularbatch')?notificationc.delUrl:'/config/user/delnotifications';
	const notificationvs = new NotificationVs({model:notificationc,el:'.notification-bell'});
		notificationvs.render();	
	toServer(notificationc, 'fetch').then(result=>{
		if(!result.status || result.status != 200) throw new Error('Notification error');
		result.data?result.data.forEach(notif=>{
			notificationc.add(new NotificationM(notif));
		}):null;
		const notificationvs = new NotificationVs({model:notificationc,el:'.notification-bell'});
		Backbone['notifications'] = {};
		notificationvs.render();		
	}).catch(err=>console.log(err));
	

	// method for sending forgot profile password link on mail only for admin purpose
		const fgtprofpswd = () => {
			fetch('/rest/admin/fgtprofpswd', {
				method:'POST',
			}).then(res=>res.json()).then(result=>{
				if(result.status != 200)
					throw new Error('Mail not sent, try again!');
				//alert('Mail is sent with Password reset link!');
				const messageboxm = new MessageboxM({
					message:'Mail has sent!'
				});
				const messageboxv = new MessageboxV({model:messageboxm,el:'.dashboard'});
				messageboxv.render();
			}).catch(err=>{
				alert('Mail not sent!');
			});
		};
		

	return {
		toServer:toServer,
		openMoreMenu: openMoreMenu,
		closeMoreMenu: closeMoreMenu,
		fgtprofpswd:fgtprofpswd
	}
});