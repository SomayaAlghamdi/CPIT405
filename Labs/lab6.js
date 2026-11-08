
// Get HTML elements
let likeBtn = document.getElementById("likeBtn");
let dislikeBtn = document.getElementById("dislikeBtn");
let likeCount = document.getElementById("likeCount");
let dislikeCount = document.getElementById("dislikeCount");

let commentInput = document.getElementById("commentInput");
let submitBtn = document.getElementById("submitBtn");
let commentsList = document.getElementById("commentsList");

let resetBtn = document.getElementById("resetBtn");
let message = document.getElementById("message");

// Initialize data
let likes = 0;
let dislikes = 0;
let comments = [];

// Set a cookie
function setCookie(name, value) {
    document.cookie =
        name + "=" + encodeURIComponent(value) +
        "; max-age=2592000; path=/; SameSite=Lax";
}

// Get a cookie
function getCookie(name) {
    let cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();

        if (cookie.startsWith(name + "=")) {
            return decodeURIComponent(
                cookie.substring(name.length + 1)
            );
        }
    }

    return null;
}

// Delete a cookie
function deleteCookie(name) {
    document.cookie =
        name + "=; max-age=0; path=/; SameSite=Lax";
}

// Update the page
function updateUI() {
    likeCount.textContent = likes;
    dislikeCount.textContent = dislikes;

    commentsList.innerHTML = "";

    comments.forEach(function(comment) {
        let p = document.createElement("p");
        p.className = "comment";
        p.textContent = comment;
        commentsList.appendChild(p);
    });

    let voted = getCookie("lab6_vote") !== null;
    likeBtn.disabled = voted;
    dislikeBtn.disabled = voted;

    let commented = getCookie("lab6_comments") !== null;
    commentInput.disabled = commented;
    submitBtn.disabled = commented;
}

// Handle Like
function addLike() {
    if (getCookie("lab6_vote") !== null) {
        message.textContent = "You have already voted!";
        return;
    }

    likes++;
    setCookie("lab6_vote", "like");
    setCookie("lab6_likes", likes);
    likeBtn.classList.add("animate");

    message.textContent = "You liked this!";
    updateUI();
}

// Handle Dislike
function addDislike() {
    if (getCookie("lab6_vote") !== null) {
        message.textContent = "You have already voted!";
        return;
    }

    dislikes++;
    setCookie("lab6_vote", "dislike");
    setCookie("lab6_dislikes", dislikes);
    dislikeBtn.classList.add("animate");

    message.textContent = "You disliked this!";
    updateUI();
}

// Handle comment submission
function addComment() {
    if (getCookie("lab6_comments") !== null) {
        message.textContent = "You have already commented!";
        return;
    }

    let comment = commentInput.value.trim();

    if (comment === "") {
        message.textContent = "Please write a comment!";
        return;
    }

    comments.push(comment);

    setCookie("lab6_comments", JSON.stringify(comments));

    commentInput.value = "";
    message.textContent = "Comment added!";
    updateUI();
}

// Handle Reset
function resetAll() {
    deleteCookie("lab6_vote");
    deleteCookie("lab6_likes");
    deleteCookie("lab6_dislikes");
    deleteCookie("lab6_comments");

    likes = 0;
    dislikes = 0;
    comments = [];

    commentInput.value = "";
    message.textContent = "All data has been reset!";

    updateUI();
}

// Load saved data from cookies
function loadData() {
    likes = Number(getCookie("lab6_likes")) || 0;
    dislikes = Number(getCookie("lab6_dislikes")) || 0;

    let savedComments = getCookie("lab6_comments");

    if (savedComments !== null) {
        try {
            let parsed = JSON.parse(savedComments);

            if (Array.isArray(parsed)) {
                comments = parsed;
            }
        } catch (error) {
            comments = [];
        }
    }

    updateUI();
}

// Event listeners
likeBtn.addEventListener("click", addLike);
dislikeBtn.addEventListener("click", addDislike);
submitBtn.addEventListener("click", addComment);
resetBtn.addEventListener("click", resetAll);

// Initialize page
loadData();



likeBtn.addEventListener("animationend", function() {
    likeBtn.classList.remove("animate");
});

dislikeBtn.addEventListener("animationend", function() {
    dislikeBtn.classList.remove("animate");
});
