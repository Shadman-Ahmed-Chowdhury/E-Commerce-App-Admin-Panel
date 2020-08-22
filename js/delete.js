//Firebase Configuration
import { firebaseConfig } from "./../Config/FirebaseConfig.js";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var firestore = firebase.firestore();

const tempCode = localStorage.getItem("storageName");
const code = tempCode.toString(10);

function pageRedirect() {
    window.location.href = "index.html";
}

function deleteFunction(code) {
    console.log(code);

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#01D307",
        reverseButtons: true,
    }).then((result) => {
        if (result.value) {
            // Deleting from database
            firestore
                .collection("Products")
                .doc(code)
                .delete()
                .then(function () {
                    //confirmation message
                    Swal.fire({
                        icon: "success",
                        title: "Successfully deleted",
                        showConfirmButton: false,
                        timer: 2000,
                    }).then((result) => {
                        pageRedirect();
                    });
                })
                .catch(function (error) {
                    console.error("Error removing document: ", error);
                });
        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
            //confirmation message
            Swal.fire({
                icon: "error",
                title: "Cancelled!",
                text: "Your imaginary file is safe :)",
                showConfirmButton: false,
                timer: 2000,
            });
        }
    });
}

deleteFunction(code);
