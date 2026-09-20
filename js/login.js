let token = null;

let cookies = document.cookie.split(";");

for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();

    if (cookie.startsWith("token=")) {
        token = cookie.substring(6);
    }
}

if (token) {
    window.location.href = "dashboard.html";
}

let loginForm = document.getElementById("loginForm");
let email = document.getElementById("email");
let password = document.getElementById("password");
let alertContainer = document.getElementById("alert-container");

let loginText = document.getElementById("loginText");
let loginSpinner = document.getElementById("loginSpinner");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    let emailValue = email.value.trim();
    let passwordValue = password.value;

    loginText.classList.add("hidden");
    loginSpinner.classList.remove("hidden");

    try {
        let response = await fetch(
            "https://haditabatabaei.dev/api/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: emailValue,
                    password: passwordValue
                })
            }
        );

        let data = await response.json();

        if (response.ok) {
            document.cookie =
                "token=" + data.token + "; path=/";

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            alertContainer.textContent =
                "Login successful";

            window.location.href = "dashboard.html";
        } else {
            alertContainer.textContent =
                data.message ||
                "Invalid email or password";
        }
    } catch (error) {
        console.error(error);

        alertContainer.textContent =
            "Something went wrong. Please try again.";
    }

    loginText.classList.remove("hidden");
    loginSpinner.classList.add("hidden");
});