import router from '../components/Router.js';
// Global inscription, no need to use it anywhere but in the HTML
import tabsMenu from '../components/globals/tabsMenu.js';

(() => {
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
			injectCss(file) {
				const css = document.createElement('link');
				const head = document.querySelector('head');
				css.setAttribute('rel', 'stylesheet');
				css.setAttribute('href', `css/${file}.css`);
				css.setAttribute('id', 'injected');
				head.appendChild(css);
				console.log(`${file}.css injected`);

			},
			ejectCss(file) {
				const toEject = document.querySelector('#injected');
				document.querySelector('head').removeChild(toEject);
				console.log('css ejected');
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
			this.injectCss('tabsMenu');
		},
	});
	// Provide a way to declare filters globally
	Vue.filter('duration', (int) => {
		const min = (int / 60) >> 0; // Why to use Math.floor when we can use bitwise operator ...
		const sec = int % 60;
		return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
	});
	Vue.filter('convertRankToPercent', rank => (rank / 10000) >> 0);
})();
