const addTask = document.getElementById("addTask");
const input = document.getElementById("todoInput");
const todo = document.getElementById("toDo");
const addBtn = document.getElementById("add");

addBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    const value = input.value;

    if (!value) return;

    const newTask = document.createElement("p");
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
    localStorage.setItem("data",todo.innerText)
}
// function getData(){
//     todo.innerText = localStorage.getItem("data");
// }
