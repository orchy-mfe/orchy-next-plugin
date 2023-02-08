## orchy-next-plugin

This plugin allows you render in `orchy` a `Next.js` application.

### Plugin configuration

The plugin accepts one attribute:
- `nextBase`: the path where your `Next.js` application is exposed.

#### Configuration example

#### JSON

```json
{
    "type": "element",
    "tag": "orchy-next-plugin",
    "url": "//localhost:3000/orchy-next-plugin.js",
    "attributes": {
        "nextBase": "http://localhost:3001"
    }
}
```

#### HTML

```html
<script type="module" src="//localhost:3000/orchy-next-plugin.js"></script>
<orchy-next-plugin orchy-element nextBase="http://localhost:3001"></orchy-next-plugin>
```