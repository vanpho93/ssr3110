var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

server.listen(process.env.PORT || 3000, () => console.log('Server started'));

app.get('/', (req, res)=>res.render('homepage'));

var {getAllNote, deleteNote, updateNote, insertNote} = require('./db.js');

io.on('connection', socket => {
  console.log('Co nguoi ket noi');

  getAllNote(rows => {
    socket.emit('SERVER_SEND_DATA_FIRST_TIME', rows);
  });

  socket.on('DELETE_NOTE', data =>{
    deleteNote(data, kq => {
      socket.emit('SERVER_CONFIRM_DELETE', {result: kq, index: data});
    });
  });

  socket.on('CLIENT_ADD_NOTE', note => {
    insertNote(note, row => {
      socket.emit('SERVER_ACCEPT_NOTE',row);
    });
  });

  socket.on('CLIENT_UPDATE_NOTE', note => {
    updateNote(note.id, note.value, rowCount => {
      if(rowCount == 1){
        socket.emit('SERVER_ACCEPT_UPDATE', note);
      }else{
        socket.emit('SERVER_ACCEPT_UPDATE', '');
      }
    });
  });
});
