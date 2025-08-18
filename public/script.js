function createTable() {
  fetch('/createTable')
    .then(res => res.text())
    .then(data => showSuccess(data));
}

function addItem() {
  const name = prompt('Enter item name:');
  if (!name) return showError('Item name is required.');

  fetch('/addItem', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  })
    .then(res => res.text())
    .then(data => showSuccess(data));
}

function getItems() {
  showSpinner();
  fetch('/getItems')
    .then(res => res.json())
    .then(data => {
      if (!data.length) return showInfo("📭 No items found.");
      renderCards(data);
    });
}

function updateItem() {
  const id = prompt('Enter item ID to update:');
  const name = prompt('Enter new item name:');
  if (!id || !name) return showError('Both ID and name required.');

  fetch(`/updateItem/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  })
    .then(res => res.text())
    .then(data => showSuccess(data));
}

function deleteItem() {
  const id = prompt('Enter item ID to delete:');
  if (!id) return showError('Item ID required.');

  fetch(`/deleteItem/${id}`, {
    method: 'DELETE'
  })
    .then(res => res.text())
    .then(data => showSuccess(data));
}

