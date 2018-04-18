import router from '../components/Router.js';
// Global inscription, no need to use it anywhere but in the HTML
import tabsMenu from '../components/globals/tabsMenu.js';

(() => {
	Vue.component('album-grid', resolve => fetch('../templates/locals/album-grid.html')
		.then(albs => albs.text())
		.then(albs => resolve({
			name: 'results-for-albums',
			template: albs,
			props: {
				// Contain the results for the "tout" tab
				albums: {
					type: Object,
					required: true
				},
				release: {
					type: Boolean,
					required: false
				}
			},
		})));
	Vue.component('track-grid', resolve => fetch('../templates/locals/track-grid.html')
		.then(tout => tout.text())
		.then(tout => resolve({
			template: tout,
			props: {
				// Contain the results for the "tout" tab
				tracks: {
					type: Object,
					required: true
				}
			},
			data: function () {
				return {
					// The titles to iterate through
					titles: [
						'Titre',
						'Artiste',
						'Album',
						'Dur.',
						'Pop.'
					]
				};
			}
		})));
	Vue.component('artist-grid', resolveArts => fetch('../templates/locals/artist-grid.html')
		.then(arts => arts.text())
		.then(arts => resolveArts({
			name: 'artist-grid',
			template: arts,
			props: {
				// Contain the results for the "tout" tab
				artists: {
					type: Object,
					required: true
				}
			},
			filters: {
				addSpace: int => int.toLocaleString()
			},
		})));
	const app = new Vue({
		el: '#app',
		name: 'parent',
		components: {

		},
		router,
		data: {
			favs: {},
			quickSearchInput: '',
			loading: true
		},
		methods: {
			addOrRemoveFav: function (data) {
				if (`#${data.id}` in localStorage) {
					Vue.delete(this.favs, `#${data.id}`);
					localStorage.removeItem(`#${data.id}`);
				} else {
					Vue.set(this.favs, `#${data.id}`, JSON.stringify(data));
					localStorage.setItem(`#${data.id}`, JSON.stringify(data));
				}
				console.log(localStorage.length);
			},
			test: function (id) {
				return `#${id}` in this.favs;
			},

			goSearch() {
				if (this.quickSearchInput.length) {
					router.push({
						name: 'quickSearch',
						params: {
							search: this.quickSearchInput
						}
					});
				}
			}
		},
		created() {
			for (const item in localStorage) {
				if (/^#/.test(item)) {
					this.favs[`${item}`] = localStorage.getItem(`#${item}`);
				}
			}
		},
	});

	// Provide a way to declare filters globally
	Vue.filter('duration', (int, withHours = false) => {
		if (!withHours) {
			const min = (int / 60) >> 0; // Why to use Math.floor when we can use bitwise operator ...
			const sec = int % 60;
			return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
		}
		// else
		const min = (int / 60) >> 0; // Why to use Math.floor when we can use bitwise operator ...
		return `${min} min`;


	});
	// Vue.filter('convertRankToPercent', rank => (rank / 10000) >> 0);
	Vue.filter('slashedDate', date => date.replace(/-/g, '/'));
})();
