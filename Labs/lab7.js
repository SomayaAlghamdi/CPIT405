
const ACCESS_KEY = "FOtULfhujh_eo2krDVxF58nmzZn54MQjxI8zDoP91Vc";

const searchInput = document.getElementById("searchInput");
const imageContainer = document.getElementById("imageContainer");
const statusMessage = document.getElementById("statusMessage");

const xhrBtn = document.getElementById("xhrBtn");
const promiseBtn = document.getElementById("promiseBtn");
const asyncBtn = document.getElementById("asyncBtn");

let currentSearch = 0;

// Prepare the URL for the Unsplash API
function getSearchURL() {
    const keyword = searchInput.value.trim();

    if (keyword === "") {
        statusMessage.textContent = "Please enter a search keyword.";
        return null;
    }

    if (ACCESS_KEY === "YOUR_ACCESS_KEY") {
        statusMessage.textContent = "Please add your Unsplash Access Key.";
        return null;
    }

    return "https://api.unsplash.com/search/photos?query="
        + encodeURIComponent(keyword)
        + "&per_page=5";
}

// Start a new search
function startSearch() {
    const url = getSearchURL();

    if (url === null) {
        return null;
    }

    currentSearch++;

    imageContainer.innerHTML = "";
    statusMessage.textContent = "Loading photos...";

    xhrBtn.disabled = true;
    promiseBtn.disabled = true;
    asyncBtn.disabled = true;

    return {
        url: url,
        searchId: currentSearch
    };
}

// Enable the buttons after searching
function finishSearch(searchId) {
    if (searchId !== currentSearch) {
        return;
    }

    xhrBtn.disabled = false;
    promiseBtn.disabled = false;
    asyncBtn.disabled = false;
}

// Display the photos using DOM
function displayPhotos(data, searchId) {
    if (searchId !== currentSearch) {
        return;
    }

    imageContainer.innerHTML = "";

    const photos = data.results;

    if (!Array.isArray(photos)) {
        throw new Error("Invalid API response.");
    }

    if (photos.length === 0) {
        statusMessage.textContent = "No photos found.";
        return;
    }

    photos.forEach(function(photo) {

        const card = document.createElement("div");
        card.className = "photo-card";

        const img = document.createElement("img");
        img.src = photo.urls.small;
        img.alt = photo.alt_description || "Unsplash photo";
        img.loading = "lazy";

        const photographer = document.createElement("p");
        photographer.textContent = "Photo by ";

        const link = document.createElement("a");
        link.href = photo.user.links.html;
        link.textContent = photo.user.name;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        photographer.appendChild(link);

        card.appendChild(img);
        card.appendChild(photographer);

        imageContainer.appendChild(card);
    });

    statusMessage.textContent =
        photos.length + " photos loaded successfully!";
}

// Display errors
function showError(error, searchId) {
    if (searchId !== currentSearch) {
        return;
    }

    statusMessage.textContent = "Error: " + error.message;
    console.error(error);
}

// Method 1: XMLHttpRequest
function searchWithXHR() {
    const search = startSearch();

    if (search === null) {
        return;
    }

    const xhr = new XMLHttpRequest();

    xhr.open("GET", search.url, true);

    xhr.setRequestHeader(
        "Authorization",
        "Client-ID " + ACCESS_KEY
    );

    xhr.onload = function() {
        try {
            if (xhr.status >= 200 && xhr.status < 300) {
                const data = JSON.parse(xhr.responseText);
                displayPhotos(data, search.searchId);
            } else {
                throw new Error("HTTP status: " + xhr.status);
            }
        } catch (error) {
            showError(error, search.searchId);
        } finally {
            finishSearch(search.searchId);
        }
    };

    xhr.onerror = function() {
        showError(
            new Error("Network request failed."),
            search.searchId
        );
        finishSearch(search.searchId);
    };

    xhr.send();
}

// Method 2: Fetch with Promises
function searchWithPromises() {
    const search = startSearch();

    if (search === null) {
        return;
    }

    fetch(search.url, {
        headers: {
            "Authorization": "Client-ID " + ACCESS_KEY
        }
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error("HTTP status: " + response.status);
        }

        return response.json();
    })
    .then(function(data) {
        displayPhotos(data, search.searchId);
    })
    .catch(function(error) {
        showError(error, search.searchId);
    })
    .finally(function() {
        finishSearch(search.searchId);
    });
}

// Method 3: Fetch with Async/Await
async function searchWithAsyncAwait() {
    const search = startSearch();

    if (search === null) {
        return;
    }

    try {
        const response = await fetch(search.url, {
            headers: {
                "Authorization": "Client-ID " + ACCESS_KEY
            }
        });

        if (!response.ok) {
            throw new Error("HTTP status: " + response.status);
        }

        const data = await response.json();

        displayPhotos(data, search.searchId);

    } catch (error) {
        showError(error, search.searchId);

    } finally {
        finishSearch(search.searchId);
    }
}

// Mouse events
xhrBtn.addEventListener("click", searchWithXHR);

promiseBtn.addEventListener("click", searchWithPromises);

asyncBtn.addEventListener("click", searchWithAsyncAwait);

// Keyboard event: Press Enter to search
searchInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchWithAsyncAwait();
    }
});
