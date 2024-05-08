const taskInput = document.querySelector(".task-input input"),
  filters = document.querySelectorAll(".filters span"),
  clearAll = document.querySelector(".clear-btn"),
  taskBox = document.querySelector(".task-box"),
  employeeSelect = document.getElementById("employee-select");

let editId,
  isEditTask = false,
  todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

function showTodo(filter) {
  let liTag = "";
  if (todos) {
    todos.forEach((todo, id) => {
      let completed = todo.status == "completed" ? "checked" : "";
      if (filter == todo.status || filter == "all") {
        liTag += `<li class="task">
                    <label for="${id}">
                        <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                        <p class="${completed}">${todo.name}</p>
                        <p>Assigned to: ${todo.employee}</p>
                    </label>
                    <div class="settings">
                        <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                        <ul class="task-menu">
                            <li onclick='editTask(${id}, "${todo.name}", "${todo.employee}")'><i class="uil uil-pen"></i>Edit</li>
                            <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                        </ul>
                    </div>
                </li>`;
      }
    });
  }

  taskBox.innerHTML = liTag || `<span>Хоосон байна</span>`;
  let checkTask = taskBox.querySelectorAll(".task");
  !checkTask.length
    ? clearAll.classList.remove("active")
    : clearAll.classList.add("active");
  taskBox.offsetHeight >= 300
    ? taskBox.classList.add("overflow")
    : taskBox.classList.remove("overflow");
}
showTodo("all");

function showMenu(selectedTask) {
  let menuDiv = selectedTask.parentElement.lastElementChild;
  menuDiv.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != selectedTask) {
      menuDiv.classList.remove("show");
    }
  });
}

function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

function editTask(taskId, textName, selectedEmployee) {
  editId = taskId;
  isEditTask = true;
  taskInput.value = textName;
  employeeSelect.value = selectedEmployee;
  taskInput.focus();
  taskInput.classList.add("active");
}

function deleteTask(deleteId, filter) {
  isEditTask = false;
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo(filter);
}

clearAll.addEventListener("click", () => {
  isEditTask = false;
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo();
});

taskInput.addEventListener("keyup", (e) => {
  let userTask = taskInput.value.trim();
  if (e.key == "Enter" && userTask) {
    if (!isEditTask) {
      todos = !todos ? [] : todos;
      let taskInfo = {
        name: userTask,
        status: "pending",
        employee: employeeSelect.value,
      };
      todos.push(taskInfo);
    } else {
      isEditTask = false;
      todos[editId].name = userTask;
      todos[editId].employee = employeeSelect.value;
    }
    taskInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(document.querySelector("span.active").id);
  }
});

function addEmployee() {
  const employeeName = prompt("Enter the name of the new employee:");
  if (employeeName) {
    const selectElement = document.getElementById("employee-select");
    const optionElement = document.createElement("option");
    optionElement.textContent = employeeName;
    optionElement.value = employeeName;
    selectElement.appendChild(optionElement);
  }
}

document
  .getElementById("add-employee-btn")
  .addEventListener("click", addEmployee);

function deleteEmployee() {
  const selectElement = document.getElementById("employee-select");
  const selectedIndex = selectElement.selectedIndex;
  if (selectedIndex !== -1) {
    const confirmed = confirm("Энэ ажилтанг устгахдаа итгэлтэй байна уу!!");

    if (confirmed) {
      selectElement.remove(selectedIndex);
      alert("Амжилттай устлаа");
    }
  } else {
    alert("Устгах ажилтнаа сонгоно уу.");
  }
}
document
  .getElementById("delete-employee-btn")
  .addEventListener("click", deleteEmployee);

const tasks = [
  { id: 1, name: "Task 1", assignedTo: "John Doe" },
  { id: 2, name: "Task 2", assignedTo: "Jane Smith" },
];

function displayTasks(username) {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    if (task.assignedTo === username) {
      const li = document.createElement("li");
      li.textContent = task.name;
      taskList.appendChild(li);
    }
  });
}

function employeeAuthentication(username, password) {
  const employeeUsername = "employee";
  const employeePassword = "employee";

  return username === employeeUsername && password === employeePassword;
}

function customerAuthentication(username, password) {
  const customerUsername = "customer";
  const customerPassword = "customer";

  return username === customerUsername && password === customerPassword;
}

document.getElementById("logout-btn").addEventListener("click", logout);

document.getElementById("login-btn").addEventListener("click", () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const loginType = document.getElementById("login-type").value;
  if (loginType === "employee") {
    if (employeeAuthentication(username, password)) {
      console.log("Employee authenticated successfully.");
      showTaskElements(); // Show task-related elements
    } else {
      alert("Ажилтны нэр эсвэл нууц үг буруу байна");
    }
  } else if (loginType === "customer") {
    if (customerAuthentication(username, password)) {
      console.log("Customer authenticated successfully.");
      showTaskElements(); // Show task-related elements
    } else {
      alert("Хэрэглэгчийн нэр эсвэл нууц үг буруу байна");
    }
  }
});

function showTaskElements() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("task-elements").style.display = "block";
  document.getElementById("task-dashboard").style.display = "block";
}
