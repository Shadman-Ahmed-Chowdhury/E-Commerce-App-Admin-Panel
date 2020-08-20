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
const code = "00" + tempCode.toString(10);
console.log(code);
firestore
    .collection("products")
    .doc(code)
    .get()
    .then(function (doc) {
        if (doc.exists) {
            document.getElementById("formDiv").style.visibility = "visible";
            console.log(doc.data().ProductName);
            document.getElementById(
                "productName"
            ).value = doc.data().ProductName;
            document.getElementById("price").value = doc.data().Price;
            document.getElementById("code").value = doc.data().Code;
        }
    });
