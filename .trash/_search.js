import { searchUrl, isAnEmptyObject } from '../../js/utils.js';

export default Vue.component('Home', (resolve, reject) => {
	fetch('../templates/pages/search.html')
		.then(data => data.text())
		.then(template => resolve({
			name: 'search',
			props: ['favs', 'search', 'order', 'query'],
			data: function () {
				return {
					searchInput: '',
					filterInput: '',
					orderInput: '',
					advancedSearch: {
						artist: '',
						album: '',
						track: '',
						label: '',
						dur_min: '',
						dur_max: '',
						bpm_min: '',
						bpm_max: '',
					},
					searchMode: false,
					baseUrl: searchUrl,
					allResults: {},
				};
			},
			created() {
				this.quickOrAdvanced();
			},
			filters: {
				inCaseOfAdvancedSearch: function (search, route) {
					if (search === 'advanced' && !isAnEmptyObject(route.query)) {
						let str = route.fullPath.split('?')[1];
						str = str.replace(/=([\d\w%]+)(?:&|$)/g, ':$1, ');
						return str;
					}
					return search;
				}
			},
			methods: {
				updateRoute() {
					switch (this.searchMode) {
						case false:
							if (!this.orderInput) {
								this.$router.push({
									name: 'quickSearch',
									params: {
										search: this.searchInput || this.search,
									}
								});
							} else {
								this.$router.push({
									name: 'quickSearchWithOrder',
									params: {
										search: this.searchInput || this.search,
										order: this.orderInput || this.order
									}
								});
							}
							break;
						case true:
							const query = {};
							const shouldBeAnInt = ['dur_min', 'dur_max', 'bpm_min', 'bpm_max'];
							for (const param in this.advancedSearch) {
								if (this.advancedSearch[param].length > 0) {
									if (shouldBeAnInt.indexOf(param) !== -1 && !/^\d+$/.test(this.advancedSearch[param])) {
										this.throwQueryError(param, 'int');
										return false;
									}
									// else
									query[param] = this.advancedSearch[param];
								}
							}
							this.$router.push({
								name: 'advancedSearch',
								query
							});
							break;
						default: return null;
					}
				},
				throwQueryError(prob, type) {
					console.error(`${prob} should be of ${type} type.`);
				},
				makeQuickSearch() {
					const search = this.searchInput ? this.searchInput : this.search;
					const order = this.checkOrder();
					let fullSearch = '';
					if (order) {
						// I've decided to upperCase the order directly in the request,
						// because I find it ugly in capital in the url.
						// Yep.
						fullSearch = this.baseUrl.replace('query', `${search}&order=${order.toUpperCase()}`);
					} else {
						fullSearch = this.baseUrl.replace('query', `${search}`);
					}
					console.log(fullSearch);
					fetchJsonp(fullSearch)
						.then(data => data.json())
						.then((data) => {
							this.allResults = data;
							this.searchInput = '';
						});
				},
				makeAdvancedSearch() {
					// Because route as been previously updated and query params checked,
					// we can blindy slice the url to make the request.
					// If the user suceed in making a bad request,
					// it will simply result in an empty result, which is not my problem !
					// We just have to process params to make them as Deezer want.
					const allQueries = this.$route.fullPath.split('?')[1].replace(/=([\d\w%]+)(&|$)/g, ':"$1"$2');
					const fullSearch = this.baseUrl.replace('query', `${allQueries}`);
					console.log(fullSearch);
					fetchJsonp(fullSearch)
						.then(data => data.json())
						.then((data) => {
							this.allResults = data;
						});
				},
				quickOrAdvanced: function() {
					if (isAnEmptyObject(this.$route.query) && !!this.search) {
						this.makeQuickSearch();
					} else if (!isAnEmptyObject(this.$route.query)) {
						this.makeAdvancedSearch();
					}
				},
				checkOrder: function() {
					// this will check for the validity of the order
					// to make the cleanest request as possible.
					// return false if no order are defined
					if (!this.order) {
						return false;
					}

					const order = this.orderInput || this.order;
					const validOrders = [
						'RANKING',
						'TRACK_ASC',
						'TRACK_DESC',
						'ARTIST_ASC',
						'ARTIST_DESC',
						'ALBUM_ASC',
						'ALBUM_DESC',
						'RATING_ASC',
						'RATING_DESC',
						'DURATION_ASC',
						'DURATION_DESC'
					];
					// I finally don't use this default value,
					// especially because ranking is already the default value.
					// But we can imagine to store user's preference and set this consequently
					const defaultOrder = 'RANKING';

					// toUpperCase for the sake of beauty.
					// cf comments in @makeQuickSearch
					return validOrders.indexOf((order).toUpperCase()) !== -1 ? order : defaultOrder;
				}
			},
			watch: {
				// All the magic happen here, because of this watcher.
				// We update the url before request to the api,
				// which trigger this particular method.
				// With this trick,
				// we can handle both url's changes from the user's hand
				// and url's changes from the form.
				$route: 'quickOrAdvanced'
			},
			template
		}));
});
