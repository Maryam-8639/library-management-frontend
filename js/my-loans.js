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

async function loadLoans() {
    let tableBody = document.querySelector(".table tbody");

    tableBody.innerHTML =
    "<tr><td colspan='5'>Loading your loans...</td></tr>";
    try {
        let response = await fetch(
            "https://haditabatabaei.dev/api/loans/my-loans",
            {
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        let data = await response.json();

        if (response.ok) {
            let loans = data.data;

            loans.forEach(function (loan) {
                let row = document.createElement("tr");

                let bookCell = document.createElement("td");

                bookCell.innerHTML =
                    "<strong>" + loan.book.title + "</strong><br>" +
                    "<small>ISBN: " + loan.book.isbn + "</small>";

                let authorCell = document.createElement("td");
                authorCell.textContent = loan.book.author;

                let dateCell = document.createElement("td");

                dateCell.textContent =
                    loan.loanDate.split("T")[0];

                let statusCell = document.createElement("td");

                let status = document.createElement("span");

                status.textContent = loan.status;

                if (loan.status === "active") {
                    status.className =
                        "status status-active";
                } else {
                    status.className =
                        "status status-returned";
                }

                statusCell.appendChild(status);

                let actionCell = document.createElement("td");

                let button = document.createElement("button");

                button.className =
                    "btn btn-success btn-sm";

                if (loan.status === "active") {
                    button.textContent = "Return";

                    button.addEventListener("click", function () {
                        returnBook(loan.id);
                    });
                } else {
                    button.textContent = "Returned";
                    button.disabled = true;
                    button.className =
                        "btn btn-secondary btn-sm";
                }

                actionCell.appendChild(button);

                row.appendChild(bookCell);
                row.appendChild(authorCell);
                row.appendChild(dateCell);
                row.appendChild(statusCell);
                row.appendChild(actionCell);

                tableBody.appendChild(row);
            });

            updateStatistics(loans);
        } else {
            document.cookie =
                "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

            localStorage.removeItem("user");

            window.location.href = "login.html";
        }
    } catch (error) {
        console.error(error);

        alert("Something went wrong while loading your loans.");
    }
}

async function returnBook(loanId) {
    let confirmReturn = confirm(
        "Are you sure you want to return this book?"
    );

    if (!confirmReturn) {
        return;
    }

    try {
        let response = await fetch(
            "https://haditabatabaei.dev/api/loans/" +
            loanId +
            "/return",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        let data = await response.json();

        if (response.ok) {
            alert("Book returned successfully.");

            localStorage.removeItem("books");
            localStorage.removeItem("booksTime");
loadLoans();
        } else {
            alert(
                data.message ||
                "Unable to return this book."
            );
        }
    } catch (error) {
        console.error(error);

        alert("Something went wrong. Please try again.");
    }
}

function updateStatistics(loans) {
    let activeLoans = 0;
    let returnedBooks = 0;

    loans.forEach(function (loan) {
        if (loan.status === "active") {
            activeLoans++;
        }

        if (loan.status === "returned") {
            returnedBooks++;
        }
    });

    let statistics =
        document.querySelectorAll(".stat-number");

    statistics[0].textContent = activeLoans;
    statistics[1].textContent = returnedBooks;
}

loadLoans();