import { mixins } from '../utils.js';

export default Vue.component('tabs-menu', (resolve, reject) => {
	fetch('../../templates/components/tabsMenu.html')
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
				watch: {
					'$route.params.showTab': function() {
						this.showTab(this.$route.params.showTab);
					}
				},
				created() {
					const arr = /,/.test(this.headers) ? this.headers.split(', ') : this.headers.split(' ');
					for (const title of arr) {
						this.titles.push(title);
					}
					if (this.activeTab === '') {
						this.activeTab = this.$route.params.showTab || this.titles[0];
					}
				},
				filters: {
					toUp: y => y.replace(/^\w/, x => x.toUpperCase()).replace(/-/g, ' ')
				},
				methods: {
					showTab: function (title) {
						this.$router.push({
							name: this.$route.name,
							params: {
								showTab: title
							}
						});
						this.activeTab = title || this.titles[0];
					}
				},
				template
			});
		});
});
