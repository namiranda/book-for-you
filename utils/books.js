/**
 * Devuelve un objeto book, que contiene la informacion del libro seleccionado aleatoriamente
 * @param {JSON} data
 */
const getRandomBook = (data) => {
    let max = data["items"].length;
    let random = Math.floor(Math.random() * max);
    book = {
        title: data["items"][random]["volumeInfo"]["title"],
        authors: data["items"][random]["volumeInfo"]["authors"],
        description: data["items"][random]["volumeInfo"]["description"],
        cover_url: formattedCover(
            data["items"][random]["volumeInfo"]["imageLinks"]["thumbnail"]
        ),
        publisher: data["items"][random]["volumeInfo"]["publisher"],
        publishedDate: data["items"][random]["volumeInfo"]["publishedDate"],
        //thumbnail: String,
        infoLink: data["items"][random]["volumeInfo"]["infoLink"]
    };
    console.log(data["items"][random]);
    console.log(book.cover_url);
    return book;
}

/**
 * Devuelve un link a una imagen de portada de mayor tamaño, en caso de estar disponible
 * Ademas cambia http por https
 * @param {String} url
 */
function formattedCover(url) {
    let index = url.indexOf("zoom=1");
    let start = url.slice(url.indexOf("//books"), index);
    let end = url.slice(url.indexOf("&edge"));
    let newUrl = "https:" + start + "zoom=50" + end;

    return newUrl;
}

module.exports = getRandomBook;