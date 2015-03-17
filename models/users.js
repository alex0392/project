var crypto=require('crypto');
var async=require('async');
var HttpError=require('../untils/error').HttpError;
var mongoose=require('../config/mongoose');
Schema=mongoose.Schema;
var schema=new Schema({
	username:{
		type:'string',
		unique:true,
		requiered:true
	},
	hashedPassword:{
		type:'string',
		requiered:true

	},
	salt:{
		type:'string',
		requiered:true,

	},
	created:{
		type:'date',
	}
});





schema.methods.encryptPassword=function(password){
	return crypto.createHmac('sha1',this.salt).update(password).digest('hex')
}
schema.virtual('password')
	.set(function(password){
		this._palinPassword=password;
		this.salt=Math.random()+'';
		this.hashedPassword=this.encryptPassword(password);
	})
	.get(function(){
		return this._plainPassword;
	})
	
schema.methods.checkPassword=function(password){
	return this.encryptPassword(password)===this.hashedPassword;
}	
	
schema.statics.authorize=function(username,password,callback){
	var User=this;
	
	async.waterfall([
		function(callback){
			User.findOne({username:username},callback);
		},
	
		function(user, callback){
			if(user){
				if(user.checkPassword(password)){
					callback(null,user);
				}else{
					callback(new HttpError(403,'PASSWORD ERROR'))
				}
			}
		else{
			var user=new User({username:username,password:password});
			user.save(function(err){
				if(err) return callback(err);
				callback(null,user);
			});
		}
		}
	],callback);
}

exports.Users=mongoose.model('Users',schema);