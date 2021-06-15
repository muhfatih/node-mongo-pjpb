require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Laporan = require("./models/laporan");
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
const { CheckAuth } = require("./CheckAuth");
const mongoDB = process.env.MONGO_URI || "";
mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    console.log(res);
    app.listen(process.env.PORT);
  });

// app.get('/token', async (req,res)=>{
//     const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjZhOGJhNTY1MmE3MDQ0MTIxZDRmZWRhYzhmMTRkMTRjNTRlNDg5NWIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4NjQ4ODg5MDk4ODItNTJkZzU4MWozbWFjMGw1b2lndXRtZnNjbmRwZGM5NWEuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4NjQ4ODg5MDk4ODItNTJkZzU4MWozbWFjMGw1b2lndXRtZnNjbmRwZGM5NWEuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDAwMTU1Nzc0NTE0OTIwNzM5OTYiLCJlbWFpbCI6InJiaW50YW5nLmJhZ3VzMTFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJwWmhUcTFPaHB5ZWlXbk5aSUxjZUNRIiwibm9uY2UiOiJlWFJhYUdLbXFrNWhTT2w0cVFFNnZKR01SZTF6TWJ4aDBaRy1jNFdvdjJBIiwibmFtZSI6ImVyIGJpbnQiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDUuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1aNmllUnlOdWJJby9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BTVp1dWNuSmZjNGZPcHFmUWhRVS12cFoxMDJzeU9WNXJRL3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJlciIsImZhbWlseV9uYW1lIjoiYmludCIsImxvY2FsZSI6ImlkIiwiaWF0IjoxNjE2NzczMDc1LCJleHAiOjE2MTY3NzY2NzV9.iVo9vliAu2dBuPtQLvitAjCWUC2RLAM8cTkP7ilymDj7hkUC4WMh9b-GEJvQcTni8BuM4FM4YqlDywGvrFl3MMzI8-1QZHY_8NHrX1MwVB0pArx_9VzIeNU-dXFt6i77VnupyrG5AinXOh32yOrjl8dlV9x4HHfYaWsTSHBbTTQU7PHNa5aNxrMcabCUO3uQssRXUrNjEAsSDRoLNrPNKLRuUn804smVGdOkSUwg5bjKhSfxqwCGa1ZEnPTJgWk-pocHSlr0oWeaL5ZVecIy4cF_bEg9GcV0WAaPNDP5J-EW6bSQUDhTJU3gi84BcUgRS1Ka7uUbfAyaE13RCTjTWg";
//     const payload = await verify(token,"IOS");
//     console.log(payload);
//     if(!payload) return res.status(403).send("impostor");
//     return res.send(payload);
// })

app.get("/", (req, res) => {
  return res.json({ test: "Hello" });
});

//create laporan
app.post("/buat-laporan", CheckAuth, async (req, res) => {
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
  } = req.body;

  const payload = req.payload;
  console.log(payload);
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
  });

  const result = await lapor.save();
  return res.send(result);
});

//read by laporan id
app.get("/laporan/:id_laporan", async (req, res) => {
  const { id_laporan } = req.params;
  const laporan = await Laporan.findById(id_laporan);
  return res.send(laporan);
});

//read laporan
app.get("/laporan", async (req, res) => {
  const laporans = await Laporan.find();
  return res.send(laporans);
});

//delete laporan
app.delete("/laporan-delete", CheckAuth, async (req, res) => {
  const { id_laporan } = req.body;
  const laporanDelete = await Laporan.findByIdAndDelete(id_laporan);
  return res.send(laporanDelete);
});

//update laporan
app.patch("/laporan-update", async (req, res) => {
  const { id_laporan, data } = req.body;
  /**
   * bentuk datanya kek gitu
   *
   * data = {
   *  deskripsi : "deskripsi baru"
   * }
   *
   */

  const filter = { id_laporan: id_laporan };
  const result = await Laporan.updateOne(filter, data);
  if (result.n < 1) {
    //jumlah dokumen yang cocok
    return res.sendStatus(404);
  }
  return res.send(result);
});
