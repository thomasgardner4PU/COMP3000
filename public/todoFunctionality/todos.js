get_todos()

function get_todos() {
    let request = new XMLHttpRequest();
    let requestURL = '/get_todos'
    request.open('GET', requestURL)
    request.responseType = 'json'
    request.send()
    request.onload = function () {
        let todos =  request.response
        printTodos(todos)
    }
}

function printTodos(todos) {

    let table = document.getElementById("todo_table")
    for (var i in todos) {
        const todo_id = todos[i].todo_id
        const todo =  todo[i].todo
        let row = document.createElement("tr")
        let todo_cell = document.createElement("td")
        let todo_button = document.createElement("button")
        todo_button.setAttribute("onclick", "completeTodo(" + todo_id + ")")
        todo_button.innerHTML = todo
        todo_cell.append(todo_button)
        row.append(todo_cell)
        table.append(row)

    }
}

function completeTodo(todo_id) {
    let form = document.getElementById("complete_todo_form")
    form.action = form.action + todo_id
    form.submit()
}