let books = [];

function addBook(book){
    let table = $("#bookTable tbody");
    table.append(`
    <tr id="${book.id}">
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.genre}</td>
    <td>${book.year}</td>
    <td>${book.quantity}</td>
    <td>
        <button class="mb-1 btn btn-sm btn-warning editBtn" data-id="${book.id}">
        Edit
        </button>
        <button class="mb-1 btn btn-sm btn-danger deleteBtn" data-id="${book.id}">
        Delete
        </button>
    </td>
    `);
}

function clearForm(){
    $("#bookTitle").val("");
    $("#author").val("");
    $("#genre").val("");
    $("#year").val("");
    $("#quantity").val("");
}

function generateId(){
    return Math.floor(Math.random()*1000000);
}

$(document).on("click", "#clearBtn", function(){
    clearForm();
});

$("#bookForm").submit(function (e){
    e.preventDefault();

    let book = {
        id: generateId(),
        title: $("#bookTitle").val(),
        author: $("#author").val(),
        genre: $("#genre").val(),
        year: $("#year").val(),
        quantity: $("#quantity").val(),
    };

    books.push(book);
    addBook(book);

    clearForm();
});