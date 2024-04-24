document.addEventListener('DOMContentLoaded', async function() {
    // Function to load initial games
    async function loadInitialGames() {
        const response = await fetch('http://localhost:8000/api/getall');
        if (response.ok) {
            const data = await response.json();
            displayResults(data, 100);
        } else {
            alert('Error loading games. Please try again later.');
        }
    }
    // Call the function to load initial games when the page loads
    loadInitialGames();
});

if (!localStorage.getItem('like')){
    localStorage.setItem('like', JSON.stringify([]));
}
if (!localStorage.getItem('dislike')){
    localStorage.setItem('dislike', JSON.stringify([]));
}
async function search() {
    const query = document.getElementById('searchInput').value.trim();
    if (query === '') {
        alert('Please enter a search query');
        return;
    }

    const response = await fetch(`http://localhost:8000/api/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (response.ok) {
        const data = await response.json();
        displayResults(data, 8);
    } else {
        alert('Error searching. Please try again later.');
    }
}

// Function to display search results
function displayResults(results, number) {

    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    const firstResult = results.result.splice(0, number);

    firstResult.forEach(result => {
        const devcol = document.createElement('dev');
        devcol.className = 'col mb-4';
        devcol.innerHTML = `
            <div class="card" style="width: 18rem;">
              <img src=${result.img_url} class="card-img-top">
              <div class="card-body">
                <h5 class="card-title">${result.name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${result.price}</h6>
                <p class="card-text">${truncDescription(result.full_desc.desc)}</p>
                <div class="d-flex justify-content-between">
                    <button class="btn btn-danger"  onclick="addDislike('${result.ident}')" style="visibility: ${findLike(result.ident)}" data-name="${result.ident}" data-type="like">👎</button>
                    <button class="btn btn-success " onclick="addLike('${result.ident}')" style="visibility: ${findDislike(result.ident)}" data-name="${result.ident}" data-type="dislike">👍</button>
                </div>
              </div>
            </div>
        `;
        searchResults.appendChild(devcol);
    });
}

function findLike(name) {
    let storageItem = JSON.parse(localStorage.getItem('like')) || [];
    return storageItem.includes(name) ? "hidden" : "visible";
}

function findDislike(name) {
    let storageItem = JSON.parse(localStorage.getItem('dislike')) || [];
    return storageItem.includes(name) ? "hidden" : "visible";
}

function addLike(name){
    let likes = JSON.parse(localStorage.getItem('like')) || [];
    if(!likes.includes(name)){
        likes.push(name);
    }
    else {
        likes = likes.filter(item => item !== name);
    }
    localStorage.setItem('like', JSON.stringify(likes));

    updateButtonVisibility(name, 'like', !likes.includes(name));
}

function addDislike(name){
    let dislikes = JSON.parse(localStorage.getItem('dislike')) || [];
    if(!dislikes.includes(name)){
        dislikes.push(name);
    }
    else {
        dislikes = dislikes.filter(item => item !== name);
    }
    localStorage.setItem('dislike', JSON.stringify(dislikes));

    updateButtonVisibility(name, 'dislike', !dislikes.includes(name));
}

function updateButtonVisibility(name, type, visible) {
    const buttons = document.querySelectorAll(`[data-name="${name}"][data-type="${type}"]`);
    buttons.forEach(button => {
        button.style.visibility = visible ? 'visible' : 'hidden'; // Set the visibility based on the 'visible' parameter
    });
}

function truncDescription(description){
    if(description.length > 200) {
        description = description.substring(0, 200) + '...';
    }
    if(description.substring(0, 16) === "About This Game "){
        description = description.substring(16, description.length)
    }
    if(description.substring(0, 19) === "About This Content "){
        description = description.substring(19, description.length)
    }
    return description
}
