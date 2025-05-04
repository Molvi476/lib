document.addEventListener("DOMContentLoaded", function () {
    const viewBooksBtn = document.getElementById("viewBooks");
    const manageBooksBtn = document.getElementById("manageBooks");
    const issuedBooksBtn = document.getElementById("issuedBooks");
    const contentDisplay = document.getElementById("contentDisplay");

    // View Books Functionality
    if (viewBooksBtn) {
        viewBooksBtn.addEventListener("click", function () {
            const books = JSON.parse(localStorage.getItem("books")) || [];
            if (books.length === 0) {
                contentDisplay.innerHTML = "<p>No books available.</p>";
            } else {
                contentDisplay.innerHTML = "<h3>Books List:</h3>" + books.map((book, index) => {
                    return `<p>${book.title} by ${book.author} - Status: ${book.status}
                            <button class="issueBook" data-index="${index}">${book.status === 'Available' ? 'Issue' : 'Return'}</button>
                            <button class="deleteBook" data-index="${index}">Delete</button></p>`;
                }).join("");
            }

            // Issue or Return Book Functionality
            const issueButtons = document.querySelectorAll('.issueBook');
            issueButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const index = button.getAttribute("data-index");
                    const books = JSON.parse(localStorage.getItem("books")) || [];
                    const book = books[index];

                    if (book.status === "Available") {
                        // If book is available, issue it
                        contentDisplay.innerHTML = `
                            <h3>Issue Book</h3>
                            <form id="issueBookForm">
                                <p>Book: ${book.title} by ${book.author}</p>
                                <input type="text" id="readerName" placeholder="Reader's Name" required>
                                <input type="text" id="readerContact" placeholder="Reader's Contact" required>
                                <input type="text" id="readerAddress" placeholder="Reader's Address" required>
                                <button type="submit">Issue Book</button>
                            </form>
                        `;

                        const issueBookForm = document.getElementById("issueBookForm");
                        issueBookForm.addEventListener("submit", function (e) {
                            e.preventDefault();

                            const readerName = document.getElementById("readerName").value;
                            const readerContact = document.getElementById("readerContact").value;
                            const readerAddress = document.getElementById("readerAddress").value;

                            // Store issuer info and update book status
                            book.status = "Issued";
                            book.issuedBy = { name: readerName, contact: readerContact, address: readerAddress };
                            localStorage.setItem("books", JSON.stringify(books));

                            viewBooksBtn.click(); // Refresh the books list
                        });
                    } else if (book.status === "Issued") {
                        // If the book is issued, allow returning it
                        book.status = "Available";
                        delete book.issuedBy; // Remove issuer info
                        localStorage.setItem("books", JSON.stringify(books));

                        viewBooksBtn.click(); // Refresh the books list
                    }
                });
            });

            // Delete Book Functionality
            const deleteButtons = document.querySelectorAll('.deleteBook');
            deleteButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const index = button.getAttribute("data-index");
                    const books = JSON.parse(localStorage.getItem("books")) || [];
                    books.splice(index, 1); // Remove the book from array
                    localStorage.setItem("books", JSON.stringify(books));
                    viewBooksBtn.click(); // Refresh the book list
                });
            });
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

                books.push({ title, author, status: "Available" });
                localStorage.setItem("books", JSON.stringify(books));
                manageBooksBtn.click(); // Refresh after adding
            });
        });
    }

    // Show Issued Books
    if (issuedBooksBtn) {
        issuedBooksBtn.addEventListener("click", function () {
            const books = JSON.parse(localStorage.getItem("books")) || [];
            const issuedBooks = books.filter(book => book.status === "Issued");

            if (issuedBooks.length === 0) {
                contentDisplay.innerHTML = "<p>No books have been issued.</p>";
            } else {
                contentDisplay.innerHTML = "<h3>Issued Books:</h3>" + issuedBooks.map(book => {
                    return `<p>${book.title} by ${book.author} - Issued To: ${book.issuedBy.name} (${book.issuedBy.contact}, ${book.issuedBy.address})</p>`;
                }).join("");
            }
        });
    }
});
