//Firebase Configuration

import { firebaseConfig } from "/Config/FirebaseConfig.js";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var firestore = firebase.firestore();

//Taking Input from the excel file
let selectedFile;

document.getElementById("input").addEventListener("change", (event) => {
    selectedFile = event.target.files[0];
});

var myArray = [];

document.getElementById("button").addEventListener("click", () => {
    if (selectedFile) {
        let fileReader = new FileReader();
        fileReader.readAsBinaryString(selectedFile);
        fileReader.onload = (event) => {
            //console.log(event.target.result);
            let data = event.target.result;
            let workbook = XLSX.read(data, { type: "binary" });
            //console.log(workbook);
            workbook.SheetNames.forEach((sheet) => {
                let rowObject = XLSX.utils.sheet_to_row_object_array(
                    workbook.Sheets[sheet]
                );
                //console.log(rowObject);
                myArray = rowObject;
                console.log(myArray);
                //document.getElementById("jsondata").innerHTML = JSON.stringify(rowObject, undefined, 4);
            });
            // Saving Data
            event.preventDefault();
            for (var i = 0; i < myArray.length; i++) {
                var code = "00" + myArray[i].Code.toString(10);
                console.log(code);
                firestore
                    .collection("products")
                    .doc(code)
                    .set({
                        ProductName: myArray[i].Product,
                        Price: myArray[i].Price,
                        Code: myArray[i].Code,
                    })
                    .then(function () {
                        console.log("Data Saved!");
                    })
                    .catch(function (error) {
                        console.log("Got an error ", error);
                    });
            }
        };
    }
});

//Saving Data from the form manually

const productName = document.querySelector("#productName");
const price = document.querySelector("#price");
const code = document.querySelector("#code");
const submitBtn = document.querySelector("#submitBtn");

submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    firestore
        .collection("products")
        .doc(code.value)
        .set({
            ProductName: productName.value,
            Price: price.value,
            Code: code.value,
        })
        .then(function () {
            console.log("Data Saved!");
        })
        .catch(function (error) {
            console.log("Got an error ", error);
        });

    productName.value = "";
    price.value = "";
    code.value = "";
});
const productList = document.querySelector("#productList");

// Product List Display
function renderProductList(doc) {
    let li = document.createElement("li");
    let content = document.createElement("div");
    let span = document.createElement("span");

    var codeToPass;
    li.setAttribute("data-id", doc.id);
    var image = document.createElement("img");
    image.src = "./../images/default.jpg";
    span.appendChild(image);
    content.innerHTML +=
        `<div class="card" style="width: 24rem;">
        <img class="card-image" src="./../images/default.jpg" width="200" height="150">
        <h3 class="text-center">` +
        doc.data().ProductName +
        `</h3>

    <p class="text-center">` +
        doc.data().Price +
        `$</p>
    <p class="text-center"> ` +
        doc.data().Code +
        `</p>
        <a href="#" onclick="editFunction()" class="btn btn-secondary">Edit</a>
        <a href="#" class="btn btn-danger ">Delete</a>
</div> `;

    li.appendChild(content);

    productList.appendChild(li);
}

function editFunction() {
    var getCode = prompt("Type the product code: ");
    localStorage.setItem("storageName", getCode);
}

//Real Time Data Fetching

firestore.collection("products").onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((change) => {
        console.log(change.doc.data());
        if (change.type === "added") {
            renderProductList(change.doc);
        }
    });
});
