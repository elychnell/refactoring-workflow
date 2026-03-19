import './style.scss';
import { createHtml } from './src/js/createHtml';
import { toggleLightMode } from './src/js/toggleDarkmode.js';

function init() {
	toggleLightMode();
	createHtml();
}

init();
