const status = require('../../utils/status.constants')
// Validators middleware functions......... 

function validateUserInputsForSignUp(req, res, next) {
  const errors = [];
  const sanitizedData = {
    full_name: req.body.full_name ? req.body.full_name.trim() : '',
    user_name: req.body.user_name ? req.body.user_name.trim() : '',
    email: req.body.email ? req.body.email.trim().toLowerCase() : '',
    password: req.body.password ? req.body.password.trim() : '',
    confirm_password: req.body.confirm_password ?  req.body.confirm_password.trim() : '',
  };


  if (!sanitizedData.full_name || typeof sanitizedData.full_name !== 'string') {
    errors.push('Invalid full name');
  }

  if (!sanitizedData.user_name || typeof sanitizedData.user_name !== 'string') {
    errors.push('Invalid Username');
  }

  if (!sanitizedData.email || typeof sanitizedData.email !== 'string') {
    errors.push('Invalid email');
  } else {
    if (!emailIsValid(sanitizedData.email)) {
      errors.push('Enter a valid email address');
    };
  }

  if (!sanitizedData.password || typeof sanitizedData.password !== 'string' || sanitizedData.password.length < 8) {
    errors.push('Invalid password and Password should be at least 8 characters');
  } else {

    if (!hasUppercaseLetter(sanitizedData.password)) {
      errors.push('Password should contain at least one uppercase letter');
    };
  };

  if (!sanitizedData.confirm_password || typeof sanitizedData.confirm_password !== 'string' || sanitizedData.confirm_password.length < 8) {
    errors.push('Invalid password and Password should be at least 8 characters');
  } else {

    if (!hasUppercaseLetter(sanitizedData.confirm_password)) {
      errors.push('Password should contain at least one uppercase letter');
    };
  };




  if (!errors.length) {
    req.body = sanitizedData;
    next()
  } else {
    res.status(status.HTTP_400_BAD_REQUEST).render('register', {message: errors[0]})
  }


}


function validateUserInputsForSignIn(req, res, next) {
  const errors = [];

  //sanitizing the req.body form datas to validate
  const sanitizedData = {
    email: req.body.user_name ? req.body.user_name.trim() : '',
    password: req.body.password ? req.body.password.trim() : '',

  };


  if (!sanitizedData.user_name || typeof sanitizedData.user_name !== 'string') {
    errors.push('Invalid Username');
  }

  if (!sanitizedData.password || typeof sanitizedData.password !== 'string' || sanitizedData.password.length < 8) {
    errors.push('invalid password and Password should be at least 8 characters');
  } else {
    if (!hasSpecialCharacter(sanitizedData.password)) {
      errors.push('Password should contain at least one special character');
    };

    if (!hasUppercaseLetter(sanitizedData.password)) {
      errors.push('Password should contain at least one uppercase letter');
    };
  };

  if (!errors.length) {
    req.body = sanitizedData;
    next();
  } else {
    res.status(status.HTTP_400_BAD_REQUEST).render('login', {message: errors[0]})
  }
}

function validateUserInputsForResetPassword(req, res, next) {
  const errors = [];

  //sanitizing the req.body form datas to validate
  const sanitizedData = {
    token: req.body.token ? req?.body?.token?.trim() : '',
    password: req.body?.password ? req?.body?.password?.trim() : '',

  };


  if (!sanitizedData.password || typeof sanitizedData.password !== 'string' || sanitizedData.password.length < 8) {
    errors.push('invalid password and Password should be at least 8 characters');
  } else {
    if (!hasSpecialCharacter(sanitizedData.password)) {
      errors.push('Password should contain at least one special character');
    };

    if (!hasUppercaseLetter(sanitizedData.password)) {
      errors.push('Password should contain at least one uppercase letter');
    };
  };

  if (!errors.length) {
    req.body = sanitizedData;
    next();
  } else {
    res.status(status.HTTP_400_BAD_REQUEST).json({ status: 400, message: errors[0] })
  }
}

function validateInstructorsInputsForResetPassword(req, res, next) {
  const errors = [];

  //sanitizing the req.body form datas to validate
  const sanitizedData = {
    token: req.body.token ? req?.body?.token?.trim() : '',
    new_password: req.body.new_password ? req?.body?.new_password.trim() : '',
    old_password: req.body.old_password ? req?.body?.old_password.trim() : '',

  };


  if (!sanitizedData.new_password || typeof sanitizedData.new_password !== 'string' || sanitizedData.new_password.length < 8) {
    errors.push('invalid password and Password should be at least 8 characters');
  } else {
    if (!hasSpecialCharacter(sanitizedData.new_password)) {
      errors.push('Password should contain at least one special character');
    };

    if (!hasUppercaseLetter(sanitizedData.new_password)) {
      errors.push('Password should contain at least one uppercase letter');
    };
  };

  if (!sanitizedData.old_password || typeof sanitizedData.old_password !== 'string' || sanitizedData.old_password.length < 8) {
    errors.push('invalid password and Password should be at least 8 characters');
  } else {
    if (!hasSpecialCharacter(sanitizedData.old_password)) {
      errors.push('Password should contain at least one special character');
    };

    if (!hasUppercaseLetter(sanitizedData.old_password)) {
      errors.push('Password should contain at least one uppercase letter');
    };
  };

  if (!errors.length) {
    req.body = sanitizedData;
    next();
  } else {
    res.status(status.HTTP_400_BAD_REQUEST).json({ status: 400, message: errors[0] })
  }
}

function validateUserInputsForRole(req, res, next) {
  const errors = [];

  //sanitizing the req.body form datas to validate
  const sanitizedData = {
    email: req.body.email ? req.body.email.trim().toLowerCase() : '',
    role: req.body.role ? req.body.role.trim().toLowerCase() : '',

  };


  if (!sanitizedData.email || typeof sanitizedData.email !== 'string') {
    errors.push('Invalid email');
  } else {
    if (!emailIsValid(sanitizedData?.email)) {
      errors.push('Enter a valid email address');
    };
  }

  if (!sanitizedData.role || typeof sanitizedData.role !== 'string') {
    errors.push('invalid role');
  }

  if (!errors.length) {
    req.body = sanitizedData;
    next();
  } else {
    res.status(status.HTTP_400_BAD_REQUEST).json({ status: 400, message: errors[0] })
  }
}


function comparePassword(req, res, next) {
  const errors = [];
  if (req.body.password === req.body.confirm_password) {
    next()
  } else {
    errors.push('Passwords not match');
    res.status(status.HTTP_400_BAD_REQUEST).json({ status: 400, message: errors[0] })
  }

}


function inputAreAllNumbers(password) {
  const phoneAreNumbers = /[0-9]/;
  return phoneAreNumbers.test(password);
}


// Check if the password contains at least one special character
function hasSpecialCharacter(password) {
  const specialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
  return specialChars.test(password);//note that the .text method return boolean value true or false
}

// Check if the password contains at least one uppercase letter
function hasUppercaseLetter(password) {
  const uppercaseChars = /[A-Z]/;
  return uppercaseChars.test(password);//note that the .text method return boolean value true or false
}

// Check if the email contains the valid character
function emailIsValid(email) {
  const emailChars = /[@.]/;
  return emailChars.test(email);//note that the .text method return boolean value true or false
}

function getFirstLetters(fullname){
  const firstLetter = fullname.split(" ")[0].slice(0, 1).toUpperCase();
  const secondLetter = fullname.split(" ")[1].slice(0, 1).toUpperCase();

  return `${firstLetter+secondLetter}`
}

function capitalizeString(str) {
  if (!str) return str; 
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}



module.exports = {
  validateUserInputsForSignUp,
  validateUserInputsForSignIn,
  validateUserInputsForRole,
  validateUserInputsForResetPassword,
  validateInstructorsInputsForResetPassword,
  comparePassword
}