var bookmarks

var contentArr = [
	{ page: "index", visited: false },
	{ page: "defensive-driving-basics", visited: false },
	{ page: "pre-trip-requirements", visited: false },
	{ page: "on-the-road", visited: false },
	{ page: "driving-adverse-conditions", visited: false },
	{ page: "vehicle-incidents", visited: false },
]

// SHORTCUT FOR SCORM 
var SCORM = pipwerks.SCORM

// jquery init
$(document).ready(function () {
	scormInit();
	$(window).bind('unload', exit_course);
})

//Init LMS
function scormInit() {
	SCORM.version = "1.2"
	SCORM.init()
	SCORM.handleExitMode = false

	console.log('data: ' + SCORM.get('cmi.suspend_data'))
	if (SCORM.get('cmi.suspend_data') !== null || SCORM.get('cmi.suspend_data') !== 'undefined') {
		bookmarks = SCORM.get('cmi.suspend_data').split(',')

		for (var i = 0; i < bookmarks.length; i++) {
			contentArr[i].visited = bookmarks[i]
		}
	}
	else {
		bookmarks = []
	}
}

//
function bookmark(frame) {
	SCORM.set('cmi.core.lesson_location', frame);

	for (var i = 0; i < contentArr.length; i++) {
		if (frame === contentArr[i].page) {
			contentArr[i].visited = true
		}

		// array to send to lms
		bookmarks[i] = contentArr[i].visited
	}

	SCORM.set('cmi.suspend_data', bookmarks.join(','))
	checkComplete(contentArr)
}

// Check for course completion and send a status to the LMS
function checkComplete(arr) {

	for (var i = 0; i < arr.length; i++) {
		if (arr[i].visited !== true) {
			SCORM.set('cmi.core.lesson_status', 'incomplete');
			return
		}
	}

	SCORM.set('cmi.core.lesson_status', 'completed');
	SCORM.save();
}

function completeCourse() {
	SCORM.set('cmi.core.lesson_status', 'completed');
	SCORM.set('cmi.core.score.raw', 100);
	SCORM.set('cmi.core.lesson_status', 'passed');
	SCORM.save();
}

function exit_course() {
	// checkComplete (contentArr)

	// SCORM.set( 'cmi.suspend_data', bookmarks.join( ',' ) );
	// SCORM.set("cmi.core.exit", "suspend");

	SCORM.save();
	SCORM.set("cmi.core.exit", "suspend");
	SCORM.quit();

	window.close();
	window.location.href = 'completed.html';
}