import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

const dev = process.env.NODE_ENV === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),
	dev: dev,
	// we'll extract any component CSS out into
	// a separate file — better for performance
	css: css => css.write('build/bundle.css'),
	kit: {
		adapter: adapter(),

		// hydrate the <div id="svelte"> element in src/app.html
		//target: '#svelte',

		paths: {
			base: dev ? '' : ''
		},
		appDir: 'internal',
		files: {lib: 'src/lib', routes: 'src/routes'}
	}
};

export default config;
