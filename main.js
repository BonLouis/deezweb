import router from '../components/Router.js';
// Global inscription, no need to use it anywhere but in the HTML
import tabsMenu from '../components/globals/tabsMenu.js';
import trackGrid from '../components/globals/trackGrid.js';
import artistGrid from '../components/globals/artistGrid.js';
import albumGrid from '../components/globals/albumGrid.js';

(() => {
	const app = new Vue({
		el: '#app',
		name: 'parent',
		router,
		data: {
			favs: {},
			quickSearchInput: '',
			loading: true
		},
		methods: {
			addOrRemoveFav: function (data) {
				if (`${data.type}#${data.id}` in localStorage) {
					Vue.delete(this.favs, `${data.type}#${data.id}`);
					localStorage.removeItem(`${data.type}#${data.id}`);
				} else {
					Vue.set(this.favs, `${data.type}#${data.id}`, JSON.stringify(data));
					localStorage.setItem(`${data.type}#${data.id}`, JSON.stringify(data));
				}
				console.log(localStorage.length);
			},
			// test: function (data) {
			// 	return `${data.type}#${data.id}` in this.favs;
			// },

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
			initWidget(data) {

				const d = document;
				const widg = d.querySelector('#widg-target');
				if (data) {
					let mode;
					let {id} = data;
					if (data.type === 'artist') {
						mode = 'radio';
						id = `artist-${id}`;
					} else if (data.type === 'track') {
						mode = 'tracks';
					} else {
						mode = data.type;
					}
					debugger;
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
					// head.removeChild(d.getElementById(idl));
					while (widg.firstChild) {
						widg.removeChild(widg.firstChild);
					}
				}
				js = d.createElement(s);
				js.id = idl;
				js.src = 'https://e-cdns-files.dzcdn.net/js/widget/loader.js';
				head.appendChild(js);
			}
		},
		created() {
			for (const item in localStorage) {
				if (/^#/.test(item)) {
					this.favs[`${item}`] = localStorage.getItem(`#${item}`);
				}
			}
			this.initWidget();
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
	Vue.filter('slashedDate', date => date.replace(/-/g, '/'));
})();
