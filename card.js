let books_title = [];

if (localStorage.getItem("books")) {
    books = JSON.parse(localStorage.getItem("books"));
    for (let i = 0; i < books.length; i++) {
        books_title.push(books[i].title);
    }
    populateDropdown(books_title, "bookName");
}

let visitors_name = [];

if (localStorage.getItem("visitors")) {
    visitors = JSON.parse(localStorage.getItem("visitors"));

    for (let i = 0; i < visitors.length; i++) {
        visitors_name.push(visitors[i].name);
    }
    populateDropdown(visitors_name, "visitorName");
}
  
let cards = [];

if (localStorage.getItem("cards")) {
    cards = JSON.parse(localStorage.getItem("cards"));
    for (let i = 0; i < cards.length; i++) {
    cards[i].penalty = calculatePenalty(cards[i]);
    addCard(cards[i]);
    }
}


function populateDropdown(array, dropdownId) {
    let dropdown = $("#" + dropdownId);
    
    // Clear existing options
    dropdown.empty();

    // Add the placeholder option
    let placeholderOption = $("<option disabled selected></option>").text(`Choose ${dropdownId}`);
    dropdown.append(placeholderOption);
    
    // Iterate over the array and create options
    for (let i = 0; i < array.length; i++) {
        let option = $("<option></option>").text(array[i]);
        dropdown.append(option);
    }
}


function calculatePenalty(card) {
    let returnDate = new Date(card.returnDate);
    let currentDate = new Date();
    let timeDiff = Math.abs(returnDate.getTime() - currentDate.getTime());
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    let penalty = 0;
    if (currentDate > returnDate) {
        penalty = diffDays * 0.10;
    }
    return penalty;
}

function addCard(card){
    let table = $("#cardTable tbody");
    table.append(`
    <tr id="${card.id}">
    <td>${card.visitor}</td>
    <td>${card.book}</td>
    <td>${card.borrowDate}</td>
    <td>${card.returnDate}</td>
    <td>${card.penalty.toFixed(2)} UA</td>
    <td>
        <button class="mb-1 btn btn-sm btn-warning editBtn" data-id="${card.id}">
        Edit
        </button>
        <button class="mb-1 btn btn-sm btn-danger deleteBtn" data-id="${card.id}">
        Delete
        </button>
    </td>
    `);
    // Save updated books to local storage
  
  localStorage.setItem("cards", JSON.stringify(cards));
}

function clearForm(){
    $("#visitorName").val("");
    $("#bookName").val("");
    $("#borrowDate").val("");
    populateDropdown(visitors_name, "visitorName");
    populateDropdown(books_title, "bookName");
}

function generateId(){
    return Math.floor(Math.random()*1000000);
}

$(document).on("click", "#clearBtn", function(){
    clearForm();
});

$("#cardForm").submit(function (e) {
    e.preventDefault();

    let borrowDate = new Date($("#borrowDate").val());
    let returnDate = new Date(borrowDate.getTime() + 30 * 24 * 60 * 60 * 1000); // Adding 30 days

    let returnYear = returnDate.getFullYear();
    let returnMonth = ("0" + (returnDate.getMonth() + 1)).slice(-2); // Adding leading zero if necessary
    let returnDay = ("0" + returnDate.getDate()).slice(-2); // Adding leading zero if necessary

    let returnFormattedDate = `${returnYear}-${returnMonth}-${returnDay}`;

  
    let card = {
      id: generateId(),
      visitor: $("#visitorName option:selected").text(),
      book: $("#bookName option:selected").text(),
      borrowDate: $("#borrowDate").val(), // Convert to ISO string format
      returnDate: returnFormattedDate, // Convert to ISO string format
      penalty: 0.00,
    };
  
    cards.push(card);
    addCard(card);
  
    let bookTitle = card.book;
    let book = books.find((b) => b.title === bookTitle);
    if (book) {
      book.quantity--;
      localStorage.setItem("books", JSON.stringify(books));
    }
    clearForm();
  
    localStorage.setItem('cards', JSON.stringify(cards));
});

$("#editForm").submit(function (e){
    e.preventDefault();

    let cardId = $("#editCardId").val();
    let cardIndex = cards.findIndex((card)=>card.id == cardId);
    let card = cards[cardIndex];
    card.returnDate = $("#editreturnDate").val();
    card.penalty = calculatePenalty(card);

    let row = $(`#${card.id}`);
    row.find("td:eq(0)").text(card.returnDate);
    row.find("td:eq(4)").text(card.penalty.toFixed(2) + " UA");

    $("#editModal").modal("hide");
    // Save updated books to local storage
  localStorage.setItem("cards", JSON.stringify(cards));

});

$(document).on("click", ".editBtn", function () {
    let cardId = $(this).data("id");

    let cardIndex = cards.findIndex((card) => card.id == cardId);
    let card = cards[cardIndex];

    $("#editreturnDate").val(card.returnDate);
    $("#editCardId").val(card.id);
    card.penalty = calculatePenalty(card);

    $("#editModal").modal("show");
    localStorage.setItem('cards', JSON.stringify(cards));
});

$(document).on("click", "#clsBtn", function () {
    $("#editModal").modal("hide");
});

$(document).on("click", ".deleteBtn", function () {
    let cardId = $(this).data("id");

    let cardIndex = cards.findIndex((card) => card.id == cardId);
    let card = cards[cardIndex];

    let bookTitle = card.book;
    let book = books.find((b) => b.title === bookTitle);

    if (book) {
      book.quantity++;
      localStorage.setItem("books", JSON.stringify(books));
    }
    
    cards.splice(cardIndex, 1);
    $(`#${card.id}`).remove();
    
    localStorage.setItem('cards', JSON.stringify(cards));
});
