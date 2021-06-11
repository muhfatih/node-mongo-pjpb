const express = require('express')
const mongoose = require('mongoose')
const app = express()
const Laporan = require('./models/laporan')
const {OAuth2Client} = require('google-auth-library');
const clientAndroid = new OAuth2Client(process.env.CLIENT_ID_ANDROID);
const clientIOS = new OAuth2Client(process.env.CLIENT_ID_IOS);
require('dotenv').config();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const mongoDB = process.env.MONGO_URI
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
.then((res)=>{
    console.log(res)
    app.listen(process.env.PORT)
})

async function verify(token,platform) {
    const client = platform === "ANDROID"?clientAndroid : clientIOS
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: [CLIENT_ID_ANDROID,CLIENT_ID_IOS],  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    }).catch(err => {
        console.log("INVALID TOKEN");
    });
    if(!ticket) return false;
    const payload = ticket.getPayload();
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    return payload
  }

// app.get('/token', async (req,res)=>{
//     const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjZhOGJhNTY1MmE3MDQ0MTIxZDRmZWRhYzhmMTRkMTRjNTRlNDg5NWIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4NjQ4ODg5MDk4ODItNTJkZzU4MWozbWFjMGw1b2lndXRtZnNjbmRwZGM5NWEuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4NjQ4ODg5MDk4ODItNTJkZzU4MWozbWFjMGw1b2lndXRtZnNjbmRwZGM5NWEuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDAwMTU1Nzc0NTE0OTIwNzM5OTYiLCJlbWFpbCI6InJiaW50YW5nLmJhZ3VzMTFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJwWmhUcTFPaHB5ZWlXbk5aSUxjZUNRIiwibm9uY2UiOiJlWFJhYUdLbXFrNWhTT2w0cVFFNnZKR01SZTF6TWJ4aDBaRy1jNFdvdjJBIiwibmFtZSI6ImVyIGJpbnQiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDUuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1aNmllUnlOdWJJby9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BTVp1dWNuSmZjNGZPcHFmUWhRVS12cFoxMDJzeU9WNXJRL3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJlciIsImZhbWlseV9uYW1lIjoiYmludCIsImxvY2FsZSI6ImlkIiwiaWF0IjoxNjE2NzczMDc1LCJleHAiOjE2MTY3NzY2NzV9.iVo9vliAu2dBuPtQLvitAjCWUC2RLAM8cTkP7ilymDj7hkUC4WMh9b-GEJvQcTni8BuM4FM4YqlDywGvrFl3MMzI8-1QZHY_8NHrX1MwVB0pArx_9VzIeNU-dXFt6i77VnupyrG5AinXOh32yOrjl8dlV9x4HHfYaWsTSHBbTTQU7PHNa5aNxrMcabCUO3uQssRXUrNjEAsSDRoLNrPNKLRuUn804smVGdOkSUwg5bjKhSfxqwCGa1ZEnPTJgWk-pocHSlr0oWeaL5ZVecIy4cF_bEg9GcV0WAaPNDP5J-EW6bSQUDhTJU3gi84BcUgRS1Ka7uUbfAyaE13RCTjTWg";
//     const payload = await verify(token,"IOS");
//     console.log(payload);
//     if(!payload) return res.status(403).send("impostor");
//     return res.send(payload);
// })

app.get('/',(req,res)=>{
    res.send("API LAPOR")
})

//create laporan
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
        datetime,
        token,
        } = req.body
    const payload = await verify(token,"IOS");
    console.log(payload);
    if(!payload) return res.status(403).send("INVALID TOKEN");
    console.log(payload)
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
app.delete('/laporan-delete', async (req,res)=>{
    const {id} = req.body;
    const laporanDelete = await Laporan.findByIdAndDelete(id);
    return res.send(laporanDelete);
})

//update laporan
app.patch('/laporan-update', (req,res)=>{
    const {id,id_laporan} = req.body;
})