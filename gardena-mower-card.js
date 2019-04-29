class GardenaMowerCard extends Polymer.Element {

    static get template() {
        return Polymer.html`
          <style>
            .background {
              background-repeat: no-repeat;
              background-position: center center;
              background-size: cover;
            }
            .title {
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
              justify-content: space-evenly;
            }
            .button {
              cursor: pointer;
              padding: 16px;
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
              padding-right: 10px;
              border-right: 2px solid var(--primary-color);
            }
          </style>
          <ha-card hass="[[_hass]]" config="[[_config]]" class="background" style="[[background]]">
            <template is="dom-if" if="{{name}}">
              <div class="title" style="[[text]]">[[name]]</div>
            </template>
            <div class="content" on-click="moreInfo" style="[[padding]]">
              <div class="grid" style="[[text]]">
                <div class="grid-content grid-left">
                  <div>Status: [[stateObj.attributes.status]]</div>
                  <div>Battery: [[stateObj.attributes.battery_level]] %</div>
                  <div>Radio: [[stateObj.attributes.radio_quality]] %</div>
                  <div>Next Start: [[stateObj.attributes.timestamp_next_start]]</div>
                </div>
                <template is="dom-if" if="{{showDetails}}">
                  <div class="grid-content grid-right" >
                    <div>Charging Cycles: [[stateObj.attributes.charging_cycles]]</div>
                    <div>Collisions: [[stateObj.attributes.collisions]]</div>
                    <div>Cutting Time: [[stateObj.attributes.cutting_time]] h</div>
                    <div>Running Time: [[stateObj.attributes.running_time]] h</div>
                  </div>
                </template>
              </div>
            </div>
            <template is="dom-if" if="{{buttons}}">
              <div class="flex">
                <div class="button" on-tap="startMower">
                  <ha-icon icon="mdi:play"></ha-icon>
                </div>
                <div class="button" on-tap="stopMower">
                  <ha-icon icon="mdi:stop"></ha-icon>
                </div>
                <div class="button" on-tap="returnMower">
                  <ha-icon icon="mdi:home-map-marker"></ha-icon>
                </div>
              </div>
            </template>
          </ha-card>
        `;
    }

    moreInfo() { this.fireEvent('hass-more-info'); }
    startMower() { this.callService(this.vendor === 'ecovacs' ? 'turn_on' : 'start'); }
    stopMower() { this.callService(this.vendor === 'ecovacs' ? 'turn_off' : 'stop'); }
    returnMower() { this.callService('return_to_base'); }

    callService(service) {
        this._hass.callService('vacuum', service, {entity_id: this._config.entity});
    }

    fireEvent(type, options = {}) {
        const event = new Event(type, {
            bubbles: options.bubbles || true,
            cancelable: options.cancelable || true,
            composed: options.composed || true,
        });
        event.detail = {entityId: this._config.entity};
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
        if (config.entity.split('.')[0] !== 'vacuum') throw new Error('Please define a vacuum entity.');

        this.buttons = config.buttons !== false;
        this.padding = `padding: ${this.buttons ? '16px 16px 4px' : '16px'}`;
        this.background = config.background !== false ? `background-image: url('/local/${config.background || 'img/mower.png'}')` : '';
        this.text = `color: ${config.background !== false ? 'white; text-shadow: 0 0 10px black;' : 'var(--primary-text-color)'}`;

        this.vendor = config.vendor || 'gardena';
        this.showDetails = this.vendor !== 'ecovacs';

        this._config = config;
    }

    set hass(hass) {
        this._hass = hass;

        if (hass && this._config) {
            this.stateObj = this._config.entity in hass.states ? hass.states[this._config.entity] : null;

            if (this.stateObj) {
                this.name = this._config.name !== false && (this._config.name || this.stateObj.attributes.friendly_name);
            }
        }
    }
}

customElements.define('gardena-mower-card', GardenaMowerCard);
