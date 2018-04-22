export default Vue.component('Home', (resolve, reject) => {
	fetch('../templates/pages/home.html')
		.then(res => res.text())
		.then((template) => {
			resolve({
				name: 'home',
				data: function () {
					return {};
				},

				methods: {

				},
				template
			});
		});
});
