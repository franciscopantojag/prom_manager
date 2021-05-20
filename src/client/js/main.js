/* eslint-disable */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'bootstrap/dist/js/bootstrap';
import submitRegisterForm from './submitRegisterForm';
import inputFileVoucherIndexOnChange from './inputFileVoucherIndexOnChange';
const form = document.getElementById('registerUserForm');
if (form) {
  form.onsubmit = submitRegisterForm;
}
const formControlFile1 = document.getElementById('inputFileVoucherIndex');
if (formControlFile1) {
  formControlFile1.onchange = (e) => {
    inputFileVoucherIndexOnChange(e, formControlFile1);
  };
}
const formEditAndCreateDue = document.querySelector(
  "form[id='formEditAndCreateDue']"
);

if (formEditAndCreateDue) {
  const dueTotal = document.querySelector(
    "form[id='formEditAndCreateDue'] input[name='dueTotal']"
  );
  dueTotal.onkeydown = (e, r) => {
    const dueTotalValue = Number(e.target.value);
    if (dueTotalValue < 0) {
      dueTotal.classList.add('is-invalid');
    } else {
      dueTotal.classList.remove('is-invalid');
    }
  };
  formEditAndCreateDue.onsubmit = () => {
    if (Number(dueTotal.value) < 0) {
      dueTotal.classList.add('is-invalid');
      return false;
    }
  };
}
