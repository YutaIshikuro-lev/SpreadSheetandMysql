import * as mysql from 'mysql2';
import * as dotenv from "dotenv";

// dotenv.config({path: "../../../.env"});
dotenv.config({path: "/app/.env"});

const dbHost = '10.18.0.25'
// const dbHost = 'localhost'
const dbUser = process.env.MYSQL_USER
const dbUserpassWord = process.env.MYSQL_PASSWORD

export function dbselect(dataBase:string){
  console.log('select sql')
  var connection = mysql.createConnection({
    host     : dbHost,
    user     : dbUser,
    password : dbUserpassWord,
    database : dataBase,
    port     : 3306
  });

  console.log('接続完了');
  connection.connect((err) => {
    if (err) throw err;
    connection.query('SELECT * FROM test;', function(err, rows) {
      if (err) throw err;
      console.log('The solution is: ', rows);
    });
    connection.end();
  });
}

export function dbinsert(insertsqlcmd:string, dataBase:string){
  var connection = mysql.createConnection({
    host     : dbHost,
    user     : dbUser,
    password : dbUserpassWord,
    database : dataBase,
    port     : 3306
  });
  connection.beginTransaction((err) => {
    if (err) {
      return connection.rollback(() => {
        throw err;
      });
    }
    connection.commit((err) => {
      if (err) {
        return connection.rollback(() => {
          throw err;
        });
      }
    });
  
    console.log('insert sql by insert.ts');
    
    connection.query(insertsqlcmd, function(err, rows) {
      if(err){
        if(err.code.match('ER_LOCK_DEADLOCK')){
          throw 'insert するデータが多いです。1ヶ月ごとにデータをinsertしてください。';
        }else{
          throw err;
        }
      }
      // if (err) throw err;
    });  
    connection.end();
  });  
}