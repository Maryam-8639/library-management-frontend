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

let booksContainer = document.querySelector(".grid-3");

async function loadBooks() {
    booksContainer.textContent = "Loading books...";
    try {
        let cachedBooks = localStorage.getItem("books");
        let cachedTime = localStorage.getItem("booksTime");

        if (
            cachedBooks &&
            cachedTime &&
            Date.now() - Number(cachedTime) < 5 * 60 * 1000
        ) {
            let books = JSON.parse(cachedBooks);

            displayBooks(books);

            return;
        }

        let response = await fetch(
            "https://haditabatabaei.dev/api/books"
        );

        let data = await response.json();

        if (response.ok) {
            localStorage.setItem(
                "books",
                JSON.stringify(data.data)
            );

            localStorage.setItem(
                "booksTime",
                Date.now()
            );

            displayBooks(data.data);
        } else {
            booksContainer.textContent =
                "Unable to load books.";
        }
    } catch (error) {
        console.error(error);

        booksContainer.textContent =
            "Something went wrong while loading books.";
    }
}

function displayBooks(books) {
    booksContainer.innerHTML = "";

    books.forEach(function (book) {
        let bookCard = document.createElement("div");

        bookCard.className = "card";

        let title = document.createElement("h3");
        title.textContent = book.title;

        let author = document.createElement("p");
        author.textContent = "Author: " + book.author;

        let isbn = document.createElement("p");
        isbn.textContent = "ISBN: " + book.isbn;

        let category = document.createElement("p");
        category.textContent =
            "Category: " + book.category.name;

        let copies = document.createElement("p");
        copies.textContent =
            "Available Copies: " + book.availableCopies;

        let description = document.createElement("p");
        description.textContent = book.description;

        let borrowButton = document.createElement("button");

        borrowButton.className = "btn btn-primary btn-sm";
        borrowButton.textContent = "Borrow Book";

        if (!book.available) {
            borrowButton.disabled = true;
            borrowButton.textContent = "Not Available";
        }

        borrowButton.addEventListener("click", function () {
            borrowBook(book.id);
        });

        let detailsButton = document.createElement("button");

        detailsButton.className =
            "btn btn-secondary btn-sm";

        detailsButton.textContent = "View Details";

        detailsButton.addEventListener("click", function () {
            viewDetails(book.id);
        });

        bookCard.appendChild(title);
        bookCard.appendChild(author);
        bookCard.appendChild(isbn);
        bookCard.appendChild(category);
        bookCard.appendChild(copies);
        bookCard.appendChild(description);
        bookCard.appendChild(borrowButton);
        bookCard.appendChild(detailsButton);

        booksContainer.appendChild(bookCard);
    });
}

function viewDetails(bookId) {
    console.log("Selected book:", bookId);
}

async function borrowBook(bookId) {
    let user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    let dueDate = new Date();

    dueDate.setDate(dueDate.getDate() + 14);

    try {let response = await fetch(
            "https://haditabatabaei.dev/api/loans",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    bookId: bookId,
                    userId: user.id,
                    loanPeriod: 14,
                    dueDate: dueDate.toISOString()
                })
            }
        );

        let data = await response.json();

        if (response.ok) {
            alert("Book borrowed successfully.");

            localStorage.removeItem("books");
            localStorage.removeItem("booksTime");

            loadBooks();
        } else {
            alert(
                data.message ||
                "Unable to borrow this book."
            );
        }
    } catch (error) {
        console.error(error);

        alert("Something went wrong. Please try again.");
    }
}

loadBooks();
