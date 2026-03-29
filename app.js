const wrapper = document.querySelector(".wrapper"),
searchInput = wrapper.querySelector("input"),
synonyms = wrapper.querySelector(".synonyms .list"),
infoText = wrapper.querySelector(".info-text"),
volumeIcon = wrapper.querySelector(".word i"),
removeIcon = wrapper.querySelector(".search span");

let audio;

// Display API data
function data(result, word) {

    if (result.title) {
        infoText.innerHTML =
        `Can't find the meaning of <span>"${word}"</span>. Please try another word.`;
        return;
    }

    wrapper.classList.add("active");

    let meanings = result[0].meanings[0];
    let definitions = meanings.definitions[0];

    let phoneticText = result[0].phonetics[0]?.text || "";
    let audioSrc = result[0].phonetics[0]?.audio || "";

    // Word
    document.querySelector(".word p").innerText = result[0].word;

    // Phonetics
    document.querySelector(".word span").innerText =
        `${meanings.partOfSpeech} ${phoneticText}`;

    // Meaning
    document.querySelector(".meaning span").innerText =
        definitions.definition;

    // Example
    document.querySelector(".example span").innerText =
        definitions.example || "No example available";

    // Audio
    if (audioSrc) {
        audio = new Audio(audioSrc);
    }

    // Synonyms
    let syns = meanings.synonyms;

    if (!syns || syns.length === 0) {
        synonyms.parentElement.style.display = "none";
    } else {

        synonyms.parentElement.style.display = "block";
        synonyms.innerHTML = "";

        syns.slice(0,5).forEach(syn => {
            let tag = `<span onclick="search('${syn}')">${syn}, </span>`;
            synonyms.insertAdjacentHTML("beforeend", tag);
        });
    }
}


// Search word again from synonym
function search(word) {
    searchInput.value = word;
    fetchApi(word);
    wrapper.classList.remove("active");
}


// Fetch API
function fetchApi(word) {

    wrapper.classList.remove("active");

    infoText.style.color = "#000";
    infoText.innerHTML =
        `Searching the meaning of <span>"${word}"</span>`;

    let url =
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(url)
        .then(res => res.json())
        .then(result => data(result, word))
        .catch(() => {
            infoText.innerHTML = "Something went wrong.";
        });
}


// Enter key search
searchInput.addEventListener("keyup", e => {

    if (e.key === "Enter" && e.target.value) {
        fetchApi(e.target.value);
    }

});


// Play pronunciation
volumeIcon.addEventListener("click", () => {

    if (audio) {
        audio.play();
    }

});


// Clear search
removeIcon.addEventListener("click", () => {

    searchInput.value = "";
    searchInput.focus();

    wrapper.classList.remove("active");

    infoText.style.color = "#9a9a9a";

    infoText.innerHTML =
    "Type a word and press enter to get meaning, example, pronunciation, and synonyms of that typed word.";

});