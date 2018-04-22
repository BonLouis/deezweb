import {
	searchAllUrl,
	searchArtistUrl,
	searchAlbumUrl,
	mixins,
	isAnEmptyObject
} from '../utils.js';

export default Vue.component('Home', (resolve, reject) => {
	fetch('../templates/pages/search.html')
		.then(data => data.text())
		.then(template => resolve({
			name: 'search',
			props: ['favs', 'search', 'query'],
			data: function () {
				return {
					searchInput: '',
					filterInput: '',
					order: '',
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

				makeQuickSearch() {
					this.searchForArtists();
					this.searchForAlbums();
					this.searchForAll();
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
					fetchJsonp(fullSearch)
						.then(data => data.json())
						.then((data) => {
							this.$set(this.allResults, 'all', data);
							this.$root.loading = false;
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
					}
					// else if (!isAnEmptyObject(this.$route.query)) {
					// 	this.makeAdvancedSearch();
					// }
				},
				checkOrder: function () {
					// this will check for the validity of the order
					// to make the cleanest request as possible.
					// return false if no order are defined

					// Erratum !
					// It was usefull when using the advanced search,
					// but as long as I have remove it, it's not very usefull anymore
					if (!this.order) {
						return false;
					}

					const order = this.order;
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
				},
				// updateRoute() {
				// 	if (!this.orderInput) {
				// 		this.$router.push({
				// 			name: 'quickSearch',
				// 			params: {
				// 				search: this.searchInput || this.search,
				// 			}
				// 		});
				// 	} else {
				// 		this.$router.push({
				// 			name: 'quickSearchWithOrder',
				// 			params: {
				// 				search: this.searchInput || this.search,
				// 				order: this.orderInput || this.order
				// 			}
				// 		});
				// 	}
				// },
			},
			watch: {
				// All the magic happen here, because of this watcher.
				// We update the url before request to the api,
				// which trigger this particular method.
				// With this trick,
				// we can handle both url's changes from the user's hand
				// and url's changes from the form.
				$route: 'quickOrAdvanced',

				// Uh,
				// please don't watch @track-grid.html:5
				order: 'searchForAll'
			},
			template,
		}));
});
