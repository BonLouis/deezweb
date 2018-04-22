export default Vue.component('album-grid', (resolve) => {
	fetch('../../templates/locals/album-grid.html')
		.then(albs => albs.text())
		.then((albs) => {
			resolve({
				name: 'album-grid',
				template: albs,
				props: {
					// Contain the results for the "tout" tab
					albums: {
						type: Object,
						required: true
					},
					release: {
						type: Boolean,
						required: false
					}
				}
			});
		});
});
