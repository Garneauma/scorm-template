/* ---------- VUE CUSTOM COMPONENTS ---------- */

// Main navigation
Vue.component('main-nav', {
	data() {
		return {
			showMenu: showMenu,
			modules: modules,
			resources: resources
		}
	},
	props: ['progress', 'current'],
	template: `<div id="mainNavWrapper">
				<!-- NAVIGATION -->
				<nav id="mainNav" class="navbar navbar-expand py-0 fixed-top">
					<span class="navbar-brand">
						<img src="./assets/img/_branding/FIP_en_fr.svg" class="nav__logo" alt="Public service and procurement Canada" v-if="lang == 'en'">
						<img src="./assets/img/_branding/FIP_fr_en.svg" class="nav__logo" alt="Services publics et Approvisionnement Canada" v-else>
					</span>

					<div class="progress ml-lg-auto mr-lg-3">
						<div class="progress-bar" role="progressbar" :style="progressStyle" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100"></div>
					</div>

					<ul class="navbar-nav ml-auto ml-lg-0">
						<li class="nav-item d-none d-md-block">
							<a href="#" role="button" class="nav-link size-trigger" onclick="return resizeText()">
								<i class="bi-fonts"></i>
								<i class="bi-fonts"></i>
								<i class="bi-fonts"></i>
								<span class="sr-only" v-if="lang == 'en'">Increase or reduce font size</span>
								<span class="sr-only" v-else>Augmenter ou réduire la taille du texte</span>
							</a>
						</li>
						<li class="nav-item d-none d-md-block">
							<a :href="modules[0].url" class="nav-link">
								<i class="bi-house-door-fill"></i>
								<span class="sr-only" v-if="lang == 'en'">Go to course homepage</span>
								<span class="sr-only" v-else>Aller à la page d'accueil du cours</span>
							</a>
						</li>
						<li class="nav-item d-none d-md-block">
							<a :href="modules[current].url_fr" aria-label="Change language to French" class="nav-link" v-if="lang == 'en'">FR</a>
							<a :href="modules[current].url" aria-label="Changer la langue pour anglais" class="nav-link" v-else>EN</a>
						</li>
						<li class="nav-item">
							<a href="#" role="button" class="nav-link menu-trigger" aria-controls="courseNav" @click.prevent="toggleMenu">
								<i class="bi-list"></i>
								<span class="sr-only" v-if="lang == 'en'">Show menu</span>
								<span class="sr-only" v-else>Afficher le menu</span>
							</a>
						</li>
					</ul>
				</nav>

				<!-- MENU -->
				<transition name="fade" enter-active-class="animate__animated animate__fadeIn animate__faster" leave-active-class="animate__animated animate__fadeOut animate__faster" mode="out-in">
					<div class="menu-overlay" v-show="showMenu" @click="toggleMenu"></div>
				</transition>
				<transition name="slide-fade" enter-active-class="animate__animated animate__slideInRight animate__faster" leave-active-class="animate__animated animate__slideOutRight animate__faster" mode="out-in">
					<aside id="sideNav" class="menu" v-show="showMenu">
						<div class="menu-sidebar" @keydown.esc="toggleMenu">
							<button type="button" class="menu-close" @click="toggleMenu" aria-controls="courseNav">
								<i class="bi-x"></i>
								<span class="sr-only" v-if="lang == 'en'">Hide menu</span>
								<span class="sr-only" v-else>Cacher le menu</span>
							</button>

							<div class="menu-sidebar-inner">
								<h2 class="h4 pl-4 pt-4 pr-5">
									<template v-if="lang == 'en'">Course Navigation</template>
									<template v-else>Navigation du cours</template>
								</h2>
								<ul class="menu-sidebar-list nav flex-column course-nav">
									<li class="nav-item" v-for="(module, index) in modules" :key="index">
										<a :href="module.url" class="nav-link" :class="{active: index==current}" v-if="lang == 'en'">{{module.title}}</a>
										<a :href="module.url_fr" class="nav-link" :class="{active: index==current}" v-else>{{module.title_fr}}</a>
									</li>
								</ul>

								<h2 class="h5 pl-4 mb-3 mt-5" v-if="resources.length">
									<template v-if="lang == 'en'">Resources</template>
									<template v-else>Ressources</template>
								</h2>
								<ul class="menu-sidebar-list nav flex-column resources-nav" v-if="resources.length">
									<li class="nav-item" v-for="resource in resources">
										<a :href="resource.url" class="nav-link" :class="{'external-link': resource.isExternal}" :target="resource.isExternal ? '_blank' : '_self'" v-if="lang == 'en'">{{resource.title}}</a>
										<a :href="resource.url_fr" class="nav-link" :class="{'external-link': resource.isExternal}" :target="resource.isExternal ? '_blank' : '_self'" v-else>{{resource.title_fr}}</a>
									</li>
								</ul>
							</div>

							<ul class="nav tools-nav d-md-none">
								<li>
									<a href="#" role="button" class="nav-link size-trigger" onclick="return resizeText()">
										<i class="bi-fonts"></i>
										<i class="bi-fonts"></i>
										<i class="bi-fonts"></i>
										<span class="sr-only" v-if="lang == 'en'">Increase or reduce font size</span>
										<span class="sr-only" v-else>Augmenter ou réduire la taille du texte</span>
									</a>
								</li>
								<li>
									<a :href="modules[0].url" class="nav-link">
										<i class="bi-house-door-fill"></i>
										<span class="sr-only" v-if="lang == 'en'">Go to course homepage</span>
										<span class="sr-only" v-else>Aller à la page d'accueil du cours</span>
									</a>
								</li>
								<li>
									<a :href="modules[current].url_fr" aria-label="Change language to French" class="nav-link" v-if="lang == 'en'">FR</a>
									<a :href="modules[current].url" aria-label="Changer la langue pour anglais" class="nav-link" v-else>EN</a>
								</li>
							</ul>
						</div>
					</aside>
				</transition>
			</div>`,
	methods: {
		// Show/hide course navigation
		toggleMenu: function (e) {
			this.showMenu = !this.showMenu;

			if (this.showMenu) {
				setTimeout(function () {
					document.querySelector('.menu-close').focus();
					focusLoop('#sideNav');
				}, 500)
			} else {
				setTimeout(function () {
					document.querySelector('.menu-trigger').focus();
				}, 500)
			}
		}
	},
	computed: {
		progressStyle() {
			return 'width: ' + this.progress + '%';
		}
	}
})

// Next button in footer
Vue.component('next-button', {
	props: ['link'],
	template: '<button class="btn btn-primary btn-lg" @click="redirect(link)"><slot>Text goes here</slot><i class="bi-arrow-right ml-3"></i></button>',
	methods: {
		redirect: function (link) {
			window.location.href = link;
		}
	}
})

// Previous button in footer
Vue.component('prev-button', {
	props: ['link'],
	template: '<button class="btn btn-primary btn-lg" @click="redirect(link)"><i class="bi-arrow-left mr-3"></i><slot>Text goes here</slot></button>',
	methods: {
		redirect: function (link) {
			window.location.href = link;
		}
	}
})

// Quiz container
Vue.component('quiz-mc', {
	data: function () {
		return {

		}
	},
	template: '<div class="quiz-question">' +
		'<slot>Radio buttons goes here</slot>' +
		'</div>'
})

// Quiz checkbox option
Vue.component('checkbox', {
	props: ['currentQuestion', 'quizScores', 'questionValue', 'questionText'],
	template: '<div class="form-group">' +
	'<div class="custom-control custom-checkbox" :class="{correct: isClassCorrective}">' +
		'<input type="checkbox" class="custom-control-input" :id="\'quizCheck\' + currentQuestion + questionValue" :name="\'question\' + currentQuestion" :value="questionValue" v-model="quizScores[currentQuestion].model" :disabled="quizScores[currentQuestion].answer != \'\'">' +
		'<label class="custom-control-label" :for="\'quizCheck\' + currentQuestion + questionValue">{{questionText}}</label>' +
	'</div>' +
	'</div>',
	computed: {
		isClassCorrective: function () {
			for (var i = 0; i < this.quizScores[this.currentQuestion].corrective.length; i++) {
				if (this.questionValue == this.quizScores[this.currentQuestion].corrective[i] && this.quizScores[this.currentQuestion].answer != '') {
					return true
				}
			}
			return false;
		}
	}
})

// Quiz radio option
Vue.component('radio', {
	props: ['currentQuestion', 'quizScores', 'questionValue', 'questionText'],
	template: '<div class="form-group">' +
	'<div class="custom-control custom-radio" :class="{correct: isClassCorrective}">' +
		'<input type="radio" class="custom-control-input" :id="\'quizCheck\' + currentQuestion + questionValue" :name="\'question\' + currentQuestion" :value="questionValue" v-model="quizScores[currentQuestion].model" :disabled="quizScores[currentQuestion].answer != \'\'">' +
		'<label class="custom-control-label" :for="\'quizCheck\' + currentQuestion + questionValue">{{questionText}}</label>' +
	'</div>' +
	'</div>',
	computed: {
		isClassCorrective: function () {
			for (var i = 0; i < this.quizScores[this.currentQuestion].corrective.length; i++) {
				if (this.questionValue == this.quizScores[this.currentQuestion].corrective[i] && this.quizScores[this.currentQuestion].answer != '') {
					return true
				}
			}
			return false;
		}
	}
})

//  Quiz Feedback
Vue.component('quiz-feedback', {
	template: '<div class="quiz-feedback"><slot>Quiz feedback here</slot></div>'
})


/* ---------- VUE CUSTOM FILTERS ---------- */

// Round number filter
Vue.filter('round', function (value, accuracy, keep) {
	if (typeof value !== 'number') return value;

	var fixed = value.toFixed(accuracy);

	return keep ? fixed : +fixed;
})