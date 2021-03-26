const mongoose = require("mongoose")
const schema = mongoose.Schema

const laporanSchema = new schema({
    title : String,
    id_laporan : String,
    deskripsi : String,
    gambar : String,
    kontak_person : String,
    jml_vote : Number,
    email_pelapor : String,
    status : Boolean,
    datetime : String,
})

const laporan = mongoose.model("laporan", laporanSchema, "laporan")
module.exports = laporan