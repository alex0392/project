//переменные
//логика
//шаблон
config=require('../config');
scripts=config.get('scripts');
scripts[0]='';



exports.index=function(req,res){
	if(req.params.id){
		var index=req.params.id;
	}else{var index='index'}
	var maintexts=require('../models/maintexts').maintexts;
	//userId=req.session.user;
	maintexts.findOne({'url':index},function(err,text){
		if(!text){text={
		name:'Добро пожаловать насайт',
		body:'Упс. Ошибка 404:(('
		}}
		res.render('index',{text:text});
	})
	
	
}
exports.add=function(req,res){
	var Maintexts=require('../models/maintexts').maintexts;
	var maintexts=new Maintexts({
		name:'История марки',
		body: 'История марки',
		url:'history'
	});
	maintexts.save(function(){
		console.log('OK');
	});
	
	res.redirect('/');
}