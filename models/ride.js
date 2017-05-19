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
    detour: String,
		note: String
	},
  owner: {
    id: mongoose.Schema.Types.ObjectId,
    name: String
  }
});


module.exports = mongoose.model('Ride',rideSchema);

// {
//   "numOfSeat": 3,
//   "price": 10,
//   "date": ISODate("2016-12-30T17:00:00Z"),
//   "des": "Hưng Yên, Việt Nam",
//   "src": "Hà Nội, Việt Nam",
//   "owner": {
//     "name": "admin"
//   },
// },
// {
//   "numOfSeat": 1,
//   "price": 70,
//   "date": ISODate("2017-11-30T17:00:00Z"),
//   "des": "Hưng Yên, Việt Nam",
//   "src": "Hà Nội, Việt Nam",
//   "owner": {
//     "name": "admin"
//   },
//   "__v": 0
// }
