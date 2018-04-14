import Home from './pages/home.js';
import Search from './pages/search.js';
import Artist from './pages/artist.js';
import Album from './pages/album.js';
import Track from './pages/track.js';
import Favs from './pages/favs.js';

export default new VueRouter({
	routes: [{
		path: '/',
		component: Home
	}, {
		path: '/search',
		component: Search,
	}, {
		path: '/search/:search/',
		name: 'quickSearch',
		component: Search,
		props: true,
	}, {
		path: '/search/:search/:order',
		name: 'quickSearchWithOrder',
		component: Search,
		props: true,
	}, {
		path: '/search/advanced',
		name: 'advancedSearch',
		component: Search,
	}, {
		path: '/artist/:id',
		component: Artist,
		props: true,
	}, {
		path: '/album/:id',
		component: Album,
		props: true
	}, {
		path: '/track/:id',
		component: Track,
		props: true
	}, {
		path: '/favs',
		component: Favs
	}]
});
