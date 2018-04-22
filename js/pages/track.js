import { trackUrl } from '../utils.js';

export default Vue.component('Track', (resolve, reject) => {
	fetch('../templates/pages/track.html')
		.then(res => res.text())
		.then((template) => {
			resolve({
				name: 'Track',
				data: function () {
					return {
						baseUrl: trackUrl,
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
			});
		});
});
