function createTable() {
    fetch('/createTable')
        .then(res => res.text())
        .then(data => displayResult(data));
}

function insertDummyBooks() {
    fetch('/insertDummyBooks')
        .then(res => res.text())
        .then(data => displayResult(data));
}

function addBook() {
    const title = prompt('Book title:');
    const author = prompt('Author name:');
    const genre = prompt('Genre:');
    const year_published = parseInt(prompt('Year published:'), 10);
    const isbn = prompt('ISBN:');
    const available_copies = parseInt(prompt('Available copies:'), 10);

    if (!title || !author) return alert("Title and author are required.");

    const book = { title, author, genre, year_published, isbn, available_copies };

    fetch('/addBook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
    })
        .then(res => res.text())
        .then(data => displayResult(data));
}

function getBooks() {
    fetch('/getBooks')
        .then(res => res.json())
        .then(data => {
            if (!data.length) return displayResult("No books found.");
            const result = data.map(b => 
                `📖 [${b.id}] "${b.title}" by ${b.author} (${b.year_published})\nGenre: ${b.genre} | ISBN: ${b.isbn} | Copies: ${b.available_copies}`
            ).join("\n\n");
            displayResult(result);
        });
}

function updateBook() {
    const id = prompt('Enter book ID to update:');
    if (!id) return;

    const title = prompt('New title:');
    const author = prompt('New author:');
    const genre = prompt('New genre:');
    const year_published = parseInt(prompt('New year published:'), 10);
    const isbn = prompt('New ISBN:');
    const available_copies = parseInt(prompt('New available copies:'), 10);

    const book = { title, author, genre, year_published, isbn, available_copies };

    fetch(`/updateBook/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
    })
        .then(res => res.text())
        .then(data => displayResult(data));
}

function deleteBook() {
    const id = prompt('Enter book ID to delete:');
    if (!id) return;
    fetch(`/deleteBook/${id}`, { method: 'DELETE' })
        .then(res => res.text())
        .then(data => displayResult(data));
}

function clearBooks() {
    if (!confirm('Are you sure you want to delete ALL books?')) return;
    fetch('/clearBooks', { method: 'DELETE' })
        .then(res => res.text())
        .then(data => displayResult(data));
}

function displayResult(content) {
    document.getElementById('result').innerText = content;
}

