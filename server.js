const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const upload = multer({ dest: __dirname + "/public/images" });

mongoose
  .connect(
    "mongodb+srv://isaacnetti:2U7OGFw2qTU36CEd@cluster.kjhijtg.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) => console.error("could not connect ot mongodb...", err));

const albumSchema = new mongoose.Schema({
    name: String,
    artist: String,
    rating: String,
    genre: String,
    releaseDate:String,
    songs: [String],
    img: String
  });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const Album = mongoose.model("Album",albumSchema);

app.get("/api/albums", (req, res) => {
    getAlbums(res);
});

const getAlbums = async (res) =>{
    const albums = await Album.find();
    res.send(albums);
}

app.post("/api/albums",upload.single("img"), (req, res) => {
    const result = validatealbum(req.body);

    if (result.error) {
        console.log("here");
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const album = new Album ({
        name: req.body.name,
        artist: req.body.artist,
        rating: req.body.rating,
        genre: req.body.genre,
        releaseDate: req.body.released,
        songs: req.body.songs.split(",")
    });

    if (req.file) {
        album.img = "images/" + req.file.filename;
      }

    createAlbum(album, res);
});

const createAlbum = async (album,res) =>{
    const result = await album.save();
    res.send(album);
}

app.put("/api/albums/:id", upload.single("img"), (req, res) => {
   
    const result = validatealbum(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    updateAlbum(req,res);
});

const updateAlbum = async (req,res) =>{
    let update = {
        name: req.body.name,
        artist: req.body.artist,
        rating: req.body.rating,
        genre: req.body.genre,
        releaseDate: req.body.released,
        songs: req.body.songs.split(",")
    }
    if(req.file){
        update.img = "images/" + req.file.filename;
    }

    const result = await Album.updateOne({ _id: req.params.id },update);
    const album = await Album.findById(req.params.id);
    res.send(album);
}

app.delete("/api/albums/:id", upload.single("img"), (req, res) => {
    removeAlbum(res,req.params.id);
});
const removeAlbum = async (res, id) => {
    const album = await Album.findByIdAndDelete(id);
    res.send(album);
  };

const validatealbum = (album) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.string().min(3).required(),
        artist: Joi.string().min(3).required(),
        rating: Joi.string().required(),
        genre: Joi.string().min(3).required(),
        released: Joi.string().min(3).required(),
        songs: Joi.allow("")
    });

    return schema.validate(album);
};

app.listen(3000, () => {
    console.log("I'm listening");
});