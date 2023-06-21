import { firebaseConfig } from "./firebase.js";

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js';
import { getFirestore, collection, query, where, getDocs,getDoc, setDoc, addDoc, doc,deleteDoc,onSnapshot,orderBy, limit,startAt,endAt } from 'https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js';


firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const storage = firebase.storage();







/*  start function to upload files */

async function uploadFiles(input) {

  
    // let orderId=input.dataset.id;
    // let orderData=AllPersonsData.find(el=>el.id==`${orderId}`);
  
  let ArrayOfFilesLinks = [];
  
  if(ArrayOfFilesLinks==undefined){
    ArrayOfFilesLinks=[];
  };
  
  if(input.files[0]!==undefined){
  
    
      for(let i=0; i<input.files.length; i++){
  
        const ref = firebase.storage().ref();
        const file =  input.files[i];
        const name = +new Date() + "-" + file.name;
        const metadata = {
          contentType: file.type,
        };
        
        const task = ref.child(name).put(file, metadata);
        await task
        .then(async snapshot => snapshot.ref.getDownloadURL())
        .then(async url => {
        
          ArrayOfFilesLinks.push({src: url,name: file.name});
          
        })
        .catch(console.error);
  
      };
      
  };
  
  return ArrayOfFilesLinks;
  };
  
/* end function to upload Files */






/* on window open */
let ArrayOfFilesLinksOld = JSON.parse(localStorage.getItem("ArrayOfFilesLinks") || "[]")

ArrayOfFilesLinksOld.forEach(e=>{
    document.querySelector(".dadOfFilesLinks").innerHTML+=`
    <div>
        <a class="link" href="${e.src}" target="_blank" style="display: inline-block; max-width: 80%; overflow: hidden; text-overflow: ellipsis;">${e.name}</a>
    </div>
    <br>
    `;
});










let mainInput = document.querySelector("#mainInput");

document.querySelector(".uploadBtn").addEventListener("click",async ()=>{

    if(mainInput.files[0]==undefined){

        Swal.fire('برجاء اختيار الملفات اولا','','error',)

    } else {

        Swal.fire({
          title: 'Please Wait!',
          didOpen: () => {Swal.showLoading()}
        });
        
        let ArrayOfFilesLinksOld = JSON.parse(localStorage.getItem("ArrayOfFilesLinks") || "[]");
        await uploadFiles(mainInput).then(ArrayOfFilesLinks=>{

            ArrayOfFilesLinks=[...ArrayOfFilesLinks, ...ArrayOfFilesLinksOld]
            localStorage.setItem("ArrayOfFilesLinks",JSON.stringify(ArrayOfFilesLinks));

            Swal.fire('تم الرفع','','success');

            document.querySelector(".dadOfFilesLinks").innerHTML="";
            ArrayOfFilesLinks.forEach(e=>{
                document.querySelector(".dadOfFilesLinks").innerHTML+=`
                <div>
                    <a class="link" href="${e.src}" target="_blank" style="display: inline-block; max-width: 100px; overflow: hidden; text-overflow: ellipsis;">${e.name}</a>
                </div>
                <br>
                `;
            });


        });
        
    };

});




  