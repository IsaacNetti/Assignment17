const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let albums = [{
        _id: 1,
        name: "Maybe Man",
        artist: "AJR", 
        rating:"7",
        genre:"Alternitive Pop",
        releaseDate: "2023-11-10",
        songs: [
            "Maybe Man",
            "Touchy Feely Fool",
            "Yes I'm A Mess",
            "The Dumb Song",
            "Inertia",
            "Turning out Pt. iii",
            "Hole in the Bottom of My Brain",
            "The DJ is Crying for help",
            "I Won't",
            "Steve's Going to London",
            "God is Really Real",
            "2085",
        ],
    },
    {
        _id: 2,
        name: "1989 (Taylor's version)",
        artist: "Taylor Swift", 
        rating:"9",
        genre:"Pop",
        releaseDate: "2023-10-27",
        songs: [
            "Welcome to New York",
            "Blank Space",
            "Style",
            "Out Of The Woods",
            "All You Had To Do Was Stay",
            "Shake It Off",
            "I Wish You Would",
            "Bad Blood",
            "Wildest Dreams",
            "How You Get The Girl",
            "This Love",
            "I Know Places",
            "Clean",
            "Wonderland",
            "You Are In Love",
            "New Romantics",
        ],
    },
    {
        _id: 3,
        name: "Stick Season",
        artist: "Noah Kahan", 
        rating:"8",
        genre:"Indie Folk",
        releaseDate: "2023-06-09",
        songs: [
            "Northern Attitude",
            "Stick Season",
            "All My Love",
            "She Calls Me Back",
            "Come Over",
            "New Perspective",
            "Everywhere, Everything",
            "Orange Juice",
            "Strawberry Wine",
            "Growing Sideways",
            "Halloween",
            "Homesick",
            "Still",
            "The View Between Villages",
        ],
    },
];

app.get("/api/albums", (req, res) => {
    res.send(albums);
});

app.post("/api/albums",upload.single("img"), (req, res) => {
    const result = validatealbum(req.body);

    if (result.error) {
        console.log("here");
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const album = {
        _id: albums.length + 1,
        name: req.body.name,
        artist: req.body.artist,
        rating: req.body.rating,
        genre: req.body.genre,
        releaseDate: req.body.released,
        songs: req.body.songs.split(",")
    }

    albums.push(album);
    res.send(albums);
});
app.put("/api/albums/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);

    const album = albums.find((r) => r._id === id);

    const result = validatealbum(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    album.name = req.body.name;
    album.artist = req.body.artist;
    album.rating = req.body.rating;
    album.genre = req.body.genre;
    album.releaseDate = req.body.released;
    album.songs = req.body.songs.split(",");


    res.send(album);
});

app.delete("/api/albums/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);

    const album = albums.find((r) => r._id === id);

    if (!album) {
        res.status(404).send("The recipe was not found");
        return;
    }

    const index = albums.indexOf(album,);
    albums.splice(index, 1);
    res.send(album);

});


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