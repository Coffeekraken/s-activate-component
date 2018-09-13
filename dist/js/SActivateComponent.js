'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _SAnchorWebComponent2 = require('coffeekraken-sugar/js/core/SAnchorWebComponent');

var _SAnchorWebComponent3 = _interopRequireDefault(_SAnchorWebComponent2);

var _dispatchEvent = require('coffeekraken-sugar/js/dom/dispatchEvent');

var _dispatchEvent2 = _interopRequireDefault(_dispatchEvent);

var _debounce = require('coffeekraken-sugar/js/utils/functions/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

if (!window.sugar) window.sugar = {};
if (!window.sugar._sActivateStack) window.sugar._sActivateStack = {};
if (!window.sugar._sActivateActiveStack) window.sugar._sActivateActiveStack = {};

/**
 * @name    SActivateComponent
 * @extends SWebComponent
 * Create links that apply an active class on his target instead of the default link behavior. This can be used to create tabs, accordion, or whatever you want that require to have a class added dynamically by clicking.
 * Features:
 * - Nested support. When a nested target is activated, all the parent ones will be too.
 * - Grouping (tabs, etc...)
 * - History
 * - Toggle
 * - Saving state
 * - And more...
 *
 * @example html
 * <style>
 *    #my-target { display: none; }
 *    #my-target.active { display: block; }
 * </style>
 * <a href="#my-target" is="s-activate" toggle>Click me to activate the target</a>
 * <div id="my-target">
 *    I will have an "active" class when the link has been clicked
 * </div>
 *
 * @author  Olivier Bossel <olivier.bossel@gmail.com>
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
     * @definition  SWebComponent.componentWillMount
     * @protected
     */
    value: function componentWillMount() {
      _get(SActivateComponent.prototype.__proto__ || Object.getPrototypeOf(SActivateComponent.prototype), 'componentWillMount', this).call(this);
    }

    /**
     * Mount component
     * @definition  SWebComponent.componentMount
     * @protected
     */

  }, {
    key: 'componentMount',
    value: function componentMount() {
      var _this2 = this;

      _get(SActivateComponent.prototype.__proto__ || Object.getPrototypeOf(SActivateComponent.prototype), 'componentMount', this).call(this);

      // make sure we have a target element to work with
      var targetElm = this._getTargetElm();
      if (!targetElm) {
        throw new Error('No HTMLElement correspond to the ' + this.componentNameDash + ' hash "' + this._getTargetHash() + '". The ' + this.componentNameDash + ' component need a proper target to work with...');
      }

      // handleListeners first time
      this._removeAndAddListeners();
      window.addEventListener('resize', (0, _debounce2.default)(function () {
        _this2._removeAndAddListeners();
      }, 250));

      // listen for the enter key
      this.addEventListener('keydown', function (e) {
        if (e.keyCode === 13) {
          // enter
          // prevent default
          e.preventDefault();
          // toggle
          _this2.toggle();
        }
      });

      // listen for hash changes
      this._handleHistory();

      // check hash to activate the component if needed
      this._checkHashAndActivateIfNeeded();

      // check if need to activate myself due to the active class
      if (this.classList.contains(this.props.activeClass)) {
        this._processActivate();
      }

      // restore state if needed
      if (this.props.saveState) this._restoreState();

      // listen for the s-activate:activate event on the target element
      // to activate myself when a nested item if activated
      if (this.props.listenChilds) {
        targetElm.addEventListener(this.componentNameDash + ':activate', this._onNestedComponentActivate.bind(this));
      }

      // if we want to unactivate the component on an outside click
      if (this.props.unactivateOnOutsideClick) {
        this.addEventListener('click', function (e) {
          e.stopPropagation();
        });
        targetElm.addEventListener('click', function (e) {
          e.stopPropagation();
        });
        document.addEventListener('click', function (e) {
          // close the element
          if (_this2.isActive()) _this2.unactivate();
        });
      }
    }

    /**
     * Get the trigger
     */

  }, {
    key: 'getTrigger',
    value: function getTrigger() {
      if ('ontouchstart' in window) return 'touchend';
      var cssTrigger = window.getComputedStyle(this).getPropertyValue('--s-activate-trigger');
      if (cssTrigger) return cssTrigger.trim();
      return this.props.trigger;
    }

    /**
     * Get the unactivate trigger
     */

  }, {
    key: 'getUnactivateTrigger',
    value: function getUnactivateTrigger() {
      if ('ontouchstart' in window) return 'touchend';
      var cssTrigger = window.getComputedStyle(this).getPropertyValue('--s-activate-unactivate-trigger');
      if (cssTrigger) return cssTrigger.trim();
      return this.props.unactivateTrigger;
    }

    /**
     * Add and remove listeners
     */

  }, {
    key: '_removeAndAddListeners',
    value: function _removeAndAddListeners() {

      if (!this._onTriggerFn) {
        this._onTriggerFn = this._onTrigger.bind(this);
      }

      // listen for the trigger
      if (this._oldTrigger) {
        this.removeEventListener(this._oldTrigger, this._onTriggerFn);
      }
      this._oldTrigger = this.getTrigger();
      this.addEventListener(this.getTrigger(), this._onTriggerFn);

      // listen for the unactivate trigger if needed
      if (!this._onUnactivateTriggerFn) {
        this._onUnactivateTriggerFn = this._onUnactivateTrigger.bind(this);
      }
      if (!this._onTargetMouseEnterFn) {
        this._onTargetMouseEnterFn = this._onTargetMouseEnter.bind(this);
      }
      var unactivateTrigger = this.getUnactivateTrigger();
      if (this._oldUnactivateTrigger) {
        this.removeEventListener(this._oldUnactivateTrigger, this._onUnactivateTriggerFn);
      }
      var targetElm = this._getTargetElm();
      targetElm.removeEventListener('mouseenter', this._onTargetMouseEnterFn);
      if (unactivateTrigger) {
        this._oldUnactivateTrigger = unactivateTrigger;
        this.addEventListener(unactivateTrigger, this._onUnactivateTriggerFn);
        if (unactivateTrigger === 'mouseleave' || unactivateTrigger === 'mouseout') {
          targetElm.addEventListener('mouseenter', this._onTargetMouseEnterFn);
          targetElm.addEventListener(this.props.unactivateTrigger, this._onUnactivateTriggerFn);
        }
      }
    }

    /**
     * When the unactivateTrigger is fired
     * @param   {Event}   e   The unactivateTrigger event
     */

  }, {
    key: '_onUnactivateTrigger',
    value: function _onUnactivateTrigger(e) {
      var _this3 = this;

      clearTimeout(this._unactivateTimeout);
      this._unactivateTimeout = setTimeout(function () {
        _this3.unactivate();
      }, this.props.unactivateTimeout);
    }

    /**
     * When the mouse enter the target element
     * @param   {MouseEvent}    e   The mouseenter event
     */

  }, {
    key: '_onTargetMouseEnter',
    value: function _onTargetMouseEnter(e) {
      // clear the unactivate timeout
      clearTimeout(this._unactivateTimeout);
    }

    /**
     * When the unactivateTrigger is fired from the target element
     * @param   {Event}   e   The unactivateTrigger event
     */

  }, {
    key: '_onTargetUnactivateTrigger',
    value: function _onTargetUnactivateTrigger(e) {
      var _this4 = this;

      clearTimeout(this._unactivateTimeout);
      this._unactivateTimeout = setTimeout(function () {
        _this4.unactivate();
      }, this.props.unactivateTimeout);
    }

    /**
     * When a nested component activate itself, I need to activate myself
     * @param   {Event}   e   The custom event
     */

  }, {
    key: '_onNestedComponentActivate',
    value: function _onNestedComponentActivate(e) {
      // make sure it's not myself that dispatch the event
      // to prevent a maximum call stack error
      if (e.target === this._getTargetElm()) return;

      // process to activation
      this._processActivate();
    }

    /**
     * Handle history
     */

  }, {
    key: '_handleHistory',
    value: function _handleHistory() {
      var _this5 = this;

      if (this.props.history) {
        window.addEventListener('hashchange', function (e) {
          _this5._processHistoryChange();
        });
      }
    }

    /**
     * Check the url hash and activate if needed
     */

  }, {
    key: '_checkHashAndActivateIfNeeded',
    value: function _checkHashAndActivateIfNeeded() {
      var _this6 = this;

      setTimeout(function () {
        // check with hash if need to activate the element
        if (_this6.props.hash) {
          var hash = document.location.hash;
          if (hash && hash === _this6._getTargetHash()) {
            _this6._processActivate();
          }
        }
      });
    }

    /**
     * Process history change
     */

  }, {
    key: '_processHistoryChange',
    value: function _processHistoryChange() {
      var hash = document.location.hash;
      if (hash && hash === this._getTargetHash()) {
        this._processActivate();
      }
    }

    /**
     * When the trigger property has been fired on the element
     * @param   {Event}   e   The event
     */

  }, {
    key: '_onTrigger',
    value: function _onTrigger(e) {
      // prevent default behavior
      // mostly when the trigger is "click"
      // cause we handle the hash change by hand
      e.preventDefault();

      // clear the unactivateTimeout
      clearTimeout(this._unactivateTimeout);

      // toggle
      if (this.props.toggle && this.isActive()) {
        this.unactivate();
      } else {
        // activate the element
        this.activate();
      }
    }

    /**
     * Component unmount
     * @definition    SWebComponent.componentUnmount
     * @protected
     */

  }, {
    key: 'componentUnmount',
    value: function componentUnmount() {
      _get(SActivateComponent.prototype.__proto__ || Object.getPrototypeOf(SActivateComponent.prototype), 'componentUnmount', this).call(this);
    }

    /**
     * Component will receive prop
     * @definition    SWebComponent.componentWillReceiveProp
     * @protected
     */

  }, {
    key: 'componentWillReceiveProp',
    value: function componentWillReceiveProp(name, newVal, oldVal) {
      switch (name) {
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
     * Get the hash of the target element
     * @return    {String}    The target element hash
     */

  }, {
    key: '_getTargetHash',
    value: function _getTargetHash() {
      if (this._targetHash) return this._targetHash; // cache strategy

      if (this.props.for) {
        if (this.props.for instanceof window.HTMLElement) {
          this._targetHash = '#' + this.props.for.id;
        } else if (typeof this.props.for === 'string') {
          this._targetHash = ('#' + this.props.for).replace('##', '#');
        }
      } else {
        this._targetHash = ('#' + this.props.href).replace('##', '#');
      }

      return this._targetHash;
    }

    /**
     * Get the target element
     * @return    {HTMLElement}   The target element
     */

  }, {
    key: '_getTargetElm',
    value: function _getTargetElm() {
      if (this._targetElm) return this._targetElm; // cache strategy
      this._targetElm = document.querySelector(this._getTargetHash());
      return this._targetElm;
    }

    /**
     * Get all the component from the same group
     * @return    {Array<SActivateComponent>}   A node list of SActivateComponent elements that are in the same group as me
     */

  }, {
    key: '_getComponentOfTheSameGroup',
    value: function _getComponentOfTheSameGroup() {
      return [].concat(_toConsumableArray(document.querySelectorAll('[is="' + this.componentNameDash + '"][group="' + this.props.group + '"]')));
    }

    /**
     * Get all the component from the same group except me
     * @return    {Array<SActivateComponent>}   A node list of SActivateComponent elements that are in the same group as me
     */

  }, {
    key: '_getComponentOfTheSameGroupExceptMe',
    value: function _getComponentOfTheSameGroupExceptMe() {
      var _this7 = this;

      return this._getComponentOfTheSameGroup().filter(function (elm) {
        return elm !== _this7;
      });
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
     * Activate the component
     */

  }, {
    key: 'activate',
    value: function activate() {
      if (this.props.disabled) return;

      if (this.props.history) {
        if (this.props.preventScroll) {
          window.history.pushState(null, null, this._getTargetHash());
          (0, _dispatchEvent2.default)(window, 'hashchange');
        } else {
          document.location.hash = this._getTargetHash();
        }
      } else {
        // activate simply
        this._processActivate();
      }
    }

    /**
     * Toggle if possible. Otherwise, activate
     */

  }, {
    key: 'toggle',
    value: function toggle() {
      if (this.props.toggle && this.isActive()) {
        this.unactivate();
      } else {
        // activate the element
        this.activate();
      }
    }

    /**
     * Process to the actual activation
     */

  }, {
    key: '_processActivate',
    value: function _processActivate() {
      // do nothing if disabled
      if (this.props.disabled) return;

      // callback
      this.props.beforeActivate && this.props.beforeActivate(this);

      // save the state
      this._saveState(true);

      // activate this component
      this.classList.add(this.props.activeClass);

      // aria expanded
      if (this.hasAttribute('aria-expanded')) {
        this.setAttribute('aria-expanded', true);
      }

      // activate the target element
      var targetElm = this._getTargetElm();
      targetElm.classList.add(this.props.activeTargetClass || this.props.activeClass);

      // dispatch an activate event
      (0, _dispatchEvent2.default)(targetElm, this.componentNameDash + ':activate');

      // unactive the others members of the group
      this._getComponentOfTheSameGroupExceptMe().forEach(function (sActivateComponentElm) {
        sActivateComponentElm.unactivate();
      });

      // callback
      this.props.afterActivate && this.props.afterActivate(this);
    }

    /**
     * Unactive the component
     */

  }, {
    key: 'unactivate',
    value: function unactivate() {
      // clear the activateTimeout
      clearTimeout(this._activateTimeout);

      // do nothing if disabled
      if (this.props.disabled) return;

      // prevent from unactivate multiple times
      if (!this.isActive()) return;

      // before unactivate
      this.props.beforeUnactivate && this.props.beforeUnactivate(this);

      // save the state
      this._saveState(false);

      // unactive the item itself
      this.classList.remove(this.props.activeClass);

      // aria expanded
      if (this.hasAttribute('aria-expanded')) {
        this.setAttribute('aria-expanded', false);
      }

      // unactivate the target
      var targetElm = this._getTargetElm();
      targetElm.classList.remove(this.props.activeTargetClass || this.props.activeClass);

      // check if the hash in the url is the one of this component to remove it
      if (document.location.hash === this._getTargetHash()) {
        window.history.pushState(null, null, '#');
      }

      // callback
      this.props.afterUnactivate && this.props.afterUnactivate(this);
    }

    /**
       * Save the state
       * @param   {Boolean}   activated   The activate status
       */

  }, {
    key: '_saveState',
    value: function _saveState(activated) {
      var hash = this._getTargetHash();
      // check the save state method
      switch (this.props.saveState) {
        case 'sessionStorage':
        case window.sessionStorage:
          window.sessionStorage.setItem(this._componentNameDash + '-' + hash, activated);
          break;
        case 'localStorage':
        case window.localStorage:
        case true:
          window.localStorage.setItem(this._componentNameDash + '-' + hash, activated);
          break;
      }
    }

    /**
     * Restore the state
     */

  }, {
    key: '_restoreState',
    value: function _restoreState() {
      var hash = this._getTargetHash();
      // check the save state method
      switch (this.props.saveState) {
        case 'sessionStorage':
        case window.sessionStorage:
          if (window.sessionStorage.getItem(this._componentNameDash + '-' + hash) === 'true') {
            this.activate();
          }
          break;
        case 'localStorage':
        case window.localStorage:
        case true:
          if (window.localStorage.getItem(this._componentNameDash + '-' + hash) === 'true') {
            this.activate();
          }
          break;
      }
    }
  }], [{
    key: 'defaultCss',


    /**
     * Css
     * @protected
     */
    value: function defaultCss(componentName, componentNameDash) {
      return '\n      ' + componentNameDash + ' {\n        display : block;\n      }\n    ';
    }
  }, {
    key: 'defaultProps',

    /**
     * Default props
     * @definition  SWebComponent.defaultProps
     * @protected
     */
    get: function get() {
      return {
        /**
         * Specify the target to activate. A target is an HTMLElement with an id attribute.
         * @prop
         * @type  {String}
         */
        href: null,

        class: null,

        /**
         * Specify the target of the activate link if want to override the href one
         * @prop
         * @type  {String}
         */
        for: null,

        /**
         * Specify the group in which this activate element lives. This is useful to create things like tabs, accordion, etc...
         * Basicaly, when an item of the same group is activated, the others will be unactivate automatically.
         * @prop
         * @type  {String}
         */
        group: null,

        /**
         * Specify the class that will be applied on the targets when this component is activated
         * @prop
         * @type  {String}
         */
        activeTargetClass: null,

        /**
         * Specify the class that will be applied on this component and on the targets when this component is activated
         * @prop
         * @type  {String}
         */
        activeClass: 'active',

        /**
         * Listen for childs being activated to activate ourself
         * @prop
         * @type  {Boolean}
         */
        listenChilds: false,

        /**
         * Set if we want to unactivate the component on an outside click
         * @prop
         * @type  {Boolean}
         */
        unactivateOnOutsideClick: false,

        /**
         * Set if want the component set his id in the URL
         * @prop
         * @type  {Boolean}
         */
        history: false,

        /**
         * Set if need to check the URL at start to activate the component if needed
         * @prop
         * @type  {Boolean}
         */
        hash: true,

        /**
         * Set if want that the component unactivate itself when click on it when activated
         * @prop
         * @type  {Boolean}
         */
        toggle: false,

        /**
         * Specify which event will activate the component
         * @prop
         * @type  {String}
         */
        trigger: 'click',

        /**
         * Specify if the activate component is disabled, in which case it will not activate any targets when clicked
         * @prop
         * @type  {Boolean}
         */
        disabled: false,

        /**
         * Specify if and how the state of the component will be saved. It can be true/localStorage, or sessionStorage
         * @prop
         * @type  {String|Boolean}
         */
        saveState: false,

        /**
         * Specify the event that will unactivate the component. By default, it's the same as the trigger property
         * @prop
         * @type  {String}
         */
        unactivateTrigger: null,

        /**
         * Specify a timeout before actually unactivate the component
         * @prop
         * @type  {Number}
         */
        unactivateTimeout: 200,

        /**
         * Specify if need to prevent the scroll when clicking on the component. This is useful when the "history" property is set to true and need to prevent the scroll to happened.
         * The url will be set using the window.history.pushState instead of the location.hash.
         * @prop
         * @type  {Boolean}
         */
        preventScroll: true,

        /**
         * Callback called just before the component is bein activated
         * @prop
         * @type  {Function}
         */
        beforeActivate: null,

        /**
         * Callback called just after the component is bein activated
         * @prop
         * @type  {Function}
         */
        afterActivate: null,

        /**
         * Callback called just before the component is bein unactivated
         * @prop
         * @type  {Function}
         */
        beforeUnactivate: null,

        /**
         * Callback called just after the component is bein unactivated
         * @prop
         * @type  {Function}
         */
        afterUnactivate: null
      };
    }

    /**
     * Physical props
     * @definition  SWebComponent.physicalProps
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