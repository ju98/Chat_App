//server side
const mongoose=require('mongoose');
	mongoose.connect('mongodb://localhost/chat',{useNewUrlParser: true,  useUnifiedTopology: true});
	var db=mongoose.connection;
	db.on('error',console.error.bind(console,'connection error:'));
const bodyParser=require('body-parser');

//client side
const express=require('express');
	const app=express();
	app.use(bodyParser.urlencoded({extended: true}));
		const route=require('./route.js');
		app.use(route);
		app.listen(3000);
/*
	const http = require('http').Server(app);
	const io = require('socket.io')(http);
*/
console.log('Waiting on localhost:3000');

