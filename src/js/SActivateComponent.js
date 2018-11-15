import SAnchorWebComponent from 'coffeekraken-sugar/js/core/SAnchorWebComponent'
import __dispatchEvent from 'coffeekraken-sugar/js/dom/dispatchEvent'
import __debounce from 'coffeekraken-sugar/js/utils/functions/debounce'

if (!window.sugar) window.sugar = {}
if (!window.sugar._sActivateStack) window.sugar._sActivateStack = {}
if (!window.sugar._sActivateActiveStack) window.sugar._sActivateActiveStack = {}

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

export default class SActivateComponent extends SAnchorWebComponent {
  /**
   * Default props
   * @definition  SWebComponent.defaultProps
   * @protected
   */
  static get defaultProps () {
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
       * Specify which event will activate the component on touch devices
       * @prop
       * @type    {String}
       */
      triggerTouch: 'click',

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
       * Specify the event that will unactivate the component.
       * @prop
       * @type  {String}
       */
      unactivateTrigger: null,

      /**
       * Specify the event that will unactivate the component on touch device.
       * @prop
       * @type   {String}
       */
      unactivateTriggerTouch: null,

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
    }
  }

  /**
   * Physical props
   * @definition  SWebComponent.physicalProps
   * @protected
   */
  static get physicalProps () {
    return ['group', 'disabled']
  }

  /**
   * Css
   * @protected
   */
  static defaultCss (componentName, componentNameDash) {
    return `
      ${componentNameDash} {
        display : block;
      }
    `
  }

  /**
   * Component will mount
   * @definition  SWebComponent.componentWillMount
   * @protected
   */
  componentWillMount () {
    super.componentWillMount()
  }

  /**
   * Mount component
   * @definition  SWebComponent.componentMount
   * @protected
   */
  componentMount () {
    super.componentMount()

    // make sure we have a target element to work with
    const targetElm = this._getTargetElm()
    if (!targetElm) {
      throw new Error(`No HTMLElement correspond to the ${this.componentNameDash} hash "${this._getTargetHash()}". The ${this.componentNameDash} component need a proper target to work with...`)
    }

    // handleListeners first time
    this._removeAndAddListeners()
    window.addEventListener('resize', __debounce(() => {
      this._removeAndAddListeners()
    }, 250))

    // listen for the enter key
    this.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) { // enter
        // prevent default
        e.preventDefault()
        // toggle
        this.toggle()
      }
    })

    // listen for hash changes
    this._handleHistory()

    // check hash to activate the component if needed
    this._checkHashAndActivateIfNeeded()

    // check if need to activate myself due to the active class
    if (this.classList.contains(this.props.activeClass)) {
      this._processActivate()
    }

    // restore state if needed
    if (this.props.saveState) this._restoreState()

    // listen for the s-activate:activate event on the target element
    // to activate myself when a nested item if activated
    if (this.props.listenChilds) {
      targetElm.addEventListener(`${this.componentNameDash}:activate`, this._onNestedComponentActivate.bind(this))
    }

    // if we want to unactivate the component on an outside click
    if (this.props.unactivateOnOutsideClick) {
      this.addEventListener('click', (e) => {
        e.stopPropagation()
      })
      targetElm.addEventListener('click', (e) => {
        e.stopPropagation()
      })
      document.addEventListener('click', (e) => {
        // close the element
        if (this.isActive()) this.unactivate()
      })
    }
  }

  /**
   * Get the touch trigger
   */
  getTriggerTouch () {
    const cssTrigger = window.getComputedStyle(this).getPropertyValue('--s-activate-trigger-touch')
    if (cssTrigger) return cssTrigger.trim()
    return this.props.triggerTouch
  }

  /**
   * Get the trigger
   */
  getTrigger () {
    const cssTrigger = window.getComputedStyle(this).getPropertyValue('--s-activate-trigger')
    if (cssTrigger) return cssTrigger.trim()
    return this.props.trigger
  }

  /**
   * Get the unactivate trigger touch
   */
  getUnactivateTriggerTouch () {
    const cssTrigger = window.getComputedStyle(this).getPropertyValue('--s-activate-unactivate-trigger-touch')
    if (cssTrigger) return cssTrigger.trim()
    return this.props.unactivateTriggerTouch
  }

  /**
   * Get the unactivate trigger
   */
  getUnactivateTrigger () {
    const cssTrigger = window.getComputedStyle(this).getPropertyValue('--s-activate-unactivate-trigger')
    if (cssTrigger) return cssTrigger.trim()
    return this.props.unactivateTrigger
  }

  /**
   * Add and remove listeners
   */
  _removeAndAddListeners () {
    if (!this._onTriggerFn) {
      this._onTriggerFn = this._onTrigger.bind(this)
    }

    // listen for the trigger
    if (this._oldTrigger) {
      this.removeEventListener(this._oldTrigger, this._onTriggerFn)
    }
    this._oldTrigger = this.getTrigger()
    if (this._oldTrigger) {
      this.addEventListener(this._oldTrigger, this._onTriggerFn)
    }

    // listen for the trigger touch
    if ('ontouchstart' in window) {
      if (this._oldTriggerTouch) {
        this.removeEventListener(this._oldTriggerTouch, this._onTriggerFn)
      }
      this._oldTriggerTouch = this.getTriggerTouch()
      if (this._oldTriggerTouch) {
        this.addEventListener(this._oldTriggerTouch, this._onTriggerFn)
      }
    }

    // listen for the unactivate trigger if needed
    if (!this._onUnactivateTriggerFn) {
      this._onUnactivateTriggerFn = this._onUnactivateTrigger.bind(this)
    }
    if (!this._onTargetMouseEnterFn) {
      this._onTargetMouseEnterFn = this._onTargetMouseEnter.bind(this)
    }
    const unactivateTrigger = this.getUnactivateTrigger()
    if (this._oldUnactivateTrigger) {
      this.removeEventListener(this._oldUnactivateTrigger, this._onUnactivateTriggerFn)
    }
    const targetElm = this._getTargetElm()
    targetElm.removeEventListener('mouseenter', this._onTargetMouseEnterFn)
    if (unactivateTrigger) {
      this._oldUnactivateTrigger = unactivateTrigger
      this.addEventListener(unactivateTrigger, this._onUnactivateTriggerFn)
      if (unactivateTrigger === 'mouseleave' || unactivateTrigger === 'mouseout') {
        targetElm.addEventListener('mouseenter', this._onTargetMouseEnterFn)
        targetElm.addEventListener(unactivateTrigger, this._onUnactivateTriggerFn)
      }
    }

    // listen for the trigger touch
    if ('ontouchstart' in window) {
      if (this._oldUnactivateTriggerTouch) {
        this.removeEventListener(this._oldUnactivateTriggerTouch, this._onUnactivateTriggerFn)
      }
      this._oldUnactivateTriggerTouch = this.getUnactivateTriggerTouch()
      if (this._oldUnactivateTriggerTouch) {
        this.addEventListener(this._oldUnactivateTriggerTouch, this._onUnactivateTriggerFn)
      }
    }
  }

  /**
   * When the unactivateTrigger is fired
   * @param   {Event}   e   The unactivateTrigger event
   */
  _onUnactivateTrigger (e) {
    clearTimeout(this._unactivateTimeout)
    this._unactivateTimeout = setTimeout(() => {
      this.unactivate()
    }, this.props.unactivateTimeout)
  }

  /**
   * When the mouse enter the target element
   * @param   {MouseEvent}    e   The mouseenter event
   */
  _onTargetMouseEnter (e) {
    // clear the unactivate timeout
    clearTimeout(this._unactivateTimeout)
  }

  /**
   * When the unactivateTrigger is fired from the target element
   * @param   {Event}   e   The unactivateTrigger event
   */
  _onTargetUnactivateTrigger (e) {
    clearTimeout(this._unactivateTimeout)
    this._unactivateTimeout = setTimeout(() => {
      this.unactivate()
    }, this.props.unactivateTimeout)
  }

  /**
   * When a nested component activate itself, I need to activate myself
   * @param   {Event}   e   The custom event
   */
  _onNestedComponentActivate (e) {
    // make sure it's not myself that dispatch the event
    // to prevent a maximum call stack error
    if (e.target === this._getTargetElm()) return

    // process to activation
    this._processActivate()
  }

  /**
   * Handle history
   */
  _handleHistory () {
    if (this.props.history) {
      window.addEventListener('hashchange', (e) => {
        this._processHistoryChange()
      })
    }
  }

  /**
   * Check the url hash and activate if needed
   */
  _checkHashAndActivateIfNeeded () {
    setTimeout(() => {
      // check with hash if need to activate the element
      if (this.props.hash) {
        let hash = document.location.hash
        if (hash && hash === this._getTargetHash()) {
          this._processActivate()
        }
      }
    })
  }

  /**
   * Process history change
   */
  _processHistoryChange () {
    let hash = document.location.hash
    if (hash && hash === this._getTargetHash()) {
      this._processActivate()
    }
  }

  /**
   * When the trigger property has been fired on the element
   * @param   {Event}   e   The event
   */
  _onTrigger (e) {
    // prevent default behavior
    // mostly when the trigger is "click"
    // cause we handle the hash change by hand
    e.preventDefault()

    // clear the unactivateTimeout
    clearTimeout(this._unactivateTimeout)

    // clear the activate timeout and set another one.
    // this is made to avoid double execution on devices that have touch and mouse enabled (not tested)
    clearTimeout(this._activateTimeout)
    this._activateTimeout = setTimeout(() => {
      // toggle
      if (this.props.toggle && this.isActive()) {
        this.unactivate()
      } else {
        // activate the element
        this.activate()
      }
    })
  }

  /**
   * Component unmount
   * @definition    SWebComponent.componentUnmount
   * @protected
   */
  componentUnmount () {
    super.componentUnmount()
  }

  /**
   * Component will receive prop
   * @definition    SWebComponent.componentWillReceiveProp
   * @protected
   */
  componentWillReceiveProp (name, newVal, oldVal) {
    switch (name) {
      case 'class':
        newVal = (typeof newVal === 'string') ? newVal : ''
        oldVal = (typeof oldVal === 'string') ? oldVal : ''
        const newClasses = newVal.split(' ')
        const oldClasses = oldVal.split(' ')
        if (newClasses.indexOf(this.props.activeClass) !== -1 && oldClasses.indexOf(this.props.activeClass) === -1) {
          // activate the element
          this.activate()
        } else if (newClasses.indexOf(this.props.activeClass) === -1 && oldClasses.indexOf(this.props.activeClass) !== -1) {
          // unactivate the element
          this.unactivate()
        }
        break
    }
  }

  /**
   * Get the hash of the target element
   * @return    {String}    The target element hash
   */
  _getTargetHash () {
    if (this._targetHash) return this._targetHash // cache strategy

    if (this.props.for) {
      if (this.props.for instanceof window.HTMLElement) {
        this._targetHash = `#${this.props.for.id}`
      } else if (typeof this.props.for === 'string') {
        this._targetHash = `#${this.props.for}`.replace('##', '#')
      }
    } else {
      this._targetHash = `#${this.props.href}`.replace('##', '#')
    }

    return this._targetHash
  }

  /**
   * Get the target element
   * @return    {HTMLElement}   The target element
   */
  _getTargetElm () {
    if (this._targetElm) return this._targetElm // cache strategy
    this._targetElm = document.querySelector(this._getTargetHash())
    return this._targetElm
  }

  /**
   * Get all the component from the same group
   * @return    {Array<SActivateComponent>}   A node list of SActivateComponent elements that are in the same group as me
   */
  _getComponentOfTheSameGroup () {
    return [...document.querySelectorAll(`[is="${this.componentNameDash}"][group="${this.props.group}"]`)]
  }

  /**
   * Get all the component from the same group except me
   * @return    {Array<SActivateComponent>}   A node list of SActivateComponent elements that are in the same group as me
   */
  _getComponentOfTheSameGroupExceptMe () {
    return this._getComponentOfTheSameGroup().filter((elm) => {
      return elm !== this
    })
  }

  /**
   * Check if is active
   */
  isActive () {
    return this.classList.contains(this.props.activeClass)
  }

  /**
   * Activate the component
   */
  activate () {
    if (this.props.disabled) return

    if (this.props.history) {
      if (this.props.preventScroll) {
        window.history.pushState(null, null, this._getTargetHash())
        __dispatchEvent(window, 'hashchange')
      } else {
        document.location.hash = this._getTargetHash()
      }
    } else {
      // activate simply
      this._processActivate()
    }
  }

  /**
   * Toggle if possible. Otherwise, activate
   */
  toggle () {
    if (this.props.toggle && this.isActive()) {
      this.unactivate()
    } else {
      // activate the element
      this.activate()
    }
  }

  /**
   * Process to the actual activation
   */
  _processActivate () {
    // do nothing if disabled
    if (this.props.disabled) return

    // callback
    this.props.beforeActivate && this.props.beforeActivate(this)

    // save the state
    this._saveState(true)

    // activate this component
    this.classList.add(this.props.activeClass)

    // aria expanded
    if (this.hasAttribute('aria-expanded')) {
      this.setAttribute('aria-expanded', true)
    }

    // activate the target element
    const targetElm = this._getTargetElm()
    targetElm.classList.add(this.props.activeTargetClass || this.props.activeClass)

    // dispatch an activate event
    __dispatchEvent(targetElm, `${this.componentNameDash}:activate`)

    // unactive the others members of the group
    this._getComponentOfTheSameGroupExceptMe().forEach((sActivateComponentElm) => {
      sActivateComponentElm.unactivate()
    })

    // callback
    this.props.afterActivate && this.props.afterActivate(this)
  }

  /**
   * Unactive the component
   */
  unactivate () {
    // clear the activateTimeout
    clearTimeout(this._activateTimeout)

    // do nothing if disabled
    if (this.props.disabled) return

    // prevent from unactivate multiple times
    if (!this.isActive()) return

    // before unactivate
    this.props.beforeUnactivate && this.props.beforeUnactivate(this)

    // save the state
    this._saveState(false)

    // unactive the item itself
    this.classList.remove(this.props.activeClass)

     // aria expanded
     if (this.hasAttribute('aria-expanded')) {
      this.setAttribute('aria-expanded', false)
    }

    // unactivate the target
    const targetElm = this._getTargetElm()
    targetElm.classList.remove(this.props.activeTargetClass || this.props.activeClass)

    // check if the hash in the url is the one of this component to remove it
    if (document.location.hash === this._getTargetHash()) {
      window.history.pushState(null, null, '#')
    }

    // callback
    this.props.afterUnactivate && this.props.afterUnactivate(this)
  }

  /**
     * Save the state
     * @param   {Boolean}   activated   The activate status
     */
  _saveState (activated) {
    const hash = this._getTargetHash()
    // check the save state method
    switch (this.props.saveState) {
      case 'sessionStorage':
      case window.sessionStorage:
        window.sessionStorage.setItem(`${this._componentNameDash}-${hash}`, activated)
        break
      case 'localStorage':
      case window.localStorage:
      case true:
        window.localStorage.setItem(`${this._componentNameDash}-${hash}`, activated)
        break
    }
  }

  /**
   * Restore the state
   */
  _restoreState () {
    const hash = this._getTargetHash()
    // check the save state method
    switch (this.props.saveState) {
      case 'sessionStorage':
      case window.sessionStorage:
        if (window.sessionStorage.getItem(`${this._componentNameDash}-${hash}`) === 'true') {
          this.activate()
        }
        break
      case 'localStorage':
      case window.localStorage:
      case true:
        if (window.localStorage.getItem(`${this._componentNameDash}-${hash}`) === 'true') {
          this.activate()
        }
        break
    }
  }
}
