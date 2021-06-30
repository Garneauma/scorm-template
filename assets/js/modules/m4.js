var app = new Vue({
	el: '#app',
	data: {
		lang: lang,
		showMenu: showMenu,
		courseProgress: courseProgress,
		currentQuestion: currentQuestion,
		currentTextSize: currentTextSize,
		currentLocation: currentLocation,
		moduleEndQuestion: [{
			model: [],
			answer: '',
			corrective: ["4"],
			isCorrect: false
		}]
	},
	methods: {
		// Global methods
		backtoTop: backtoTop,
		scrollHandler: function () { this.checkForScroll() },
		checkForScroll: checkForScroll,
		resizeText: resizeText,
		scrollToNextSection: scrollToNextSection,

		// Interaction methods

		// Quiz methods
		submitAnswer: submitAnswer,
		checkCorrect: checkCorrect,
		nextQuestion: nextQuestion,
		retry: retry,

		// SCORM methods
		exitCourse: exitCourse
	},
	computed: {
		computeScore: computeScore,
		getCurrentTextSize: getCurrentTextSize
	},
	mounted: function () {
		window.addEventListener('scroll', this.scrollHandler);
		this.checkForScroll()
	},
	destroyed: function () {
		window.removeEventListener('scroll', this.scrollHandler);
	}
})
