var pg = require('pg');

var config = {
  user: 'postgres',
  password: 'khoapham',
  database: 'USER',
  host: 'localhost',
  port: 5432,
  max: 10,
  idleTimeoutMillies: 30000
}

var pool = new pg.Pool(config);

function queryDB(sql, cb){
  pool.connect(function(err, client, done){
    if(err){
      console.log('LOI KET NOI ' + err);
    }else{
      done();
      client.query(sql, cb);
    }
  });
}

//SELECT * FROM "User" WHERE username = 'xyz' AND password = 'abc'

pool.on('error', function(err, client){
  console.log('LOI:: ' + err);
});

function getAllNote(cb){
  queryDB(`SELECT * FROM "Notes" ORDER BY (0 - id)`, function(err, result){
    cb(result.rows);
  });
}

function deleteNote(id, cb){
  queryDB(`DELETE FROM "Notes" WHERE id = ${id}`, (err, result) =>{
    cb(result.rowCount);
  });
}

function updateNote(id, value, cb){
  queryDB(`UPDATE "Notes" SET note='${value}' WHERE id=${id}`, (err, result) => {
    cb(result.rowCount);
  });
}

function insertNote(value, cb){
  queryDB(`WITH row AS(
	           INSERT INTO "Notes"(Note) VALUES ('${value}') RETURNING *
          )
          SELECT * FROM row`,
  (err, result) => {
    cb(result.rows[0]);
  });
}

module.exports = {getAllNote, deleteNote, updateNote, insertNote};
