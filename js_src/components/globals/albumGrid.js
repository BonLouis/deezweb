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
