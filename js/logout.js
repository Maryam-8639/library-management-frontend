let logout = document.getElementById("logout");

logout.addEventListener("click", function () {
    document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

    localStorage.removeItem("user");

    window.location.href = "login.html";
});