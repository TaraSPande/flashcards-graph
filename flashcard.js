let allCards = [];
let filteredCards = [];
let currentIndex = 0;
let shuffleEnabled = true;

const cardDiv = document.getElementById("card");
const answerDiv = document.getElementById("answer");
const progressDiv = document.getElementById("progress");
const correctList = document.getElementById("correctList");
const incorrectList = document.getElementById("incorrectList");
const subtopicFilter = document.getElementById("subtopicFilter");

function showCard() {
  if (filteredCards.length === 0) {
    cardDiv.textContent = "No cards available.";
    answerDiv.textContent = "";
    progressDiv.textContent = "0 of 0";
    return;
  }
  const card = filteredCards[currentIndex];
  document.getElementById("question").textContent = `${card.question}`;
  document.getElementById("answer").textContent = "";
  updateProgress();
}

function showAnswer() {
  const card = filteredCards[currentIndex];
  document.getElementById("answer").innerHTML = card.answer;
}

function nextCard() {
  if (currentIndex + 1 >= filteredCards.length) {
    document.getElementById("question").textContent = "🎉 You've reached the end of the deck!";
    document.getElementById("answer").textContent = "";
    // Disable answer/correct/incorrect/next buttons
    setInteractionEnabled(false);
    updateProgress();
    return;
  }

  currentIndex++;
  showCard();
}

function setInteractionEnabled(enabled) {
  document.querySelectorAll(".buttons button").forEach(btn => {
    btn.disabled = !enabled;
  });
}

function markCorrect() {
  const card = filteredCards[currentIndex];
  const li = document.createElement("li");
  li.textContent = `${card.question}`;
  correctList.appendChild(li);
  nextCard();
}

function markIncorrect() {
  const card = filteredCards[currentIndex];
  const li = document.createElement("li");
  li.textContent = `${card.question}`;
  incorrectList.appendChild(li);
  nextCard();
}

function updateProgress() {
  progressDiv.textContent = `${currentIndex + 1} of ${filteredCards.length}`;
}

function applyFilter() {
  const selected = subtopicFilter.value;
  if (selected === "All") {
    filteredCards = [...allCards];
  } else {
    filteredCards = allCards.filter(card => card.subtopic === selected);
  }
  if (shuffleEnabled) {
    filteredCards.sort(() => 0.5 - Math.random());
  }
  currentIndex = 0;
  showCard();
  setInteractionEnabled(true);
}

function toggleShuffle() {
  shuffleEnabled = !shuffleEnabled;
  applyFilter(); // reapply filter and reshuffle
}

// Load data
fetch('flashcards.json')
  .then(response => response.json())
  .then(data => {
    allCards = data;
    populateSubtopicDropdown(data);
    applyFilter();
  });

function populateSubtopicDropdown(data) {
  const subtopics = [...new Set(data.map(card => card.subtopic))];
  subtopics.forEach(sub => {
    const option = document.createElement("option");
    option.value = sub;
    option.textContent = sub;
    subtopicFilter.appendChild(option);
  });
}
