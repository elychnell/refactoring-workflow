import './style.scss';
import { createHtml } from './src/js/createHtml.js';
import { toggleLightMode } from './src/js/toggleDarkmode.js';

function init() {
	toggleLightMode();
	createHtml();
}

init();
