const { REGEX_EMAIL } = require("../helper/constant");
module.exports.validateRegisterInput = ({
  firstName,
  lastName,
  email,
  post,
  password,
  confirmPassword,
  phoneNumber,
}) => {
  const errors = {};
  if (!!!firstName) {
    errors.firstName = "Veuillez saisir votre Prénom";
  }
  if (!!!lastName) {
    errors.lastName = "Veuillez saisir votre Nom";
  }
  if (!!!email) {
    errors.email = "Veuillez saisir votre Email";
  } else {
    if (!email.match(REGEX_EMAIL)) {
      errors.email = "Votre adresse email est invalide";
    }
  }

  if (!!!post) {
    errors.post = "Veuillez defenir votre poste";
  }
  if (!!!phoneNumber) {
    errors.phoneNumber = "Veuillez saisir votre numéro de telephone";
  } else if (phoneNumber.length !== 8) {
    errors.phoneNumber = "Votre numero doit contenir 8 chiffres";
  }
  if (!!!password) {
    errors.password = "Veuillez saisir votre mot de passe";
  } else if (!!!confirmPassword) {
    errors.confirmPassword = "Merci de confirmer votre mot de passe";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Votre mot de passe est non conforme";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (email, password) => {
  const errors = {};

  if (!!!password) {
    errors.password = "Merci de mentionner votre mot de passe";
  }

  if (!!!email) {
    errors.email = "Merci de mentionner votre email";
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Votre adresse email est invalide";
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
