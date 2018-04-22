import router from './Router.js';

// Global inscription, no need to use it anywhere but in the HTML
import tabsMenu from './components/tabsMenu.js';
import trackGrid from './components/trackGrid.js';
import artistGrid from './components/artistGrid.js';
import albumGrid from './components/albumGrid.js';

(() => {
	const app = new Vue({
		el: '#app',
		name: 'parent',
		router,
		data: {
			// making the favs globals
			favs: {},
			// handle the input on home page
			quickSearchInput: '',
			// not fully usefull, but i use it sometimes
			// to prevent errors due to unready data
			loading: true,
			// a dirty way to show play/favs btn anywhere I want
			showBtnArray: []
		},
		methods: {
			// Purge storage and reload when user wants
			purge: function () {
				localStorage.clear();
				this.$router.go();
			},

			// This function will catch every fav-action to handle it correctly.
			// It will set items in localStorage on this scheme => '(typeOfTheItem)#(idOfTheItem)'
			addOrRemoveFav: function (data) {
				if (`${data.type}#${data.id}` in localStorage) {
					Vue.delete(this.favs, `${data.type}#${data.id}`);
					localStorage.removeItem(`${data.type}#${data.id}`);
				} else {
					Vue.set(this.favs, `${data.type}#${data.id}`, JSON.stringify(data));
					localStorage.setItem(`${data.type}#${data.id}`, JSON.stringify(data));
				}
			},

			// When on the home page, load the 'search'-component.
			// If not, 'search'-component will handle this by itself
			goSearch() {
				if (this.quickSearchInput.length) {
					router.push({
						name: 'quickSearch',
						params: {
							search: this.quickSearchInput
						}
					});
				}
			},

			// SDK was so painfull, I decided to "hack" the widget to make it play multiple tracks
			// On document.ready, data will be null, and the track loaded will be the one in the html.
			// Any other time, the user trigger this function with the data parameter.
			//
			// Regarding to data.type && data.id,
			// it will load another track by:
			// - removing the widget-loader (just to avoid multiple append in <head>)
			// - removing the iframe,
			// - changing the data-src of the widget,
			// - append the widget-loader again.
			initWidget(data) {
				const d = document;
				const widg = d.querySelector('#widg-target');
				if (data) {
					let mode;
					let {
						id
					} = data;
					if (data.type === 'artist') {
						mode = 'radio';
						id = `artist-${id}`;
					} else if (data.type === 'track') {
						mode = 'tracks';
					} else {
						mode = data.type;
					}

					const oldData = widg.getAttribute('data-src');
					let newData = oldData.replace(/(&type=)\w+(&id=)\d+/, `$1${mode}$2${id}`);
					if (/&autoplay=false/.test(newData)) {
						newData = newData.replace(/&autoplay=false/, '&autoplay=true');
					}
					widg.setAttribute('data-src', newData);
				}
				const s = 'script';
				const idl = 'deezer-widget-loader';
				const head = d.querySelector('head');
				let js;
				if (d.getElementById(idl)) {
					head.removeChild(d.getElementById(idl));
					while (widg.firstChild) {
						widg.removeChild(widg.firstChild);
					}
				}
				js = d.createElement(s);
				js.id = idl;
				js.src = 'https://e-cdns-files.dzcdn.net/js/widget/loader.js';
				head.appendChild(js);
			},

			// The dirty method to show play/favs btn anywhere I want
			toggleShowBtn: function (id) {
				if (this.showBtnArray.indexOf(id) !== -1) {
					this.showBtnArray.splice(this.showBtnArray.indexOf(id), 1);
				} else {
					this.showBtnArray.push(id);
				}
			}
		},

		// Load favs + init widget
		created() {
			for (const item in localStorage) {
				if (/#/.test(item)) {
					this.favs[`${item}`] = localStorage.getItem(`${item}`);
				}
			}
			this.initWidget();
		},
	});

	// Provide a way to declare filters globally
	// "withHours" parameter is used to show album's duration
	Vue.filter('duration', (int, withHours = false) => {
		if (!withHours) {
			const min = (int / 60) >> 0; // Why to use Math.floor when we can use bitwise operator ...
			const sec = int % 60;
			return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
		}
		// else
		const min = (int / 60) >> 0;
		return `${min} min`;
	});
	Vue.filter('slashedDate', date => date.replace(/-/g, '/'));
})();
