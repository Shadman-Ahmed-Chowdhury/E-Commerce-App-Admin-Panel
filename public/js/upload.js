//Firebase Configuration
import { firebaseConfig } from "./../Config/FirebaseConfig.js";

// Initialize Firebase

firebase.initializeApp(firebaseConfig);
firebase.analytics();
var admin = require("firebase-admin");
var firestore = firebase.firestore();

var priceListArray = [];
var dateListArray = [];

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
    var code = productCode.value.toString();
    console.log(code);
    const ref = firebase.storage().ref();
    e.preventDefault();
    if (Number(updatedPrice.value) != 0)
        priceListArray.push(Number(updatedPrice.value));

    if (updatedDate.value !== "") dateListArray.push(updatedDate.value);

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
            updateImageToFirestore(url, code, priceListArray, dateListArray);
        });
    } else {
        console.log("update to firestore called");
        updateToFirestore(code, priceListArray, dateListArray);
    }

    //console.log(imageUrl.value);
    //console.log(storageImageUrl);
    //console.log(updatedPrice.value);
});

function updateImageToFirestore(url, code, priceArray, dateArray) {
    console.log(url);
    firestore
        .collection("Products")
        .doc(code)
        .set({
            storageImageUrl: url,
            imageUrl: imageUrl.value,
            productCode: productCode.value,
            productName: productName.value,
            category: category.value,
            productType: productType.value,
            bottomMessage: bottomMessage.value,
            priceList: priceArray,
            dateList: dateArray,
        })
        .then(function () {
            console.log("Data Saved!");
            //confirmation message
            Swal.fire({
                icon: "success",
                title: "Successfully uploaded",
                showConfirmButton: false,
                timer: 3000,
            }).then((result) => {
                window.location.href = "home.html";
            });
        })
        .catch(function (error) {
            console.log("Got an error ", error);
        });
}
function updateToFirestore(code, priceArray, dateArray) {
    firestore
        .collection("Products")
        .doc(code)
        .set({
            storageImageUrl: "",
            imageUrl: imageUrl.value,
            productCode: productCode.value,
            productName: productName.value,
            category: category.value,
            productType: productType.value,
            bottomMessage: bottomMessage.value,
            priceList: priceArray,
            dateList: dateArray,
        })
        .then(function () {
            console.log("Data Saved!");
            //confirmation message
            Swal.fire({
                icon: "success",
                title: "Successfully uploaded",
                showConfirmButton: false,
                timer: 3000,
            }).then((result) => {
                window.location.href = "home.html";
            });
        })
        .catch(function (error) {
            console.log("Got an error ", error);
        });
}
