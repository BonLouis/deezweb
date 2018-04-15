import { mixins, artistUrl } from '../../js/utils.js';
// import Discographie from '../locals/discographie.js';
// debugger;
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
					tops: function () {
						const headerTop = document.querySelector('#header-top');
						// const pickATrack = Math.random() * this.limit >> 0;
						// headerTop.style.backgroundImage = `url(${this.top.data[pickATrack].album.cover_big})`;
						headerTop.style.backgroundImage = `url(${this.tops.data[0].album.cover_xl})`;
					}
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
						console.log(this.url);
						fetchJsonp(this.url)
							.then(artist => artist.json())
							.then((artist) => {
								this.artist = artist;
							});
					},
					loadTop() {
						const url = this.url.replace(/\?/, `/top?limit=${this.limit}&`);
						console.log(url);

						fetchJsonp(url)
							.then(tops => tops.json())
							.then((tops) => {
								this.tops = tops;
							});
					},
					loadAlbums() {
						const url = this.url.replace(/\?/, '/albums&');
						console.log(url);
						fetchJsonp(url)
							.then(albums => albums.json())
							.then((albums) => {
								this.albums = albums;
							});
					},
					loadSimilars() {
						const url = this.url.replace(/\?/, '/related&');
						console.log(url);
						fetchJsonp(url)
							.then(similars => similars.json())
							.then((similars) => {
								this.similars = similars;
							});
					},
				},
				template,
				/**
				 * Locals components
				 */
				components: {
					
				}
			});
		});
});
