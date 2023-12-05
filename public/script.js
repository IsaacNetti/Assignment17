const getAlbums = async() => {
    try {
        return (await fetch("api/albums/")).json();
    } catch (error) {
        console.log(error);
    }
};

const showAlbums = async() => {
    let albums = await getAlbums();
    let albumsDiv = document.getElementById("album-list");
    albumsDiv.innerHTML = "";
    albums.forEach((album) => {
        const section = document.createElement("section");
        section.classList.add("album");
        albumsDiv.append(section);

        const dLink = document.createElement("a");
        dLink.innerHTML = "	&#x2715;";
        section.append(dLink);
        dLink.id = "delete-link";

        const eLink = document.createElement("a");
        eLink.innerHTML = "&#9998;";
        section.append(eLink);
        eLink.id = "edit-link";

        const h3 = document.createElement("h3");
        h3.innerHTML = album.name;
        section.append(h3);

        const p1 = document.createElement("p");
        section.append(p1);
        p1.innerHTML = "Artist: "+album.artist;

        const p2 = document.createElement("p");
        section.append(p2);
        p2.innerHTML = "Rating: "+album.rating+"/10";

        const p3 = document.createElement("p");
        section.append(p3);
        p3.innerHTML = "Genre: "+album.genre;
        
        const p4 = document.createElement("p");
        section.append(p4);
        p4.innerHTML = "Released: "+album.releaseDate;


        const ul = document.createElement("ul");
        section.append(ul);
        console.log(album.songs);
        album.songs.forEach((song) => {
            const li = document.createElement("li");
            ul.append(li);
            li.innerHTML = song;
        });

        eLink.onclick = (e) => {
            e.preventDefault();
            document.querySelector(".dialog").classList.remove("transparent");
            document.getElementById("add-title").innerHTML = "Edit Album";
            populateEditForm(album);
        };
        let ff = 0;
        const yesLink = document.createElement("a");
        dLink.onclick = (e) => {
            e.preventDefault();
            if(ff == 1){     
                    yesLink.remove();
                    ff = 0;
            }
            else{
                ff = 1;
                yesLink.innerHTML = "&#x2713;";
                dLink.append(yesLink);
                yesLink.onclick = () => {
                    deleteAlbum(album);
                }
            }
        };

    });
};

const deleteAlbum = async(album) => {
    let response = await fetch(`/api/albums/${album._id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    });

    if (response.status != 200) {
        console.log("error deleting");
        return;
    }

    let result = await response.json();
    showAlbums();
    resetForm();
}

const populateEditForm = (album) => {
    const form = document.getElementById("add-album-form");
    form._id.value = album._id;
    form.name.value = album.name;
    form.artist.value = album.artist;
    form.rating.value = album.rating;
    form.genre.value = album.genre;
    form.released.value = album.releaseDate;
    populateSongs(album)
};

const populateSongs = (album) => {
    const section = document.getElementById("song-boxes");
    section.innerHTML = "";

    album.songs.forEach((song) => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = song;
        section.append(input);
    });
}

const addAlbum = async(e) => {
    e.preventDefault();
    const form = document.getElementById("add-album-form");
    const formData = new FormData(form);
    let response;
    formData.append("songs", getSongs());
    //trying to add a new album
    if (form._id.value == -1) {
        formData.delete("_id");
        
        
        console.log(...formData);

        response = await fetch("/api/albums", {
            method: "POST",
            body: formData
        });
    }
    else{
        console.log(...formData);
        response = await fetch(`/api/albums/${form._id.value}`, {
            method: "PUT",
            body: formData
        });
    }
    

    //successfully got data from server
    if (response.status != 200) {
        console.log("Error posting data");
        alert("Adding failed");
    }

    response = await response.json();
    resetForm();
    document.querySelector(".dialog").classList.add("transparent");
    showAlbums();
    location.reload();
    alert("Successfully added");
};

const getSongs = () => {
    const inputs = document.querySelectorAll("#song-boxes input");
    let songs = [];

    inputs.forEach((input) => {
        songs.push(input.value);
    });

    return songs;
}

const resetForm = () => {
    const form = document.getElementById("add-album-form");
    form.reset();
    document.getElementById("song-boxes").innerHTML = "";
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-title").innerHTML = "Add album";
    resetForm();
};

const addSong = (e) => {
    e.preventDefault();
    const section = document.getElementById("song-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
}

window.onload = () => {
    showAlbums();
    document.getElementById("add-album-form").onsubmit = addAlbum;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparent");
    };

    document.getElementById("add-song").onclick = addSong;
};