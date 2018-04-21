'use strict';

var _Router = require('../components/Router.js');

var _Router2 = _interopRequireDefault(_Router);

var _tabsMenu = require('../components/globals/tabsMenu.js');

var _tabsMenu2 = _interopRequireDefault(_tabsMenu);

var _trackGrid = require('../components/globals/trackGrid.js');

var _trackGrid2 = _interopRequireDefault(_trackGrid);

var _artistGrid = require('../components/globals/artistGrid.js');

var _artistGrid2 = _interopRequireDefault(_artistGrid);

var _albumGrid = require('../components/globals/albumGrid.js');

var _albumGrid2 = _interopRequireDefault(_albumGrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Global inscription, no need to use it anywhere but in the HTML
(function () {
	var app = new Vue({
		el: '#app',
		name: 'parent',
		router: _Router2.default,
		data: {
			favs: {},
			quickSearchInput: '',
			loading: true
		},
		methods: {
			addOrRemoveFav: function addOrRemoveFav(data) {
				if (data.type + '#' + data.id in localStorage) {
					Vue.delete(this.favs, data.type + '#' + data.id);
					localStorage.removeItem(data.type + '#' + data.id);
				} else {
					Vue.set(this.favs, data.type + '#' + data.id, JSON.stringify(data));
					localStorage.setItem(data.type + '#' + data.id, JSON.stringify(data));
				}
				console.log(localStorage.length);
			},
			// test: function (data) {
			// 	return `${data.type}#${data.id}` in this.favs;
			// },

			goSearch: function goSearch() {
				if (this.quickSearchInput.length) {
					_Router2.default.push({
						name: 'quickSearch',
						params: {
							search: this.quickSearchInput
						}
					});
				}
			},
			initWidget: function initWidget(data) {

				var d = document;
				var widg = d.querySelector('#widg-target');
				if (data) {
					var mode = void 0;
					var id = data.id;

					if (data.type === 'artist') {
						mode = 'radio';
						id = 'artist-' + id;
					} else if (data.type === 'track') {
						mode = 'tracks';
					} else {
						mode = data.type;
					}
					debugger;
					var oldData = widg.getAttribute('data-src');
					var newData = oldData.replace(/(&type=)\w+(&id=)\d+/, '$1' + mode + '$2' + id);
					if (/&autoplay=false/.test(newData)) {
						newData = newData.replace(/&autoplay=false/, '&autoplay=true');
					}
					widg.setAttribute('data-src', newData);
				}
				var s = 'script';
				var idl = 'deezer-widget-loader';
				var head = d.querySelector('head');
				var js = void 0;
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
		created: function created() {
			for (var item in localStorage) {
				if (/^#/.test(item)) {
					this.favs['' + item] = localStorage.getItem('#' + item);
				}
			}
			this.initWidget();
		}
	});

	// Provide a way to declare filters globally
	Vue.filter('duration', function (int) {
		var withHours = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		if (!withHours) {
			var _min = int / 60 >> 0; // Why to use Math.floor when we can use bitwise operator ...
			var sec = int % 60;
			return (_min < 10 ? '0' + _min : _min) + ':' + (sec < 10 ? '0' + sec : sec);
		}
		// else
		var min = int / 60 >> 0; // Why to use Math.floor when we can use bitwise operator ...
		return min + ' min';
	});
	Vue.filter('slashedDate', function (date) {
		return date.replace(/-/g, '/');
	});
})();
