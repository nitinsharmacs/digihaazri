const mongodb = require('mongodb');
const database = require('../util/dbconnection').database;

let db;

database((database)=>{
	db = database;
});

class User {
	constructor(userInformation){
		this.userToSend = {
			username: userInformation.username,
			userimageurl: 'images/usericon.png',
			useremail: userInformation.useremail,
			password: userInformation.password,
			userphone: undefined,
			useraddress: '',
			profilepasscode: userInformation.password,
			batches: []
		}
	}

	//object method 
	save(){
		return db.collection('users').insertOne(this.userToSend);
	}

	// static method for finding user by username or email
	static findUser (username, useremail) {
		return db.collection('users').findOne({$or:[{username: username}, {useremail: useremail}]});
	}	

	static updateUser(whattoupdate, updateData, userId){	
		switch(whattoupdate){
			case 'Batches': 
				return db.collection('users').findOne({_id: new mongodb.ObjectId(userId)}).then(result=>{
					if(result){
						const batch = result.batches.find(batc=>{
							if(batc.batchname == updateData.batchname && batc.teachername == updateData.teachername){
								return batc;
							}
						});
						if(batch){	//batch is batchobject found
							//batch is present
							return new Promise((resolve, reject)=>{
								resolve(undefined);
							});
						}
						const newBatches = [...result.batches, updateData];
						return db.collection('users').updateOne({_id: new mongodb.ObjectId(userId)}, {$set:{batches: newBatches}});
					}
				}).catch(err=>console.log(err));

			case 'PROFILE': 
				return db.collection('users').updateOne({_id: userId}, {$set:{userphone: updateData.userphone, useremail: updateData.useremail, useraddress: updateData.useraddress}});
			
			case 'PASSWORD':
				return db.collection('users').updateOne({_id: userId}, {$set:{password:updateData}});

			case 'PROFILEPASSCODE': 
				return db.collection('users').updateOne({_id: userId}, {$set:{profilepasscode: updateData}});
			case 'PROFILEIMAGE':
				return db.collection('users').updateOne({_id: userId}, {$set:{userimageurl: updateData}});
		}
	};

	static updatebatch(userId, previousbatchname, batchdata){
		return db.collection('users').findOne({_id: userId}).then(user=>{
			if(!user){
				return  Promise.resolve(undefined);
			}
			const batches = user.batches;
			const index = batches.findIndex(batch=>batch.batchname==previousbatchname);
			batches[index].batchname = batchdata.batchname;
			batches[index].teachername = batchdata.teachername;
			return db.collection('users').updateOne({_id: userId}, {$set:{batches: batches}});
		});
	};

	static removebatch(userId, batchname){
		return db.collection('users').findOne({_id: userId}).then(user=>{
			if(!user){
				return Promise.resolve(undefined);
			}
			let updatedbatches = user.batches.filter(batch=>{
				if(batch.batchname != batchname){
					return batch;
				}
			});
			console.log(updatedbatches)
			return db.collection('users').updateOne({_id: userId}, {$set:{batches: updatedbatches}});
		});
	}
	static saveOTP(username,useremail, OTP){
		return db.collection('users').updateOne({$or:[{username:username},{useremail:username}]}, {$set:{OTP:{OTP:OTP,expires:Date.now() + 600000}}});
	}
}

module.exports = User;

