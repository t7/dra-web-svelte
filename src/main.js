import App from './App.html';
import { locationStore } from './stores';

const app = new App({
	target: document.body,
	data: {
		name: 'worldsss'
	},
	store: locationStore
});

window.app = app;

export default app;