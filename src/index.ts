import { Maskito, MaskitoElement } from "@maskito/core";
import { maskitoDateOptionsGenerator } from "@maskito/kit";

export const numbers = /^(?:\d{4}[ -]?){0,3}\d{0,4}$/;

export const masks = {
  // Visa: Starts with 4, 13 or 16 digits
  visa: {
    final: /^4[0-9]{12}(?:[0-9]{3})?$/, // Exactly 13 or 16 digits
    start: /^4/, // Checks if the input starts with 4
    mask: [
      ...new Array(4).fill(/\d/),
      " ",
      ...new Array(4).fill(/\d/),
      " ",
      ...new Array(4).fill(/\d/),
      " ",
      ...new Array(4).fill(/\d/),
      " ",
      ...new Array(3).fill(/\d/), // Optional for 13-digit cards
    ],
  },

  // MasterCard: Starts with 51-55, 16 digits
  mastercard: {
    final: /^5[1-5][0-9]{14}$/, // Exactly 16 digits
    start: /^5[1-5]/, // Checks if the input starts with 51-55
    mask: [
      ...new Array(4).fill(/\d/),
      " ",
      ...new Array(4).fill(/\d/),
      " ",
      ...new Array(4).fill(/\d/),
      " ",
      ...new Array(4).fill(/\d/),
    ],
  },

  // American Express: Starts with 34 or 37, 15 digits
  amex: {
    final: /^3[47][0-9]{13}$/, // Exactly 15 digits
    start: /^3[47]/, // Checks if the input starts with 34 or 37
    mask: [
      ...new Array(4).fill(/\d/),
      " ",
      ...new Array(6).fill(/\d/),
      " ",
      ...new Array(5).fill(/\d/),
    ],
  },

  // Discover: Starts with 6011 or 65 or 64[4-9], 16 digits
  discover: {
    final: /^6(?:011|5[0-9]{2})[0-9]{12}$/, // Exactly 16 digits
    start: /^(6011|65|64[4-9])/, // Checks if the input starts with 6011, 65, or 64 followed by 4-9
    mask: [
      ...new Array(4).fill(/\d/),
      " ",
      ...new Array(4).fill(/\d/),
      " ",
      ...new Array(4).fill(/\d/),
      " ",
      ...new Array(4).fill(/\d/),
    ],
  },

  // Diners Club: Starts with 30[0-5], 36, 38, or 39, 14 digits
  diners: {
    final: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/, // Exactly 14 digits
    start: /^(30[0-5]|36|38|39)/, // Checks if the input starts with 30-35, 36, 38, or 39
    mask: [
      ...new Array(4).fill(/\d/),
      " ",
      ...new Array(4).fill(/\d/),
      " ",
      ...new Array(4).fill(/\d/),
    ],
  },

  // JCB: Starts with 2131, 1800, or 35[0-9]{3}, 15 or 16 digits
  jcb: {
    final: /^(?:2131|1800|35\d{3})\d{11}$/, // Exactly 15 or 16 digits
    start: /^(2131|1800|35[0-9]{3})/, // Checks if the input starts with 2131, 1800, or 35 followed by 3 digits
    mask: [
      ...new Array(4).fill(/\d/),
      " ",
      ...new Array(4).fill(/\d/),
      " ",
      ...new Array(4).fill(/\d/),
      " ",
      ...new Array(3).fill(/\d/), // Optional for 15-digit cards
    ],
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
          return masks.visa.mask;
        }

        if (masks.mastercard.start.test(state.value)) {
          return masks.mastercard.mask;
        }

        if (masks.amex.start.test(state.value)) {
          return masks.amex.mask;
        }

        if (masks.discover.start.test(state.value)) {
          return masks.discover.mask;
        }

        if (masks.diners.start.test(state.value)) {
          return masks.diners.mask;
        }

        if (masks.jcb.start.test(state.value)) {
          return masks.jcb.mask;
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
      mask: () => {
        if (this.type() === "amex") {
          return [/\d/, /\d/, /\d/, /\d/];
        }

        return [/\d/, /\d/, /\d/];
      },
    });
  }

  check() {
    const number =
      masks.visa.final.test(this.value("number")!) ||
      masks.mastercard.final.test(this.value("number")!) ||
      masks.amex.final.test(this.value("number")!) ||
      masks.discover.final.test(this.value("number")!) ||
      masks.diners.final.test(this.value("number")!) ||
      masks.jcb.final.test(this.value("number")!);

    const date = new RegExp("^(0[1-9]|1[0-2])/(?:\\d{2})$").test(
      this.date.value
    );

    const cvv =
      this.type() === "amex"
        ? new RegExp("^[0-9]{4}$").test(this.cvv.value)
        : new RegExp("^[0-9]{3}$").test(this.cvv.value);

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
      return this.number.value.replace(/\s+/g, "");
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

declare global {
  interface Window {
    SimpleCard: typeof SimpleCard;
    createSimpleCard: typeof createSimpleCard;
  }
}

window.SimpleCard = SimpleCard;
window.createSimpleCard = createSimpleCard;

export function createSimpleCard(options: Options) {
  return new SimpleCard(options);
}
