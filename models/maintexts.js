var mongoose=require('../config/mongoose');
var Schema=mongoose.Schema;

var schema=new Schema({
	name:{
		type:String,
		unique:true,
		requiered:true
	},
	body:{
		type:String,
	},
	url:{
		type:String,
		unique:true,
		requiered:true
	}
	
});
exports.maintexts=mongoose.model('maintexts',schema);