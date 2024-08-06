import { Maskito, MaskitoElement } from "@maskito/core";
import { maskitoDateOptionsGenerator } from "@maskito/kit";

export const numbers = /^(?:\d{4}[ -]?){0,3}\d{0,4}$/;

export const masks = {
  // Visa: Starts with 4, 13 or 16 digits
  visa: {
    final: /^4(?:\d{3}[- ]?){3}\d{3,4}$/, // Exactly 13 or 16 digits
    start: /^4/, // Checks if the input starts with 4
    length: /^4\d{0,15}$/, // Strictly matches 1 to 16 digits after the initial 4, no spaces or dashes
  },

  // MasterCard: Starts with 51-55, 16 digits
  mastercard: {
    final: /^5[1-5]\d{3}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}$/, // Exactly 16 digits
    start: /^5[1-5]/, // Checks if the input starts with 51-55
    length: /^5[1-5]\d{0,15}$/, // Strictly matches 2 to 16 digits after the initial 51-55, no spaces or dashes
  },

  // American Express: Starts with 34 or 37, 15 digits
  amex: {
    final: /^3[47]\d{2}[- ]?\d{6}[- ]?\d{5}$/, // Exactly 15 digits
    start: /^3[47]/, // Checks if the input starts with 34 or 37
    length: /^3[47]\d{0,15}$/, // Strictly matches 2 to 15 digits after the initial 34 or 37, no spaces or dashes
  },

  // Discover: Starts with 6011 or 65 or 64[4-9], 16 digits
  discover: {
    final: /^(6011|65|64[4-9])\d{4}[- ]?\d{4}[- ]?\d{4}$/, // Exactly 16 digits
    start: /^(6011|65|64[4-9])/, // Checks if the input starts with 6011, 65, or 64 followed by 4-9
    length: /^(6011|65|64[4-9])\d{0,15}$/, // Strictly matches 4 to 16 digits after the initial prefix, no spaces or dashes
  },

  // Diners Club: Starts with 30[0-5], 36, 38, or 39, 14 digits
  diners: {
    final: /^(30[0-5]|36|38|39)\d{4}[- ]?\d{4}[- ]?\d{4}$/, // Exactly 14 digits
    start: /^(30[0-5]|36|38|39)/, // Checks if the input starts with 30-35, 36, 38, or 39
    length: /^(30[0-5]|36|38|39)\d{0,14}$/, // Strictly matches 2 to 14 digits after the initial prefix, no spaces or dashes
  },

  // JCB: Starts with 2131, 1800, or 35[0-9]{3}, 15 or 16 digits
  jcb: {
    final: /^(2131|1800|35[0-9]{3})\d{4}[- ]?\d{4}[- ]?\d{4}$/, // Exactly 15 or 16 digits
    start: /^(2131|1800|35[0-9]{3})/, // Checks if the input starts with 2131, 1800, or 35 followed by 3 digits
    length: /^(2131|1800|35[0-9]{3})\d{0,15}$/, // Strictly matches 4 to 16 digits after the initial prefix, no spaces or dashes
  },
};

export type TypeChangeOptions = {
  type: string;
  value: string;
  valid: boolean;
};

export type Options = {
  fields: {
    card: {
      number: string | HTMLInputElement;
      date: string | HTMLInputElement;
      cvv: string | HTMLInputElement;
      name?: string | HTMLInputElement;
    };
  };
};

export class SimpleCard {
  public declare number: HTMLInputElement;
  public declare date: HTMLInputElement;
  public declare cvv: HTMLInputElement;

  constructor(public options: Options) {}

  mount() {
    this.number =
      this.options.fields.card.number instanceof HTMLInputElement
        ? this.options.fields.card.number
        : (document.querySelector(
            this.options.fields.card.number
          ) as HTMLInputElement);

    this.date =
      this.options.fields.card.date instanceof HTMLInputElement
        ? this.options.fields.card.date
        : (document.querySelector(
            this.options.fields.card.date
          ) as HTMLInputElement);

    this.cvv =
      this.options.fields.card.cvv instanceof HTMLInputElement
        ? this.options.fields.card.cvv
        : (document.querySelector(
            this.options.fields.card.cvv
          ) as HTMLInputElement);

    this.#mask();

    return this;
  }

  #mask() {
    new Maskito(this.number as MaskitoElement, {
      mask: (state) => {
        if (masks.visa.start.test(state.value)) {
          return new RegExp(masks.visa.length);
        }

        if (masks.mastercard.start.test(state.value)) {
          return new RegExp(masks.mastercard.length);
        }

        if (masks.amex.start.test(state.value)) {
          return new RegExp(masks.amex.length);
        }

        if (masks.discover.start.test(state.value)) {
          return new RegExp(masks.discover.length);
        }

        if (masks.diners.start.test(state.value)) {
          return new RegExp(masks.diners.length);
        }

        if (masks.jcb.start.test(state.value)) {
          return new RegExp(masks.jcb.length);
        }

        return new RegExp(numbers);
      },
    });

    new Maskito(
      this.date as MaskitoElement,
      maskitoDateOptionsGenerator({
        mode: "mm/yy",
        separator: "/",
      })
    );

    new Maskito(this.cvv as MaskitoElement, {
      mask: [/\d/, /\d/, /\d/],
    });
  }

  check() {
    const number =
      masks.visa.final.test(this.number.value) ||
      masks.mastercard.final.test(this.number.value) ||
      masks.amex.final.test(this.number.value) ||
      masks.discover.final.test(this.number.value) ||
      masks.diners.final.test(this.number.value) ||
      masks.jcb.final.test(this.number.value);

    const date = new RegExp("^(0[1-9]|1[0-2])/(?:\\d{2})$").test(
      this.date.value
    );

    const cvv = new RegExp("^\\d{3}$").test(this.cvv.value);

    return {
      valid: number && date && cvv,
      number: {
        valid: number,
        value: this.number.value,
      },
      date: {
        valid: date,
        value: this.date.value,
      },
      cvv: {
        valid: cvv,
        value: this.cvv.value,
      },
    };
  }

  type() {
    if (masks.visa.start.test(this.number.value)) {
      return "visa";
    }

    if (masks.mastercard.start.test(this.number.value)) {
      return "mastercard";
    }

    if (masks.amex.start.test(this.number.value)) {
      return "amex";
    }

    if (masks.discover.start.test(this.number.value)) {
      return "discover";
    }

    if (masks.diners.start.test(this.number.value)) {
      return "diners";
    }

    if (masks.jcb.start.test(this.number.value)) {
      return "jcb";
    }

    return "unknown";
  }

  value(field: "number" | "date" | "year" | "month" | "cvv") {
    if (field === "number") {
      return this.number.value;
    }

    if (field === "date") {
      return this.date.value;
    }

    if (field === "year") {
      const [, year] = this.date.value.split("/");

      return year;
    }

    if (field === "month") {
      const [month] = this.date.value.split("/");

      return month;
    }

    if (field === "cvv") {
      return this.cvv.value;
    }

    return null;
  }
}
