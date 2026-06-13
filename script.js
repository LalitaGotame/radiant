

const rules = {
    fullname: {
        required: true,
        message: "Fullname required"
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.com$/,
    message: "Enter a valid email"
    },
    dob: {
        required: true,
        minAge:16,
        message: "Date of Birth required",
        minMessage:"You must be atleast 16 years old"
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
       pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
        message: "Password not strong enough"
    }
};

const today = new Date();
const maxDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
document.getElementById("dob").max = maxDate.toISOString().split("T")[0];
document.getElementById("dob").min = minDate.toISOString().split("T")[0];


 function showError(input, message) {
    const box = input.closest(".field-box") || input.closest(".photo-box");
    if (box) box.classList.add("is-invalid-box");
    const errorDiv = document.getElementById(input.id + "Error");
    if (errorDiv) errorDiv.textContent = message;
}

function clearError(input) {
    const box = input.closest(".field-box") || input.closest(".photo-box");
    if (box) box.classList.remove("is-invalid-box");
    const errorDiv = document.getElementById(input.id + "Error");
    if (errorDiv) errorDiv.textContent = "";
}

document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();

    let hasError = false;

   

    for (let key in rules) {
        let rule = rules[key];

        if (key === "dob") {
            const dobInput = document.getElementById("dob");
            if (!dobInput.value) {
                showError(dobInput, rule.message);
                hasError = true;
            } else {
                const dobValue = new Date(dobInput.value);
                const minAge = new Date();
                minAge.setFullYear(minAge.getFullYear() - rule.minAge);
                if (dobValue > minAge) {
                    showError(dobInput, rule.minMessage);
                    hasError = true;
                } else {
                    clearError(dobInput);
                }
            }
            continue;
        }

        
        if (key === "gender") {
            const checked = document.querySelector('input[name="gender"]:checked');
            if (!checked) {
               document.getElementById("genderError").textContent=rule.message;
               hasError=true;
            } else {
                document.getElementById("genderError").textContent="";
            }
            continue;
        }

        
        if (key === "role") {
            const checked = document.querySelector('input[name="role"]:checked');
           if (!checked) {
              document.getElementById("roleError").textContent=rule.message;
              hasError=true;
            } else {
                document.getElementById("roleError").textContent="";
            }
            continue;
        }

       
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
        
        

        
        let input = document.getElementById(key);
        let value = input.value.trim();

        clearError(input);

        if (rule.required && value === "") {
            showError(input, rule.message);
            hasError = true;
            continue;
        }

        if (rule.pattern && !rule.pattern.test(value)) {
            showError(input, rule.message); 
            hasError = true;
            continue;
        }
        
    }

   
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    
    if (password !== confirmPassword) {
        showError(document.getElementById("confirmPassword"), "Passwords do not match");
        hasError = true;
    }else{
        clearError(document.getElementById("confirmPassword"));
    }

    
    if (hasError) return;

    alert("Form submitted successfully!");
});

document.getElementById("togglePassword").addEventListener("click",function(){
    const pwd=document.getElementById("password");
    if(pwd.type==="password"){
        pwd.type="text";
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");
    }else{
        pwd.type="password";
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");
    }
});

document.getElementById("toggleConfirmPassword").addEventListener("click", function () {
    const pwd = document.getElementById("confirmPassword");
    if (pwd.type === "password") {
        pwd.type = "text";
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");
    } else {
        pwd.type = "password";
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");
    }
});