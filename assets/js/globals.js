/*----------
- Global Variables
----------*/

var lang = document.querySelector("html").getAttribute("lang");
var showMenu = false;
var courseProgress = 0;
var currentQuestion = 0;
var currentTextSize = 16;
var currentLocation = 1;
var IUnderstandChecked = false;

/*----------
- Global data
----------*/

// Update this list every time you add a module to the course to update the navigation
var modules = [
	{
		url: "m0_en.html",
		url_fr: "m0_fr.html",
		title: "Title of introduction",
		title_fr: "Titre de l'introduction"
	},
	{
		url: "m1_en.html",
		url_fr: "m1_fr.html",
		title: "Title of module 1",
		title_fr: "Titre du module 1"
	},
	{
		url: "conclusion_en.html",
		url_fr: "conclusion_fr.html",
		title: "Test your knowledge",
		title_fr: "Testez vos connaissances"
	}
]

// Update this list when you want to add external resources to the course
var resources = [
	{
		url: "http://google.ca",
		url_fr: "http://google.ca",
		title: "Resource 1",
		title_fr: "Ressource 1",
		isExternal: true
	},
	{
		url: "http://google.ca",
		url_fr: "http://google.ca",
		title: "Resource 2",
		title_fr: "Ressource 2",
		isExternal: true
	},
	{
		url: "http://google.ca",
		url_fr: "http://google.ca",
		title: "Resource 3",
		title_fr: "Ressource 3",
		isExternal: true
	}
]


/*----------
- Global methods
----------*/

// Hide loader when page is loaded
window.addEventListener("load", function(event) {
	let loader = document.querySelector('#loader')

	loader.classList.add('hidden')

	setTimeout(function() {
		loader.style.display = "none"
	}, 300)
});

// Scroll back to top of page
var backtoTop = function () {
	$(document).ready(function () {

		//scroll back up
		$('html, body').animate({
			scrollTop: 0
		}, 600);
	});
}

// Event handler for scrollbar
var checkForScroll = function () {
	var doc = document.documentElement
	var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)

	var h = document.documentElement,
		b = document.body,
		st = 'scrollTop',
		sh = 'scrollHeight';
	this.courseProgress = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;

	if (top >= 200) {
		this.isNavScrolling = true
	}
	else this.isNavScrolling = false
}

// Calculate quiz score
var computeScore = function () {
	var totalScore = 0

	for (var i = 0; i < this.quizScores.length; i++) {
		if (this.quizScores[i].isCorrect == true) {
			totalScore++
		}
	}

	return totalScore
}

// Resize text
var resizeText = function () {
	let rootEl = document.querySelector('html');
	this.currentTextSize += 2

	if (this.currentTextSize > 20) {
		this.currentTextSize = 16
	}

	rootEl.setAttribute('style', 'font-size: ' + currentTextSize + 'px');

	return false;
}

// Get current text size
var getCurrentTextSize = function () {
	return this.currentTextSize + 'px'
}

// Update current position
var scrollToNextSection = function (n, loc) {
	let headerHeight;

	if (this.currentLocation <= n) {
		this.currentLocation = n
	}

	if (window.matchMedia("(min-width: 768px)").matches) {
		headerHeight = 62;
	} else {
		headerHeight = 50;
	}

	setTimeout(function () {
		$('html, body').animate({
			scrollTop: $(loc).offset().top - headerHeight
		}, 1000);
	}, 400);

	// var sco = pipwerks.SCORM;
	// sco.set('cmi.core.lesson_location', this.currentLocation)
	// sco.save();
}

// Videos initialization
$(function () {
	const player = new Plyr('#videoPlayer', {
		controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'airplay', 'fullscreen']
	});
});

// Add feature to lock focus within defined item
var focusLoop = function (container) {
	// add all the elements inside modal which you want to make focusable
	const focusableElements = 'button:visible, input, select, textarea, [tabindex]:not([tabindex="-1"]), a:visible';
	const modal = $(container); // select the modal by it's id

	const firstFocusableElement = modal.find(focusableElements)[0]; // get first element to be focused inside modal
	const focusableContent = modal.find(focusableElements);
	const lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal

	document.addEventListener('keydown', function (e) {
		let isTabPressed = e.key === 'Tab' || e.keyCode === 9;

		if (!isTabPressed) {
			return;
		}

		if (e.shiftKey) { // if shift key pressed for shift + tab combination
			if (document.activeElement === firstFocusableElement) {
				lastFocusableElement.focus(); // add focus for the last focusable element
				e.preventDefault();
			}
		} else { // if tab key is pressed
			if (document.activeElement === lastFocusableElement) { // if focused has reached to last focusable element then focus first focusable element after pressing tab
				firstFocusableElement.focus(); // add focus for the first focusable element
				e.preventDefault();
			}
		}
	});

	firstFocusableElement.focus();
}




/*----------
- Quiz methods
----------*/

// Submit answer
var submitAnswer = function (answer, questionsArray, currentQuestion) {
	// Save answer
	questionsArray[currentQuestion].answer = answer

	// Validate answer received
	this.checkCorrect(questionsArray, currentQuestion)
}

// Check answer
var checkCorrect = function (questionsArray, currentQuestion) {
	var sortedQuestions
	var sortedCorrective
	var cq = questionsArray[currentQuestion]

	if (Array.isArray(cq.answer)) {
		// Sort selected answers and correct answers 
		sortedQuestions = cq.answer.sort()
		sortedCorrective = cq.corrective.sort()

		// If number of selected answer != number of correct answers
		if (sortedQuestions.length !== sortedCorrective.length) {
			return
		}

		// Check if all selected answers match correct answers
		for (var i = 0; i < sortedQuestions.length; i++) {
			if (sortedQuestions[i] !== sortedCorrective[i]) {
				return
			}
		}
	}
	else {
		if (cq.answer != cq.corrective) {
			return
		}
	}

	cq.isCorrect = true
}

// Reset quiz
var retry = function (questionsArray) {
	this.currentQuestion = 0;

	for (var i = 0; i < questionsArray.length; i++) {
		questionsArray[i].answer = ''
		questionsArray[i].model = []
		questionsArray[i].isCorrect = false
	}
}

// Go to defined question
var nextQuestion = function (currentQuestion) {
	this.currentQuestion += 1
}



/*----------
- SCORM methods
----------*/

// Exit course and mark as completed
var exitCourse = function () {
	var path = window.location.pathname;
	var page = path.split("/").pop().split(".html").shift();

	// SCORM initialization
	window.parent.completeCourse()
	window.parent.exit_course()
}