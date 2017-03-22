# Coffeekraken s-activate-component <small>{version}</small> [![Build Status](https://travis-ci.org/Coffeekraken/s-activate-component.svg?branch=release/{version})](https://travis-ci.org/Coffeekraken/s-activate-component)

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
5. [Sugar Web Components Documentation](https://github.com/Coffeekraken/sugar/blob/master/doc/webcomponent.md)
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

<a id="readme-browsers-support"></a>
## Browsers support

* Chrome *(latest 2)*
* Firefox *(latest 2)*
* Internet Explorer 10+
* Opera *(latest 2)*
* Safari *(latest 2)*

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
