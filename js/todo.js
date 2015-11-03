function Todo(data) {
  this.id = ko.observable(data.id);
  this.text = ko.observable(data.text);
  this.completed = ko.observable(data.completed);
}

function TodoModel() {
  //Data
  var self = this;
  self.todos = ko.observableArray([]);
  self.newTaskText = ko.observable();

   
  //get
  $.ajax({
    url: "http://localhost:3000/tasks", 
    headers:{
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Token 46000fdec9f8de7da9a81b4b1f2014a2'
    },
    success: function(allData) {
      var mappedTasks = $.map(allData, function(item) {return new Todo (item)});
      self.todos(mappedTasks);
    }
  });

  //save
  self.save = function (todo) {
    $.ajax({
      url: "http://localhost:3000/task",
      headers:{
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Token 46000fdec9f8de7da9a81b4b1f2014a2'
      },
      data: ko.toJSON({todo: todo}),
      type: "POST", 
      contentType: "application/json",
      success: function(result) {
        console.log(result);
        newTodo = new Todo({id: result.id, text: result.text, completed: result.completed});
        self.todos.push(newTodo);
      }
    });
  };
  
  //add
  self.addTask = function() {
    todo = new Todo({text: this.newTaskText()});
    self.save(todo);
    self.newTaskText("");
  };

  //update
  self.updateTask = function(todo) {
    console.log({id: this.id(), text: this.text(), completed: this.completed()});
    $.ajax({
      url: "http://localhost:3000/task",
      headers:{
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Token 46000fdec9f8de7da9a81b4b1f2014a2'
      },
      data: ko.toJSON({todo: todo}),
      type: "PUT", 
      contentType: "application/json",
      success: function(result) {console.log(result)}
    });
  };

  //delete
  self.deleteTask = function(todo) {
    self.todos.destroy(todo);
    $.ajax({
      url: "http://localhost:3000/task",
      headers:{
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Token 46000fdec9f8de7da9a81b4b1f2014a2'
      },
      data: ko.toJSON({todo: todo}),
      type: "DELETE", 
      contentType: "application/json",
      success: function(result) {console.log(result)}
    });
  };  
};

ko.applyBindings(new TodoModel());