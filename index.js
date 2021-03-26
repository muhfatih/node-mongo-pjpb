const express = require('express')
const mongoose = require('mongoose')
const app = express()
const Laporan = require('./models/laporan')
const {OAuth2Client} = require('google-auth-library');
const clientAndroid = new OAuth2Client("864888909882-l3iqtf3947l9nb2s3bgh12gkkat2citv.apps.googleusercontent.com");
const clientIOS = new OAuth2Client("864888909882-52dg581j3mac0l5oigutmfscndpdc95a.apps.googleusercontent.com");
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const mongoDB = "mongodb+srv://dbAdmin:demuji@pjpb.d1llr.mongodb.net/lapor?retryWrites=true&w=majority"
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
.then((res)=>{
    console.log(res)
    app.listen(3000)
})

async function verify(token,platform) {
    const client = platform === "Android"?clientAndroid : clientIOS
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: ["864888909882-l3iqtf3947l9nb2s3bgh12gkkat2citv.apps.googleusercontent.com","864888909882-52dg581j3mac0l5oigutmfscndpdc95a.apps.googleusercontent.com"],  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    return payload
  }

app.get('/token', async (req,res)=>{
    const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjZhOGJhNTY1MmE3MDQ0MTIxZDRmZWRhYzhmMTRkMTRjNTRlNDg5NWIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4NjQ4ODg5MDk4ODItNTJkZzU4MWozbWFjMGw1b2lndXRtZnNjbmRwZGM5NWEuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4NjQ4ODg5MDk4ODItNTJkZzU4MWozbWFjMGw1b2lndXRtZnNjbmRwZGM5NWEuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDAwMTU1Nzc0NTE0OTIwNzM5OTYiLCJlbWFpbCI6InJiaW50YW5nLmJhZ3VzMTFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJwWmhUcTFPaHB5ZWlXbk5aSUxjZUNRIiwibm9uY2UiOiJlWFJhYUdLbXFrNWhTT2w0cVFFNnZKR01SZTF6TWJ4aDBaRy1jNFdvdjJBIiwibmFtZSI6ImVyIGJpbnQiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDUuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1aNmllUnlOdWJJby9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BTVp1dWNuSmZjNGZPcHFmUWhRVS12cFoxMDJzeU9WNXJRL3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJlciIsImZhbWlseV9uYW1lIjoiYmludCIsImxvY2FsZSI6ImlkIiwiaWF0IjoxNjE2NzczMDc1LCJleHAiOjE2MTY3NzY2NzV9.iVo9vliAu2dBuPtQLvitAjCWUC2RLAM8cTkP7ilymDj7hkUC4WMh9b-GEJvQcTni8BuM4FM4YqlDywGvrFl3MMzI8-1QZHY_8NHrX1MwVB0pArx_9VzIeNU-dXFt6i77VnupyrG5AinXOh32yOrjl8dlV9x4HHfYaWsTSHBbTTQU7PHNa5aNxrMcabCUO3uQssRXUrNjEAsSDRoLNrPNKLRuUn804smVGdOkSUwg5bjKhSfxqwCGa1ZEnPTJgWk-pocHSlr0oWeaL5ZVecIy4cF_bEg9GcV0WAaPNDP5J-EW6bSQUDhTJU3gi84BcUgRS1Ka7uUbfAyaE13RCTjTWg";
    const payload = await verify(token,"IOS")
    console.log(payload);
    return res.send(payload)
})

app.get('/',(req,res)=>{
    res.send("Hello World")
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
        datetime} = req.body
    const lapor = new Laporan(req.body)
    const result = await lapor.save();
    return res.send(result);
})