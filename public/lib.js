// lib.js

// 🔹 Display a message in the result box
function displayResult(message) {
    const box = document.getElementById('result');
    box.innerText = message;
}

// 🔹 Show SweetAlert2 success popup
function showSuccess(title = 'Success', text = '') {
    Swal.fire({
        icon: 'success',
        title,
        text
    });
}

// 🔹 Show SweetAlert2 error popup
function showError(title = 'Error', text = '') {
    Swal.fire({
        icon: 'error',
        title,
        text
    });
}

// 🔹 Validate a basic book object
function validateBook(book) {
    const { title, author } = book;
    if (!title || !author) {
        showError('Validation Failed', 'Title and author are required.');
        return false;
    }
    return true;
}

// 🔹 Format book data for display
function formatBooks(books) {
    if (!Array.isArray(books) || !books.length) {
        return "📭 No books available.";
    }

    return books.map(b => 
        `📖 [${b.id}] "${b.title}" by ${b.author} (${b.year_published || 'N/A'})\n` +
        `Genre: ${b.genre || 'N/A'} | ISBN: ${b.isbn || 'N/A'} | Copies: ${b.available_copies || 0}`
    ).join("\n\n");
}

