if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

const Document = require("./models/Document")
// const mongoose = require('mongoose')
// const CONNECTION_URI = process.env.MONGODB_URI || 'mongodb://localhost/nik_bin';

// DATABASE_URL=mongodb://localhost/thakurbin
const DATABASE_URL = 'mongodb + srv://thakur:mdL19FbKU3kTt9Xo@cluster0.3nmem.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const mongoose = require('mongoose')
mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected To Mongoose'))

// process.env.DATABASE_URL
// mongoose.connect(CONNECTION_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => {
//         console.log('Connected To MongoDb');
//     })
//     .catch(err => console.log(err));


app.get('/', (req, res) => {
    // https://nik-bin.herokuapp.com/ | https://git.heroku.com/nik-bin.git
    const code = `Welcome TO Nik_Bin!!
    
Use the commands in the top right corner to create a new file to share with others.`
    res.render("code-display", { code, language: 'plaintext' })
})
app.get('/new', (req, res) => {
    res.render("new")
})

app.post('/save', async (req, res) => {
    const value = req.body.value
    try {
        const document = await Document.create({ value })
        res.redirect(`/${document.id}`)
    } catch (e) {
        res.render("new", { value })
    }
})

app.get('/:id/duplicate', async (req, res) => {
    const id = req.params.id
    try {
        const document = await Document.findById(id)
        res.render('new', { value: document.value })
    } catch (e) {
        res.redirect(`/${id}`)
    }
})

app.get('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const document = await Document.findById(id)

        res.render('code-display', { code: document.value, id })
    } catch (e) {
        res.redirect("/")
    }
})
// app.listen(3000)
app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
})