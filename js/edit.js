//Firebase Configuration
import { firebaseConfig } from "/Config/FirebaseConfig.js";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var firestore = firebase.firestore();

const dataForm = document.querySelector("#dataForm");

document.getElementById("formDiv").style.visibility = "hidden";

//console.log(localStorage.getItem("storageName"));
const tempCode = localStorage.getItem("storageName");
const code = tempCode.toString(10);
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
            document.getElementById(
                "productName"
            ).value = doc.data().productName;
            document.getElementById("price").value = doc.data().category;
            document.getElementById("code").value = doc.data().productCode;
        }
    });

const productName = document.querySelector("#productName");
const price = document.querySelector("#price");

const submitBtn = document.querySelector("#submitBtn");

submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    firestore
        .collection("Products")
        .doc(code)
        .update({
            productName: productName.value,
            category: price.value,
            productCode: code,
        })
        .then(function () {
            console.log("Data Saved!");
        })
        .catch(function (error) {
            console.log("Got an error ", error);
        });
});
