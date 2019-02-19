# SActivateComponent

Create links that apply an active class on his target instead of the default link behavior. This can be used to create tabs, accordion, or whatever you want that require to have a class added dynamically by clicking.
Features:
- Nested support. When a nested target is activated, all the parent ones will be too.
- Grouping (tabs, etc...)
- History
- Toggle
- Saving state
- And more...


Author : Olivier Bossel [olivier.bossel@gmail.com](mailto:olivier.bossel@gmail.com)




## Attributes

Here's the list of available attribute(s).

### href

Specify the target to activate. A target is an HTMLElement with an id attribute.

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **null**


### for

Specify the target of the activate link if want to override the href one

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **null**


### group

Specify the group in which this activate element lives. This is useful to create things like tabs, accordion, etc...
Basicaly, when an item of the same group is activated, the others will be unactivate automatically.

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **null**


### activeTargetClass

Specify the class that will be applied on the targets when this component is activated

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **null**


### activeClass

Specify the class that will be applied on this component and on the targets when this component is activated

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **active**


### listenChilds

Listen for childs being activated to activate ourself

Type : **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }**

Default : **false**


### unactivateOnOutsideClick

Set if we want to unactivate the component on an outside click

Type : **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }**

Default : **false**


### history

Set if want the component set his id in the URL

Type : **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }**

Default : **false**


### hash

Set if need to check the URL at start to activate the component if needed

Type : **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }**

Default : **true**


### toggle

Set if want that the component unactivate itself when click on it when activated

Type : **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }**

Default : **false**


### trigger

Specify which event will activate the component

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **click**


### triggerTouch

Specify which event will activate the component on touch devices

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **click**


### disabled

Specify if the activate component is disabled, in which case it will not activate any targets when clicked

Type : **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }**

Default : **false**


### saveState

Specify if and how the state of the component will be saved. It can be true/localStorage, or sessionStorage

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) , [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }**

Default : **false**


### unactivateTrigger

Specify the event that will unactivate the component.

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **null**


### unactivateTriggerTouch

Specify the event that will unactivate the component on touch device.

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **null**


### unactivateTimeout

Specify a timeout before actually unactivate the component

Type : **{ [Number](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number) }**

Default : **200**


### preventScroll

Specify if need to prevent the scroll when clicking on the component. This is useful when the "history" property is set to true and need to prevent the scroll to happened.
The url will be set using the window.history.pushState instead of the location.hash.

Type : **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }**

Default : **true**


### beforeActivate

Callback called just before the component is bein activated

Type : **{ [Function](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function) }**

Default : **null**


### afterActivate

Callback called just after the component is bein activated

Type : **{ [Function](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function) }**

Default : **null**


### beforeUnactivate

Callback called just before the component is bein unactivated

Type : **{ [Function](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function) }**

Default : **null**


### afterUnactivate

Callback called just after the component is bein unactivated

Type : **{ [Function](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function) }**

Default : **null**




## Methods


### getTriggerTouch

Get the touch trigger


### getTrigger

Get the trigger


### getUnactivateTriggerTouch

Get the unactivate trigger touch


### getUnactivateTrigger

Get the unactivate trigger


### isActive

Check if is active


### activate

Activate the component


### toggle

Toggle if possible. Otherwise, activate


### unactivate

Unactive the component


## Events


### activate

Event dispatched when the element has been activated.


### activate:target

Event dispatched when a target element has been activated.