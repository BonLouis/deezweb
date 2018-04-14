import { artistUrl } from '../../js/utils.js';
// import Discographie from '../locals/discographie.js';
// debugger;
export default Vue.component('Artist', (resolve) => {
	fetch('../templates/pages/artist.html')
		.then(res => res.text())
		.then((template) => {
			resolve({
				name: 'artist',
				props: ['id'],
				data: function () {
					return {
						baseUrl: artistUrl,
						data: {},
						bests: {},
						limit: 20
					};
				},
				created() {
					this.loadArtist();
					this.$root.injectCss('artist');
				},
				destroyed() {
					this.$root.ejectCss();
				},
				watch: {
					bests: function () {
						const headerTop = document.querySelector('#header-top');
						// const pickATrack = Math.random() * this.limit >> 0;
						// headerTop.style.backgroundImage = `url(${this.bests.data[pickATrack].album.cover_big})`;
						headerTop.style.backgroundImage = `url(${this.bests.data[0].album.cover_xl})`;
					}
				},
				methods: {
					loadArtist() {
						let fullSearch = '';
						fullSearch = this.baseUrl.replace('query', this.id);
						fetchJsonp(fullSearch)
							.then(data => data.json())
							.then((data) => {
								this.data = data;
								this.loadBests();
								// this.getLastAlbum();
							});
					},
					loadBests() {
						const url = (`${this.data.tracklist}&output=jsonp`).replace('limit=50', `limit=${this.limit}`);
						fetchJsonp(url)
							.then(data => data.json())
							.then((data) => {
								this.bests = data;
							});
					},
				},
				template,
				/**
				 * Locals components
				 */
				components: {
					discographie: resolveDisc => fetch('../templates/locals/discographie.html')
						.then(disc => disc.text())
						.then(disc => resolveDisc({
							template: disc,
							data: function () {
								return {
									title: 'Discooo'
								};
							}
						})),
					'top-titres': resolveTop => fetch('../templates/locals/top-titres.html')
						.then(top => top.text())
						.then(top => resolveTop({
							template: top,
							data: function () {
								return {
									title: 'Zetop'
								};
							}
						})),
					'artistes-similaires': resolveSim => fetch('../templates/locals/artistes-similaires.html')
						.then(sim => sim.text())
						.then(sim => resolveSim({
							template: sim,
							data: function () {
								return {
									title: 'Likely'
								};
							}
						})),
				}
			});
		});
});
