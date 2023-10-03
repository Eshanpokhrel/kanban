const draggable = document.querySelectorAll(".task");
const droppable = document.querySelectorAll(".taskBox");

draggable.forEach((task)=>{
    task.addEventListener("dragstart",()=>{
        task.classList.add("isDragging")
    });
    task.addEventListener("dragend",()=>{
        task.classList.remove("isDragging")
    });
})
droppable.forEach((land)=>{
    land.addEventListener("dragover",(e)=>{
        e.preventDefault();
        const bottomTask  = insertAboveTask(land, e.clientY)
        const currentTask = document.querySelector(".isDragging")

        if (!bottomTask) {
            land.appendChild(currentTask)
        }
        else{
            land.insertBefore(currentTask, bottomTask);
        }
    });
});

const insertAboveTask = (land,mouseY) => {
    const els = land.querySelectorAll(".task:not(.isDragging)");

    let closestTask = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    els.forEach((task)=>{
        const { top } = task.getBoundingClientRect();
        const offset = mouseY - top;

        if (offset<0 && offset>closestOffset) {
            closestOffset = offset;
            closestTask = task;
        }
    });

    return closestTask;
}