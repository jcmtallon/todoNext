/*jshint esversion: 6 */
const NewTaskModel = require('./add_task_form/new_task_model');
const NewTaskView = require('./add_task_form/new_task_view');
const NewTaskController = require('./add_task_form/new_task_controllers');
const TodoListController = require('./../todoList/todoList_controller');
const OPTIONS = require('./../optionHandler/optionHandler.js');

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
    {title: "Also a learning", icon:"learning", active:"/assets/icon_learning_active.svg"},
    {title: "Just a task", icon:"regularTask", active:"/assets/icon_justTask.svg"}
  ]
};

exports.showModal = function(){

  compileOptions(OPTIONS.options);

  const model = new NewTaskModel(OPTIONS.id);
  const listMaster = new TodoListController(model);
  const view = new NewTaskView(model, options, listMaster);
  const controller = new NewTaskController(model, view, options);

};



/**
 * compileOptions - Adds the user custom categories and projects to the add modal option collection.
 * In the case of projects, it retrieves the corresponding category color and title for the linked
 * categories.
 *
 * @param  {Object} userOptions user options sent by the database when logging in.
 */
function compileOptions(userOptions) {


    // Extract categories (no need for any modifications)
    options.categories = userOptions.categories;

    // Extract projects (category color and category title data
    // is added to each project item to facilitate later the
    // printing)
    options.projects=[];

    $.each(userOptions.projects,( index, category) =>{

      if (userOptions.projects[index].status=='active'){

        let proj ={title: userOptions.projects[index].title,
                   id: userOptions.projects[index].id,
                   categoryId: userOptions.projects[index].categoryId,
        };

        // Find the corresponding category for this project.
        if (proj.categoryId!=''){
          let cat  = options.categories.find (obj => {
            return obj.id == proj.categoryId;
          });

          proj.category = cat.title;
          proj.color = cat.color;

        }else{
          proj.category = '';
          proj.color = '#263e65';
        }

        options.projects.push(proj);

      }


    });

}
