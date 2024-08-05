# Simple Card

Tiny library to help you with credit card inputs.

## Installation

### npm
```bash
npm i @invoiceninja/simple-card
```

## Usage

```html
<form>
    <input
        type="text"
        name="number"
        placeholder="0000 0000 0000 0000"
        id="number"
    />

    <input type="text" name="date" placeholder="mm/yy" id="date" />
    <input type="text" name="number" placeholder="000" id="cvv" />
</form>
```

```js
import { SimpleCard } from "@invoiceninja/simple-card";

const simpleCard = new SimpleCard({
  fields: {
    card: {
      number: "#number",
      cvv: "#cvv",
      date: "#date",
    },
  },
}).mount();
```

### Available methods

#### Check if the fields are valid:
```js
simpleCard.check()
```

#### Get the credit card type:
```js
simpleCard.type() // visa, mastercard .. or unknown.
```

## Contributing

### Requirements

- Node.js 20.x

You can start by cloning repository locally using git.

```bash
git clone https://github.com/invoiceninja/simple-card.git
npm i
npm run dev
```

Demo is available in demo.html after running `npm run dev`.

## Licence
The MIT License (MIT).