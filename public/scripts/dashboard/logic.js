define(['../models/Recentacti/RecentactiM', '../collections/Recentacti/RecentactiC', '../views/Recentacti/RecentactiVs', '../models/Popups/MessageboxM', '../views/Popups/MessageboxV'],(RecentactiM,RecentactiC,RecentactiVs, MessageboxM, MessageboxV)=>{
	
	// loading recent activities
	const loadRecentActivities = () => {
		const recentactic = new RecentactiC();

		fetch(recentactic.urlRoot,{
			method:'POST',
			body:{}
		}).then(res=>res.json()).then(result=>{
			if(!result) 
				throw new Error('Error while fetching activities');
			result.data.forEach(acti=>{
				recentactic.add(new RecentactiM(acti));
			});
			const recentactivs = new RecentactiVs({model:recentactic,el:'.recent-activitylist'});
			recentactivs.render();
		}).catch(err=>{
			console.log(err);
		});	

	};
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
				alert(err.message || 'MAIL NOT SENT');
			});
		};
		
	
	return {
		loadRecentActivities:loadRecentActivities,
		fgtprofpswd:fgtprofpswd
	};
});