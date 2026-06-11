const rules = {
    fullname: {
        required: true,
        message: "Fullname required"
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Enter a valid email"
    },
    dob: {
        required: true,
        message: "Date of Birth required"
    },
    gender: {
        required: true,
        type: "radio",
        message: "Please select gender"
    },
    role: {
        required: true,
        type: "radio",
        message: "Please select role"
    },
    address: {
        required: true,
        message: "Please enter your address"
    },
    phone: {
        required: true,
        pattern: /^(?:\+977)?9\d{9}$/,
        message: "Enter a valid phone number"
    },
    photo: {
        required: true,
        message: "Please upload an image"
    },
    password: {
        required: true,
        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
        message: "Password not strong enough"
    }
};

document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();

    let hasError = false;

    function showError(input, message) {
        const errorDiv = document.getElementById(input.id + "Error");
        input.classList.add("is-invalid");
        if (errorDiv) errorDiv.textContent = message;
    }

    function clearError(input) {
        const errorDiv = document.getElementById(input.id + "Error");
        input.classList.remove("is-invalid");
        if (errorDiv) errorDiv.textContent = "";
    }

    for (let key in rules) {
        let rule = rules[key];

        // Gender - radio button, handled separately
        if (key === "gender") {
            const checked = document.querySelector('input[name="gender"]:checked');
            if (!checked) {
                document.getElementById("genderError").textContent = rule.message;
                hasError = true;
            } else {
                document.getElementById("genderError").textContent = "";
            }
            continue;
        }

        // Role - radio button, handled separately
        if (key === "role") {
            const checked = document.querySelector('input[name="role"]:checked');
            if (!checked) {
                document.getElementById("roleError").textContent = rule.message;
                hasError = true;
            } else {
                document.getElementById("roleError").textContent = "";
            }
            continue;
        }

        // Photo - file input, handled separately
        if (key === "photo") {
            const photoInput = document.getElementById("photo");
            if (photoInput.files.length === 0) {
                showError(photoInput, rule.message);
                hasError = true;
            } else {
                clearError(photoInput);
            }
            continue;
        }

        // All other fields
        let input = document.getElementById(key);
        let value = input.value.trim();

        clearError(input);

        if (rule.required && value === "") {
            showError(input, rule.message);
            hasError = true;
            continue;
        }

        if (rule.pattern && !rule.pattern.test(value)) {
            showError(input, rule.message); // ✅ Fixed: was rules.message
            hasError = true;
            continue;
        }
    }

    // Confirm password check - outside the loop
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        showError(document.getElementById("confirmPassword"), "Passwords do not match");
        hasError = true;
    }

    // Final check - only submit if no errors
    if (hasError) return;

    alert("Form submitted successfully!");
});