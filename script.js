/**
 * script.js — Shared validation & UI script
 * Works for both the Registration page and the Login page.
 * Page detection is done by checking for specific form IDs.
 *
 * Radiant Elite Tutors
 */

'use strict';

/* ─────────────────────────────────────────────
   UTILITY HELPERS
   Shared by both pages.
───────────────────────────────────────────── */

/**
 * Returns the element with the given ID, or null if it doesn't exist.
 * Using this wrapper prevents "Cannot read property of null" crashes
 * when an element belongs only to one page.
 * @param {string} id
 * @returns {HTMLElement|null}
 */
const getEl = (id) => document.getElementById(id);

/**
 * Marks a field box as invalid and shows an error message.
 * @param {string} boxId      - ID of the .field-box wrapper element
 * @param {string} errorId    - ID of the .invalid-msg <span>
 * @param {string} message    - Error text to display
 */
const showError = (boxId, errorId, message) => {
  const box = getEl(boxId);
  const err = getEl(errorId);
  if (box) box.classList.add('is-invalid-box');
  if (err) err.textContent = message;
};

/**
 * Clears the invalid state from a field box.
 * @param {string} boxId   - ID of the .field-box wrapper element
 * @param {string} errorId - ID of the .invalid-msg <span>
 */
const clearError = (boxId, errorId) => {
  const box = getEl(boxId);
  const err = getEl(errorId);
  if (box) box.classList.remove('is-invalid-box');
  if (err) err.textContent = '';
};

/**
 * Validates an email address using a strict regex.
 *
 * Rules enforced:
 *  ✔ Local part (before @): letters, digits, and  . _ % + -  allowed
 *  ✔ Local part cannot start or end with a dot
 *  ✔ No consecutive dots allowed  (e.g. john..doe@  is invalid)
 *  ✔ Must have exactly one @  symbol
 *  ✔ Domain part: letters, digits, hyphens, dots allowed
 *  ✔ Domain cannot start or end with a hyphen
 *  ✔ TLD (e.g. .com .np .edu) must be 2–10 letters only
 *
 * Examples:
 *  ✅ valid:   user@gmail.com  |  john.doe@school.edu.np  |  info+tag@company.org
 *  ❌ invalid: @gmail.com  |  user@  |  user@.com  |  user..name@gmail.com
 *             user@gmail  |  user@-gmail.com  |  user @gmail.com
 *
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  const trimmed = email.trim();

  // Full regex broken into logical parts:
  // ^                          — start
  // [a-zA-Z0-9]                — local part must START with alphanumeric
  // [a-zA-Z0-9._%+\-]{0,62}   — middle of local part (allows . _ % + -)
  // [a-zA-Z0-9]                — local part must END with alphanumeric
  //   OR just one char:  [a-zA-Z0-9]{1}  (handles single-char local like a@b.com)
  // @                          — exactly one @ required
  // [a-zA-Z0-9]                — domain must START with alphanumeric
  // ([a-zA-Z0-9\-]{0,61}      — middle of domain label
  // [a-zA-Z0-9])?             — domain label must END with alphanumeric (optional if single char)
  // (\.[a-zA-Z0-9]            — dot-separated further domain labels (e.g. .edu in .edu.np)
  // ([a-zA-Z0-9\-]{0,61}
  // [a-zA-Z0-9])?)*
  // \.[a-zA-Z]{2,10}          — TLD: 2 to 10 letters only (no digits in TLD)
  // $                          — end

  const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._%+\-]{0,62}[a-zA-Z0-9]@[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,10}$/;

  // Extra check: no consecutive dots anywhere in the email
  if (trimmed.includes('..')) return false;

  return emailRegex.test(trimmed);
};

/**
 * Attaches a password show/hide toggle to a given eye icon + input pair.
 * Supports both Font Awesome (fa-eye / fa-eye-slash) and
 * Bootstrap Icons (bi-eye / bi-eye-slash).
 * @param {string} toggleId  - ID of the eye <i> element
 * @param {string} inputId   - ID of the password <input>
 */
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


/* ─────────────────────────────────────────────
   PASSWORD TOGGLES
   Initialised for both pages; getEl returns
   null for missing IDs so nothing breaks.
───────────────────────────────────────────── */

attachPasswordToggle('togglePassword',        'password');
attachPasswordToggle('toggleConfirmPassword', 'confirmPassword');


/* ─────────────────────────────────────────────
   PHOTO PREVIEW  (Registration page only)
   Moved here from the inline <script> in HTML.
───────────────────────────────────────────── */

const photoInput = getEl('photo');
if (photoInput) {
  photoInput.addEventListener('change', function () {
    const file = this.files[0];
    const preview = getEl('imagePreview');
    if (!preview) return;

    if (file) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = 'block';

      // Update the placeholder text to show the selected filename
      const label = getEl('photoLabel');
      if (label) label.textContent = file.name;
    } else {
      preview.style.display = 'none';
      const label = getEl('photoLabel');
      if (label) label.textContent = 'Select image';
    }
  });
}


/* ─────────────────────────────────────────────
   REGISTRATION PAGE
───────────────────────────────────────────── */

/**
 * Validates the registration form.
 * Returns true if all fields pass, false otherwise.
 * Each validator calls showError / clearError to update the UI.
 */
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
      // ✅ All fields passed — proceed with form submission / API call here
      console.log('Registration form is valid. Ready to submit.');
      alert('Registration successful! Welcome to Radiant Elite Tutors.');
      // registerForm.submit(); // Uncomment for a real backend POST
    }
  });
}


/* ─────────────────────────────────────────────
   LOGIN PAGE
───────────────────────────────────────────── */

/**
 * Validates the login form.
 * Returns true if all fields pass, false otherwise.
 */
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

// Attach submit listener only if the login form exists on this page
const loginForm = getEl('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const valid = validateLoginForm();
    if (valid) {
      // ✅ All fields passed — proceed with authentication here
      console.log('Login form is valid. Ready to authenticate.');
      alert('Login successful!');
      // loginForm.submit(); // Uncomment for a real backend POST
    }
  });
}


/* ─────────────────────────────────────────────
   LOGIN PAGE — TAB SWITCHER
   Toggles active-tab / inactive styling between
   "Student Login" and "Teacher Login" buttons.
───────────────────────────────────────────── */

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