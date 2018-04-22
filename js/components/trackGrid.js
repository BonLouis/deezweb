export default Vue.component('track-grid', (resolve) => {
	fetch('../../templates/components/track-grid.html')
		.then(data => data.text())
		.then((data) => {
			resolve({
				props: {
					// Contain the results for the "tout" tab
					tracks: {
						type: Object,
						required: true
					},
					// Are we in album mode ?
					mode: {
						type: Boolean,
						required: false,
						default: false
					}
				},
				data: function () {
					return {
						// The titles to iterate through
						titles: this.mode ?
							[
								'#',
								'Titre',
								'Dur.',
								'Pop.'
							] : [
								'Titre',
								'Artiste',
								'Album',
								'Dur.',
								'Pop.'
							],
						class: this.mode ?
							'grid-for-search' :
							'grid-for-album'
					};
				},
				template: data
			});
		});
});
