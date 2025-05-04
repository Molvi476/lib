// Existing login and sign-up logic
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    // Handle Sign-Up Form Submission
    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("signupName").value;
            const email = document.getElementById("signupEmail").value;
            const password = document.getElementById("signupPassword").value;

            // Check if email already exists
            const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
            const userExists = existingUsers.some(user => user.email === email);

            if (userExists) {
                alert("Email already registered. Please use a different email.");
            } else {
                // Store the new user
                existingUsers.push({ name, email, password });
                localStorage.setItem("users", JSON.stringify(existingUsers));
                window.location.href = "login.html"; // Redirect to login page
            }
        });
    }

    // Handle Login Form Submission
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;

            // Retrieve users from localStorage
            const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
            const user = existingUsers.find(user => user.email === email && user.password === password);

            if (user) {
                // Redirect to dashboard if login is successful
                window.location.href = "dashboard.html";
            } else {
                alert("Invalid email or password. Please try again.");
            }
        });
    }
});

// Dashboard functionality
document.addEventListener("DOMContentLoaded", function () {
    const viewBooksBtn = document.getElementById("viewBooks");
    const manageBooksBtn = document.getElementById("manageBooks");
    const manageUsersBtn = document.getElementById("manageUsers");
    const contentDisplay = document.getElementById("contentDisplay");

    // View Books Functionality
    if (viewBooksBtn) {
        viewBooksBtn.addEventListener("click", function () {
            const books = JSON.parse(localStorage.getItem("books")) || [];
            if (books.length === 0) {
                contentDisplay.innerHTML = "<p>No books available.</p>";
            } else {
                contentDisplay.innerHTML = "<h3>Books List:</h3>" + books.map(book => `<p>${book.title} by ${book.author}</p>`).join("");
            }
        });
    }

    // Manage Books Functionality
    if (manageBooksBtn) {
        manageBooksBtn.addEventListener("click", function () {
            contentDisplay.innerHTML = `
                <h3>Manage Books</h3>
                <form id="addBookForm">
                    <input type="text" id="bookTitle" placeholder="Book Title" required>
                    <input type="text" id="bookAuthor" placeholder="Book Author" required>
                    <button type="submit">Add Book</button>
                </form>
            `;

            const addBookForm = document.getElementById("addBookForm");
            addBookForm.addEventListener("submit", function (e) {
                e.preventDefault();

                const title = document.getElementById("bookTitle").value;
                const author = document.getElementById("bookAuthor").value;
                const books = JSON.parse(localStorage.getItem("books")) || [];

                books.push({ title, author });
                localStorage.setItem("books", JSON.stringify(books));
                alert("Book added successfully!");
            });
        });
    }

    // Manage Users Functionality
    if (manageUsersBtn) {
        manageUsersBtn.addEventListener("click", function () {
            const users = JSON.parse(localStorage.getItem("users")) || [];
            if (users.length === 0) {
                contentDisplay.innerHTML = "<p>No users registered.</p>";
            } else {
                contentDisplay.innerHTML = "<h3>Users List:</h3>" + users.map(user => `<p>${user.name} (${user.email})</p>`).join("");
            }
        });
    }
});
