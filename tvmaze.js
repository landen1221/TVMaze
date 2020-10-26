async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const res = await axios.get("http://api.tvmaze.com/search/shows", {params: {q: query}})
  const returnData = []
  
  for (let i=0; i<res.data.length; i++) {
    returnData.push({
      id: res.data[i].show.id,
      name: res.data[i].show.name,
      summary: res.data[i].show.summary,
      image: res.data[i].show.image ? res.data[i].show.image.medium : "https://tinyurl.com/tv-missing"
    })
  }

  return returnData
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {

    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <img class="card-img-top" src=${show.image}>
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <hr>
             <div class="text-center">
             <button class="btn btn-success get-episodes">Display Episodes</button>
             </div>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);
  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  const returnData = []
  for (let i =0; i<res.data.length; i++) {
    returnData.push({
      id: res.data[i].id,
      name: res.data[i].name,
      season: res.data[i].season,
      number: res.data[i].number
    })
  }

  // TODO: return array-of-episode-info, as described in docstring above
  return returnData
}

function populateEpisodes(episodes) {
  const UL = document.querySelector('ul')
  UL.style.visibility = 'visible'
  UL.innerHTML = ""
  for (let episode of episodes) {
    const newLI = document.createElement('li')
    newLI.innerText = `${episode.name} (season ${episode.season}, episode ${episode.number})`
    UL.append(newLI)
  }
  $("#episodes-area").show();

}

$("#shows-list").on("click", ".get-episodes", async function handleEpisodeClick(evt) {
  let showId = $(evt.target).closest(".Show").data("show-id");
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
});