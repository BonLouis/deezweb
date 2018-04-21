import {
	searchAllUrl,
	searchArtistUrl,
	searchAlbumUrl,
	mixins,
	isAnEmptyObject
} from '../../js/utils.js';

export default Vue.component('Home', (resolve, reject) => {
	fetch('../templates/pages/search.html')
		.then(data => data.text())
		.then(template => resolve({
			name: 'search',
			mixins: [mixins],
			props: ['favs', 'search', 'order', 'query'],
			data: function () {
				return {
					searchInput: '',
					filterInput: '',
					orderInput: '',
					urls: {
						searchAllUrl,
						searchArtistUrl,
						searchAlbumUrl
					},
					allResults: {
						all: {},
						artists: {},
						albums: {}
					},
				};
			},
			created() {
				this.$root.loading = true;
				this.quickOrAdvanced();
			},
			methods: {
				updateRoute() {
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
				},
				throwQueryError(prob, type) {
					console.error(`${prob} should be of ${type} type.`);
				},
				makeQuickSearch() {
					this.searchForAll();
					this.searchForArtists();
					this.searchForAlbums();
					this.searchInput = '';
				},
				searchForAll() {
					const search = this.searchInput ? this.searchInput : this.search;
					const order = this.checkOrder();
					let fullSearch = '';
					if (order) {

						// I've decided to upperCase the order directly in the request,
						// because I find it ugly in capital in the url.
						// Yep.
						fullSearch = this.urls.searchAllUrl.replace('query', `${search}&order=${order.toUpperCase()}`);
					} else {
						fullSearch = this.urls.searchAllUrl.replace('query', `${search}`);
					}
					console.log(fullSearch);
					fetchJsonp(fullSearch)
						.then(data => data.json())
						.then((data) => {
							this.$set(this.allResults, 'all', data);
						});
				},
				searchForArtists() {
					const search = this.searchInput ? this.searchInput : this.search;
					const order = this.checkOrder();
					let fullSearch = '';
					if (order) {
						fullSearch = this.urls.searchArtistUrl.replace('query', `${search}&order=${order.toUpperCase()}`);
					} else {
						fullSearch = this.urls.searchArtistUrl.replace('query', `${search}`);
					}
					console.log(fullSearch);
					fetchJsonp(fullSearch)
						.then(data => data.json())
						.then((data) => {
							this.$set(this.allResults, 'artists', data);
						});
				},
				searchForAlbums() {
					const search = this.searchInput ? this.searchInput : this.search;
					const order = this.checkOrder();
					let fullSearch = '';
					if (order) {
						fullSearch = this.urls.searchAlbumUrl.replace('query', `${search}&order=${order.toUpperCase()}`);
					} else {
						fullSearch = this.urls.searchAlbumUrl.replace('query', `${search}`);
					}
					console.log(fullSearch);
					fetchJsonp(fullSearch)
						.then(data => data.json())
						.then((data) => {
							this.$set(this.allResults, 'albums', data);
							this.$root.loading = false;
						});
				},
				quickOrAdvanced: function () {
					if (isAnEmptyObject(this.$route.query) && !!this.search) {
						this.makeQuickSearch();
					} else if (!isAnEmptyObject(this.$route.query)) {
						this.makeAdvancedSearch();
					}
				},
				checkOrder: function () {
					// this will check for the validity of the order
					// to make the cleanest request as possible.
					// return false if no order are defined
					if (!this.order) { return false; }

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
				// $route: 'quickOrAdvanced'
			},
			template,
		}));
});
