import { mixins } from '../../js/utils.js';

export default Vue.component('tabs-menu', (resolve, reject) => {
	fetch('../templates/globals/tabsMenu.html')
		.then(res => res.text())
		.then((template) => {
			resolve({
				name: 'tabs-menu',
				mixins: [mixins],
				props: ['headers'],
				data: function () {
					return {
						asyncProps: [],
						titles: [],
						activeTab: ''
					};
				},
				created() {
					const arr = /,/.test(this.headers) ? this.headers.split(', ') : this.headers.split(' ');
					for (const title of	arr) {
						this.titles.push(title);
						if (this.activeTab === '') {
							this.activeTab = title;
						}
					}
				},
				filters: {
					toUp: y => y.replace(/^\w/, x => x.toUpperCase()).replace(/-/g, ' ')
				},
				methods: {
					showTab: function(title) {
						this.activeTab = title;
					}
				},
				template
			});
		});
});
