import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

class MyGardenaCard extends LitElement {
  static styles = css`
            .background {
              background-repeat: no-repeat;
              background-position: center center;
              background-size: cover;
            }
            .title {
              display:block!important;
              font-size: 20px;
              padding: 16px 16px 0;
              text-align: center;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
            .content {
              cursor: pointer;
            }
            .flex {
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .button {
              cursor: pointer;
              padding: 16px;
              color: white;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(2, auto);
            }
            .grid-content {
              display: grid;
              align-content: space-between;
              grid-row-gap: 6px;
            }
            .grid-left {
              text-align: left;
              font-size: 110%;
              padding-left: 10px;
              border-left: 2px solid var(--primary-color);
            }
            .grid-right {
              text-align: right;
			  font-size: 110%;
              padding-right: 10px;
              border-right: 2px solid var(--primary-color);
            }
  `;

  static properties = {
    _hass: {},
    _config: {},
    name: {},
    stateObj: {},
    buttons: {},
    padding: {},
    background: {},
    text: {},
    vendor: {},
    showDetails: {},
  };

  render() {
    return html`
      <ha-card
        .hass=${this._hass}
        .config=${this._config}
        class="background"
        style=${this.background}
      >
        ${this.name
          ? html`
              <div class="title" style=${this.text}>${this.name}</div>
            `
          : ''}
        <div class="content" @click=${this.moreInfo} style=${this.padding}>
          <div class="grid" style=${this.text}>
            <div class="grid-content grid-left">
              <div>Status: ${this.stateObj.attributes.state}</div>
              <div>Battery: ${this.stateObj.attributes.battery_level} %</div>
              <div>Radio: ${this.stateObj.attributes.rf_link_level} %</div>
            </div>
            ${this.showDetails
              ? html`
                  <div class="grid-content grid-right">
                    <div>Last Error: ${this.stateObj.attributes.last_error}</div>
                    <div>Battery State: ${this.stateObj.attributes.battery_state}</div>
                    <div>Cutting Time: ${this.stateObj.attributes.operating_hours} h</div>
                  </div>
                `
              : ''}
          </div>
        </div>
        ${this.buttons
          ? html`
              <div class="flex">
                <div class="button" @click=${this.startMower}>
                  <ha-icon icon="mdi:play"></ha-icon>
                </div>
                <div class="button" @click=${this.stopMower}>
                  <ha-icon icon="mdi:stop"></ha-icon>
                </div>
                <div class="button" @click=${this.returnMower}>
                  <ha-icon icon="mdi:home-map-marker"></ha-icon>
                </div>
              </div>
            `
          : ''}
      </ha-card>
    `;
  }

  moreInfo() {
    this.dispatchEvent(new CustomEvent('hass-more-info', { bubbles: true, composed: true }));
  }

  startMower() {
    this.callService(this.vendor === 'ecovacs' ? 'turn_on' : 'start');
  }

  stopMower() {
    this.callService(this.vendor === 'ecovacs' ? 'turn_off' : 'stop');
  }

  returnMower() {
    this.callService('return_to_base');
  }

  callService(service) {
    this._hass.callService('vacuum', service, { entity_id: this._config.entity });
  }

  fireEvent(type, options = {}) {
    const event = new CustomEvent(type, {
      bubbles: options.bubbles || true,
      cancelable: options.cancelable || true,
      composed: options.composed || true,
      detail: { entityId: this._config.entity },
    });
    this.shadowRoot.dispatchEvent(event);
    return event;
  }

  getCardSize() {
    if (this.name && this.buttons) return 5;
    if (this.name || this.buttons) return 4;
    return 3;
  }

  setConfig(config) {
    if (!config.entity) throw new Error('Please define an entity.');
    if (config.entity.split('.')[0] !== 'vacuum')
      throw new Error('Please define a vacuum entity.');

    this.buttons = config.buttons !== false;
    this.padding = `padding: ${this.buttons ? '16px 16px 4px' : '16px'}`;
    this.background = config.background !== false
      ? `background-image: url('/local/${config.background || 'img/mower.png'}')`
      : '';
    this.text = `color: ${config.background !== false
      ? 'white; text-shadow: 0 0 10px black;'
      : 'var(--primary-text-color)'}`;

    this.vendor = config.vendor || 'gardena';
    this.showDetails = this.vendor !== 'ecovacs';

    this._config = config;
  }

  set hass(hass) {
    this._hass = hass;

    if (hass && this._config) {
      this.stateObj = this._config.entity in hass.states
        ? hass.states[this._config.entity]
        : null;

      if (this.stateObj) {
        this.name =
          this._config.name !== false &&
          (this._config.name || this.stateObj.attributes.friendly_name);
      }
    }
  }
}

customElements.define('my-gardena-card', MyGardenaCard);
