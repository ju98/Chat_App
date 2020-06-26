const mongoose=require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const bcrypt = require('bcrypt-nodejs');



var connection = mongoose.createConnection("mongodb://localhost/chat");
autoIncrement.initialize(connection);

var schemaAnswer=new mongoose.Schema({
	room: String,
	pseudo: String,
	message: String,
	date: Date,
});

schemaAnswer.plugin(autoIncrement.plugin, { model: 'Answer', field: 'mess_id' }); // auto increment of the attribute mess_id

module.exports.Answer=mongoose.model('Answer',schemaAnswer);


var schemaRoom=new mongoose.Schema({
	name: String,
});
schemaRoom.users = [];
module.exports.Room=mongoose.model('Room', schemaRoom);





var schemaUser = new mongoose.Schema({
    pseudo: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true }
});

//  Hash the password before saving it to the database
schemaUser.pre('save', function(next) {
	let user = this;
	if (!user.isModified('password'))
		return next();

	bcrypt.genSalt(10, function(err, salt) {
		if (err)
			return next(err);

	    bcrypt.hash(user.password, salt, null, function(err, hash) {
	    	if (err)
	    		return next(err);
	    	user.password = hash;
	    	next();
	    });
	});
})

// compare password in the database and the one that the user type in
schemaUser.methods.comparePassword = function(password) {
	let user = this;
	return bcrypt.compareSync(password, user.password); //boolean true/false
}

module.exports.User = mongoose.model('User', schemaUser);

//check if a user is connected
module.exports.User.connected = [];
schemaUser.methods.is_connected = function() {
	let user = this;
	return (User.connected.includes(user.pseudo)); //boolean true/false
}

//list of users in a room
module.exports.usersInRoom = [];
