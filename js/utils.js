const searchAllUrl = 'https://api.deezer.com/search?q=query&output=jsonp';
const searchArtistUrl = 'https://api.deezer.com/search/artist?q=query&output=jsonp';
const searchAlbumUrl = 'https://api.deezer.com/search/album?q=query&output=jsonp';
const artistUrl = 'https://api.deezer.com/artist/query?output=jsonp';
const albumUrl = 'https://api.deezer.com/album/query?output=jsonp';
const trackUrl = 'https://api.deezer.com/track/query?output=jsonp';

const isAnEmptyObject = (obj) => {
	for (const key in obj) {
		return false;
	}
	return true;
};
// A mixin to pass to all components
const mixins = {
	created() {
		// Inject css once when component is created
		if (!document.querySelector(`#_injected__${this.$options.name}`)) {
			const css = document.createElement('link');
			const head = document.querySelector('head');
			css.setAttribute('rel', 'stylesheet');
			css.setAttribute('href', `css/${this.$options.name}.css`);
			css.setAttribute('id', `_injected__${this.$options.name}`);
			head.appendChild(css);
			console.log(`${this.$options.name}.css injected`);
		}
	}
};
export {
	searchAllUrl,
	searchArtistUrl,
	searchAlbumUrl,
	artistUrl,
	albumUrl,
	trackUrl,
	//
	mixins,
	isAnEmptyObject
};
