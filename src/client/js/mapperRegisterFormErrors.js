/* eslint-disable */
export default function (inputId, error) {
  const element = document.querySelector(
    `div[input-id=${inputId}][class='invalid-feedback']`
  );
  const input = document.getElementById(inputId);
  if (input) {
    input.classList.add('is-invalid');
  }
  if (element) {
    element.innerHTML = error;
  }
}
