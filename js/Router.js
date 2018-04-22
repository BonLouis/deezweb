import Home from './pages/home.js';
import Search from './pages/search.js';
import Artist from './pages/artist.js';
import Album from './pages/album.js';
import Track from './pages/track.js';
import Favs from './pages/favs.js';

export default new VueRouter({
	routes: [{
		name: 'home',
		path: '/',
		component: Home
	}, {
		path: '/search',
		component: Search,
	}, {
		path: '/search/:search/:showTab?',
		name: 'quickSearch',
		component: Search,
		props: true,
	}, {
		path: '/search/:search/:order',
		name: 'quickSearchWithOrder',
		component: Search,
		props: true,
	}, {
		name: 'artist',
		path: '/artist/:id/:showTab?',
		component: Artist,
		props: true,
	}, {
		name: 'album',
		path: '/album/:id',
		component: Album,
		props: true
	}, {
		name: 'favs',
		path: '/favs/:showTab?',
		component: Favs
	}]
});
