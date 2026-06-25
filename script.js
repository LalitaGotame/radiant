 

'use strict';



const getEl = (id) => document.getElementById(id);

const showError = (boxId, errorId, message) => {
  const box = getEl(boxId);
  const err = getEl(errorId);
  if (box) box.classList.add('is-invalid-box');
  if (err) err.textContent = message;
};

const clearError = (boxId, errorId) => {
  const box = getEl(boxId);
  const err = getEl(errorId);
  if (box) box.classList.remove('is-invalid-box');
  if (err) err.textContent = '';
};


const isValidEmail = (email) => {
  const trimmed = email.trim();
  const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._%+\-]{0,62}[a-zA-Z0-9]@[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,10}$/;

  if (trimmed.includes('..')) return false;

  return emailRegex.test(trimmed);
};


const attachPasswordToggle = (toggleId, inputId) => {
  const toggle = getEl(toggleId);
  const input  = getEl(inputId);
  if (!toggle || !input) return;             // element not on this page — skip

  toggle.addEventListener('click', () => {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    // Font Awesome classes
    toggle.classList.toggle('fa-eye',      !isPassword);
    toggle.classList.toggle('fa-eye-slash', isPassword);

    // Bootstrap Icons classes (login page uses these)
    toggle.classList.toggle('bi-eye',      !isPassword);
    toggle.classList.toggle('bi-eye-slash', isPassword);
  });
};




attachPasswordToggle('togglePassword',        'password');
attachPasswordToggle('toggleConfirmPassword', 'confirmPassword');



const photoInput = getEl('photo');
if (photoInput) {
  photoInput.addEventListener('change', function () {
    const file = this.files[0];
    const preview = getEl('imagePreview');
    if (!preview) return;

    if (file) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = 'block';

      const label = getEl('photoLabel');
      if (label) label.textContent = file.name;
    } else {
      preview.style.display = 'none';
      const label = getEl('photoLabel');
      if (label) label.textContent = 'Select image';
    }
  });
}



const validateRegistrationForm = () => {
  let isValid = true;

  // ── Full Name ──────────────────────────────
  const fullname = getEl('fullname')?.value.trim() ?? '';
  if (!fullname) {
    showError('fullnameBox', 'fullnameError', 'Full name is required.');
    isValid = false;
  } else if (fullname.length < 2) {
    showError('fullnameBox', 'fullnameError', 'Name must be at least 2 characters.');
    isValid = false;
  } else {
    clearError('fullnameBox', 'fullnameError');
  }

  // ── Date of Birth (min age 16) ─────────────
  const dobValue = getEl('dob')?.value ?? '';
  if (!dobValue) {
    showError('dobBox', 'dobError', 'Date of birth is required.');
    isValid = false;
  } else {
    const today   = new Date();
    const dob     = new Date(dobValue);
    // Calculate age precisely
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    if (age < 16) {
      showError('dobBox', 'dobError', 'You must be at least 16 years old.');
      isValid = false;
    } else {
      clearError('dobBox', 'dobError');
    }
  }

  // ── Email ──────────────────────────────────
  const email = getEl('email')?.value.trim() ?? '';
  if (!email) {
    showError('emailBox', 'emailError', 'Email is required.');
    isValid = false;
  } else if (!isValidEmail(email)) {
    showError('emailBox', 'emailError', 'Please enter a valid email address.');
    isValid = false;
  } else {
    clearError('emailBox', 'emailError');
  }

  // ── Gender (radio) ─────────────────────────
  const genderSelected = document.querySelector('input[name="gender"]:checked');
  const genderError    = getEl('genderError');
  if (!genderSelected) {
    if (genderError) genderError.textContent = 'Please select your gender.';
    isValid = false;
  } else {
    if (genderError) genderError.textContent = '';
  }

  // ── Role (radio) ───────────────────────────
  const roleSelected = document.querySelector('input[name="role"]:checked');
  const roleError    = getEl('roleError');
  if (!roleSelected) {
    if (roleError) roleError.textContent = 'Please select your role.';
    isValid = false;
  } else {
    if (roleError) roleError.textContent = '';
  }

  // ── Address ────────────────────────────────
  const address = getEl('address')?.value.trim() ?? '';
  if (!address) {
    showError('addressBox', 'addressError', 'Address is required.');
    isValid = false;
  } else {
    clearError('addressBox', 'addressError');
  }

  // ── Phone (Nepal format) ───────────────────
  // Nepal numbers: start with 97/98 (mobile) or 01 (landline), 10 digits total.
  const phone = getEl('phone')?.value.trim() ?? '';
  const nepalPhoneRegex = /^(97|98)\d{8}$|^0[1-9]\d{6,8}$/;
  if (!phone) {
    showError('phoneBox', 'phoneError', 'Phone number is required.');
    isValid = false;
  } else if (!nepalPhoneRegex.test(phone)) {
    showError('phoneBox', 'phoneError', 'Enter a valid Nepal phone number (e.g. 98XXXXXXXX).');
    isValid = false;
  } else {
    clearError('phoneBox', 'phoneError');
  }

  // ── Photo ──────────────────────────────────
  const photoFiles = getEl('photo')?.files ?? [];
  const photoError = getEl('photoError');
  if (photoFiles.length === 0) {
    const photoBox = getEl('photoBox');
    if (photoBox) photoBox.classList.add('is-invalid-box');
    if (photoError) photoError.textContent = 'Please upload a profile photo.';
    isValid = false;
  } else {
    const photoBox = getEl('photoBox');
    if (photoBox) photoBox.classList.remove('is-invalid-box');
    if (photoError) photoError.textContent = '';
  }

  // ── Password (strong) ─────────────────────
  // Rules: 8+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character
  const password = getEl('password')?.value ?? '';
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#^])[A-Za-z\d@$!%*?&_#^]{8,}$/;
  if (!password) {
    showError('passwordBox', 'passwordError', 'Password is required.');
    isValid = false;
  } else if (!strongPasswordRegex.test(password)) {
    showError(
      'passwordBox',
      'passwordError',
      'Min 8 chars with uppercase, lowercase, number & special character.'
    );
    isValid = false;
  } else {
    clearError('passwordBox', 'passwordError');
  }

  // ── Confirm Password ───────────────────────
  const confirmPassword = getEl('confirmPassword')?.value ?? '';
  if (!confirmPassword) {
    showError('confirmPasswordBox', 'confirmPasswordError', 'Please re-enter your password.');
    isValid = false;
  } else if (confirmPassword !== password) {
    showError('confirmPasswordBox', 'confirmPasswordError', 'Passwords do not match.');
    isValid = false;
  } else {
    clearError('confirmPasswordBox', 'confirmPasswordError');
  }

  return isValid;
};

// Attach submit listener only if the registration form exists on this page
const registerForm = getEl('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const valid = validateRegistrationForm();
    if (valid) {
      console.log('Registration form is valid. Ready to submit.');
      alert('Registration successful! Welcome to Radiant Elite Tutors.');
      // registerForm.submit(); // Uncomment for a real backend POST
    }
  });
}


const validateLoginForm = () => {
  let isValid = true;

  // ── Email ──────────────────────────────────
  const email = getEl('email')?.value.trim() ?? '';
  if (!email) {
    showError('emailBox', 'emailError', 'Email is required.');
    isValid = false;
  } else if (!isValidEmail(email)) {
    showError('emailBox', 'emailError', 'Please enter a valid email address.');
    isValid = false;
  } else {
    clearError('emailBox', 'emailError');
  }

  // ── Password ───────────────────────────────
  const password = getEl('password')?.value ?? '';
  if (!password) {
    showError('passwordBox', 'passwordError', 'Password is required.');
    isValid = false;
  } else {
    clearError('passwordBox', 'passwordError');
  }

  return isValid;
};

const loginForm = getEl('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const valid = validateLoginForm();
    if (valid) {
      console.log('Login form is valid. Ready to authenticate.');
      alert('Login successful!');
    }
  });
}

const loginsw=document.getElementById('activetab');
const signsw=document.getElementById('inactive')
const tabButtons = document.querySelectorAll('.login-tabs .btn');
if (tabButtons.length > 0) {
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Remove active state from all tabs
      tabButtons.forEach((b) => {
        b.classList.remove('active-tab');
        b.classList.add('inactive');
      });
      // Set active state on the clicked tab
      btn.classList.add('active-tab');
      btn.classList.remove('inactive');
    });
  });
}

const links = document.querySelectorAll('.navswitch a');

links.forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add('activetab');
    } else {
        link.classList.add('inactive');
    }
});