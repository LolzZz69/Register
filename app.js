const express = require('express');
const path = require('path')
const hbs = require('hbs')
require('./db/connect')
const Collection = require('./models/schema');
const bcrypt = require('bcryptjs')
// const async = require('hbs/lib/async');


const app = express()
let port = process.env.PORT || 5000;


// Paths
const public = path.join(__dirname, 'public')
const views = path.join(__dirname, './templates/views')
const partials = path.join(__dirname, './templates/partials')

hbs.registerPartials(partials)
app.use(express.static(public))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.set('view engine', 'hbs')
app.set('views', views)




app.get('/', (req, res)=>{
    res.render('index')
})
app.get('/register', (req, res)=>{
    res.render('register')
})
app.get('/login', (req, res)=>{
    res.render('login')
})

app.post('/register', async (req, res)=>{
    try{
        if(req.body.pass ===  req.body.cpass){
            const data = new Collection({
                fname: req.body.firstname,
                lname: req.body.lastname,
                email: req.body.email,
                no: req.body.phone,
                password: req.body.pass,
                cpassword: req.body.cpass,
            })
    
            const result = await data.save()
            res.status(201).render('index')
        }else{
            res.status(400).send("Password are not matching")
        }
    }catch(err){
        res.status(400).send(err)
    }
})

app.post('/login', async (req, res)=>{
    try{
        let email = req.body.email
        let password = req.body.pass
        const datas = await Collection.findOne({email: email})
        
        const isMatch = await bcrypt.compare(password, datas.password)

        if(isMatch){
            res.status(201).render('index')
        }else{
            res.status(400).send('password are not matching')
        }
    }catch(err){
        res.status(400).send(err)
    }
})

app.get('/', (req, res)=>{
    res.send("Techinical Error")
})

app.listen(port, ()=>{
    console.log(`Server is running at port: ${port}`);
})