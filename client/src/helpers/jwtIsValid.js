import { decode } from 'js-base64'

export default function jwtIsValid() {
  try {
    const exp = JSON.parse(decode(localStorage.getItem('jwt').split('.')[1])).exp
    if (exp * 1000 > Date.now()) return true
  } catch {
    return false
  }
}