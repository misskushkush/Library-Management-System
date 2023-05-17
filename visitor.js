let visitors = [];

if (localStorage.getItem("visitors")) {
    visitors = JSON.parse(localStorage.getItem("visitors"));
    for (let i = 0; i < visitors.length; i++) {
      addVisitor(visitors[i]);
    }
  }

function addVisitor(visitor){
    let table = $("#visitorTable tbody");
    table.append(`
    <tr id="${visitor.id}">
    <td>${visitor.name}</td>
    <td>${visitor.surname}</td>
    <td>${visitor.phone}</td>
    <td>
        <button class="mb-1 btn btn-sm btn-warning editBtn" data-id="${visitor.id}">
        Edit
        </button>
        <button class="mb-1 btn btn-sm btn-danger deleteBtn" data-id="${visitor.id}">
        Delete
        </button>
    </td>
    `);
    localStorage.setItem("visitors", JSON.stringify(visitors));
}

function clearForm(){
    $("#name").val("");
    $("#surname").val("");
    $("#phone").val("");
}

function generateId(){
    return Math.floor(Math.random()*1000000);
}

$(document).on("click", "#clearBtn", function(){
    clearForm();
});

$("#visitorForm").submit(function (e){
    e.preventDefault();

    let visitor = {
        id: generateId(),
        name: $("#name").val(),
        surname: $("#surname").val(),
        phone: $("#phone").val(),
    };

    visitors.push(visitor);
    addVisitor(visitor);

    clearForm();
    localStorage.setItem("visitors", JSON.stringify(visitors));
});

$("#editForm").submit(function (e){
    e.preventDefault();

    let visitorId = $("#editVisitorId").val();
    let visitorIndex = visitors.findIndex((visitor)=>visitor.id == visitorId);
    
    if (visitorIndex === -1) {
        console.log(`No visitor found with ID ${visitorId}`);
        return;
    }
    
    let visitor = visitors[visitorIndex];
    visitor.name = $("#editname").val();
    visitor.surname = $("#editsurname").val();
    visitor.phone = $("#editphone").val();


    let row = $(`#${visitor.id}`);
    row.find("td:eq(0)").text(visitor.name);
    row.find("td:eq(1)").text(visitor.surname);
    row.find("td:eq(2)").text(visitor.phone);

    $("#editModal").modal("hide");

    localStorage.setItem("visitors", JSON.stringify(visitors));
});

$(document).on("click", ".editBtn", function () {
    let visitorId = $(this).data("id");

    let visitorIndex = visitors.findIndex((visitor) => visitor.id == visitorId);
    let visitor = visitors[visitorIndex];

    $("#editname").val(visitor.name);
    $("#editsurname").val(visitor.surname);
    $("#editphone").val(visitor.phone);
    $("#editVisitorId").val(visitor.id);

    $("#editModal").modal("show");
    localStorage.setItem("visitors", JSON.stringify(visitors));
});

$(document).on("click", "#clsBtn", function () {
    $("#editModal").modal("hide");
});

$(document).on("click", ".deleteBtn", function () {
    let visitorId = $(this).data("id");

    let visitorIndex = visitors.findIndex((visitor) => visitor.id == visitorId);
    let visitor = visitors[visitorIndex];

    if (confirm(`Are you sure you want to delete 
    ${visitor.name}`)) {
        visitors.splice(visitorIndex, 1);
        $(`#${visitor.id}`).remove();
    }

    localStorage.setItem("visitors", JSON.stringify(visitors));
});


function getVisitorsFromLocalStorage() {
    return JSON.parse(localStorage.getItem("visitors")) || [];
}

// Function to filter visitors based on the search input
function filterVisitorsByName(visitors, searchName) {
    if (!searchName) {
        return visitors; 
    }

    return visitors.filter(visitor => visitor.name.toLowerCase().includes(searchName.toLowerCase()));
}
  
  // Function to sort visitors based on the selected characteristic
function sortVisitors(visitors, sortCharacteristic) {
    return visitors.sort((a, b) => {
      const valueA = isNumeric(a[sortCharacteristic]) ? parseFloat(a[sortCharacteristic]) : a[sortCharacteristic];
      const valueB = isNumeric(b[sortCharacteristic]) ? parseFloat(b[sortCharacteristic]) : b[sortCharacteristic];
  
      if (valueA < valueB) {
        return -1;
      } else if (valueA > valueB) {
        return 1;
      } else {
        return 0;
      }
    });
  }
  
  // Helper function to check if a value is numeric
  function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
  
  // Function to populate the table with visitors
function populateVisitorTable(visitors) {
    let table = $("#visitorTable tbody");
    table.empty(); // Clear existing table rows
    let row = $("<tr></tr>");
    row.append($("<th></th>").text("Name"));
    row.append($("<th></th>").text("Surname"));
    row.append($("<th></th>").text("Phone"));
    row.append($("<th></th>").text("Actions"));

    table.append(row);

    visitors.forEach(visitor => {
        addVisitor(visitor);
        });

}
  
// Function to handle the search button click event
$("#searchBtn").click(function() {
    let searchName = $("#searchInput").val();
    let visitors = getVisitorsFromLocalStorage();
    let filteredVisitors = filterVisitorsByName(visitors, searchName);
    populateVisitorTable(filteredVisitors);
});
  
// Function to handle the sort button click event
$(".sort-btn").click(function() {
    let sortCharacteristic = $(this).data("sort");
    let visitors = getVisitorsFromLocalStorage();
    let sortedvisitors = sortVisitors(visitors, sortCharacteristic);
    populateVisitorTable(sortedvisitors);
});
