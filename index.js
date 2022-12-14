const express = require('express');
const app = express();
const mysql = require('mysql')
const port = 3001;
const cors = require('cors');
app.use(express.json())
app.use(cors());
const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'pokemonfullstack'
})

app.get('/getpokemon', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * from pokemon', (err, rows) => {
            connection.close() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
    });
app.get('/getpokemon/:name', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query(`SELECT * from pokemon WHERE name = "${req.params.name}"`, (err, rows) => {
            connection.close() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
    });
app.delete('/deletepokemon/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query(`DELETE FROM pokemon WHERE id = ${req.params.id}`, (err, rows) => {
            connection.close() // return the connection to pool
            if (!err) {
                res.sendStatus(200)
            } else {
                res.sendStatus(400)
            }
        })
    })
    });

app.put('/updatepokemon/:id', (req, res) => {
    if(req.body.name=="" || req.body.type=="" || req.body.level==""){
        res.sendStatus(400)
        return
    }
    if(req.body.image == ""){
        req.body.image = "https://2.bp.blogspot.com/-YNAeUatyqSI/URzkmAVaW2I/AAAAAAAACx8/WjpXTdiWVvw/s320/Vector_Poke_Ball_by_fistsh.png.jpg"
    }
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query(`UPDATE pokemon SET name = "${req.body.name}", type = "${req.body.type}", level = "${req.body.level}", image = "${req.body.image}" WHERE id = ${req.params.id}`, (err, rows) => {
            connection.close() // return the connection to pool
            if (!err) {
                res.sendStatus(200)
            } else {
                res.sendStatus(500)
            }
        })
    })
    });
    
app.post('/addpokemon', (req, res) => {
    if(req.body.name=="" || req.body.type=="" || req.body.level==""){
        res.sendStatus(400)
        return
    }
        if(req.body.image == ""){
            req.body.image = "https://2.bp.blogspot.com/-YNAeUatyqSI/URzkmAVaW2I/AAAAAAAACx8/WjpXTdiWVvw/s320/Vector_Poke_Ball_by_fistsh.png.jpg"
        }
    pool.getConnection((err, connection) => {

        if(err) throw err
        console.log(req.body)
        connection.query(`INSERT INTO pokemon (name, type, level, image) VALUES ("${req.body.name}", "${req.body.type}", "${req.body.level}", "${req.body.image}")`, (err, rows) => {
            connection.close() // return the connection to pool
            if (!err) {
                res.sendStatus(200)
            } else {
                res.sendStatus(500)
            }
        })
    })
});

/*
app.use(function(req, res) {
    res.status(404);
    res.send('404: Page introuvable');
    });
    */
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    });

