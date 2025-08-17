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
    Swal.fire({
        title: '➕ Add New Book',
        html:
            '<input id="title" class="swal2-input" placeholder="Title">' +
            '<input id="author" class="swal2-input" placeholder="Author">' +
            '<input id="genre" class="swal2-input" placeholder="Genre">' +
            '<input id="year" class="swal2-input" placeholder="Year Published">' +
            '<input id="isbn" class="swal2-input" placeholder="ISBN">' +
            '<input id="copies" class="swal2-input" placeholder="Available Copies">',
        focusConfirm: false,
        preConfirm: () => {
            const title = document.getElementById('title').value;
            const author = document.getElementById('author').value;
            const genre = document.getElementById('genre').value;
            const year_published = parseInt(document.getElementById('year').value, 10);
            const isbn = document.getElementById('isbn').value;
            const available_copies = parseInt(document.getElementById('copies').value, 10);

            if (!title || !author) {
                Swal.showValidationMessage('Title and Author are required');
                return false;
            }

            return { title, author, genre, year_published, isbn, available_copies };
        }
    }).then(result => {
        if (result.isConfirmed) {
            fetch('/addBook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(result.value)
            })
                .then(res => res.text())
                .then(data => Swal.fire('✅ Added', data, 'success').then(getBooks));
        }
    });
}

function getBooks() {
    fetch('/getBooks')
        .then(res => res.json())
        .then(data => {
            if (!data.length) return displayResult("📭 No books found.");
            const result = data.map(b =>
                `📖 [${b.id}] "${b.title}" by ${b.author} (${b.year_published})\nGenre: ${b.genre} | ISBN: ${b.isbn} | Copies: ${b.available_copies}`
            ).join("\n\n");
            displayResult(result);
        });
}

function updateBook() {
    Swal.fire({
        title: '✏ Update Book',
        input: 'number',
        inputLabel: 'Enter Book ID to Update',
        inputPlaceholder: 'Book ID',
        inputAttributes: { min: 1 }
    }).then(idResult => {
        if (!idResult.isConfirmed || !idResult.value) return;

        const id = idResult.value;

        Swal.fire({
            title: '📘 New Book Details',
            html:
                '<input id="title" class="swal2-input" placeholder="New Title">' +
                '<input id="author" class="swal2-input" placeholder="New Author">' +
                '<input id="genre" class="swal2-input" placeholder="New Genre">' +
                '<input id="year" class="swal2-input" placeholder="New Year Published">' +
                '<input id="isbn" class="swal2-input" placeholder="New ISBN">' +
                '<input id="copies" class="swal2-input" placeholder="New Available Copies">',
            focusConfirm: false,
            preConfirm: () => {
                return {
                    title: document.getElementById('title').value,
                    author: document.getElementById('author').value,
                    genre: document.getElementById('genre').value,
                    year_published: parseInt(document.getElementById('year').value, 10),
                    isbn: document.getElementById('isbn').value,
                    available_copies: parseInt(document.getElementById('copies').value, 10)
                };
            }
        }).then(dataResult => {
            if (dataResult.isConfirmed) {
                fetch(`/updateBook/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataResult.value)
                })
                    .then(res => res.text())
                    .then(data => Swal.fire('✅ Updated', data, 'success').then(getBooks));
            }
        });
    });
}

function deleteBook() {
    Swal.fire({
        title: '🗑 Delete Book',
        input: 'number',
        inputLabel: 'Enter Book ID to Delete',
        inputPlaceholder: 'Book ID',
        inputAttributes: { min: 1 }
    }).then(result => {
        if (!result.isConfirmed || !result.value) return;
        const id = result.value;

        fetch(`/deleteBook/${id}`, { method: 'DELETE' })
            .then(res => res.text())
            .then(data => Swal.fire('🗑 Deleted', data, 'success').then(getBooks));
    });
}

function clearBooks() {
    Swal.fire({
        title: '⚠ Are you sure?',
        text: "This will delete ALL books!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete all!',
        cancelButtonText: 'Cancel'
    }).then(result => {
        if (result.isConfirmed) {
            fetch('/clearBooks', { method: 'DELETE' })
                .then(res => res.text())
                .then(data => Swal.fire('🔥 Cleared', data, 'success').then(() => displayResult("")));
        }
    });
}

function displayResult(content) {
    document.getElementById('result').innerText = content;
}

