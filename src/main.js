import App from './App.html';
import { globalStore } from './stores/globalStore';

const app = new App({
	target: document.body,
	store: globalStore
});

window.app = app;

export default app;