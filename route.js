var controller=require('./controller.js');

const route=require('express').Router();
	route.get('/chat', (req, res)=>{
		res.send('<html><body>Welcome to the chat !</br><a href="http://localhost:3000/chat/connection">Conection</a></body></html>');
	});

	//Messages

	//CREATE
	route.get('/chat/api/create',(req,res)=>{
		res.send(controller.createMessageForm());
	});

	route.post('/chat/api/create',(req,res)=>{
		controller.apiCreateMessage(req.body.room, req.body.pseudo, req.body.message);
		res.send('CREATE : Variable initialized at '+req.body.message+'.');
	});
	
	//READ
	route.get('/chat/api/read',(req,res)=>{
		controller.apiReadMessages(res);
	});

	route.get('/chat/api/read/:id',(req,res)=>{
		controller.apiReadMessage(res, req.params.id);
	});
	
	//UPDATE
	route.get('/chat/api/update',(req,res)=>{
		res.send('UPDATE : Variable incremented.');
	});
	
	//DELETE
	route.get('/chat/api/delete',(req,res)=>{
		controller.deleteMessageForm(res);
	});

	route.post('/chat/api/delete',(req,res)=>{
		controller.apiDeleteMessage(res, req.body.mess_id);
	});
	

	//Room

	route.get('/chat/room/read/:user',(req,res)=>{ //for a user, see all the rooms
		controller.readRooms(res, req.params.user);
	});

	route.get('/chat/room/:name/:user',(req,res)=>{ //for a user, see the messages in the room
		controller.roomMessages(res, req.params.name, req.params.user);
	});

	route.get('/chat/room/connection/:name/:user',(req,res)=>{ //when a user enters in a room
		controller.userInRoom(res, req.params.name, req.params.user);
		//res.redirect('http://localhost:3000/chat/room/'+ req.params.name +'/'+ req.params.user);
	});

	route.get('/chat/room/quit/:name/:user',(req,res)=>{ //when a user leaves a room
		controller.userOutRoom(req.params.name, req.params.user);
		res.redirect('http://localhost:3000/chat/room/read/'+req.params.user);
	});

	route.post('/chat/room/:name/:user/create',(req,res)=>{ //in a room, when a user send a message
		controller.apiCreateMessage(req.params.name, req.params.user, req.body.message);
		res.redirect('http://localhost:3000/chat/room/'+req.params.name+'/'+req.params.user);
	});



	// User
	route.get('/chat/connection',(req,res)=>{ //for a user, to connect
		res.send(controller.connectionForm(res));
	});

	route.post('/chat/connection',(req,res)=>{
		controller.connection(res, req.body.pseudo, req.body.password);
	});
	
	//CREATE
	route.get('/chat/api/user/create',(req,res)=>{
		res.send(controller.createUserForm());
	});

	route.post('/chat/api/user/create',(req,res)=>{
		controller.apiCreateUser(req.body.pseudo, req.body.password);
		res.send('CREATE : Variable initialized at '+req.body.pseudo+'.');
	});
	
	//READ
	route.get('/chat/api/user/read/:username',(req,res)=>{
		controller.apiReadUser(res, req.params.username);
	});
	
	//UPDATE
	route.get('/chat/api/user/update',(req,res)=>{
		res.send('UPDATE...');
	});
	
	//DELETE
	route.get('/chat/api/user/delete',(req,res)=>{
		controller.deleteUserForm(res);
	});

	route.post('/chat/api/user/delete',(req,res)=>{
		controller.apiDeleteUser(res, req.body.pseudo);
	});




	// Admin
	route.get('/chat/admin', (req, res) => {
		controller.adminPage(res);
	});

	route.post('/chat/admin/user/read', (req, res) => {
		res.redirect('http://localhost:3000/chat/api/user/read/'+req.body.username);
	});

	route.post('/chat/admin/room/create', (req,res) => {
		controller.createRoom(req.body.name);
		res.redirect('http://localhost:3000/chat/admin');
	});

	route.post('/chat/admin/room/delete', (req,res) => {
		controller.deleteRoom(req.body.name);
		res.redirect('http://localhost:3000/chat/admin');
	});



module.exports=route;