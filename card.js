class ToggleCardWithShadowDom extends HTMLElement {

    // status
    status = {};

    // lifecycle
    setConfig(config) {
        this.status.config = config;
        this.doCheck();
        this.doCard();
        this.doStyle();
        this.doShadowDom();
        this.doListen();
        // Although doCard(), doStyle(), doShadowDom()
        // are designed to be called once in the
        // dashboard this doesn't hold for the
        // configuration editor. The editor does
        // call setConfig() repeatedly without
        // calling hass() thereafter.
        // In this case HTML/CSS are redrawn
        // and need an update to refill the values.
        if (this.hasHass()) {
            this.doUpdate();
        }
    }

    set hass(hass) {
        this.status.hass = hass;
        this.doUpdate()
    }

    onToggle() {
        this.doToggle();
    }

    // accessors
    hasHass() {
        return this.status.hass !== undefined
    }

    isOff() {
        return this.getState().state == 'off';
    }

    isOn() {
        return this.getState().state == 'on';
    }

    getHeader() {
        return this.status.config.header;
    }

    getEntityID() {
        return this.status.config.entity;
    }

    getState() {
        return this.status.hass.states[this.getEntityID()];
    }

    getAttributes() {
        return this.getState().attributes
    }

    getName() {
        const friendlyName = this.getAttributes().friendly_name;
        return friendlyName ? friendlyName : this.getEntityID();
    }

    // jobs
    doCheck() {
        if (!this.status.config.entity) {
            throw new Error('Please define an entity!');
        }
    }

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

    doStyle() {
        this.status.style = document.createElement("style");
        this.status.style.textContent = `
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
        if (!this.shadowRoot) {
            this.attachShadow({ mode: "open" });
        }
        this.shadowRoot.replaceChildren(this.status.style, this.status.card);
    }

    doListen() {
        this.status.dl.addEventListener("click", this.onToggle.bind(this), false);
    }

    doUpdate() {
        if (!this.getState()) {
            this.status.error.textContent = `${this.getEntityID()} is unavailable.`;
            this.status.error.classList.remove("error--hidden");
            this.status.dl.classList.add("dl--hidden");
        } else {
            this.status.error.textContent = "";
            this.status.topic.textContent = this.getName();
            if (this.isOff()) {
                this.status.toggle.classList.remove("toggle--on");
                this.status.toggle.classList.add("toggle--off");
            } else if (this.isOn()) {
                this.status.toggle.classList.remove("toggle--off");
                this.status.toggle.classList.add("toggle--on");
            }
            this.status.value.textContent = this.getState().state;
            this.status.error.classList.add("error--hidden");
            this.status.dl.classList.remove("dl--hidden");
        }
    }

    doToggle() {
        this.status.hass.callService('input_boolean', 'toggle', {
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
