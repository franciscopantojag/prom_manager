/* eslint-disable */
import axios from 'axios';
import mapper from './mapperRegisterFormErrors';
import removeError from './removeErrorRegisterForm';
export default async function (e) {
  e.preventDefault();
  const data = new FormData(e.target);
  const formToSend = Object.fromEntries(data.entries());
  const keys = ['email', 'password', 'firstName', 'lastName', 'dni'];
  keys.forEach((a) => removeError(a));
  try {
    const response = await axios.post('/register', formToSend);
    if (response.data) {
      if (response.data.ok === 'ok') {
        window.location.assign('/');
      }
    }
  } catch (err) {
    if (err.response) {
      if (err.response.status === 400) {
        const { errors } = err.response.data;
        if (errors) {
          for (let key in errors) {
            mapper(key, errors[key]);
          }
        }
      } else if (err.response.data.ok === 'ok') {
        window.location.assign('/');
      }
    }
  }
}
