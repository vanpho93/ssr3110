var express = require('express');
var app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

app.listen(process.env.PORT || 3000, () => console.log('Server started'));

app.get('/', (req, res)=>res.render('homepage'));

var {getAllNote, deleteNote, updateNote, insertNote} = require('./db.js');

app.get('/api/getNote', (req, res) => {
  getAllNote(function(rows){
    res.send(rows);
  });
});

app.get('/api/update/:id/:note', (req, res) => {
  var {id, note} = req.params;
  updateNote(id, note, kq => {
    if(kq > 0){
      res.send('1');
    }else{
      res.send('0');
    }
  });
});

app.get('/api/delete/:id', (req, res) => {
  deleteNote(req.params.id, kq => {
    var msg = kq > 0? 1: 0;
    res.send(''+msg);
  })
})

app.get('/api/insert/:note', (req, res) => {
  insertNote(req.params.note, row => {
    res.send(row);
  });
});
