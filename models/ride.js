var mongoose=require('mongoose');

var rideSchema = mongoose.Schema({
	src: String,
	des: String,
	date: Date,
  price: Number,
  numOfSeat: Number,
	detail:{
		luggage: String,
    flexibility: String,
    detour: String
	},
  owner: {
    id: mongoose.Schema.Types.ObjectId,
    name: String
  }
});


module.exports = mongoose.model('Ride',rideSchema);
