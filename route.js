var controller=require('./controller.js');

const route=require('express').Router();
	//CRUD of messages
	route.get('/chat', (req, res)=>{
		controller.apiReadMessages(res);
	});

	route.post('/chat', (req, res)=>{
		controller.apiPostMessage(req);
	});

	//CREATE
	route.get('/chat/api/create',(req,res)=>{
		res.send(controller.createMessageForm());
	});

	route.post('/chat/api/create',(req,res)=>{
		controller.apiCreateMessage(req.body.saloon, req.body.pseudo, req.body.message);
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
	

module.exports=route;