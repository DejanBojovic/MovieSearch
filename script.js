// new istance of XMLHttpRequest object that contains needed methods for AJAX call
var ourRequest = new XMLHttpRequest();

// selecting the button that makes the AJAX call
const buttonGET = document.querySelector(".button-get");
// selecting the button that removes displayed movie from the page
const buttonREMOVE = document.querySelector(".button-remove");

// selecting the input field
const input = document.querySelector(".input-field");
// selecting the div that will display the info gotten from AJAX
const showingDiv = document.querySelector(".data-show");

// takes care of overflow property in css
let movieCount = 0;

// adding event listener to buttonGET that will trigger AJAX call
buttonGET.addEventListener("click", function() {
    // since overflow is hidden if only one movie is displayed, if user wants to search for more movies overflow needs to change in order to enable scroll on the page
    if(++movieCount > 1) {
        document.querySelector("body").style.overflow = "visible";
        movieCount = 0;
    }

    // getting the value from the input field before AJAX soo we know what movie user wants to be displayed
    const gottenInput = input.value;
    // value of input field is then being reset
    input.value = "";

    // if noting is in the input field before pressing the buttonGET, the call will not be executed because we dont have the vital parameter - name of the wanted movie
    if(gottenInput.length > 0) {
        // input that we've got from the input field is being added into the URL as the parameter
        // we only need information for that specific movie or series and that is why we need this parameter to get its specific info
        // function has two arguments - type of call you want to make and url from which you want to ,in this case, get the info
        ourRequest.open("GET", `https://www.omdbapi.com/?t=${gottenInput}&apikey=611d749b`);

        // function that is invoked once the info has been fetched form the URL in "open" method
        // it specifies what exactly to do with this gotten info
        ourRequest.onload = function() {
            // since we get the info in JSON format we first need to parse it into usable code (arrays and objects)
            var data = JSON.parse(ourRequest.responseText);

            // if user searches for the wront movie title call "wrongtitleDisplay" function
            if(data.Response === "False") {
                wrongTitleDisplay();
            } else {
                // function that displays the data on the page if movie title was correctly typed
                appendHTML(data);

                // selecting the "x" in the top right corner that removes clicked movie panel
                // this is added here because this "x" is not displayed on the screen until the data arrives from API
                const removeX = document.querySelector(".remove");

                removeX.addEventListener("click", function(e) {
                    // selecting and removing parent element of the "x" in the top right corner by setting its display to "none"
                    e.target.parentNode.remove();
                })
            }
            
        }
        
        // our request to fetch the data is sent and "onload" function will do its work once the data arrives - asynchronous
        ourRequest.send();
    }
});

// adding event listener to the button that clears our page - deletes the movie that we displayed
// simply removing all content from the div that displays gotten data about movie
buttonREMOVE.addEventListener("click", function() {
    showingDiv.innerHTML = "";

    document.querySelector("body").style.overflow = "hidden";
})

// function that is being called once the data arrives
// it defined how the data is displayed on the page
function appendHTML(dt) {
    // using template literals to form a string which contains info from the gotten data
    // creating "HTML like" string
    let htmlString = 
    `
    <div class="main">
        <div class="main-left">
            <h1 class="title">${dt.Title}</h1>
            <img src="${dt.Poster}" alt="${dt.Title}-movie-poster">
            <p class="movie-genre">Genre: ${dt.Genre}</p>
            <p class="movie-release">Release Date: ${dt.Released}</p>
        </div>
        <div class="main-right">
            <div class="rating-div">
                <p>IMDb rating</p>
                <p class="rating-number">${dt.imdbRating}</p>
            </div>
            <p class="director">Director: ${dt.Director}</p>
            <p class="actors">Actors: ${dt.Actors}</p>
            <p class="movie-plot">Plot: ${dt.Plot}</p>
        </div>
        <div class="remove">x</div>
    </div>`;

    // clearing the previous movie from the page if there was any
    // showingDiv.innerHTML = "";

    // this function turns our previously constructed string into HTML which then gets added to the page
    // since the string has the structure of HTML elements once turned into HTML from this function it has all the capabilities that HTML elements have
    // its look and position is then defined by the classes in the css file
    showingDiv.insertAdjacentHTML("afterbegin", htmlString);
}

// function that is being called when user searches for movie title that does not exist
function wrongTitleDisplay() {
    // selecting the div that is beiong displayed
    const wrongTitleDiv = document.querySelector(".wrong-title-div");
    // selecting the button that closes the div
    const wrongTitleButton = document.querySelector(".btn-wrong-title");

    // giving the div display flex to show it on the page
    wrongTitleDiv.style.display = "flex";

    // when button is pressed div is removed form the page again
    wrongTitleButton.addEventListener("click", function() {
        wrongTitleDiv.style.display = "none";
    })
}