## orchy-next-plugin

This plugin allows you to store your data inside the `local` or `session` storage using the `orchy's eventBus`.

### Plugin configuration

The plugin accepts one attribute:
- `strategy`: it is used to configure the storage kind for your data. Actually only `local` and `session` are supported.

The plugin accepts one property:
- `eventBus`: the `orchy's eventBus` instance.

#### Configuration example

Note that the `eventBus` property will be automatically injected by `orchy`.

#### JSON

```json
{
    "type": "element",
    "tag": "orchy-next-plugin",
    "url": "//localhost:3000/orchy-next-plugin.js",
    "attributes": {
        "strategy": "local", // or "session"
    }
}
```

#### HTML

```html
<script type="module" src="//localhost:3000/orchy-next-plugin.js"></script>
<orchy-next-plugin orchy-element strategy="local"></orchy-next-plugin>
```

### EventBus messages

#### Retrieve data

To retrieve your data, you should send a message following this format:
```javascript
{
    label: 'orchy-storage:get',
    payload: {
        key: any;
    }
}
```

The label has been defined as a constant in the `OrchyStorageEventsLabels.GET` module.  
We suggest to use the `orchyStorageEventsBuilder.get` function to create this structure.

If your data is correctly retrieved, you will receive a message with the following format:
```javascript
{
    label: 'orchy-storage:get:result',
    payload: {
        key: any;
        value: any;
    }
}
```

The label has been defined as a constant in the `OrchyStorageEventsLabels.GET_RESULT` module.

#### Insert data
To insert your data, you should send a message following this format:
```javascript
{
    label: 'orchy-storage:post',
    payload: {
        key: any;
        value: any;
    }
}
```

The label has been defined as a constant in the `OrchyStorageEventsLabels.POST` module.  
We suggest to use the `orchyStorageEventsBuilder.post` function to create this structure.

#### Delete data
To delete your data, you should send a message following this format:
```javascript
{
    label: 'orchy-storage:delete',
    payload: {
        key: any;
    }
}
```

The label has been defined as a constant in the `OrchyStorageEventsLabels.DELETE` module.  
We suggest to use the `orchyStorageEventsBuilder.delete` function to create this structure.

#### Clear all data
To clear all data, you should send a message following this format:
```javascript
{
    label: 'orchy-storage:clear',
}
```

The label has been defined as a constant in the `OrchyStorageEventsLabels.CLEAR` module.  
We suggest to use the `orchyStorageEventsBuilder.clear` function to create this structure.