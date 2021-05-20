/* eslint-disable */
export default function (e, formControlFile1) {
  const output = document.getElementById('output');
  if (formControlFile1.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function () {
      output.src = reader.result;
      output.classList.remove('d-none');
    };
    reader.readAsDataURL(e.target.files[0]);
  } else {
    output.src = '';
    output.classList.add('d-none');
  }
}
