const addTask = document.getElementById("addTask");
const input = document.getElementById("todoInput");
const todo = document.getElementById("toDo");
const addBtn = document.getElementById("add");
const task = document.getElementsByClassName("task");

addBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    const value = input.value;

    if (!value) return;

    const newTask = document.createElement("div");
    newTask.classList.add("task")
    newTask.setAttribute("draggable","true")
    newTask.innerText = value;

    newTask.addEventListener("dragstart",()=>{
        newTask.classList.add("isDragging")

    });
    newTask.addEventListener("dragend",()=>{
        newTask.classList.remove("isDragging")
    });

    todo.appendChild(newTask);
    input.value = "";    
    saveData();

});

function saveData(){
    localStorage.setItem("data",input.innerText);
}
function getData(){
    input.innerText = localStorage.getItem("data");
}
getData();
