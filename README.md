# gardena-mower-card

Simple card for Gardena robotmower in Home Assistant's Lovelace UI. Using this component to add Gardena to Home Assistant:
https://github.com/wijnandtop/home_assistant_gardena/tree/master/gardena. Based on the work done by benct since Gardena uses the same Vacuum class: https://github.com/benct/lovelace-xiaomi-vacuum-card.

[![GH-release](https://img.shields.io/badge/version-0.3-red.svg?style=flat-square)](https://raw.githubusercontent.com/Cavemanz/lovelace-gardena-mower-card/master/gardena-mower-card.js)
[![GH-last-commit](https://img.shields.io/github/last-commit/Cavemanz/lovelace-gardena-mower-card.svg?style=flat-square)](https://github.com/Cavemanz/lovelace-gardena-mower-card/commits/master)
[![GH-code-size](https://img.shields.io/github/languages/code-size/Cavemanz/lovelace-gardena-mower-card.svg?style=flat-square)](https://github.com/Cavemanz/lovelace-gardena-mower-card)

### Setup

Add [gardena-mower-card.js](https://raw.githubusercontent.com/Cavemanz/lovelace-gardena-mower-card/master/gardena-mower-card.js) to your `<config>/www/` folder. Add the following to your `ui-lovelace.yaml` file:

```yaml
resources:
  - type: js
    url: /local/gardena-mower-card.js?v=0.3
```
If you want to use the mower background image, add [img/mower.png](https://raw.githubusercontent.com/Cavemanz/lovelace-gardena-mower-card/master/img/mower.png) to `<config>/www/img/`.

### *(Optional)* Add to custom updater

1. Make sure you have the [custom_updater](https://github.com/custom-components/custom_updater) component installed and working.

2. Add a new reference under `card_urls` in your `custom_updater` configuration in `configuration.yaml`.

```yaml
custom_updater:
  card_urls:
    - https://raw.githubusercontent.com/Cavemanz/lovelace-gardena-mower-card/master/tracker.json
```

### Options

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `custom:gardena-mower-card`
| entity | string | **Required** | `vacuum.sileno`
| name | string/bool | `friendly_name` | Override entity friendly name (set to false to hide title)
| background | string/bool | `img/mower.png` | Custom path/name of background image (set to false to disable background)
| buttons | bool | `true` | Set to false to hide button row
| vendor | string | gardena | 

### Examples

![gardena-mower-card](https://raw.githubusercontent.com/Cavemanz/lovelace-gardena-mower-card/master/examples/default.png)

Hidden title/name

![gardena-mower-card-no-title](https://raw.githubusercontent.com/Cavemanz/lovelace-gardena-mower-card/master/examples/no-title.png)

Hidden button row

![gardena-mower-card-no-buttons](https://raw.githubusercontent.com/Cavemanz/lovelace-gardena-mower-card/master/examples/no-buttons.png)

No background image

![gardena-mower-card-no-background](https://raw.githubusercontent.com/Cavemanz/lovelace-gardena-mower-card/master/examples/no-background.png)

```yaml
type: 'custom:gardena-mower-card'
entity: vacuum.sileno
name: Gardena Sileno City 500
buttons: true
background: img/mower.png
```


### Disclaimer

This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Gardena, or any of its subsidiaries or its affiliates. The official Gardena website can be found at https://www.gardena.com/.
