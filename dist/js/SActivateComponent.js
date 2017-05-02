Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _SAnchorWebComponent2 = require('coffeekraken-sugar/js/core/SAnchorWebComponent');

var _SAnchorWebComponent3 = _interopRequireDefault(_SAnchorWebComponent2);

var _uniqid = require('coffeekraken-sugar/js/utils/uniqid');

var _uniqid2 = _interopRequireDefault(_uniqid);

var _dispatchEvent = require('coffeekraken-sugar/js/dom/dispatchEvent');

var _dispatchEvent2 = _interopRequireDefault(_dispatchEvent);

var _whenAttribute = require('coffeekraken-sugar/js/dom/whenAttribute');

var _whenAttribute2 = _interopRequireDefault(_whenAttribute);

var _attributesObservable = require('coffeekraken-sugar/js/dom/attributesObservable');

var _attributesObservable2 = _interopRequireDefault(_attributesObservable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

if (!window.sugar) window.sugar = {};
if (!window.sugar._sActivateStack) window.sugar._sActivateStack = {};
if (!window.sugar._sActivateActiveStack) window.sugar._sActivateActiveStack = {};
var _nestedActiveElements = [];

/**
 * @name 	SActivateComponent
 * @extends 	SWebComponent
 * Create links that apply an active class on his target instead of the default link behavior. This can be used to create tabs, accordion, or whatever you want that require to have a class added dynamically by clicking.
 * Features:
 * - Nested support. When a nested target is activated, all the parent ones will be too.
 * - Grouping (tabs, etc...)
 * - History
 * - Toggle
 * - Saving state
 * - And more...
 *
 * @styleguide 	Objects / Activate Link
 * @example 	html
 * <style>
 * 	#my-target { display: none; }
 * 	#my-target.active { display: block; }
 * </style>
 * <a href="#my-target" is="s-activate">Click me to activate the target</a>
 * <div id="my-target">
 * 	I will have an "active" class when the link has been clicked
 * </div>
 *
 * @author 		Olivier Bossel <olivier.bossel@gmail.com>
 */

var SActivateComponent = function (_SAnchorWebComponent) {
	_inherits(SActivateComponent, _SAnchorWebComponent);

	function SActivateComponent() {
		_classCallCheck(this, SActivateComponent);

		return _possibleConstructorReturn(this, (SActivateComponent.__proto__ || Object.getPrototypeOf(SActivateComponent)).apply(this, arguments));
	}

	_createClass(SActivateComponent, [{
		key: 'componentWillMount',


		/**
   * Component will mount
   * @definition 		SWebComponent.componentWillMount
   * @protected
   */
		value: function componentWillMount() {
			_get(SActivateComponent.prototype.__proto__ || Object.getPrototypeOf(SActivateComponent.prototype), 'componentWillMount', this).call(this);
			this._sActivateTargets = null;
			this._sActivateTargetsDisabledTimeout = null;
			this._sActivateNestedItems = [];
			document.body.addEventListener(this._componentNameDash + ':activate', this._componentWillMountBodyActivateListener.bind(this));
		}

		/**
   * Mount component
   * @definition 		SWebComponent.componentMount
   * @protected
   */

	}, {
		key: 'componentMount',
		value: function componentMount() {
			var _this2 = this;

			_get(SActivateComponent.prototype.__proto__ || Object.getPrototypeOf(SActivateComponent.prototype), 'componentMount', this).call(this);

			// stop listening for activate elements that have been activated
			// BEFORE this is mounted
			document.body.removeEventListener(this._componentNameDash + ':activate', this._componentWillMountBodyActivateListener);

			// update references
			this.update();

			// loop on each targets and each active elements to check if need to activate
			// this element. This is to handle when a nested s-activate is inited before this
			var activateCauseOfNestedActivatedItems = false;
			[].forEach.call(this._sActivateTargets, function (target) {
				if (activateCauseOfNestedActivatedItems) return;
				_this2._sActivateNestedItems.forEach(function (activateItem) {
					if (target.contains(activateItem)) {
						_this2._activate();
						activateCauseOfNestedActivatedItems = true;
					}
				});
			});
			// reset activate nested items (just to be sure)
			this._sActivateNestedItems = [];

			// handle history if needed
			if (this.props.history) {
				this._handleHistory();
			}

			// if we don't have any group yet
			if (!this._getGroup(this)) {
				this.setProp('group', 'group-' + Math.round(Math.random() * 99999999));
			}

			// listen for trigger (click, mouseover, etc...)
			this.addEventListener(this.props.trigger, this._onTriggerElement.bind(this));

			// if we are on mobile and we listen for a touchmove, we cancel the event
			if ('ontouchstart' in window) {
				this.addEventListener('touchstart', function (e) {
					_this2._isTouchMoved = false;
				});
				this.addEventListener('touchmove', function (e) {
					_this2._isTouchMoved = true;
				});
			}

			// listen for the activate event on the body to check if we need to unactivate
			// this
			document.body.addEventListener(this._componentNameDash + ':activate', function (e) {
				window.sugar._sActivateActiveStack[e.detail.group] = e.detail.id;
				if (e.detail.group === _this2.props.group && e.detail.id !== _this2.props.id) {
					_this2.unactivate();
				}
			});

			// check on init if another element of the same group is already activated
			// to unactivate this
			if (window.sugar._sActivateActiveStack[this.props.group] && window.sugar._sActivateActiveStack[this.props.group] !== this.props.id) {
				this.unactivate();
			}

			// listen for childs behin activated
			[].forEach.call(this._sActivateTargets, function (target) {
				target.addEventListener(_this2._componentNameDash + ':activate', _this2._onTargetActivate.bind(_this2), true);
			});

			// check if has an unactivate trigger
			var unactivate_trigger = this.props.unactivateTrigger;
			if (unactivate_trigger) {
				this.addEventListener(unactivate_trigger, this._onElmUnactivate.bind(this));
				if (unactivate_trigger == 'mouseleave' || unactivate_trigger == 'mouseout') {
					[].forEach.call(this._sActivateTargets, function (target) {
						target.addEventListener('mouseenter', _this2._onTargetMouseEnter.bind(_this2));
						target.addEventListener(unactivate_trigger, _this2._onTargetUnactivate.bind(_this2));
					});
				}
			}

			// manage the active class
			if (this.classList.contains(this.props.activeClass)) {
				// activate the targets
				// but to not dispatch any events etc...
				[].forEach.call(this._sActivateTargets, function (target) {
					target.classList.add(_this2.props.activeTargetClass || _this2.props.activeClass);
				});
			}
			setTimeout(function () {
				// check with hash if need to activate the element
				if (_this2.props.hash) {
					var hash = document.location.hash;
					if (hash) {
						if (hash.substr(1) === _this2.props.id) {
							_this2._activate();
						}
					}
				}
			});
			// restore state
			this._restoreState();
		}

		/**
   * Component unmount
   * @definition 		SWebComponent.componentUnmount
   * @protected
   */

	}, {
		key: 'componentUnmount',
		value: function componentUnmount() {
			var _this3 = this;

			_get(SActivateComponent.prototype.__proto__ || Object.getPrototypeOf(SActivateComponent.prototype), 'componentUnmount', this).call(this);
			// listen for trigger (click, mouseover, etc...)
			this.removeEventListener(this.props.trigger, this._onTriggerElement);
			// remove all the classes
			this.classList.remove(this.props.activeClass);
			[].forEach.call(this._sActivateTargets, function (target) {
				// remove the class from targets
				target.classList.remove(_this3.props.activeTargetClass || _this3.props.activeClass);
				// stop listening for activate event
				target.removeEventListener(_this3._componentNameDash + ':activate', _this3._onTargetActivate, true);
			});
			[].forEach.call(this._sActivateTargets, function (target) {
				if (target._sActivateAttributesObservable) {
					target._sActivateAttributesObservable.unsubscribe();
				}
			});
			if (this.props.unactivateTrigger) {
				this.removeEventListener(this.props.unactivateTrigger, this._onElmUnactivate);
				[].forEach.call(this._sActivateTargets, function (target) {
					target.removeEventListener('mouseenter', _this3._onTargetMouseEnter);
					target.removeEventListener(_this3.props.unactivateTrigger, _this3._onTargetUnactivate);
				});
			}
		}

		/**
   * Component will receive prop
   * @definition 		SWebComponent.componentWillReceiveProp
   * @protected
   */

	}, {
		key: 'componentWillReceiveProp',
		value: function componentWillReceiveProp(name, newVal, oldVal) {
			var _this4 = this;

			switch (name) {
				case 'href':
					// wait next frame to be sure that we have the last html
					this.mutate(function () {
						_this4.update();
					});
					break;
				case 'class':
					newVal = typeof newVal === 'string' ? newVal : '';
					oldVal = typeof oldVal === 'string' ? oldVal : '';
					var newClasses = newVal.split(' ');
					var oldClasses = oldVal.split(' ');
					if (newClasses.indexOf(this.props.activeClass) !== -1 && oldClasses.indexOf(this.props.activeClass) === -1) {
						// activate the element
						this.activate();
					} else if (newClasses.indexOf(this.props.activeClass) === -1 && oldClasses.indexOf(this.props.activeClass) !== -1) {
						// unactivate the element
						this.unactivate();
					}
					break;
			}
		}

		/**
   * Render the component
   * Here goes the code that reflect the this.props state on the actual html element
   * @definition 		SWebComponent.render
   * @protected
   */

	}, {
		key: 'render',
		value: function render() {
			_get(SActivateComponent.prototype.__proto__ || Object.getPrototypeOf(SActivateComponent.prototype), 'render', this).call(this);
		}
	}, {
		key: '_componentWillMountBodyActivateListener',
		value: function _componentWillMountBodyActivateListener(e) {
			if (this._sActivateNestedItems.indexOf(e.target) === -1) {
				this._sActivateNestedItems.push(e.target);
			}
		}

		/**
   * On target activate
   */

	}, {
		key: '_onTargetActivate',
		value: function _onTargetActivate(e) {
			// if ( this.props.id === e.detail.id) return;
			if (!this.isComponentMounted()) return;
			// e.stopPropagation();
			// activate the trigger that handle this target
			if (this.props.id !== e.detail.id && e.target._sActivateTrigger && e.target._sActivateTrigger !== this) {
				this._activate();
			}
		}

		/**
   * On element trigger is launched
   */

	}, {
		key: '_onTriggerElement',
		value: function _onTriggerElement(e) {
			var _this5 = this;

			e.preventDefault();
			if (this.props.disabled) return;

			// if is touch moved, means that we need to stop here cause the user does not
			// have make a tap, but instead has swiped, or something else...
			if (this._isTouchMoved) return;

			clearTimeout(this._activateTimeout);
			this._activateTimeout = setTimeout(function () {

				// if the target is the element itself
				// we stop if the current target if not
				// the element itselg to avoid issues
				if (_this5._sActivateTargets.length === 1 && _this5._sActivateTargets[0] === _this5) {
					if (e.target !== _this5) return;
				}

				// clear unactivate timeout
				clearTimeout(_this5._unactivateTimeout);
				// if toggle
				if (_this5.props.toggle && _this5.isActive()) {
					// unactivate
					_this5.unactivate();
					// check if has a hash
					if (_this5.props.history) {
						window.history.back();
					}
				} else {
					if (_this5.props.history) {
						// simply activate again if the same id that hash
						// this can happened when an element has history to false
						if (document.location.hash && document.location.hash === _this5.props.id) {
							_this5._activate();
						} else {
							// simply change the hash
							// the event listener will take care of activate the
							// good element
							if (_this5.props.preventScroll) {
								window.history.pushState(null, null, '' + (document.location.pathname || '') + (document.location.search || '') + '#' + _this5.props.id);
								(0, _dispatchEvent2.default)(window, 'hashchange');
							} else {
								document.location.hash = '' + _this5.props.id;
							}
						}
					} else {
						// activate the element
						_this5._activate();
					}
				}
			}, this.props.activateTimeout);
		}

		/**
   * Element unactivate
   */

	}, {
		key: '_onElmUnactivate',
		value: function _onElmUnactivate(e) {
			var _this6 = this;

			clearTimeout(this._unactivateTimeout);
			clearTimeout(this._activateTimeout);
			this._unactivateTimeout = setTimeout(function () {
				_this6.unactivate();
			}, this.props.unactivateTimeout);
		}

		/**
   * Targer mouseenter callback
   */

	}, {
		key: '_onTargetMouseEnter',
		value: function _onTargetMouseEnter(e) {
			// clear the unactivate timeout
			clearTimeout(this._unactivateTimeout);
		}

		/**
   * Target uncactivate callback
   */

	}, {
		key: '_onTargetUnactivate',
		value: function _onTargetUnactivate(e) {
			var _this7 = this;

			clearTimeout(this._unactivateTimeout);
			this._unactivateTimeout = setTimeout(function () {
				_this7.unactivate();
			}, this.props.unactivateTimeout);
		}

		/**
   * Get target
   */

	}, {
		key: '_getTargetsSelector',
		value: function _getTargetsSelector(elm) {
			return elm._targetsSelector;
		}

		/**
   * Get group
   */

	}, {
		key: '_getGroup',
		value: function _getGroup(elm) {
			// if (this.props.group) return this.props.group;
			return elm.props.group;
			// return elm.getAttribute(this._componentNameDash+'-group') || elm.getAttribute('data-'+this._componentNameDash+'-group');
		}

		/**
   * Check if is active
   */

	}, {
		key: 'isActive',
		value: function isActive() {
			return this.classList.contains(this.props.activeClass);
		}

		/**
   * Activate the element
   */

	}, {
		key: '_activate',
		value: function _activate() {
			var _this8 = this;

			// prevent from activate multiple times
			if (this.isActive()) return;

			// before activate callback
			this.props.beforeActivate && this.props.beforeActivate(this);

			// save the state
			this._saveState(true);

			// activate the element
			this.classList.add(this.props.activeClass);

			// activate all the targets
			[].forEach.call(this._sActivateTargets, function (target) {
				_this8.activateTarget(target);
				// dispatch an event to tell parents that this target is activated
				(0, _dispatchEvent2.default)(target, _this8._componentNameDash + ':activate', {
					id: _this8.props.id,
					group: _this8.props.group
				});
			});

			// callback
			this.props.afterActivate && this.props.afterActivate(this);
		}

		/**
   * Activate a target element
   * @param 		{HTMLElement} 		target 			The target to activatee
   */

	}, {
		key: 'activateTarget',
		value: function activateTarget(target) {
			if (target !== this && target.activate && typeof target.activate === 'function') target.activate();else {
				// remove the active class on target
				target.classList.add(this.props.activeTargetClass || this.props.activeClass);
			}
		}

		/**
   * Unactivate a target element
   * @param 		{HTMLElement} 		target 			The target to activatee
   */

	}, {
		key: 'unactivateTarget',
		value: function unactivateTarget(target) {
			if (target !== this && target.unactivate && typeof target.unactivate === 'function') target.unactivate();else {
				// remove the active class on target
				target.classList.remove(this.props.activeTargetClass || this.props.activeClass);
			}
		}

		/**
   * Handle history
   */

	}, {
		key: '_handleHistory',
		value: function _handleHistory() {
			var _this9 = this;

			window.addEventListener('hashchange', function (e) {
				_this9._processHistoryChange();
			});
			window.addEventListener('popstate', function (e) {
				_this9._processHistoryChange();
			});
		}

		/**
   * Process history change
   */

	}, {
		key: '_processHistoryChange',
		value: function _processHistoryChange() {
			// clearTimeout(this._processHistoryChangeTimeout);
			// this._processHistoryChangeTimeout = setTimeout(() => {
			var hash = document.location.hash;
			if (hash) {
				if (hash.substr(1) === this.props.id) {
					this._activate();
				}
			}
			// });
		}

		/**
   * Activate the element
   */

	}, {
		key: 'activate',
		value: function activate() {
			if (this.props.history) {
				if (this.props.preventScroll) {
					window.history.pushState(null, null, '#' + this.props.id);
					(0, _dispatchEvent2.default)(window, 'hashchange');
				} else {
					document.location.hash = this.props.id;
				}
			} else {
				// activate simply
				this._activate();
			}
		}

		/**
   * Unactive
   */

	}, {
		key: 'unactivate',
		value: function unactivate() {
			var _this10 = this;

			// prevent from unactivate multiple times
			if (!this.isActive()) return;

			// before unactivate
			this.props.beforeUnactivate && this.props.onBeforeUnactivate(this);

			// save the state
			this._saveState(false);

			// unactive the item itself
			this.classList.remove(this.props.activeClass);

			// unactive targets
			if (this._sActivateTargets instanceof NodeList) {
				[].forEach.call(this._sActivateTargets, function (target) {
					_this10.unactivateTarget(target);
					// dispatch an event to tell parents that this target is unactivated
					(0, _dispatchEvent2.default)(target, _this10._componentNameDash + ':unactivate', {
						id: _this10.props.id,
						group: _this10.props.group
					});
				});
			}

			// callback
			this.props.afterUnactivate && this.props.afterUnactivate(this);
		}

		/**
   * Save the state
   * @param 		{Boolean} 		activated 		The activate status
   */

	}, {
		key: '_saveState',
		value: function _saveState(activated) {
			if (!this.props.id) return;
			// check the save state method
			switch (this.props.saveState) {
				case 'sessionStorage':
					sessionStorage.setItem(this._componentNameDash + '-' + this.props.id, activated);
					break;
				case 'localStorage':
				case true:
					localStorage.setItem(this._componentNameDash + '-' + this.props.id, activated);
					break;
			}
		}

		/**
   * Restore the state
   */

	}, {
		key: '_restoreState',
		value: function _restoreState() {
			if (!this.props.id) return;
			// check the save state method
			switch (this.props.saveState) {
				case 'sessionStorage':
					if (eval(sessionStorage.getItem(this._componentNameDash + '-' + this.props.id))) {
						this.activate();
					}
					break;
				case 'localStorage':
				case true:
					if (eval(localStorage.getItem(this._componentNameDash + '-' + this.props.id))) {
						this.activate();
					}
					break;
			}
		}

		/**
   * Check if all targets are disabled
   */

	}, {
		key: '_checkDisabledTargets',
		value: function _checkDisabledTargets() {
			var allDisabled = true;
			[].forEach.call(this._sActivateTargets, function (target) {
				if (!target.hasAttribute('disabled')) {
					allDisabled = false;
				}
			});
			if (allDisabled) {
				this.setProp('disabled', true);
			} else {
				this.setProp('disabled', false);
			}
		}

		/**
   * Update targets, etc...
   * @param 		{HTMLElement} 		[scope=document.body] 			The scope to update
   */

	}, {
		key: 'update',
		value: function update() {
			var _this11 = this;

			var scope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;


			// target
			var targetsSelector = this.props.targets || this.props.href;

			// remove # at start of targetsSelector
			if (targetsSelector && targetsSelector.substr(0, 1) === '#') {
				targetsSelector = targetsSelector.substr(1);
			}

			// if the targetsSelector is an id
			// and the setting "id" is not set
			// set the setting with the targetsSelector id
			if (!this.props.id && typeof targetsSelector === 'string') {
				this.setProp('id', targetsSelector);
			} else if (!this.props.id) {
				this.setProp('id', (0, _uniqid2.default)());
			}

			// if don't have any targetsSelector
			// mean that it's the element itself
			// so check if already an id
			// otherwise, set a new one
			if (!targetsSelector) {
				var id = this._componentNameDash + '-' + (0, _uniqid2.default)();
				if (!this.props.id) {
					this.setProp('id', id);
				}
				targetsSelector = id;
			}

			// save in stack id an id exist
			if (this.props.id) {
				window.sugar._sActivateStack[this.props.id] = this;
			}

			// update the targetsSelectors array
			if (targetsSelector) {
				this._sActivateTargets = scope.querySelectorAll('#' + targetsSelector + ',[' + this._componentNameDash + '-target="' + targetsSelector + '"]');
				[].forEach.call(this._sActivateTargets, function (t) {
					// observe disable attribute on the target
					if (!t._sActivateAttributesObservable) {
						t._sActivateAttributesObservable = (0, _attributesObservable2.default)(t, {
							attributeFilter: ['disabled']
						}).subscribe(function (mutation) {
							clearTimeout(_this11._sActivateTargetsDisabledTimeout);
							_this11._sActivateTargetsDisabledTimeout = setTimeout(function () {
								_this11._checkDisabledTargets();
							});
						});
					}
					t._sActivateTrigger = _this11;
				});
				// check disabled targets first time
				this._checkDisabledTargets();
			} else {
				this._sActivateTargets = [];
			}

			// save the selector
			this._targetsSelector = targetsSelector;
		}
	}], [{
		key: 'defaultCss',


		/**
   * Css
   * @protected
   */
		value: function defaultCss(componentName, componentNameDash) {
			return '\n\t\t\t' + componentNameDash + ' {\n\t\t\t\tdisplay : block;\n\t\t\t}\n\t\t';
		}
	}, {
		key: 'defaultProps',


		/**
   * Default props
   * @definition 		SWebComponent.defaultProps
   * @protected
   */
		get: function get() {
			return {
				/**
     * Specify the target to activate. A target can be an HTMLElement with an id or an s-activate-target="{id}" attribute.
     * @prop
     * @type	{String}
     */
				href: null,

				id: null,
				class: null,

				/**
     * Specify the targets of the activate link if want to override the href one
     * @prop
     * @type 	{String}
     */
				targets: null,

				/**
     * Specify the group in which this activate element lives. This is useful to create things like tabs, accordion, etc...
     * Basicaly, when an item of the same group is activated, the others will be unactivate automatically.
     * @prop
     * @type 	{String}
     */
				group: null,

				/**
     * Specify the class that will be applied on the targets when this component is activated
     * @prop
     * @type	{String}
     */
				activeTargetClass: null,

				/**
     * Specify the class that will be applied on this component and on the targets when this component is activated
     * @prop
     * @type 	{String}
     */
				activeClass: 'active',

				/**
     * Set if want the component set his id in the URL
     * @prop
     * @type 	{Boolean}
     */
				history: true,

				/**
     * Set if need to check the URL at start to activate the component if needed
     * @prop
     * @type	{Boolean}
     */
				hash: true,

				/**
     * Set if want that the component unactivate itself when click on it when activated
     * @prop
     * @type 		{Boolean}
     */
				toggle: false,

				/**
     * Specify which event will activate the component
     * @prop
     * @type  	{String}
     */
				trigger: 'click',

				/**
     * Specify if the activate component is disabled, in which case it will not activate any targets when clicked
     * @prop
     * @type 	{Boolean}
     */
				disabled: false,

				/**
     * Specify if and how the state of the component will be saved. It can be true/localStorage, or sessionStorage
     * @prop
     * @type 	{String|Boolean}
     */
				saveState: false,

				/**
     * Specify the event that will unactivate the component. By default, it's the same as the trigger property
     * @prop
     * @type 	{String}
     */
				unactivateTrigger: null,

				/**
     * Specify a timeout before actually activating the component
     * @prop
     * @type 	{Number}
     */
				activateTimeout: 0,

				/**
     * Specify a timeout before actually unactivate the component
     * @prop
     * @type	{Number}
     */
				unactivateTimeout: 200,

				/**
     * Specify if need to prevent the scroll when clicking on the component. This is useful when the "history" property is set to true and need to prevent the scroll to happened.
     * The url will be set using the window.history.pushState instead of the location.hash.
     * @prop
     * @type 	{Boolean}
     */
				preventScroll: false,

				/**
     * Callback called just before the component is bein activated
     * @prop
     * @type	{Function}
     */
				beforeActivate: null,

				/**
     * Callback called just after the component is bein activated
     * @prop
     * @type	{Function}
     */
				afterActivate: null,

				/**
     * Callback called just before the component is bein unactivated
     * @prop
     * @type	{Function}
     */
				beforeUnactivate: null,

				/**
     * Callback called just after the component is bein unactivated
     * @prop
     * @type	{Function}
     */
				afterUnactivate: null
			};
		}

		/**
   * Mount dependencies
   * @protected
   */

	}, {
		key: 'mountDependencies',
		get: function get() {
			return [function () {
				return (0, _whenAttribute2.default)(this, 'href');
			}];
		}

		/**
   * Physical props
   * @definition 		SWebComponent.physicalProps
   * @protected
   */

	}, {
		key: 'physicalProps',
		get: function get() {
			return ['group', 'disabled'];
		}
	}]);

	return SActivateComponent;
}(_SAnchorWebComponent3.default);

exports.default = SActivateComponent;