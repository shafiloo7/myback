const express = require('express')
const app = express()
const ejs = require('ejs')
const { ObjectId } = require('bson')

app.use(express.static('static'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const MongoClient = require('mongodb').MongoClient
const url = 'mongodb+srv://sha:shapassword@cluster0.6l2ff.mongodb.net/second'
const dbClient = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true })

dbClient.connect((err) => {
    if (err) {
        console.log('error')
    } else {
        console.log('success')

    }
})



app.get('/add', (req, res) => {
    res.render('form')
})

app.post('/add', async(req, res) => {

    const database = dbClient.db('second')
    let data = req.body
    data.id = `${Date.now()}`
    console.log(data)
    await database.collection('collection1').insertOne(data).then(() => {
        console.log('success')
    }).catch((e) => {
        console.log(e)
    })
    res.redirect('/show')
})


app.get('/show', async(req, res) => {
    const database = dbClient.db('second')

    let d = await database.collection('collection1').find()
    let data = []

    await d.forEach((item) => {
        data.push(item)
    })
    console.log(data)


    res.render('show', { data })

})
app.get('/profile/:id', async(req, res) => {

    const database = dbClient.db('second')
    console.log(req.params.id)
    let user = await database.collection('collection1').findOne({ id: req.params.id })
    console.log(user)

    res.render('profile', { user })

})
app.get('/delete/:id', async(req, res) => {
    const database = dbClient.db('second')
    console.log(req.params.id)
    await database.collection('collection1').deleteOne({ id: req.params.id })

    res.redirect('/show')
})

app.get('/edit/:id', async(req, res) => {
    const database = dbClient.db('second')
    let data = await database.collection('collection1').findOne({
        id: req.params.id
    })
    console.log(data)
    res.render('edit', { data })

})
app.post('/edit', async(req, res) => {
    const database = dbClient.db('second')
    let data = req.body
    console.log(data)
    await database.collection('collection1').updateOne({ id: data.id }, { $set: { name: data.name, edu: data.edu, age: data.age } }).then(() => {
        console.log('updata')
    }).catch((e) => {
        console.log(e)
    })
    res.redirect('/show')
})







app.listen(4444)