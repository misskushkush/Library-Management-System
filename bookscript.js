let books = [];

if (localStorage.getItem("books")) {
    books = JSON.parse(localStorage.getItem("books"));
    for (let i = 0; i < books.length; i++) {
      addBook(books[i]);
    }
  }

function addBook(book){
    let table = $("#bookTable tbody");
    table.append(`
    <tr id="${book.id}">
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.name}</td>
    <td>${book.year}</td>
    <td>${book.page}</td>
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
    // Save updated books to local storage
  localStorage.setItem("books", JSON.stringify(books));
}

function clearForm(){
    $("#bookTitle").val("");
    $("#author").val("");
    $("#publishName").val("");
    $("#publishYear").val("");
    $("#pageQuantity").val("");
    $("#quantity").val("");
}

function generateId(){
    return Math.floor(Math.random()*1000000);
}

$(document).on("click", "#clearBtn", function(){
    clearForm();
});

$("#addForm").submit(function (e){
    e.preventDefault();

    let book = {
        id: generateId(),
        title: $("#bookTitle").val(),
        author: $("#author").val(),
        name: $("#publishName").val(),
        year: $("#publishYear").val(),
        page: $("#pageQuantity").val(),
        quantity: $("#quantity").val(),
    };

    books.push(book);
    addBook(book);

    $("#addModal").modal("hide");
    localStorage.setItem('books', JSON.stringify(books));
});

$(document).on("click", "#createBtn", function () {

    $("#addModal").modal("show");
    localStorage.setItem('books', JSON.stringify(books));
});

$("#editForm").submit(function (e){
    e.preventDefault();

    let bookId = $("#editBookId").val();
    let bookIndex = books.findIndex((book)=>book.id == bookId);
    let book = books[bookIndex];
    book.title = $("#editbookTitle").val();
    book.author = $("#editauthor").val();
    book.name = $("#editpublishName").val();
    book.year = $("#editpublishYear").val();
    book.page = $("#editpageQuantity").val();
    book.quantity = $("#editquantity").val();


    let row = $(`#${book.id}`);
    row.find("td:eq(0)").text(book.title);
    row.find("td:eq(1)").text(book.author);
    row.find("td:eq(2)").text(book.name);
    row.find("td:eq(3)").text(book.year);
    row.find("td:eq(4)").text(book.page);
    row.find("td:eq(5)").text(book.quantity);

    $("#editModal").modal("hide");
    // Save updated books to local storage
  localStorage.setItem("books", JSON.stringify(books));

});

$(document).on("click", ".editBtn", function () {
    let bookId = $(this).data("id");

    let bookIndex = books.findIndex((book) => book.id == bookId);
    let book = books[bookIndex];

    $("#editbookTitle").val(book.title);
    $("#editauthor").val(book.author);
    $("#editpublishName").val(book.name);
    $("#editpublishYear").val(book.year);
    $("#editpageQuantity").val(book.page);
    $("#editquantity").val(book.quantity);
    $("#editBookId").val(book.id);

    $("#editModal").modal("show");
    localStorage.setItem('books', JSON.stringify(books));
});

$(document).on("click", "#clsBtn", function () {
    $("#editModal").modal("hide");
    $("#addModal").modal("hide");
});

$(document).on("click", ".deleteBtn", function () {
    let bookId = $(this).data("id");

    let bookIndex = books.findIndex((book) => book.id == bookId);
    let book = books[bookIndex];

    if (confirm(`Are you sure you want to delete 
    ${book.title}`)) {
        books.splice(bookIndex, 1);
        $(`#${book.id}`).remove();
    }
    localStorage.setItem('books', JSON.stringify(books));
});
