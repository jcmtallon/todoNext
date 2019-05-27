/*jshint esversion: 6 */
const NewTaskModel = require('./add_task_form/new_task_model');
const NewTaskView = require('./add_task_form/new_task_view');
const NewTaskController = require('./add_task_form/new_task_controllers');
const TodoListController = require('./../activeTodos/activeTodoList_controller');
const OPTIONS = require('./../optionHandler/OptionHandler');

// ID generator
// '_' + Math.random().toString(36).substr(2, 9);

// (Dummy_To_be_replaced)
// Includes all available options for the user
// when interacting the form.
const options = {
  hours:[
    {title: "Score", value: "Score", type:"habit", icon:"star", active:"starActive"},
    {title: "Fast task", value: "Fast task", type:"both", icon:"hours", active:"hours"},
    {title: "1 hour", value: "1", type:"both", icon:"hours", active:"number1"},
    {title: "2 hours", value: "2", type:"both", icon:"hours", active:"number2"},
    {title: "3 hours", value: "3", type:"both", icon:"hours", active:"number3"},
    {title: "4 hours", value: "4", type:"both", icon:"hours", active:"number4"},
    {title: "5 hours", value: "5", type:"both", icon:"hours", active:"number5"},
    {title: "6 hours", value: "6", type:"both", icon:"hours", active:"number6"},
    {title: "7 hours", value: "7", type:"both", icon:"hours", active:"number7"},
    {title: "8 hours", value: "8", type:"both", icon:"hours", active:"number8"},
    {title: "9 hours", value: "9", type:"both", icon:"hours", active:"number9"}
  ],
  urgency:[
    {title: "High", icon: "urgHigh"},
    {title: "Normal", icon: "urgNormal"},
    {title: "Low", icon: "urgLow"}
  ],
  learning:[
    {title: "Also a learning", icon:"learningGrey", active:"/assets/icon_learning_active.svg"},
    {title: "Just a task", icon:"regularTask", active:"/assets/icon_justTask.svg"}
  ]
};

exports.showModal = function(){

  compileOptions(OPTIONS);

  const model = new NewTaskModel(OPTIONS.userId);
  const listMaster = new TodoListController(model);
  const view = new NewTaskView(model, options, listMaster);
  const controller = new NewTaskController(model, view, options);

};



/**
 * compileOptions - Adds the user custom categories and projects to the add modal option collection.
 * In the case of projects, it retrieves the corresponding category color and title for the linked
 * categories..
 *.
 * @param  {Object} userOptions user options sent by the database when logging in.
 */
function compileOptions(userOptions) {

    options.categories = userOptions.categories.getCategories();

    // Extract projects (category color and category title data
    // is added to each project item to facilitate later the
    // printing)
    //
    options.projects = [];

    $.each(userOptions.projects.getProjects(),(index, project) =>{

      let catColor = '#263e65';
      let catName = '';
      if (project.categoryId!=''){
        let cat = options.categories.find( obj => {
          return obj._id == project.categoryId;
        });
          if (cat!=undefined){
            catColor = cat.color;
            catName = cat.title;
          }
      }
      project.color = catColor;
      project.category = catName;
      options.projects.push(project);
    });

}
