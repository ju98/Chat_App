# Chat_App
A chat server built with Node.Js, MongoDB and Redis

<h2>Prerequisites</h2>
Requirements for using this app:
<ul>
  <li>NodeJS must be installed and configured.</li>
  <li>MongoDB must be installed.</li>
  <li>Nodemon must be installed globally; this is accomplished with the following command: npm install -g nodemon</li>
</ul>  

<h2>How to install the project and its dependencies</h2>
<ol>
  <li>Clone this project : git clone https://github.com/ju98/Chat_App.git</li>
  <li>Initialize a package.json file : npm init</li>
  <li>Install the following dependencies:
  <ul>
    <li>Express.js (npm install express)</li>
    <li>Mongoose (npm install mongoose) and (npm install mongoose-auto-increment)</li>
    <li>Redis (npm install redis) = node_redis</li>
    <li>Bcrypt (npm install bcrypt-nodejs)</li>
  </ul>
  </li>
</ol>

<h2>How to start the application</h2>
<ol>
  <li>Run mongod</li>
  <li>Start Redis server</li>
  <li>Run server (nodemon app.js)</li>
</ol>

<h2>Features of the chat</h2>
<h3>For a user :</h3>
<ul>
<li>If he has a login (pseudo + password) previously registered by the admin, he can connect <a href="http://localhost:3000/chat/connection">here</a> and access all the rooms of the chat.</li>
<li>He can only be in one room at a time. (Don’t forget to click on the link ‘Leave room’ in order to quit a room. Otherwise the user is still considered in the room.)</li>
<li>Into a room, he can see the thread of messages sent, the users who are in the same room and send messages.</li>
<li>In order to see the new messages, he has to update the page.</li>
</ul>
<h3>For the admin :</h3> <a href="http://localhost:3000/chat/admin">admin page</a>
<ul>
<li>He can create or delete users.</li>
<li>He can see the characteristics of a user, by entering his pseudo.</li>
<li>He can see the rooms and create or delete them.</li>
<li>In this <a href="http://localhost:3000//chat/api/delete">page</a> he can delete a message (with the id of the message).</li>
</ul>
  
<h2>Caracteristics</h2>
<h3>User :</h3> 
<ul>
<li>Users are managed with Redis.</li>
<li>A user is identified by his pseudo. His pseudo is unique and there can’t be 2 users with the same one. His has also a password and a name of room (None : if he’s not in a room).</li>
</ul>
<h3>Room :</h3>
<ul>
<li>Rooms are managed with MongoDB.</li>
<li>A room is identified by his name.</li>
</ul>
<h3>Message :</h3>
<ul>
<li>Messages are managed with MongoDB.</li>
<li>Attributes of a message are the id, the room where it has been sent, the pseudo of the sender, the message, and the date.</li>
</ul>
