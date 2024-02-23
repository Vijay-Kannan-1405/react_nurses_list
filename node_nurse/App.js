const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const ExcelJS = require('exceljs');
const csv = require('fast-csv');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "vijay@2000",
  database: "nursedb"
});

con.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database as id ' + con.threadId);
});

app.get('/nurse', async (req, res) => {
  try {
    const rows = await new Promise((resolve, reject) => {
      con.query('SELECT * FROM nurse', (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
    res.json(rows);
  } catch (err) {
    console.error('Error executing query: ' + err.stack);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/nurse', (req, res) => {
  const bodyParam = req.body;
  console.log(Object.values(bodyParam || {}), bodyParam);
  var sql = "INSERT INTO nurse (name, dob, age, license) VALUES ?";
  var values = [Object.values(bodyParam || {})];
  con.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("records inserted: " + result.affectedRows);
  });
  res.send('Added Successfully');
});

app.patch('/nurse/:id', (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  con.query('UPDATE nurse SET name = ?, dob = ?, age = ?, license = ? WHERE id = ?',
    [updatedData.name, updatedData.dob, updatedData.age, updatedData.license, id],
    (err, result) => {
      if (err) {
        console.error('Error updating record:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.send('Record updated successfully');
    });
});

app.delete('/nurse/:id', (req, res) => {
  const id = req.params.id;
  con.query('DELETE FROM nurse WHERE id = ?', id, (err, result) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      return res.status(500).send('Internal Server Error');
    }
    console.log('Deleted record with ID:', id);
    res.send('Deleted successfully');
  });
});

// Excel Download

app.get('/nurse/xlsx', async (req, res) => {
  con.query('SELECT * FROM nurse', (err, rows) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Internal Server Error');
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet1');
    sheet.addRow(['ID', 'Name', 'DOB', 'Age', 'License']);

    rows.forEach((row) => {
      sheet.addRow([row.id, row.name, row.dob, row.age, row.license]);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="nurse_data.xlsx"');

    workbook.xlsx.write(res)
      .then(() => {
        res.end();
      });
  });
});

// CSV Downlaod

app.get('/nurse/csv', (req, res) => {
  con.query('SELECT * FROM nurse', (err, rows) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Internal Server Error');
    }

    const csvStream = csv.format({ headers: true });
    const writableStream = fs.createWriteStream('nurse_data.csv');

    csvStream.pipe(writableStream).on('finish', () => {
      res.download('nurse_data.csv', 'nurse_data.csv', (err) => {
        if (err) {
          console.error('Error downloading file:', err);
          return res.status(500).send('Internal Server Error');
        }
        fs.unlink('nurse_data.csv', (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          }
        });
      });
    });

    rows.forEach((row) => {
      csvStream.write(row);
    });

    csvStream.end();
  });
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});


// create database

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   con.query("CREATE DATABASE nursedb", function (err, result) {
//     if (err) throw err;
//     console.log("Database created");
//   });
// });

// create table

// con.connect(function (err) {
//   if (err) throw err;
//   var sql = "CREATE TABLE nurse (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), dob DATE, age int, license VARCHAR(255))";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Table created");
//   });
// });

// insert single value

// con.connect(function (err) {
//   if (err) throw err;
//   var sql = "INSERT INTO nurse (name, dob, age, license) VALUES ('John Doe', '1990-01-01', 32, '12345')";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("insterd");
//   });
// });

// insert multiple value

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   var sql = "INSERT INTO nurse (name, dob, age, license) VALUES ?";
//   var values = [
//     ['John', '2000-05-12', '71', '23232'],
//     ['Peter', '1991-05-30', '21', '5435'],
//     ['Amy', '1993-05-5', '56', '5678'],
//     ['Hannah', '1991-05-1', '43', '7686'],
//   ];
//   con.query(sql, [values], function (err, result) {
//     if (err) throw err;
//     console.log("Number of records inserted: " + result.affectedRows);
//   });
// });

// view value

// con.connect(function (err) {
//   if (err) throw err;
//   var sql = "SELECT * FROM nurse";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("data", result);
//   });
// });


// con.end((err) => {
//   if (err) {
//     console.error('Error closing connection: ' + err.stack);
//     return;
//   }
//   console.log('Connection closed.');
// });