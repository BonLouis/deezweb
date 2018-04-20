export default Vue.component('Favs', (resolve, reject) => {
	fetch('../templates/pages/favorites.html')
		.then(res => res.text())
		.then((template) => {
			resolve({
				name: 'favorites',
				data: function () {
					return {
						favs: {
							data: [],
							total: 0
						}
					};
				},
				created() {
					for (const item in localStorage) {
						if (/^#/.test(item)) {
							this.favs.data.push(JSON.parse(localStorage.getItem(item)));
						}
					}
					this.favs.total = this.favs.data.length;
				},
				methods: {
					addOrRemoveFav: function (data) {
						if (`#${data.id}` in localStorage) {
							localStorage.removeItem(`#${data.id}`);
						} else {
							localStorage.setItem(`#${data.id}`, JSON.stringify(data));
						}
						this.populateFavs();
					},
					populateFavs: function () {
						const newFavs = [];
						for (const item in localStorage) {
							if (/^#/.test(item)) {
								newFavs.push(JSON.parse(localStorage.getItem(item)));
							}
						}
						this.favs = newFavs;
					}
				},
				template
			});
		});
});
