import Page from "../../domain/entities/page.js";

export default function blankPage() {
  return new Page({
    title: "Blank Page",
    name: "blank",
  });
}
