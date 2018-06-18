module.exports = {
	// server port
	port : 3000,

	// title
	title : 's-activate-component',

	// layout
	layout : 'right',

	// compile server
	compileServer : {

		// compile server port
		port : 4000

	},

	// editors
	editors : {
		html : {
			language : 'html',
			data : `
			<a class="btn active" href="#tab-1" is="s-activate" group="tabs">Tab 1</a>
			<a class="btn" href="#tab-2" is="s-activate" group="tabs">Tab 2</a>
			<div class="tab" id="tab-1">
				<h1 class="h1 m-b">Tab 1</h1>
				<p class="p">
					Phasellus et enim pharetra, fermentum magna commodo, cursus nunc. In eget ex vitae tortor molestie cursus vitae pulvinar dui. Phasellus venenatis nunc ut neque varius posuere. Aenean mauris quam, ornare.
				</p>
			</div>
			<div class="tab" id="tab-2">
				<h1 class="h1 m-b">Tab 2</h1>
				<p class="p">
					Phasellus et enim pharetra, fermentum magna commodo, cursus nunc. In eget ex vitae tortor molestie cursus vitae pulvinar dui. Phasellus venenatis nunc ut neque varius posuere. Aenean mauris quam, ornare.
				</p>
			</div>
			`
		},
		css : {
			language : 'sass',
			data : `
				@import 'node_modules/coffeekraken-sugar/index';
				@import 'node_modules/coffeekraken-s-typography-component/index';
				@import 'node_modules/coffeekraken-s-button-component/index';
				@include s-init();
				@include s-classes();
				@include s-typography-classes();
				@include s-button-classes();
				body {
					padding: s-space(big);
				}
				.tab {
					display: none;
					padding: s-space(default);
					background: white;
				}
				.tab.active { display: block; }
			`
		},
		js : {
			language : 'js',
			data : `
				import 'webcomponents.js/webcomponents-lite'
				import SActivateComponent from './dist/index'
			`
		}
	}
}
