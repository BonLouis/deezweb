import { albumUrl } from '../../js/utils.js';

export default Vue.component('Album', (resolve, reject) => {
	fetch('../templates/pages/album.html')
	.then(res => res.text())
	.then(template => {
		resolve({
			name: 'album',
			data: function () {
				return {
					baseUrl: albumUrl,
					data: {}
				};
			},
			props: ['id'],
			created() {
				this.makeSearch();
			},
			methods: {
				makeSearch() {
					let fullSearch = '';
					fullSearch = this.baseUrl.replace('query', this.id);
					fetchJsonp(fullSearch)
						.then(data => data.json())
						.then((data) => {
							this.data = data;
						});
				},
			},
			template
			
		})
	})

});