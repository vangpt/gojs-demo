// document.addEventListener("DOMContentLoaded", () => {
//   const includes = document.querySelectorAll("[data-include]");
//   includes.forEach(async (el) => {
//     const file = el.getAttribute("data-include");
//     const res = await fetch(`../../theme/components/${file}/${file}.html`);
//     if (res.ok) {
//       const html = await res.text();
//       el.innerHTML = html;
//     } else {
//       el.innerHTML = `<p>Failed to load ${file}.html</p>`;
//     }
//   });
// });
