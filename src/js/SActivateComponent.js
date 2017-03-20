import SAnchorWebComponent from 'coffeekraken-sugar/js/core/SAnchorWebComponent'
import __uniqid from 'coffeekraken-sugar/js/utils/uniqid'
import __dispatchEvent from 'coffeekraken-sugar/js/dom/dispatchEvent'
import __whenAttribute from 'coffeekraken-sugar/js/dom/whenAttribute'
import __attributesObservable from 'coffeekraken-sugar/js/dom/attributesObservable'

if ( ! window.sugar) window.sugar = {};
if ( ! window.sugar._sActivateStack) window.sugar._sActivateStack = {};
if ( ! window.sugar._sActivateActiveStack) window.sugar._sActivateActiveStack = {};
const _nestedActiveElements = [];

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

 /**
  * @name 	SActivateComponent
  * Create links that apply an active class on his target instead of the default link behavior. This can be used to create tabs, accordion, or whatever you want that require to have a class added dynamically by clicking.
  * @styleguide 	Objects / Activate Link
  *
  * @example 	html
  * <style>
  * 	#my-target { display: none; }
  * 	#my-target.active { display: block; }
  * </style>
  * <a href="#my-target" is="s-activate" toggle="true">Click me to activate the target</a>
  * <div id="my-target">
  * 	I will have an "active" class when the link has been clicked
  * </div>
  *
  * @author 		Olivier Bossel <olivier.bossel@gmail.com>
  */

export default class SActivateComponent extends SAnchorWebComponent {

	/**
	 * Default props
	 * @definition 		SWebComponent.defaultProps
	 * @protected
	 */
	static get defaultProps() {
		return {
			/**
			 * Specify the target to activate. A target can be an HTMLElement with an id or an s-activate-target="{id}" attribute.
			 * @prop
			 * @type	{String}
			 */
			href : null,

			id : null,

			/**
			 * Specify the group in which this activate element lives. This is useful to create things like tabs, accordion, etc...
			 * Basicaly, when an item of the same group is activated, the others will be unactivate automatically.
			 * @prop
			 * @type 	{String}
			 */
			group : null,

			/**
			 * Specify the class that will be applied on the targets when this component is activated
			 * @prop
			 * @type	{String}
			 */
			activeTargetClass : null,

			/**
			 * Specify the class that will be applied on this component and on the targets when this component is activated
			 * @prop
			 * @type 	{String}
			 */
			activeClass : 'active',

			/**
			 * Set if want the component set his id in the URL
			 * @prop
			 * @type 	{Boolean}
			 */
			history : true,

			/**
			 * Set if need to check the URL at start to activate the component if needed
			 * @prop
			 * @type	{Boolean}
			 */
			anchor : true,

			/**
			 * Set if want that the component unactivate itself when click on it when activated
			 * @prop
			 * @type 		{Boolean}
			 */
			toggle : false,

			/**
			 * Specify which event will activate the component
			 * @prop
			 * @type  	{String}
			 */
			trigger : 'click',

			/**
			 * Specify if the activate component is disabled, in which case it will not activate any targets when clicked
			 * @prop
			 * @type 	{Boolean}
			 */
			disabled : false,

			/**
			 * Specify if and how the state of the component will be saved. It can be true/localStorage, or sessionStorage
			 * @prop
			 * @type 	{String|Boolean}
			 */
			saveState : false,

			/**
			 * Specify the event that will unactivate the component. By default, it's the same as the trigger property
			 * @prop
			 * @type 	{String}
			 */
			unactivateTrigger : null,

			/**
			 * Specify a timeout before actually activating the component
			 * @prop
			 * @type 	{Number}
			 */
			activateTimeout : 0,

			/**
			 * Specify a timeout before actually unactivate the component
			 * @prop
			 * @type	{Number}
			 */
			unactivateTimeout : 200,

			/**
			 * Specify if need to prevent the scroll when clicking on the component. This is useful when the "history" property is set to true and need to prevent the scroll to happened.
			 * The url will be set using the window.history.pushState instead of the location.hash.
			 * @prop
			 * @type 	{Boolean}
			 */
			preventScroll : false,

			/**
			 * Callback called just before the component is bein activated
			 * @prop
			 * @type	{Function}
			 */
			beforeActivate : null,

			/**
			 * Callback called just after the component is bein activated
			 * @prop
			 * @type	{Function}
			 */
			afterActivate : null,

			/**
			 * Callback called just before the component is bein unactivated
			 * @prop
			 * @type	{Function}
			 */
			beforeUnactivate : null,

			/**
			 * Callback called just after the component is bein unactivated
			 * @prop
			 * @type	{Function}
			 */
			afterUnactivate : null
		};
	}

	/**
	 * Mount dependencies
	 * @protected
	 */
	static get mountDependencies() {
		return [function() {
			return __whenAttribute(this, 'href');
		}];
	}

	/**
	 * Physical props
	 * @definition 		SWebComponent.physicalProps
	 * @protected
	 */
	static get physicalProps() {
		return ['group','disabled'];
	}

	/**
	 * Css
	 * @protected
	 */
	static defaultCss(componentName, componentNameDash) {
		return `
			${componentNameDash} {
				display : block;
			}
		`;
	}

	/**
	 * Component will mount
	 * @definition 		SWebComponent.componentWillMount
	 * @protected
	 */
	componentWillMount() {
		super.componentWillMount();
		this._sActivateTargets = null;
		this._sActivateTargetsDisabledTimeout = null;
		this._sActivateNestedItems = [];
		document.body.addEventListener(`${this._componentNameDash}:activate`, this._componentWillMountBodyActivateListener.bind(this));
	}

	/**
	 * Mount component
	 * @definition 		SWebComponent.componentMount
	 * @protected
	 */
	componentMount() {
		super.componentMount();

		// stop listening for activate elements that have been activated
		// BEFORE this is mounted
		document.body.removeEventListener(`${this._componentNameDash}:activate`, this._componentWillMountBodyActivateListener);

		// update references
		this.update();

		// loop on each targets and each active elements to check if need to activate
		// this element. This is to handle when a nested s-activate is inited before this
		let activateCauseOfNestedActivatedItems = false;
		[].forEach.call(this._sActivateTargets, (target) => {
			if (activateCauseOfNestedActivatedItems) return;
			this._sActivateNestedItems.forEach((activateItem) => {
				if (target.contains(activateItem)) {
					this._activate();
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
		if ( ! this._getGroup(this)) {
			this.setProp('group', 'group-'+Math.round(Math.random()*99999999));
		}

		// listen for trigger (click, mouseover, etc...)
		this.addEventListener(this.props.trigger, this._onTriggerElement.bind(this));

		// listen for the activate event on the body to check if we need to unactivate
		// this
		document.body.addEventListener(`${this._componentNameDash}:activate`, (e) => {
			window.sugar._sActivateActiveStack[e.detail.group] = e.detail.id;
			if (e.detail.group === this.props.group
				&& e.detail.id !== this.props.id
			) {
				this.unactivate();
			}
		});

		// check on init if another element of the same group is already activated
		// to unactivate this
		if ( window.sugar._sActivateActiveStack[this.props.group]
			&& window.sugar._sActivateActiveStack[this.props.group] !== this.props.id
		) {
			this.unactivate();
		}

		// listen for childs behin activated
		[].forEach.call(this._sActivateTargets, (target) => {
			target.addEventListener(`${this._componentNameDash}:activate`, this._onTargetActivate.bind(this), true);
		});

		// check if has an unactivate trigger
		let unactivate_trigger = this.props.unactivateTrigger;
		if (unactivate_trigger) {
			this.addEventListener(unactivate_trigger, this._onElmUnactivate.bind(this));
			if (unactivate_trigger == 'mouseleave' || unactivate_trigger == 'mouseout') {
				[].forEach.call(this._sActivateTargets, (target) => {
					target.addEventListener('mouseenter', this._onTargetMouseEnter.bind(this));
					target.addEventListener(unactivate_trigger, this._onTargetUnactivate.bind(this));
				});
			}
		}

		// manage the active class
		if (this.classList.contains(this.props.activeClass)) {
			// activate the targets
			// but to not dispatch any events etc...
			[].forEach.call(this._sActivateTargets, (target) => {
				target.classList.add(this.props.activeTargetClass || this.props.activeClass);
			});
		}
		setTimeout(() => {
			// check with anchor if need to activate the element
			if (this.props.anchor) {
				let hash = document.location.hash;
				if (hash) {
					if (hash.substr(1) === this.props.id) {
						this._activate();
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
	componentUnmount() {
		super.componentUnmount();
		// listen for trigger (click, mouseover, etc...)
		this.removeEventListener(this.props.trigger, this._onTriggerElement);
		// remove all the classes
		this.classList.remove(this.props.activeClass);
		[].forEach.call(this._sActivateTargets, (target) => {
			// remove the class from targets
			target.classList.remove(this.props.activeTargetClass || this.props.activeClass);
			// stop listening for activate event
			target.removeEventListener(`${this._componentNameDash}:activate`, this._onTargetActivate, true);
		});
		[].forEach.call(this._sActivateTargets, (target) => {
			if (target._sActivateAttributesObservable) {
				target._sActivateAttributesObservable.unsubscribe();
			}
		});
		if (this.props.unactivateTrigger) {
			this.removeEventListener(this.props.unactivateTrigger, this._onElmUnactivate);
			[].forEach.call(this._sActivateTargets, (target) => {
				target.removeEventListener('mouseenter', this._onTargetMouseEnter);
				target.removeEventListener(this.props.unactivateTrigger, this._onTargetUnactivate);
			});
		}
	}

	/**
	 * Component will receive prop
	 * @definition 		SWebComponent.componentWillReceiveProp
	 * @protected
	 */
	componentWillReceiveProp(name, newVal, oldVal) {
		switch(name) {
			case 'href':
			case 'activate':
				// wait next frame to be sure that we have the last html
				this.mutate(() => {
					this.update();
				});
			break;
		}
	}

	/**
	 * Render the component
	 * Here goes the code that reflect the this.props state on the actual html element
	 * @definition 		SWebComponent.render
	 * @protected
	 */
	render() {
		super.render();
	}

	_componentWillMountBodyActivateListener(e) {
		if (this._sActivateNestedItems.indexOf(e.target) === -1) {
			this._sActivateNestedItems.push(e.target);
		}
	}

	/**
	 * On target activate
	 */
	_onTargetActivate(e) {
		// if ( this.props.id === e.detail.id) return;
		if ( ! this.isComponentMounted()) return;
		// e.stopPropagation();
		// activate the trigger that handle this target
		if (this.props.id !== e.detail.id
			&& e.target._sActivateTrigger
			&& e.target._sActivateTrigger !== this) {
			this._activate();
		}
	}

	/**
	 * On element trigger is launched
	 */
	_onTriggerElement(e) {
		e.preventDefault();
		if ( this.props.disabled) return;

		clearTimeout(this._activateTimeout);
		this._activateTimeout = setTimeout(() => {

			// if the target is the element itself
			// we stop if the current target if not
			// the element itselg to avoid issues
			if (this._sActivateTargets.length === 1
				&& this._sActivateTargets[0] === this
			) {
				if (e.target !== this) return;
			}

			// clear unactivate timeout
			clearTimeout(this._unactivateTimeout);
			// if toggle
			if (this.props.toggle && this.isActive()) {
				// unactivate
				this.unactivate();
				// check if has a hash
				if (this.props.history) {
					window.history.back();
				}
			} else {
				if (this.props.history) {
					// simply activate again if the same id that anchor
					// this can happened when an element has history to false
					if (document.location.hash && document.location.hash === this.props.id) {
						this._activate();
					} else {
						// simply change the hash
						// the event listener will take care of activate the
						// good element
						if (this.props.preventScroll) {
							window.history.pushState(null,null,`${document.location.pathname || ''}${document.location.search || ''}#${this.props.id}`);
							__dispatchEvent(window, 'hashchange');
						} else {
							document.location.hash = `${this.props.id}`;
						}
					}
				} else {
					// activate the element
					this._activate();
				}
			}
		}, this.props.activateTimeout);
	}

	/**
	 * Element unactivate
	 */
	_onElmUnactivate(e) {
		clearTimeout(this._unactivateTimeout);
		clearTimeout(this._activateTimeout);
		this._unactivateTimeout = setTimeout(() => {
			this.unactivate();
		}, this.props.unactivateTimeout);
	}

	/**
	 * Targer mouseenter callback
	 */
	_onTargetMouseEnter(e) {
		// clear the unactivate timeout
		clearTimeout(this._unactivateTimeout);
	}

	/**
	 * Target uncactivate callback
	 */
	_onTargetUnactivate(e) {
		clearTimeout(this._unactivateTimeout);
		this._unactivateTimeout = setTimeout(() => {
			this.unactivate();
		}, this.props.unactivateTimeout);
	}

	/**
	 * Get target
	 */
	_getTargetsSelector(elm) {
		return elm._targetsSelector;
	}

	/**
	 * Get group
	 */
	_getGroup(elm) {
		// if (this.props.group) return this.props.group;
		return elm.props.group;
		// return elm.getAttribute(this._componentNameDash+'-group') || elm.getAttribute('data-'+this._componentNameDash+'-group');
	}

	/**
	 * Check if is active
	 */
	isActive() {
		return this.classList.contains(this.props.activeClass);
	}

	/**
	 * Activate the element
	 */
	_activate() {
		// before activate callback
		this.props.beforeActivate && this.props.beforeActivate(this);

		// save the state
		this._saveState(true);

		// activate the element
		this.classList.add(this.props.activeClass);

		// activate all the targets
		[].forEach.call(this._sActivateTargets, (target) => {
			this.activateTarget(target);
			// dispatch an event to tell parents that this target is activated
			__dispatchEvent(target, `${this._componentNameDash}:activate`, {
				id : this.props.id,
				group : this.props.group
			});
		});

		// callback
		this.props.afterActivate && this.props.afterActivate(this);
	}

	/**
	 * Activate a target element
	 * @param 		{HTMLElement} 		target 			The target to activatee
	 */
	activateTarget(target) {
		if (target !== this && target.activate && typeof(target.activate) === 'function') target.activate();
		else {
			// remove the active class on target
			target.classList.add(this.props.activeTargetClass || this.props.activeClass);
		}
	}

	/**
	 * Unactivate a target element
	 * @param 		{HTMLElement} 		target 			The target to activatee
	 */
	unactivateTarget(target) {
		if (target !== this && target.unactivate && typeof(target.unactivate) === 'function') target.unactivate();
		else {
			// remove the active class on target
			target.classList.remove(this.props.activeTargetClass || this.props.activeClass);
		}
	}

	/**
	 * Handle history
	 */
	_handleHistory() {
		window.addEventListener('hashchange', (e) => {
			this._processHistoryChange();
		});
		window.addEventListener('popstate', (e) => {
			this._processHistoryChange();
		});
	}

	/**
	 * Process history change
	 */
	_processHistoryChange() {
		// clearTimeout(this._processHistoryChangeTimeout);
		// this._processHistoryChangeTimeout = setTimeout(() => {
			let hash = document.location.hash;
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
	activate() {
		if (this.props.history) {
			if (this.props.preventScroll) {
				window.history.pushState(null,null,`#${this.props.id}`);
				__dispatchEvent(window, 'hashchange');
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
	unactivate() {
		// before unactivate
		this.props.beforeUnactivate && this.props.onBeforeUnactivate(this);

		// save the state
		this._saveState(false);

		// unactive the item itself
		this.classList.remove(this.props.activeClass);

		// unactive targets
		if (this._sActivateTargets instanceof NodeList) {
			[].forEach.call(this._sActivateTargets, (target) => {
				this.unactivateTarget(target);
				// dispatch an event to tell parents that this target is unactivated
				__dispatchEvent(target, `${this._componentNameDash}:unactivate`, {
					id : this.props.id,
					group : this.props.group
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
	_saveState(activated) {
		if ( ! this.props.id) return;
		// check the save state method
		switch(this.props.saveState) {
			case 'sessionStorage':
				sessionStorage.setItem(`${this._componentNameDash}-${this.props.id}`, activated);
			break;
			case 'localStorage':
			case true:
				localStorage.setItem(`${this._componentNameDash}-${this.props.id}`, activated);
			break;
		}
	}

	/**
	 * Restore the state
	 */
	_restoreState() {
		if ( ! this.props.id) return;
		// check the save state method
		switch(this.props.saveState) {
			case 'sessionStorage':
				if (eval(sessionStorage.getItem(`${this._componentNameDash}-${this.props.id}`))) {
					this.activate();
				}
			break;
			case 'localStorage':
			case true:
				if (eval(localStorage.getItem(`${this._componentNameDash}-${this.props.id}`))) {
					this.activate();
				}
			break;
		}
	}

	/**
	 * Check if all targets are disabled
	 */
	_checkDisabledTargets() {
		let allDisabled = true;
		[].forEach.call(this._sActivateTargets, (target) => {
			if ( ! target.hasAttribute('disabled')) {
				allDisabled = false;
			}
		});
		if ( allDisabled) {
			this.setProp('disabled', true);
		} else {
			this.setProp('disabled', false);
		}
	}

	/**
	 * Update targets, etc...
	 * @param 		{HTMLElement} 		[scope=document.body] 			The scope to update
	 */
	update(scope = document.body) {

		// target
		let targetsSelector = this.props.target || this.props.href;

		// remove # at start of targetsSelector
		if (targetsSelector && targetsSelector.substr(0,1) === '#') {
			targetsSelector = targetsSelector.substr(1);
		}

		// if the targetsSelector is an id
		// and the setting "id" is not set
		// set the setting with the targetsSelector id
		if ( ! this.props.id
			&& (typeof(targetsSelector) === 'string')
		) {
			this.setProp('id', targetsSelector);
		} else if ( ! this.props.id) {
			this.setProp('id', __uniqid());
		}

		// if don't have any targetsSelector
		// mean that it's the element itself
		// so check if already an id
		// otherwise, set a new one
		if ( ! targetsSelector) {
			const id = `${this._componentNameDash}-${__uniqid()}`;
			if ( ! this.props.id) {
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
			this._sActivateTargets = scope.querySelectorAll(`#${targetsSelector},[${this._componentNameDash}-target="${targetsSelector}"]`);
			[].forEach.call(this._sActivateTargets, (t) => {
				// observe disable attribute on the target
				if ( ! t._sActivateAttributesObservable) {
					t._sActivateAttributesObservable = __attributesObservable(t, {
						attributeFilter : ['disabled']
					}).subscribe((mutation) => {
						clearTimeout(this._sActivateTargetsDisabledTimeout);
						this._sActivateTargetsDisabledTimeout = setTimeout(() => {
							this._checkDisabledTargets();
						});
					});
				}
				t._sActivateTrigger = this;
			});
			// check disabled targets first time
			this._checkDisabledTargets();
		} else {
			this._sActivateTargets = [];
		}

		// save the selector
		this._targetsSelector = targetsSelector;
	}
}
