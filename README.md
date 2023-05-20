# Plain Vanilla JavaScript Toggle Card With Shadow DOM

![toggle on](img/toggle-on.png)
![toggle off](img/toggle-off.png)

Encapsulate CSS into a shadow DOM

***

* @published: May 2023
* @author: Elmar Hinz
* @workspace: `conf/www/tutor`
* @name: `toggle-card-with-shadow-dom`
* @id: `tcwsd`

You learn:

* how to attach a shadow dom inside the constructor
* how to clean up the lifecycle
* how to get rid of the prefixes
* how to migrate BEM methodology with nested CSS modifiers

## Intro

Introducing the usage of the shadow dom. It encapsulates the dom of the card,
the nodes, the CSS, even the ids. This gives you some advantages. Organizing the
CSS is getting easier. Also the lifecycle is getting easier to handle. The full
shadow dom can already be created in the constructor, so that the elements are
accessible early.

## Prerequisites

* tutorial 04: Plain Vanilla JavaScript Toggle Card
* you know how to register the `card.js` as a resource
* you know how to create the helper entity of type `boolean` aka `toggle`
* you know how to add and edit a card
* you know how to reload `card.js` after editing

## Setup

Take the same steps as in the previous tutorial. Name the helper entity
`tcwsd` this time.

![configuration of the card](img/configuration.png)

## The code

### Overview

The code of the previous tutorial is only slightly modified. The function
`doAttach()` is modified to attach a shadow dom. The CSS is simplified.

### Attaching the shadow dom

```js
    doAttach() {
        this.attachShadow({ mode: "open" });
        this.shadowRoot.append(this._elements.style, this._elements.card);
    }

```

The attachment of the shadow dom is straight forward. The children can
be appended from the constructor already and we can query for the elements
as early.

```js
    constructor() {
        super();
        this.doCard();
        this.doStyle();
        this.doAttach();
        this.doQueryElements();
        this.doListen();
    }
```

### Simplifying `setConfig()`

Now `setConfig()` can focus upon it's own tasks.

Before:

```js
    setConfig(config) {
        console.log("ToggleCardVanillaJs.setConfig()")
        this._config = config;
        if (!this._isAttached) {
            this.doAttach();
            this.doQueryElements();
            this.doListen();
            this._isAttached = true;
        }
        this.doCheckConfig();
        this.doUpdateConfig();
    }
```

After:

```js
    setConfig(config) {
        this._config = config;
        this.doCheckConfig();
        this.doUpdateConfig();
    }
```

### Dropping BEM methodology

The CSS is encapsulated now. We can drop the prefix/block and stay with
*elements* and *modifiers*. Exploiting recent CSS advancements we can
drop composed class names at all.

In CSS the BEM class `.tcws-error-hidden` becomes `.error.hidden`. I still
recommend to use the combination of element and modifier `.error.hidden` over
the naked modifier `.hidden`. Even the latter becomes less error prone as
the shadow dom is rather small.

```js
    .error { text-color: red; }
    .error.hidden { display: none; }
```

Some browsers already support nested CSS. CSS will become pretty organized.

```js
    .error {
        text-color: red;
        &.hidden { display: none; }
    }
```

The HTML is adjusted accordingly.

```js
    doCard() {
        this._elements.card = document.createElement("ha-card");
        this._elements.card.innerHTML = `
                <div class="card-content">
                    <p class="error error hidden">
                    <dl class="dl">
                        <dt class="dt"></dt>
                        <dd class="dd">
                            <span class="toggle">
                                <span class="button"></span>
                            </span>
                            <span class="value">
                            </span>
                        </dd>
                    </dl>
                </div>
        `;
    }
```
