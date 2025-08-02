// Elements
const addButton = document.querySelector(".input-div button");
const inputBox = document.querySelector(".input-div input");
const listContainer = document.querySelector("#list-container");
const taskStatus = document.querySelectorAll(".task-status div");
const taskInfo = document.querySelector("#tasks-info");

let tasks = [];
let isEditing = false;
let currentId = null;

function addTask(){
    //Katsotaan onko käyttäjä kirjoittanut mitään
    if(inputBox.value.trim() == ""){
        alert("Kirjoita ensin jotain");
    } else {
        //Tallennetaan tehtävä objektina listaan
        let task = {status: "pending", name : inputBox.value};
        tasks.push(task);
        
        saveData();
        getTasks("all");
    }
    //Tyhjennetään input boxi
    inputBox.value = "";
}

function getTasks(filter){
    let li = "";
    document.querySelector(".active").classList.remove("active");
    document.getElementById(filter).classList.add("active");
    if(!tasks.length == 0){
        tasks.forEach((task, id) => {
            if(task.status == filter || filter == "all"){
                li += `<li id=${id} class=${task.status}><div id="check-icon"></div>${task.name}<img id="more-icon" src="img/more.png" alt="more">
                <div id="more-div">
                <button id="deleteButton">Poista</button>
                <button id="editButton">Muokkaa</button>
                </div></li>`;
            }
        });
    }
    listContainer.innerHTML = li;
    //Jos tehtäviä ei ole teksti tulee näkyviin
    if(li == ""){
        taskInfo.style.display = "block";
    } else {
        taskInfo.style.display = "none";
    }
}

function editTask(id){
    //Muokataan tehtävän nimeä
    if(inputBox.value.trim() != ""){
        tasks[id].name = inputBox.value;
        saveData();
        getTasks("all");
        currentId = null;
        isEditing = false;
    } else {
        alert("Sinun pitää kirjoittaa jotain");
    }
    inputBox.value = "";
}

function getTaskAmount(){
    let pendingTasks = 0;
    let doneTasks = 0;
    tasks.forEach(task => {
        if(task.status == "pending"){
            pendingTasks++;
        } else {
            doneTasks++;
        }
    });
    //Tehtävien määrä näkyviin
    all.innerHTML = "Kaikki("+tasks.length+")";
    pending.innerHTML = "Tekemättä("+pendingTasks+")";
    done.innerHTML = "Tehty("+doneTasks+")";
}

//Auki oleva valikko suljetaan
function closeOptions(){
    if(document.querySelector("#more-div.active")){
        document.querySelector("#more-div.active").classList.remove("active");
    }
}

//EventListeners
addButton.addEventListener("click", ()=> {
    if(!isEditing){
        addTask();
    } else {
        editTask(currentId);
    }
});

listContainer.addEventListener("click", (e)=>{
    //Vaihdetaan tehtävän tila
    if(e.target.nodeName == "LI"){
        e.target.classList.toggle("done");
        if(tasks[e.target.id].status == "pending"){
            tasks[e.target.id].status = "done";
        } else {
            tasks[e.target.id].status = "pending";
        }
        saveData();
        closeOptions();

        //Selaako käyttäjä tekemättömiä tai tehtyjä tehtäviä
        let currentStatus = document.querySelector(".task-status div.active");
        getTasks(currentStatus.id);
        
    } else if(e.target.nodeName == "IMG"){
        if(!e.target.nextElementSibling.classList.contains("active")){
            closeOptions();
        }
        //Valikko näkyviin
        e.target.nextElementSibling.classList.toggle("active");
    } else if(e.target.id == "deleteButton"){
        closeOptions();
        //Poistetaan tehtävä
        tasks.splice(e.target.offsetParent.offsetParent.id, 1);
        saveData();
        getTasks("all");
    } else if(e.target.id == "editButton"){
        closeOptions();
        //Muokataan tehtävää
        isEditing = true;
        currentId = e.target.offsetParent.offsetParent.id;
        inputBox.value = tasks[currentId].name;
    }
});

taskStatus.forEach(statusBtn => {
    statusBtn.addEventListener("click", () => {
        document.querySelector(".active").classList.remove("active");
        statusBtn.classList.add("active");
        getTasks(statusBtn.id);
    });
});

//localStorage
//Tallennetaan tehtävä lista
function saveData(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
    getTaskAmount();
}
//Haetaan tehtävä lista
function getData(){
    if(localStorage.getItem("tasks") != null){
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    getTaskAmount();
}

//Kun sivu avautuu data haetaan localstoragesta
getData();
getTasks("all");