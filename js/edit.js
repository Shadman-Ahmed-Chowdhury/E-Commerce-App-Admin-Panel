//Firebase Configuration
import { firebaseConfig } from "./../Config/FirebaseConfig.js";

// Initialize Firebase

firebase.initializeApp(firebaseConfig);
firebase.analytics();

var firestore = firebase.firestore();

const dataForm = document.querySelector("#dataForm");

document.getElementById("formDiv").style.visibility = "hidden";

//console.log(localStorage.getItem("storageName"));
const tempCode = localStorage.getItem("storageName");
const code = tempCode.toString(10);

var priceListArray = [];
var dateListArray = [];
//console.log(code);

firestore
    .collection("Products")
    .doc(code)
    .get()
    .then(function (doc) {
        if (doc.exists) {
            document.getElementById("formDiv").style.visibility = "visible";
            //console.log(doc.data().ProductName);
            //console.log(code);
            if (doc.data().imageUrl != "") {
                var src = doc.data().imageUrl;
                var preview = document.getElementById("file-ip-1-preview");
                preview.src = src;
                console.log(src);
                preview.style.display = "block";
            } else if (doc.data().storageImageUrl != "") {
                var src = doc.data().storageImageUrl;
                var preview = document.getElementById("file-ip-1-preview");
                preview.src = src;
                console.log(src);
                preview.style.display = "block";
            } else {
                var src =
                    "https://firebasestorage.googleapis.com/v0/b/prizer-kuwait.appspot.com/o/no-image.jpg?alt=media&token=de46086b-4c2d-4311-bbad-89ee438727c9";
                var preview = document.getElementById("file-ip-1-preview");
                preview.src = src;
                console.log(src);
                preview.style.display = "block";
            }
            document.getElementById("imageUrl").value = doc.data().imageUrl;
            document.getElementById("code").value = doc.data().productCode;
            document.getElementById(
                "productName"
            ).value = doc.data().productName;
            //var priceListArray = doc.data().priceList;
            document.getElementById("category").value = doc.data().category;
            document.getElementById(
                "productType"
            ).value = doc.data().productType;
            document.getElementById(
                "bottomMessage"
            ).value = doc.data().bottomMessage;

            //Retriving the priceList and dateList
            priceListArray = doc.data().priceList;
            dateListArray = doc.data().dateList;

            console.log(dateListArray);
            console.log(priceListArray);

            buildTable(priceListArray, dateListArray);
        }
    });

function buildTable(priceArray, dateArray) {
    var table = document.getElementById("myTable");
    for (var i = 0; i < priceArray.length; i++) {
        var price = Number(priceArray[i]);
        var priceFloat = price.toFixed(3);
        var row = `<tr>
                        <td style="text-align:center">${dateArray[i]}</td>
                        <td style="text-align:center">${priceFloat} KD</td>
                        <td style="text-align:center"> 
                            <a class="btn btn-sm btn-outline-danger" onclick="onDelete(${i})"> 
                                Delete 
                            </a> 
                        </td>
                   </tr>`;
        table.innerHTML += row;
    }
}

const imageUrl = document.querySelector("#imageUrl");
const productCode = document.querySelector("#code");
const productName = document.querySelector("#productName");
const category = document.querySelector("#category");
const productType = document.querySelector("#productType");
const bottomMessage = document.querySelector("#bottomMessage");
const updatedDate = document.querySelector("#updatedDate");
const updatedPrice = document.querySelector("#updatedPrice");

const submitBtn = document.querySelector("#submitBtn");

submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const ref = firebase.storage().ref();

    const file = document.querySelector("#file-ip-1").files[0];
    var fileName;
    if (file) {
        fileName = file.name;

        const metadata = {
            contentType: file.type,
        };
        const task = ref.child(fileName).put(file, metadata);
        task.then((snapshot) => snapshot.ref.getDownloadURL()).then((url) => {
            //alert("Image Upload Successful");
            console.log("update image to firestore");
            updateImageToFirestore(url);
        });
    } else {
        console.log("update to firestore called");
        updateToFirestore();
    }

    //console.log(imageUrl.value);
    //console.log(storageImageUrl);
    console.log(updatedPrice.value);
});
const addPriceBtn = document.querySelector("#addPriceBtn");
addPriceBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (Number(updatedPrice.value) != 0)
        priceListArray.push(Number(updatedPrice.value));

    if (updatedDate.value !== "") dateListArray.push(updatedDate.value);
    updatePriceToFirestore();

    //confirmation message
    Swal.fire({
        icon: "success",
        title: "Successfully edited",
        showConfirmButton: false,
        timer: 3000,
    }).then((result) => {
        location.reload();
    });
});
function updateImageToFirestore(url) {
    console.log(url);
    firestore
        .collection("Products")
        .doc(code)
        .update({
            storageImageUrl: url,
            imageUrl: imageUrl.value,
            productCode: productCode.value,
            productName: productName.value,
            category: category.value,
            productType: productType.value,
            bottomMessage: bottomMessage.value,
        })
        .then(function () {
            console.log("Data Saved!");
            //confirmation message
            Swal.fire({
                icon: "success",
                title: "Successfully edited",
                showConfirmButton: false,
                timer: 3000,
            }).then((result) => {
                location.reload();
            });
        })
        .catch(function (error) {
            console.log("Got an error ", error);
        });
}
function updateToFirestore() {
    firestore
        .collection("Products")
        .doc(code)
        .update({
            //storageImageUrl: "",
            imageUrl: imageUrl.value,
            productCode: productCode.value,
            productName: productName.value,
            category: category.value,
            productType: productType.value,
            bottomMessage: bottomMessage.value,
        })
        .then(function () {
            console.log("Data Saved!");
            //confirmation message
            Swal.fire({
                icon: "success",
                title: "Successfully edited",
                showConfirmButton: false,
                timer: 3000,
            }).then((result) => {
                location.reload();
            });
        })
        .catch(function (error) {
            console.log("Got an error ", error);
        });
}
function updatePriceToFirestore(url) {
    firestore
        .collection("Products")
        .doc(code)
        .update({
            priceList: priceListArray,
            dateList: dateListArray,
        })
        .then(function () {
            console.log("Data Saved!");
            //confirmation message
            Swal.fire({
                icon: "success",
                title: "Successfully edited",
                showConfirmButton: false,
                timer: 2000,
            }).then((result) => {
                location.reload();
            });
        })
        .catch(function (error) {
            console.log("Got an error ", error);
        });
}
