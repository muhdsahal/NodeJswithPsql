const express= require("express")
// const { pool } = require("./dssb")
// db====================
const {Pool} = require('pg')
const bodyParser = require('body-parser')

// Create a new Pool instance with your PostgreSQL connection details
 const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'node_psql',
    password: '1234',
    port: 5432,// PostgreSQL default port is 5432
});
// -------------------------


const app = express()


app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get("/", (request,response) => {
    pool.query("SELECT * FROM users",(error,results)=>{
        if (error){
            throw error
        }
        response.status(200).json(results.rows)

    })
})



app.get("/users/:id",( request,response) => {
    const id = parseInt(request.params.id)

    pool.query("select * from users where id = $1",[id],(error,results) =>{
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
})

app.post("/users", (request,response) => {
    const {name,email} = request.body

    pool.query("INSERT INTO users (name,email) VALUES($1,$2)"
    ,[name,email],(error) => {
        if (error){
            throw error
        }
        response.status(201).send(`User added with ID: completed`)
    })
})

app.put("/users/:id", (request,response) => {
    const id = parseInt(request.params.id)
    const {name,email} = request.body


    pool.query("UPDATE users SET name = $1 , email = $2  WHERE id = $3",
    [name,email,id],
    (error,results) => {
        if  (error){
            throw error
        }
        response.status(200).send(`User modified with ID: ${id}`)
    }
  )
})


app.delete("/users/:id", (request,response) => {
    const id = parseInt(request.params.id)

    pool.query("DELETE from users  WHERE id = $1",
    [id],
    (error) => {
        if  (error){
            throw error
        }
        response.status(200).send(`deleted user with ID: ${id}`)
    }
  )
})

app.listen(3000,()=>{
    console.log("server")
})