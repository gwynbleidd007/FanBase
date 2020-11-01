// SETTING UP THE GLOBAL VARIABLES
let search = '';
let imdbID = '';
let notFound = false;
const crossProxy = 'https://cors-anywhere.herokuapp.com/';
const loader = `<div class="loader"></div>`

// CREATING OBJECT TO STORE DOM OBJECTS
const docObjects = {
    titleImage: document.getElementById("titleImage"),
    metaData: document.getElementById("metaData"),
    informationBody: document.getElementById("informationBody"),
    plotBody: document.getElementById('plotBody'),
    trailerBody: document.getElementById("trailerBody"),
    synopsisBody: document.getElementById('synopsisBody'),
    crewBody: document.getElementById("crewBody"),
    castBody: document.getElementById('castBody'),
    imagesBody: document.getElementById("imagesBody"),
    newsBody: document.getElementById('newsBody'),
    similarBody: document.getElementById('similarBody'),
};

// OBJECT TO STORE API CALLS
let apiCalls = {
    synopsis: false,
    crew: false,
    cast: false,
    images: false,
    news: false,
    similar: false,
}

// RESET THE SITE
clearSite = () => {
    search = '';
    imdbID = '';
    document.getElementById('content').style.display = 'none';
    notFound = false;
    for (let i in docObjects) {
        docObjects[i].innerHTML = '';
    }
    for (let i in apiCalls) {
        apiCalls[i] = false;
        docObjects[i + "Body"].style.height = "0px";
    }
}

// LOADER
addLoader = (dObj) => {
    dObj.innerHTML = loader;
}
removeLoader = (dObj) => {
    dObj.innerHTML = "";
}

// TOGGLE SHOW/HIDE
updateHeight = (dom) => {
    dom.style.height = 'auto';
    let height = dom.offsetHeight + 'px';
    // dom.style.height = '0px';
    setTimeout(function () {
        dom.style.height = height;
    }, 11);
}
showHide = (dom) => {
    if (dom.offsetHeight === 0) {
        dom.style.height = 'auto';
        let height = dom.offsetHeight + 'px';
        dom.style.height = '0px';
        setTimeout(function () {
            dom.style.height = height;
        }, 11);
    }
    else {
        dom.style.height = '0px';
    }
}

loadSynopsis = async () => {
    if (imdbID === '' || imdbID === undefined)
        return;
    if (apiCalls.synopsis === false) {
        try {
            addLoader(docObjects.synopsisBody);
            showHide(docObjects.synopsisBody);
            let synopsis = await fetch(`https://imdb8.p.rapidapi.com/title/get-synopses?tconst=${imdbID}`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "imdb8.p.rapidapi.com",
                    "x-rapidapi-key": apiKeys.x_rapidapi_key
                }
            }).then(res => res.json());
            removeLoader(docObjects.synopsisBody);
            apiCalls.synopsis = true;
            synopsis = synopsis[0].text;
            docObjects.synopsisBody.innerHTML = `<p>${synopsis}</p>`;
            updateHeight(docObjects.synopsisBody);
        } catch { err => { console.log(err) } }
    }
    else {
        showHide(docObjects.synopsisBody);
    }
}

loadCrew = async () => {
    if (imdbID === '' || imdbID === undefined)
        return;
    if (apiCalls.crew === false) {
        try {
            addLoader(docObjects.crewBody);
            showHide(docObjects.crewBody);
            let crew = await fetch(`https://imdb8.p.rapidapi.com/title/get-top-crew?tconst=${imdbID}`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "imdb8.p.rapidapi.com",
                    "x-rapidapi-key": apiKeys.x_rapidapi_key
                }
            }).then(res => res.json());
            apiCalls.crew = true;
            removeLoader(docObjects.crewBody);
            let str = "";
            for (let i in crew) {
                let strLst = [];
                crew[i].forEach(element => {
                    strLst.push(`<a href="https://www.imdb.com${element.id}">${element.name}</a>`);
                });
                strLst = strLst.join(', ');
                str = str.concat(`<div><h3>${i[0].toUpperCase() + i.slice(1)}</h3><p>${strLst}</p></div>`);
            }
            docObjects.crewBody.innerHTML = str;
            updateHeight(docObjects.crewBody);
        } catch { err => { console.log(err) } }
    }
    else {
        showHide(docObjects.crewBody);
    }
}

loadCast = async () => {
    if (imdbID === '' || imdbID === undefined)
        return;
    if (apiCalls.cast === false) {
        try {
            addLoader(docObjects.castBody);
            showHide(docObjects.castBody);
            let IMD = await fetch(`https://imdb-internet-movie-database-unofficial.p.rapidapi.com/film/${imdbID}`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "imdb-internet-movie-database-unofficial.p.rapidapi.com",
                    "x-rapidapi-key": apiKeys.x_rapidapi_key
                }
            }).then(res => res.json());
            apiCalls.cast = true;
            removeLoader(docObjects.castBody);
            let actorTableString = `<table><tr><th>Actor</th><th>Role</th></tr>`;
            IMD.cast.forEach(element => {
                actorTableString = actorTableString.concat(`<tr><td><a href="https://www.imdb.com/name/${element.actor_id}/">${element.actor}</a></td><td>${element.character}</td></tr>`);
            });
            actorTableString += '</table>'
            docObjects.castBody.innerHTML = actorTableString;
            updateHeight(docObjects.castBody);
        } catch { err => { console.log(err) } }
    }
    else {
        showHide(docObjects.castBody);
    }
}

loadImages = async () => {
    if (imdbID === '' || imdbID === undefined)
        return;
    if (apiCalls.images === false) {
        try {
            addLoader(docObjects.imagesBody);
            showHide(docObjects.imagesBody);
            let images = await fetch(`${crossProxy}https://api.hillbillysoftware.com/Images/ByID/${apiKeys.hillbilly}/${imdbID}`).then(res => res.json());
            apiCalls.images = true;
            removeLoader(docObjects.imagesBody);
            let str = "";
            for (let i in images) {
                if (Array.isArray(images[i]) === true) {
                    images[i].forEach(element => {
                        str = str.concat(`<img src="${element}" alt=""/>`);
                    });
                }
            }
            docObjects.imagesBody.innerHTML = str;
            docObjects.imagesBody.style.height = 'auto';
        } catch { err => { console.log(err) } }
    }
    else {
        docObjects.imagesBody.style.height = docObjects.imagesBody.style.height === '0px' ? 'auto' : '0px';
    }
}

loadNews = async () => {
    if (imdbID === '' || imdbID === undefined)
        return;
    if (apiCalls.news === false) {
        try {
            addLoader(docObjects.newsBody);
            showHide(docObjects.newsBody);
            let news = await fetch(`https://imdb8.p.rapidapi.com/title/get-news?limit=10&tconst=${imdbID}`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "imdb8.p.rapidapi.com",
                    "x-rapidapi-key": apiKeys.x_rapidapi_key
                }
            }).then((res) => { return res.json() });
            apiCalls.news = true;
            removeLoader(docObjects.newsBody);
            let str = "";
            news.items.forEach(req => {
                str = str.concat(`<div><h3><a href="${req.link}">${req.head}</a></h3><p>${req.body + "..."}</p></div>`);
            });
            docObjects.newsBody.innerHTML = str;
            updateHeight(docObjects.newsBody);
        } catch { err => { console.log(err) } }
    }
    else {
        showHide(docObjects.newsBody);
    }
}

loadSimilar = () => {
    showHide(docObjects.similarBody);
}

onSearch = async () => {
    // PERFORMINGN THE BASICS
    clearSite();
    // GETTING THE SEARCH TERM
    search = encodeURI(document.getElementById("search").value);
    // SETTING THE LOADER
    document.getElementById('contentBox').insertAdjacentHTML('afterbegin', loader);

    let url, tastedrive, tasteInfo, omdb;
    let metaDataStr = "";

    // WORKING WITH OMDB
    try {
        url = apiKeys.omdb + search;
        omdb = await fetch(url).then(res => res.json());
        imdbID = omdb.imdbID;
        if (omdb.Title) {
            search = encodeURI(omdb.Title);
            // SETTING THE POSTER
            docObjects.titleImage.innerHTML = `<img id="imgPoster" src=${omdb.Poster}/>`
            // SETTING THE METADATA
            let metaData = ["Title", "Year", "Rated", "Released", "Runtime", "Genre", "totalSeasons", "Language", "Country", "imdbRating", "Type"];
            metaDataStr = "<hr/>";
            metaData.forEach(element => {
                metaDataStr = metaDataStr.concat(`<h4 style="display: inline;">${element} : </h4><p style="display: inline;">${omdb[element]}</p><br/>`);
            });
            metaDataStr = metaDataStr.concat(`<hr/>`);
            // SETTING THE PLOT
            docObjects.plotBody.innerHTML = `<p>${omdb.Plot}</p>`;
        }
    } catch { err => { console.log(err) } };

    // WORKING WITH TASTEDRIVE
    try {
        url = apiKeys.tastedrive + search;
        tastedrive = await fetch(`${crossProxy}${url}`).then(res => res.json());
        tasteInfo = tastedrive.Similar.Info[0];
        // search = encodeURI(tasteInfo.Name);
        if (tasteInfo.wUrl) {
            // SETTING INFORMATION AND TRAILER
            docObjects.informationBody.innerHTML = `<p>${tasteInfo.wTeaser}</p>`;
            docObjects.trailerBody.innerHTML = ` <iframe src="${tasteInfo.yUrl}" frameborder="0" allowfullscreen id="trailerVideo"></iframe> `;
            // SETTING THE SIMILARS
            tastedrive.Similar.Results.forEach(req => {
                docObjects.similarBody.insertAdjacentHTML('beforeend', `<div><h3><a href="${req.wUrl}">${req.Name}</a></h3><p>${req.wTeaser}</p></div>`);
            });
        }
    } catch { err => { console.log(err) } };

    // SETTING THE LINKS IN METADATA
    metaDataStr = metaDataStr.concat(`<h4 style="text-align: center;">`);
    if (omdb.Title) {
        metaDataStr = metaDataStr.concat(`<a href="https://www.imdb.com/title/${imdbID}/">IMDB</a>`);
    }
    if (tasteInfo.wUrl) {
        metaDataStr = metaDataStr.concat(` | <a href="${tasteInfo.wUrl}" >Wikipedia</a>`);
    }
    metaDataStr = metaDataStr.concat(`</h4><br/>`);

    // SETTING THE TITLE
    if (omdb.Title)
        document.getElementById('title').innerText = omdb.Title;
    else if (tasteInfo.wUrl) {
        document.getElementById('title').innerText = tasteInfo.Name;
    }
    else {
        document.getElementById('title').innerText = "Oops!!! Not Found";
        notFound = true;
    }
    docObjects.metaData.innerHTML = metaDataStr;

    // MAKING THE DIV BLOCK VISIBLE
    document.getElementsByClassName("loader")[0].remove();
    document.getElementById("content").style.display = '';
}

// METADATA