# Very Intuitive Modules

- Web Components
  - [Masonry](#masonry)
  - [Random Image](#random-image)

## Web Components

### Masonry
#### Source
[`web-components/vi-masonry.js`](web-components/vi-masonry.js)#### Usage

#### Usage
In `html`, use it like this, where:
- the `col-width` represents the ideal column width (in pixels)
- the `gap` represents the horizontal and vertical gap (in pixels)
```html
<vi-masonry col-width="100" gap="16">...</vi-masonry>
```
In `JS`, you have some helper functions:
```js
const masonry = document.querySelector("vi-masonry")

// sets the values and refreshes the element at once
masonry.refresh({ gap: 20, columnWidth: 200, transition: false })

// But you can also use the individual methods
masonry.gap()            // get the gap
masonry.gap(30)          // set the gap
masonry.columnWidth()    // get the column width
masonry.columnWidth(300) // set the column width
masonry.refresh()        // refreshes the UI

// An you can also chain them
masonry.gap(20).columnWidth(500).refresh()
```

### Random Image
#### Source
[`web-components/random-img.js`](web-components/random-img.js)

#### Usage
```html
<random-img></random-img>
```
