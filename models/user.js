var mongoose=require('mongoose');
var bcrypt=require('bcrypt-nodejs');

var userSchema=mongoose.Schema({
  local:{
    email:String,
    password:String
  },
  rides:{
  	offered:[mongoose.Schema.Types.ObjectId],
  	booked:[mongoose.Schema.Types.ObjectId]
  },
  profile:{
  	personal:{
  		name: String
  	}
  	// photo:{},
  	// car: {
  	// 	modal: String,
  	// 	colour: String
  	// }
  	// exp: String,
  	// rate: Number,
  	// preferences: {
  	// 	chat: Number,
  	// 	smoke: Number,
  	// 	pet: Number,
  	// 	music: Number
  	// }
  }
});

userSchema.methods.generateHash=function(password){
  return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
}

userSchema.methods.validPassword=function(password){
  return bcrypt.compareSync(password,this.local.password);
}

module.exports = mongoose.model('User',userSchema);
