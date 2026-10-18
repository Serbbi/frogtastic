export function validateEmail(e) {
    const email = e.target.value;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (email === "") {
        e.target.nextElementSibling.textContent = "Please fill out this field.";
    } else if (!emailRegex.test(email)) {
        e.target.nextElementSibling.textContent = "Please enter an email address.";
    } else {
        e.target.nextElementSibling.textContent = "";
        e.target.classList.remove("error-input");
    }
    if (e.target.nextElementSibling.textContent !== "") {
        e.target.classList.add("error-input");
    }
}

export function validateUsername(e) {
    const username = e.target.value;
    const usernameRegex = /^[a-zA-Z0-9._-]{3,30}$/;
    if (username === "") {
        e.target.nextElementSibling.textContent = "Please fill out this field.";
    } else if (username.length < 3) {
        e.target.nextElementSibling.textContent = "Username must be at least 3 characters long.";
    } else if (username.length > 30) {
        e.target.nextElementSibling.textContent = "Username must be at most 30 characters long.";
    } else if (!usernameRegex.test(username)) {
        e.target.nextElementSibling.textContent = "Username can only contain letters, numbers, periods, underscores, and dashes.";
    } else {
        e.target.nextElementSibling.textContent = "";
        e.target.classList.remove("error-input");
    }

    if (e.target.nextElementSibling.textContent !== "") {
        e.target.classList.add("error-input");
    }
}

export function validatePassword(e) {
    const password = e.target.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/;
    if (password === "") {
        e.target.parentElement.nextElementSibling.textContent = "Please fill out this field.";
    } else if (password.length < 8) {
        e.target.parentElement.nextElementSibling.textContent = "Password must be at least 8 characters long.";
    } else if (!passwordRegex.test(password)) {
        e.target.parentElement.nextElementSibling.textContent = "Password must contain at least one uppercase letter, one lowercase letter, one number and one symbol.";
    } else {
        e.target.parentElement.nextElementSibling.textContent = "";
        e.target.classList.remove("error-input");
    }

    if (e.target.parentElement.nextElementSibling.textContent !== "") {
        e.target.classList.add("error-input");
    }
}

export function validateConfirmPassword(e, input) {
    const password = e.target.value;
    if (password === "") {
        e.target.parentElement.nextElementSibling.textContent = "Please fill out this field.";
    } else if (password !== input.password) {
        e.target.parentElement.nextElementSibling.textContent = "Passwords do not match.";
    } else {
        e.target.parentElement.nextElementSibling.textContent = "";
        e.target.classList.remove("error-input");
    }

    if (e.target.parentElement.nextElementSibling.textContent !== "") {
        e.target.classList.add("error-input");
    }
}