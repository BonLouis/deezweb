import {
	mixins,
	artistUrl
} from '../utils.js';
export default Vue.component('Artist', (resolve) => {
	fetch('../templates/pages/artist.html')
		.then(res => res.text())
		.then((template) => {
			resolve({
				name: 'artist',
				mixins: [mixins],
				props: ['id'],
				data: function () {
					return {
						baseUrl: artistUrl,
						url: '',
						artist: {},
						tops: {},
						albums: {},
						similars: {},
						limit: 20
					};
				},
				created() {
					this.loadAll();
				},
				watch: {
					albums: function () {
						const headerTop = document.querySelector('#header-top');
						headerTop.style.backgroundImage = `url(${this.albums.data[0].cover_xl})`;
					},
					'$route.params.id': function () {
						this.loadAll();
					},
				},
				methods: {
					loadAll() {
						this.loadArtist();
						this.loadTop();
						this.loadAlbums();
						this.loadSimilars();
					},
					loadArtist() {
						this.url = this.baseUrl.replace('query', this.id);
						fetchJsonp(this.url)
							.then(artist => artist.json())
							.then((artist) => {
								this.artist = artist;
								this.$root.loading = false;
							});
					},
					loadTop() {
						const url = this.url.replace(/\?/, `/top?limit=${this.limit}&`);

						fetchJsonp(url)
							.then(tops => tops.json())
							.then((tops) => {
								this.tops = tops;
							});
					},
					loadAlbums() {
						const url = this.url.replace(/\?/, '/albums&');
						fetchJsonp(url)
							.then(albums => albums.json())
							.then((albums) => {
								this.albums = albums;
							});
					},
					loadSimilars() {
						const url = this.url.replace(/\?/, '/related&');
						fetchJsonp(url)
							.then(similars => similars.json())
							.then((similars) => {
								this.similars = similars;
							});
					},
					
				},
				template
			});
		});
});
