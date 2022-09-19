"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  const response = await axios.get('http://api.tvmaze.com/search/shows', { params: { q: String(term)} });
  return response.data;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    show = show.show;

    let image;
    
    if (show.image == null){
      image = "https://tinyurl.com/tv-missing";
    }
    else{
      image = show.image.medium;
    }
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${image}" 
              alt="${show.name}" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-dark btn-sm Show-getEpisodes">
               Episodes
             </button><br>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);
  

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function(evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

$("#shows-list").on("click", ".btn" , async function(evt){
  evt.preventDefault();
  //console.log($(this).parent().parent());
  const showId = $(this).parent().parent().parent().attr("data-show-id");
  const episodes = await getEpisodes(showId);
  
  populateEpisodes.bind(this, episodes.data)();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) { 
  const response = axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  return response;
}

/** Write a clear docstring for this function... */
//Takes object array of episodes appends episode info into episode list area
function populateEpisodes(episodes) {
  $("#episodes-list").empty();
  for(let episode of episodes){
    let name= episode.name;
    let season= episode.season;
    let number= episode.number;

    $("#episodes-list").append($(`<li>${name} (Season ${season}, Ep ${number})</li>`));
    $episodesArea.show();
  }
}


