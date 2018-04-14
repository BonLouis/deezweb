const searchUrl = 'https://api.deezer.com/search?q=query&output=jsonp';
const artistUrl = 'https://api.deezer.com/artist/query?output=jsonp';
const albumUrl = 'https://api.deezer.com/album/query?output=jsonp';
const trackUrl = 'https://api.deezer.com/track/query?output=jsonp';

const isAnEmptyObject = (obj) => {
	for (const key in obj) {
		return false;
	}
	return true;
};

export { searchUrl, artistUrl, albumUrl, trackUrl, isAnEmptyObject };
