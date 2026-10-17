// Session Duration
const focusMinutes = 25;
const breakMinutes = 5;

// Select Elements
const timer = document.getElementById("timer");
const message = document.getElementById("message");
const modeButtons = document.querySelectorAll(".modes button");
const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const tomato = document.getElementById("tomato");
const tomatoFill = document.getElementById("tomato-fill");
const alarm = document.getElementById("alarm");

// Timer States
let currentMode = "focus";
let sessionMinutes = focusMinutes;
let timeLeft = sessionMinutes * 60; // Convert Minutes To Seconds
let intervalId = null; // Time Is Stopped
let endTime = 0;

// Update The Time, Fill The Tomato, Change The Buttons
function updateDisplay() {

	// Time Left => 190 Seconds
	const minutes = Math.floor(timeLeft / 60); // 3 Minutes
	const seconds = timeLeft % 60; // 10 Seconds
	timer.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

	// 300 / 300 = 1 * 100 = 100%
	// 150 / 300 = 0.5 * 100 = 50%
	tomatoFill.style.height = `${(timeLeft / (sessionMinutes * 60)) * 100}%`;
	tomato.classList.toggle("running", intervalId !== null); // Time Is Running
	startButton.textContent = intervalId === null ? "Start" : "Pause";

	for (const button of modeButtons) {
		button.classList.toggle("active", button.dataset.mode === currentMode);
	}

}



// Stop The Interval And Mark The Timer As Paused
function pauseTimer() {
	clearInterval(intervalId);
	intervalId = null;
}

// Update The Remaining Time and Play Audio File When Session End 
function tick() {
	
	const remainginMillseconds = endTime - Date.now();
	const remainginSeconds = Math.ceil(remainginMillseconds / 1000); // To Get Seconds
	timeLeft = Math.max(0, remainginSeconds);

	if (timeLeft === 0) {

		pauseTimer();
		message.textContent = currentMode === "focus" ? "Focus Is Complete" : "Break Is Complete";
		alarm.currentTime = 0;
		alarm.play();

	}

	updateDisplay();
}

// Start The Countdown Or Pause The Running Session 
function toggleTimer() {
	// Time Is Running or No ?
	if (intervalId !== null) { // Pause The Session If Its Running

		

	} else { // Start The Session

		alarm.pause(); // Pause The Audio
		alarm.currentTime = 0; // Move Sound to The Start

		if (timeLeft === 0) timeLeft = sessionMinutes * 60;
		endTime = Date.now() + timeLeft * 1000; // Seconds * 1000 = Millseconds

		intervalId = setInterval(tick, 1000);
		message.textContent = currentMode === "focus" ? "Time To Focus" : "Take A Break";

	}

	updateDisplay();
}

// Reset The Selected Session And Stop Playing Alert
function resetTimer() {
	pauseTimer();
	alarm.pause();
	alarm.currentTime = 0;
	timeLeft = sessionMinutes * 60;
	endTime = 0;
	message.textContent = currentMode === "focus" ? "Time To Focus" : "Take A Break";
	updateDisplay();
}

// Select The Mode
function changeMode(event) {
	currentMode = event.currentTarget.dataset.mode;
	sessionMinutes = currentMode === "focus" ? focusMinutes : breakMinutes;
	resetTimer();
	// console.log(currentMode);
}

// Connect Controls
function setupEvents() {
	startButton.addEventListener("click", toggleTimer);
	resetButton.addEventListener("click", resetTimer);
	for (const button of modeButtons) {
		button.addEventListener("click", changeMode);
	}
}

setupEvents()
updateDisplay();