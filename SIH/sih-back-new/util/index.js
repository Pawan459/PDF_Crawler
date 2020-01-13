const Helper = {
  isValidEmail(email) {
    return /^[a-z0-9][a-z0-9-_\.]+@[a-z0-9][a-z0-9-]+[a-z0-9]\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/.test(email);
  },
  isValidNumber(number) {
      return /^[0-9]{10}$/.test(number);
  }
}

module.exports = Helper;
