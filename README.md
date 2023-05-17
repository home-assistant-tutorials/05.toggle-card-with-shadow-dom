# Plain Vanilla JavaScript Toggle Card With Shadow DOM

![toggle on](img/toggle-on.png)
![toggle off](img/toggle-off.png)

Encapsulate CSS into a shadow DOM

***

* @published: May 2023
* @author: Elmar Hinz
* @workspace: `conf/www/tutor`
* @name: `toggle-card-with-shadow-dom`
* @id/prefix: `tcwsd`

You learn:

* how to encapsulate the CSS into a shadow dom

## Goal

In this tutorial you will learn how to use a shadow DOM to encapsulate
the CSS to the card. You can drop the prefixes. The BEM methodology
(block, element, modifier) gets shrunk to a EM methodology.

## Prerequisites

* tutorial 04: Plain Vanilla JavaScript Toggle Card

## Setup

Take the same steps as in the previous tutorial. Name the helper entity
`tcwsd` this time.

![configuration of the card](img/configuration.png)

## The code

The code is slightly modified. A function `doShadowDom()` is added to the
workflow. Here the shadow dom is created. The *style* and the *cards* HTML
are added.

```js
    doShadowDom() {
        this.attachShadow({ mode: "open" });
        this.shadowRoot.append(this.status.style, this.status.card);
    }
```

The function `doSetup()` has been renamed to `doCard()`. The prefixes
of the HTML classes and in the style have been removed.

```js
    doCard() {
        this.status.card = document.createElement("ha-card");
        if (this.getHeader()) {
            this.status.card.setAttribute("header", this.getHeader());
        }
        this.status.card.innerHTML = `
                <div class="card-content">
                    <p class="error error--hidden">
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
        this.status.error = this.status.card.querySelector(".error")
        this.status.dl = this.status.card.querySelector(".dl")
        this.status.topic = this.status.card.querySelector(".dt")
        this.status.toggle = this.status.card.querySelector(".toggle")
        this.status.value = this.status.card.querySelector(".value")
    }
    ```

Also the log entries of the lifecycle has been removed. They served
the purposes of the previous tutorial.
