require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const app = express()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
const Laporan = require('./models/laporan')
const mongoDB = process.env.MONGO_URI ?? ""
const {CheckAuth} = require('./CheckAuth');
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
.then((res)=>{
    console.log(res)
    app.listen(process.env.PORT)
})

app.get('/',(req,res)=>{
    return res.json({test:"Hello"})
})

//create laporan
app.post('/buat-laporan', CheckAuth, async (req,res) => {
    const {
        title, 
        id_laporan, 
        deskripsi, 
        gambar, 
        kontak_person, 
        jml_vote, 
        email_pelapor, 
        status, 
        datetime,
        } = req.body
    
    const lapor = new Laporan({
        title, 
        id_laporan, 
        deskripsi, 
        gambar, 
        kontak_person, 
        jml_vote, 
        email_pelapor, 
        status, 
        datetime,
    }
    )

    const result = await lapor.save();
    return res.send(result);
})

//read by laporan id
app.get('/laporan/:id_laporan', async (req,res)=>{
    const{id_laporan} = req.params;
    const laporan = await Laporan.findById(id_laporan);
    return res.send(laporan)
})

//read laporan
app.get('/laporan', async (req,res)=>{
    const laporans = await Laporan.find();
    return res.send(laporans);
})

//delete laporan
app.delete('/laporan-delete', CheckAuth, async (req,res)=>{
    const {id} = req.body;
    const laporanDelete = await Laporan.findByIdAndDelete(id);
    return res.send(laporanDelete);
})

//update laporan
app.patch('/laporan-update', CheckAuth, (req,res)=>{
    const {id,id_laporan} = req.body;
})