# Coffeekraken s-activate-component <img src=".resources/coffeekraken-logo.jpg" height="25px" />

<p>
	<a href="https://travis-ci.org/Coffeekraken/s-activate-component">
		<img src="https://img.shields.io/travis/Coffeekraken/s-activate-component.svg?style=flat-square" />
	</a>
	<a href="https://www.npmjs.com/package/coffeekraken-s-activate-component">
		<img src="https://img.shields.io/npm/v/coffeekraken-s-activate-component.svg?style=flat-square" />
	</a>
	<a href="https://github.com/coffeekraken/s-activate-component/blob/master/LICENSE.txt">
		<img src="https://img.shields.io/npm/l/coffeekraken-s-activate-component.svg?style=flat-square" />
	</a>
	<!-- <a href="https://github.com/coffeekraken/s-activate-component">
		<img src="https://img.shields.io/npm/dt/coffeekraken-s-activate-component.svg?style=flat-square" />
	</a>
	<a href="https://github.com/coffeekraken/s-activate-component">
		<img src="https://img.shields.io/github/forks/coffeekraken/s-activate-component.svg?style=social&label=Fork&style=flat-square" />
	</a>
	<a href="https://github.com/coffeekraken/s-activate-component">
		<img src="https://img.shields.io/github/stars/coffeekraken/s-activate-component.svg?style=social&label=Star&style=flat-square" />
	</a> -->
	<a href="https://twitter.com/coffeekrakenio">
		<img src="https://img.shields.io/twitter/url/http/coffeekrakenio.svg?style=social&style=flat-square" />
	</a>
	<a href="http://coffeekraken.io">
		<img src="https://img.shields.io/twitter/url/http/shields.io.svg?style=flat-square&label=coffeekraken.io&colorB=f2bc2b&style=flat-square" />
	</a>
</p>

Simple ```<a>``` webcomponent extension that give the ability to activate a target element by adding/removing a class on it. Useful to create some toggle, tabs, etc... behaviors.

## Features

1. Add an "active" class on the target
2. Support for "toggle" option
3. Support for activating the target that match the url hash
4. Support for history
5. Support different triggers like "click", "mouseover", etc...
6. Support saving the state between page loads
7. A nested target will activate automatically his parents when needed
7. And more...

## Table of content

1. **[Demo](http://components.coffeekraken.io/app/s-activate-component)**
2. [Install](#readme-install)
3. [Get Started](#readme-get-started)
4. [Javascript API](doc/js)
5. [Sugar Web Components Documentation](https://github.com/Coffeekraken/sugar/blob/master/doc/js/webcomponents.md)
6. [Browsers support](#readme-browsers-support)
7. [Contribute](#readme-contribute)
8. [Who are Coffeekraken?](#readme-who-are-coffeekraken)
9. [Licence](#readme-license)

<a name="readme-install"></a>
## Install

```
npm install coffeekraken-s-activate-component --save
```

<a name="readme-get-started"></a>
## Get Started

First, import the component into your javascript file like so:

```js
import SActivateComponent from 'coffeekraken-s-activate-component'
```

Then simply use it inside your html like so:

```html
<a href="#my-cool-element" is="s-activate">
	click to activate #my-cool-element
</a>
<div id="my-cool-element">
	I will have the class "active" when activated
</div>
```

## CSS Variables

This webcomponent make use of some css variables. Here's the list:

- `--s-activate-trigger` : Specify the trigger to use to activate the component. Do not use quotes.
- `--s-activate-unactivate-trigger` : Specify the trigger to use to unactivate the component. Do not use quotes.
- `--s-activate-trigger-touch` : Specify the trigger to use to activate the component on touch devices. Do not use quotes.
- `--s-activate-unactivate-trigger-touch` : Specify the trigger to use to unactivate the component on touch devices. Do not use quotes.

Here's an example:

```scss
.my-cool-activate-button {
  --s-activate-trigger: mouseover;

  @media (max-width: 600px) {
    --s-activate-trigger: click;
  }
}
```

<a id="readme-browsers-support"></a>
## Browsers support

| <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" /></br>IE / Edge | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" /></br>Firefox | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" /></br>Chrome | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" /></br>Safari |
| --------- | --------- | --------- | --------- |
| IE11+ | last 2 versions| last 2 versions| last 2 versions

> As browsers are automatically updated, we will keep as reference the last two versions of each but this component can work on older ones as well.

> The webcomponent API (custom elements, shadowDOM, etc...) is not supported in some older browsers like IE10, etc... In order to make them work, you will need to integrate the [corresponding polyfill](https://www.webcomponents.org/polyfills).

<a id="readme-contribute"></a>
## Contribute

This is an open source project and will ever be! You are more that welcomed to contribute to his development and make it more awesome every day.
To do so, you have several possibilities:

1. [Share the love ❤️](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-share-the-love)
2. [Declare issues](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-declare-issues)
3. [Fix issues](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-fix-issues)
4. [Add features](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-add-features)
5. [Build web component](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-build-web-component)

<a id="readme-who-are-coffeekraken"></a>
## Who are Coffeekraken

We try to be **some cool guys** that build **some cool tools** to make our (and yours hopefully) **every day life better**.  

#### [More on who we are](https://github.com/Coffeekraken/coffeekraken/blob/master/who-are-we.md)

<a id="readme-license"></a>
## License

The code is available under the [MIT license](LICENSE.txt). This mean that you can use, modify, or do whatever you want with it. This mean also that it is shipped to you for free, so don't be a hater and if you find some issues, etc... feel free to [contribute](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md) instead of sharing your frustrations on social networks like an asshole...
