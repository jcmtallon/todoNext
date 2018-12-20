/*jshint esversion: 6 */
const setCurlet = require('./../otherMethods/setCaret');
const NewTaskModel = require('./add_task_form/new_task_model');
const NewTaskView = require('./add_task_form/new_task_view');
const NewTaskController = require('./add_task_form/new_task_controllers');

// (Dummy_To_be_replaced)
// Includes all available options for the user
// when interacting the form.
const options = {
  categories: [
    {title:'Salud', color:'#b5ea93', id:'catRRD3F'},
    {title:'Dinero', color:'#8ee2d3', id:'catRRD3G'},
    {title:'Programación', color:'#8c9be2', id:'catRRD3H'},
    {title:'Social', color:'#e2af8c', id:'catRRD3I'},
    {title:'True Story', color:'#e2988c', id:'catRRD3J'}
  ],
  projects:[
    {title: 'Correr la maraton', category: 'Salud', color:'#b5ea93', id:'proRRD3F'},
    {title: 'Completar esta maldita aplicacion', category: 'Programación', color:'#8c9be2', id:'proRRD3G'},
    {title: 'Ahorarr 10 millones de yenes', category: 'Dinero', color:'#8ee2d3', id:'proRRD3H'},
    {title: 'Grabar una película', category: 'True Story', color:'#e2988c', id:'proRRD3I'}
  ],
  hours:[
    {title: 'Score', value: 0, type:'habit', icon:'/assets/icon_star.svg', active:'/assets/icon_star_active.svg'},
    {title: 'Fast task', value: 1, type:'both', icon:'/assets/icon_hours.svg', active:'/assets/icon_hours.svg'},
    {title: '1 hour', value: 2, type:'both', icon:'/assets/icon_hours.svg', active:'/assets/number 1.svg'},
    {title: '2 hours', value: 3, type:'both', icon:'/assets/icon_hours.svg', active:'/assets/number 2.svg'},
    {title: '3 hours', value: 4, type:'both', icon:'/assets/icon_hours.svg', active:'/assets/number 3.svg'},
    {title: '4 hours', value: 5, type:'both', icon:'/assets/icon_hours.svg', active:'/assets/number 4.svg'},
    {title: '5 hours', value: 6, type:'both', icon:'/assets/icon_hours.svg', active:'/assets/number 5.svg'},
    {title: '6 hours', value: 7, type:'both', icon:'/assets/icon_hours.svg', active:'/assets/number 6.svg'},
    {title: '7 hours', value: 8, type:'both', icon:'/assets/icon_hours.svg', active:'/assets/number 7.svg'},
    {title: '8 hours', value: 9, type:'both', icon:'/assets/icon_hours.svg', active:'/assets/number 8.svg'},
    {title: '9 hours', value: 10, type:'both', icon:'/assets/icon_hours.svg', active:'/assets/number 9.svg'}
  ],
  urgency:[
    {title: 'High', icon:'/assets/icon_arrow_up.svg'},
    {title: 'Normal', icon:'/assets/icon_arrow_left.svg'},
    {title: 'Low', icon:'/assets/icon_arrow_down.svg'}
  ],
  learning:[
    {title: 'Also a learning', icon:'/assets/icon_learning.svg', active:'/assets/icon_learning_active.svg'},
    {title: 'Just a task', icon:'/assets/icon_justTask.svg', active:'/assets/icon_justTask.svg'}
  ]
};

exports.showModal = function(){

  const model = new NewTaskModel();
  const view = new NewTaskView(model, options);
  const controller = new NewTaskController(model, view, options);
} ;
