/* your JS code here */
//
'use strict';

(function () {
    /*
   this class manage a list of to do-s and uses to-do class
    */
    class TodoList {
        // we handle an array of To-do objects
        constructor() {
            this.todoList = [];
        }
        // adds a new to do to the list
        add(item) {
            this.todoList.push(item);
        }

        // this function sorts the list alphabaticly acording to title
        sortList() {
            this.todoList.sort((a,b)=> {return (a.title < b.title ? -1 : 1)});
        }

        // search for to do with similar title retrun true if found
        // params: item: the title to check
        isInList(item){
            return (this.todoList.find((x) => x.title === item) !== undefined)
        }
        // convetrs the full lists of to-dos to html
        toHtml(){
            let res = ""
            for (const x of this.todoList) {
                res += x.toSingleHtml();
            }
            return res;

        }
        // removes a to-do using the title from the list
        // params: t: the title to remove
        deleteTodo(t){
            for (let x = 0 ; x < this.todoList.length ; x++) {
                if (this.todoList[x].title === t) {
                    this.todoList.splice(x,1);
                }
            }
        }

    }

    // this class represents a single to-do
    class Todo{
        constructor(title,desc,priority) {
            this.title = title;
            this.desc = desc;
            this.priority = priority;
        }
        // convets a single to-do to a bootstrap card
        toSingleHtml(){
            let p = this.priority? "bg-danger bg-opacity-25" : "";
            let no_p = this.priority? "" : "foobar";
            let res = `<li class="list-group-item ${p} ${no_p}">
                            <div class="ms-2 me-auto float-right">
                                <div class="fw-bold">${this.title}</div>
                                <pre>${this.desc}</pre>
                                    <div class="d-flex">
                                        <button type="button" class="btn btn-danger deletebut ms-auto">Delete</button>
                                    </div>
                                      
                            </div>
                        </li>`;

            return(res)
        }
    }

    let myList = new TodoList();

    // check input and display error msg if needed
    function validateForm(){
        let errors = []
        let titlevalue = document.getElementById("title").value.trim()
        if ( titlevalue === ""){
            errors.push("title should not be empty");
            document.getElementById("titleerror").innerHTML = "<p>" + errors[errors.length-1] + "</p>";
        }
        if (!titlevalue.match("^[A-Za-z0-9]+$")){
            errors.push("title should inlcude letters and digits");
            document.getElementById("titleerror").innerHTML = "<p>" + errors[errors.length-1] + "</p>";
        }
        if (myList.isInList(titlevalue)){
            errors.push("title already exists")
            document.getElementById("titleerror").innerHTML = "<p>" + errors[errors.length-1] + "</p>";
        }
        if (document.getElementById("description").value.trim() === ""){
            errors.push("description is empty")
            document.getElementById("descerror").innerHTML = "<p>" + errors[errors.length-1] + "</p>";
        }
        return (errors.length === 0);
    }
    // remove all error messages
    function resetErrors(){
        document.getElementById("titleerror").innerHTML = "";
        document.getElementById("titleerror").innerHTML = "";
        document.getElementById("descerror").innerHTML = "";
    }

    // show/hide the buttons when switching from hoem screen to high priority screen
    function toggleButtons(){
        document.getElementById("showpriority").classList.toggle("d-none");
        document.getElementById("sortlist").classList.toggle("d-none");
        document.getElementById("back").classList.toggle("d-none");
        document.getElementById("form").classList.toggle("d-none");
    }
    // show/hide the non-high priority to-dos when switching to high priotity screen
    function toggleTodo(){
        toggleButtons();
        let nonPriority = document.querySelectorAll(".foobar");
        for (let x of nonPriority){
            x.classList.toggle("d-none");
        }
    }
    // empty the input after a task is succesfully added
    function clearTextBoxes() {
        document.getElementById("description").value = "";
        document.getElementById("title").value = "";
    }
    // the listener for the delete button
    function attachDelButton(ev) {
        myList.deleteTodo(ev.target.parentElement.firstElementChild.innerHTML);
        ev.target.parentElement.parentElement.parentElement.remove();
    }

    // main DOM event
    document.addEventListener("DOMContentLoaded", function (){

        document.getElementById("addtask").addEventListener("click",function (){
            resetErrors();
            if (validateForm()) {
                let t =  new Todo(document.getElementById("title").value.trim(),
                    document.getElementById("description").value.trim(),
                    document.getElementById("priority").checked);

                myList.add(t);
                // empty the text boxes if task was added succesfully
                clearTextBoxes();

                document.getElementById("todolist").insertAdjacentHTML("beforeend",t.toSingleHtml());
                document.getElementById("todolist").lastElementChild.firstElementChild.lastElementChild.addEventListener("click",function(ev){
                    // add listner to delete button.
                    attachDelButton(ev);
                });
            }
        });

        document.getElementById("sortlist").addEventListener("click", function (){
            myList.sortList();
            document.getElementById("todolist").innerHTML = myList.toHtml()
            let delbutton = document.querySelectorAll(".deletebut");
            for (let x of delbutton){
                x.addEventListener("click",function(ev){
                    // add listner to delete button.
                    attachDelButton(ev);
                })
            }
        })

        document.getElementById("showpriority").addEventListener("click",toggleTodo)
        document.getElementById("back").addEventListener("click" ,toggleTodo);
    })

})();



