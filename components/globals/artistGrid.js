export default Vue.component('artist-grid', (resolveArts) => {
	fetch('../../templates/locals/artist-grid.html')
		.then(arts => arts.text())
		.then((arts) => {
			resolveArts({
				name: 'artist-grid',
				template: arts,
				props: {
					// Contain the results for the "tout" tab
					artists: {
						type: Object,
						required: true
					}
				},
				filters: {
					addSpace: int => int.toLocaleString()
				},
			});
		});
});
