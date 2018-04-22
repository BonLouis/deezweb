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
				data: function () {
					return {
						showBtnArray: []
					};
				},
				methods: {
					toggleShowBtn: function(id) {
						if (this.showBtnArray.indexOf(id) !== -1) {
							this.showBtnArray.splice(this.showBtnArray.indexOf(id), 1);
						} else {
							this.showBtnArray.push(id);
						}
					}
				}
			});
		});
});
