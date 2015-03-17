var User=require('../models/users').Users
var async=require('async');
var HttpError=require('../untils/error').HttpError;

exports.index=function(req,res){
	styles[3]='/stylesheets/form.css'
	res.render('reg.jade');
}
exports.logout=function(req,res){

	req.session=null;
	res.redirect('/');

}


exports.send=function(req,res,next){
	var username=req.body.login
	var password=req.body.password
/*
	var users=new Users({
		username:login,
		password:password,
	})
	users.save(function(){
		console.log('OKEY')
	})*/
	
	User.authorize(username, password, function(err,user){
		if(err){
			if(err instanceof HttpError){
				return next(new HttpError(403,err.message));
			}else{
				return next(err);
			}
		}
	
		req.session.user=user._id;

		console.log(req.session.user);
		res.redirect('/')
	})
	
}