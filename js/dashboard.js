let token = null;

let cookies = document.cookie.split(";");

for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();

    if (cookie.startsWith("token=")) {
        token = cookie.substring(6);
    }
}
if (!token) {
    window.location.href = "login.html";
}

async function loadDashboard() {
    try {
        let response = await fetch(
            "https://haditabatabaei.dev/api/auth/me",
            {
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        let data = await response.json();

        if (response.ok) {
            let user = data.data.user;
            let stats = data.data.stats;

            let fullName = user.firstName + " " + user.lastName;

            document.getElementById("studentName").textContent =
                fullName;

            document.getElementById("userName").textContent =
                fullName;

            document.getElementById("userAvatar").textContent =
                user.firstName.charAt(0).toUpperCase();

            document.getElementById("activeLoans").textContent =
                stats.activeLoans;

            document.getElementById("availableBooks").textContent =
                stats.availableBooks;
        } else {
            document.cookie = 
            "token=; expires=Thu,01 Jan 1970 00:00:00 UTC; path=/";
            localStorage.removeItem("user")
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error(error);
    }
}

loadDashboard();