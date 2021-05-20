/* eslint-disable */
export default function (inputId) {
  const element = document.querySelector(
    `div[input-id=${inputId}][class='invalid-feedback']`
  );
  const input = document.getElementById(inputId);
  if (input) {
    input.classList.remove('is-invalid');
  }
  if (element) {
    element.innerHTML = '';
  }
}
