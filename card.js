class ToggleCardWithShadowDom extends HTMLElement {

    // private properties
    _config;
    _hass;
    _elements = {};

    // lifecycle
    constructor() {
        super();
        this.doCard();
        this.doStyle();
        this.doShadowDom();
        this.doQueryElements();
        this.doListen();
    }

    setConfig(config) {
        this._config = config;
        this.doCheckConfig();
        this.doUpdateConfig();
    }

    set hass(hass) {
        this._hass = hass;
        this.doUpdateHass()
    }

    onClicked() {
        this.doToggle();
    }

    // accessors
    isOff() {
        return this.getState().state == 'off';
    }

    isOn() {
        return this.getState().state == 'on';
    }

    getHeader() {
        return this._config.header;
    }

    getEntityID() {
        return this._config.entity;
    }

    getState() {
        return this._hass.states[this.getEntityID()];
    }

    getAttributes() {
        return this.getState().attributes
    }

    getName() {
        const friendlyName = this.getAttributes().friendly_name;
        return friendlyName ? friendlyName : this.getEntityID();
    }

    // jobs
    doCheckConfig() {
        if (!this._config.entity) {
            throw new Error('Please define an entity!');
        }
    }

    doCard() {
        this._elements.card = document.createElement("ha-card");
        this._elements.card.innerHTML = `
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
    }


    doStyle() {
        this._elements.style = document.createElement("style");
        this._elements.style.textContent = `
            .error {
                text-color: red;
            }
            .error--hidden {
                display: none;
            }
            .dl {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            .dl--hidden {
                display: none;
            }
            .dt {
                display: flex;
                align-content: center;
                flex-wrap: wrap;
            }
            .dd {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, auto) minmax(0, 2fr));
                margin: 0;
            }
            .toggle {
                padding: 0.6em;
                border: grey;
                border-radius: 50%;
            }
            .toggle--on {
                background-color: green;
            }
            .toggle--off{
                background-color: red;
            }
            .button {
                display: block;
                border: outset 0.2em;
                border-radius: 50%;
                background-color: silver;
                width: 1.4em;
                height: 1.4em;
            }
            .value {
                padding-left: 0.5em;
                display: flex;
                align-content: center;
                flex-wrap: wrap;
            }
        `
    }

    doShadowDom() {
        this.attachShadow({ mode: "open" });
        this.shadowRoot.append(this._elements.style, this._elements.card);
    }

    doQueryElements() {
        const card = this._elements.card;
        this._elements.error = card.querySelector(".error")
        this._elements.dl = card.querySelector(".dl")
        this._elements.topic = card.querySelector(".dt")
        this._elements.toggle = card.querySelector(".toggle")
        this._elements.value = card.querySelector(".value")
    }

    doListen() {
        this._elements.dl.addEventListener("click", this.onClicked.bind(this), false);
    }

    doUpdateConfig() {
        if (this.getHeader()) {
            this._elements.card.setAttribute("header", this.getHeader());
        } else {
            this._elements.card.removeAttribute("header");
        }
    }

    doUpdateHass() {
        if (!this.getState()) {
            this._elements.error.textContent = `${this.getEntityID()} is unavailable.`;
            this._elements.error.classList.remove("error--hidden");
            this._elements.dl.classList.add("dl--hidden");
        } else {
            this._elements.error.textContent = "";
            this._elements.topic.textContent = this.getName();
            if (this.isOff()) {
                this._elements.toggle.classList.remove("toggle--on");
                this._elements.toggle.classList.add("toggle--off");
            } else if (this.isOn()) {
                this._elements.toggle.classList.remove("toggle--off");
                this._elements.toggle.classList.add("toggle--on");
            }
            this._elements.value.textContent = this.getState().state;
            this._elements.error.classList.add("error--hidden");
            this._elements.dl.classList.remove("dl--hidden");
        }
    }

    doToggle() {
        this._hass.callService('input_boolean', 'toggle', {
            entity_id: this.getEntityID()
        });
    }

    // configuration defaults
    static getStubConfig() {
        return { entity: "input_boolean.tcwsd" }
    }

}

customElements.define('toggle-card-with-shadow-dom', ToggleCardWithShadowDom);

window.customCards = window.customCards || [];
window.customCards.push({
    type: "toggle-card-with-shadow-dom",
    name: "Vanilla Js Toggle With Shadow DOM",
    description: "Turn an entity on and off"
});
