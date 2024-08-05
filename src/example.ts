import { SimpleCard } from ".";

const sc = new SimpleCard({
  fields: {
    card: {
      number: "#number",
      cvv: "#cvv",
      date: "#date",
    },
  },
}).mount();

const elements = ["#number", "#cvv", "#date"];
const type = document.querySelector("#type") as HTMLSpanElement;
const valid = document.querySelector("#valid") as HTMLSpanElement;

valid.innerText = `${sc.check().valid}`;
type.innerText = `${sc.type()}`;

for (const element of elements) {
  document.querySelector(element)?.addEventListener("input", () => {
    valid.innerText = `${sc.check().valid}`;
    type.innerText = `${sc.type()}`;
  });
}
