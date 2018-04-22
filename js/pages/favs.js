export default Vue.component('Favs', (resolve, reject) => {
	fetch('../templates/pages/favorites.html')
		.then(res => res.text())
		.then((template) => {
			resolve({
				name: 'favorites',
				data: function data() {
					return {
						favs: {
							tracks: {
								data: [],
								total: 0
							},
							albums: {
								data: [],
								total: 0
							},
							artists: {
								data: [],
								total: 0
							}
						}
					};
				},
				watch: {
					// Quite rude, but it work
					'$root.favs': function () {
						this.favs = {
							tracks: {
								data: [],
								total: 0
							},
							albums: {
								data: [],
								total: 0
							},
							artists: {
								data: [],
								total: 0
							}
						};
						this.populateFavs();
					}
				},
				created() {
					this.$root.loading = true;
					this.populateFavs();
					this.$root.loading = false;
				},

				methods: {
					populateFavs: function populateFavs() {
						let t,
							al,
							ar;
						t = al = ar = 0;
						for (const item in localStorage) {
							if (/#/.test(item)) {
								switch (true) {
									case /^track#/.test(item):
										Vue.set(this.favs.tracks.data, t, JSON.parse(localStorage.getItem(item)));
										t++;
										break;
									case /^album#/.test(item):
										Vue.set(this.favs.albums.data, al, JSON.parse(localStorage.getItem(item)));
										al++;
										break;
									case /^artist#/.test(item):
										Vue.set(this.favs.artists.data, ar, JSON.parse(localStorage.getItem(item)));
										ar++;
										break;
									default:

								}
							}
						}
						for (const type in this.favs) {
							this.favs[type].total = this.favs[type].data.length;
						}
					}
				},
				template: template
			});
		});
});
