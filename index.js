const express = require('express')
const mongoose = require('mongoose')
const app = express()
const Laporan = require('./models/laporan')
const User = require('./models/user')
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const mongoDB = "mongodb+srv://dbAdmin:demuji@pjpb.d1llr.mongodb.net/pjpb?retryWrites=true&w=majority"
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
.then((res)=>{
    console.log(res)
    app.listen(3000)
})

app.get('/',(req,res)=>{
    res.send("Hello World")
})

app.post('/buat-laporan', async (req,res) => {
    const {
        title, 
        id_laporan, 
        deskripsi, 
        gambar, 
        kontak_person, 
        jml_vote, 
        email_pelapor, 
        status, 
        datetime} = req.body
    const lapor = new Laporan(req.body)
    const result = await lapor.save();
    return res.send(result);
})