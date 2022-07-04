# rp-canvas-paint

## Installation

```bash
npm i rp-canvas-paint
```

## Usage

with svelte

```
<script>
import {setup} from "rp-canvas-paint";
</script>

<canvas use:setup width="600" height="600"></canvas>
```

use it with the config file

```
import {setup,defaultConfig} from "rp-canvas-paint";
    defaultConfig.stroke.width=6;
    defaultConfig.stroke.style="rgb(255,160,30)";
    setup(node,defaultConfig)
}
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
