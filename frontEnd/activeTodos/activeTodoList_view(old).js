// /*jshint esversion: 6 */
// const Swipe = require('./../swipe/swipe');
// const MsgBox = require('./../messageBox/messageBox');
// const TaskMenu = require('./../menus/task_menu');
// const Icons = require('./../icons/icons.js');
// const OPTIONS = require('./../optionHandler/OptionHandler.js');
//
// module.exports = class TodoListView{
//   constructor(listController){
//
//     this._controller = listController;
//
//     // Editor parent
//     this._editorParent = $('#content');
//
//     // List of errors
//     this._missedTodos = [];
//
//     this._messenger = new MsgBox();
//   }
//
//
//   /**
//    * printTodos - Splits todos in four categories: overdue, today, tomorrow and to come,
//    * and requests printListTodo to print both todos and corresponding headers too.
//    *printRequest.options
//    * @param  {object} printRequest Includes a warTodo object (config file data with todos index info),
//    *                                and also todos object (collection of active todos in db)
//    */
//   printTodos(printRequest){
//
//     // Remove editor DOM
//     $('#editor').remove();
//
//     // Create new editor
//     this._theEditor = $('<div>',{
//       id:'editor'
//     });
//
//     // Create new list
//     this._theList = $('<ol>',{
//       id:'mainList',
//       class: 'stdListContainer'
//     });
//
//     // Collections used to divide todos into their respective period category.
//     let overdueCol = [];
//     let todayCol = [];
//     let tomorrowCol = [];
//     let toComeCol = [];
//
//     for (let i=0;i<printRequest.options.todoList.length;i++){
//       for (let j=0; j<printRequest.options.todoList[i].todos.length;j++){
//
//         let today = new Date();
//         today.setHours(0,0,0,0);
//
//         let warTodo = printRequest.options.todoList[i].todos.find (obj => {
//           return obj.index == j;
//         });
//
//         let currentTodo = printRequest.todos.find (obj => {
//           return obj._id == warTodo.id;
//         });
//
//         let todoDate = new Date(printRequest.options.todoList[i].date);
//
//         if(currentTodo!=undefined){
//
//           switch (true) {
//
//             case todoDate < today:
//               overdueCol.push(currentTodo);
//               break;
//
//             case todoDate < today.setDate(today.getDate()+1):
//               todayCol.push(currentTodo);
//               break;
//
//               case todoDate < today.setDate(today.getDate()+1):
//               tomorrowCol.push(currentTodo);
//               break;
//
//             default:
//               toComeCol.push(currentTodo);
//
//             }
//
//           // If war todo cannot be found in db.
//           }else{
//             this._missedTodos.push(warTodo.name);
//
//         }
//       }
//     }
//
//
//     // Overdue header goes out of the list so the user can never
//     // place anything on top of it.
//     let overDueHeader = $('<div>',{
//       id:'overDueHeader',
//       class:'view_top_title',
//       text: 'Overdue'
//     });
//
//
//     // Nest four arrays into one parent array.
//     let periods = [overdueCol,
//                    'Today', todayCol,
//                    'Tomorrow', tomorrowCol,
//                    'To come', toComeCol];
//
//     // Determines if the header needs a big margin top or not.
//     // Used to minimize the headers when they have no items inside.
//     let minimizeNextHeader = false;
//
//     // Finally prints todos and headers into the list.
//     for (let index=0; index<periods.length; index++){
//
//       // If object, check items inside.
//       if(typeof periods[index] === 'object')
//
//         // If periods, print periods
//         if(periods[index].length>0){
//
//           for(let o=0;o<periods[index].length;o++){
//           this.printListTodo(periods[index][o], printRequest.options);}
//
//         // If no items in one period, we reduce the top margin of the next header.
//         }else{
//           minimizeNextHeader=true;
//
//       // If string, print header with string.
//       // If minimize header, changes the size of the top margin to a smaller one.
//       }else{
//         let minimized = (minimizeNextHeader) ? true : false;
//         this.printListHeader(periods[index],minimized);
//         minimizeNextHeader=false;
//       }
//     }
//
//     // Append overdue header and list to the editor and print editor
//     this._theEditor.append(overDueHeader).append(this._theList);
//
//
//     // Only fade in the screen when fadein is true and no need items
//     // have been added to the list.
//     if(printRequest.fadein && printRequest.newTodoId.length==0){
//       this._theEditor.hide().fadeIn(800);
//       this._editorParent.append(this._theEditor);
//
//     // Fade in first and apply  color animation for new items later.
//     }else if(printRequest.fadein && printRequest.newTodoId.length>0){
//
//       this._theEditor.hide().fadeIn(800);
//       this._editorParent.append(this._theEditor);
//
//       setTimeout( () => {
//
//       for(let t=0;t<printRequest.newTodoId.length;t++){
//         this._newTodo = $('#' + printRequest.newTodoId[t]);
//
//         this._newTodo.animate({backgroundColor: "#fff4bf"}, 500 )
//         .animate({backgroundColor: 'white'}, 4000 );
//       }
//
//     }, 800);
//
//     // If no fade in effect and only one new item, color animation and scroll
//     // to the item.
//     }else if(printRequest.newTodoId.length==1){
//       this._editorParent.append(this._theEditor);
//       this._newTodo = $('#' + printRequest.newTodoId[0]);
//       this._newTodo.get(0).scrollIntoView();
//
//       // Scroll correction to avoid that the new task shows behind the top
//       // bar.
//       if(window.scrollY != (document.body.offsetHeight-window.innerHeight)){
//         window.scrollBy(0, -200);}
//
//       this._newTodo.animate({backgroundColor: "#fff4bf"}, 500 )
//       .animate({backgroundColor: 'white'}, 4000 );
//     }
//
//
//     this._swipe = new Swipe(this._controller);
//
//     //If error, displays a message with the list of errors that failed to print.
//     if(this._missedTodos.length>0){
//       this._messenger.showMsgBox('Failed to print:\n' +
//                                   this._missedTodos.join('\n'),'error','down');
//
//       console.log(printRequest.options.todoList);
//     }
//   }
//
//
//
//
//
//   /**
//    * printListTodo - receives a todo item, builds the html,
//    * applies the necessary css classes, picks up the category and
//    * project tag colors and prints the item into the main todo list
//    * in the main page.
//    *
//    * @param  {object} todo the target todo to print
//    * @param  {object} war  an object with all the most recent war data
//    *
//    */
//   printListTodo(todo, war){
//
//     let firstColumn = $('<td>');
//     let dragIcon = Icons.drag();
//     dragIcon.addClass('std_DragBtn instant');
//     // Padding added to place icon at the same height as
//     // the task name.
//     dragIcon.css('padding-top','5px');
//     dragIcon.css('padding-bottom','20px');
//     firstColumn.append(dragIcon);
//
//     let todoTitle = $('<div>',{
//       text: todo.name});
//
//     let labelContainer = $('<div>',{
//       class: 'task_label_container'
//     });
//
//
//     // Get category name and color from category options.
//     let catName = 'Other';
//     let catColor = '#263e65';
//     if (todo.categoryId!=''){
//       let catObj = OPTIONS.categories.getCategoryById(todo.categoryId);
//       if (catObj != undefined){
//         catName = catObj.title;
//         catColor = catObj.color;
//       }
//     }
//
//     // If category, add category to tag container, else add Other.
//     let categoryText = catName;
//       let categoryTag = $('<span>',{
//         class:'std_listItem_tag',
//         id: todo.categoryId,
//         text:categoryText});
//       categoryTag.css('background-color',catColor);
//       labelContainer.append(categoryTag);
//
//
//     //If project, add project to tag container.
//     if (todo.project!=''){
//       let projObj = OPTIONS.projects.getProjectById(todo.projectId);
//       if (projObj != undefined){
//         let projectTag = $('<span>',{
//           class:'std_listItem_tag',
//           id: projObj._id,
//           text: projObj.title});
//           projectTag.css('background-color', catColor);
//           labelContainer.append(projectTag);
//       }
//     }
//
//     // If learning, add learning icon
//     if (todo.learning){
//       let learningTag = $('<span>',{
//         class:'std_listItem_tag',
//         id:'learningTag',
//         text:'L'});
//       learningTag.css('background-color', catColor);
//       learningTag.css('opacity', '0.75');
//       labelContainer.append(learningTag);
//     }
//
//
//     let notesTag = $('<span>',{
//       class:'std_listItem_tag',
//       id:'notesTag',
//       text:'N'});
//     notesTag.css('background-color', catColor);
//     notesTag.css('opacity', '0');
//
//     if((todo.hasOwnProperty('notes') && todo.notes!='')){notesTag.css('opacity', '0.75');}
//     labelContainer.append(notesTag);
//
//
//     let secondColumn = $('<td>',{
//       class:'std_listItem_itemName'});
//     secondColumn.append(todoTitle).append(labelContainer);
//
//
//
//     // Hours column
//     let hourColumn = $('<td>',{
//       class:'hour_icon_container'});
//
//     let hourIcon;
//
//     // If Score, displays star icon.
//     // If value, displays progress (ej. 0/0h)
//     // If nothing, display invisible '0/0' to keep the same margin in all todos.
//     if(todo.hours!='Fast task' && todo.hours!='1'){
//
//       if(todo.hours=='Score'){
//         hourIcon = Icons.starActive();
//         hourIcon.addClass('std_menuIcon');
//       }else{
//         hourIcon = $('<div>',{
//           id: 'progress_div',
//           text: todo.progress + '/' + todo.hours});
//         hourIcon.css({
//           'color':'#1551b5',
//           'text-align':'right'
//       });
//       }
//
//     }else{
//       hourIcon = $('<div>',{
//         id: 'progress_div',
//         text: '0/1'});
//       hourIcon.css('opacity','0');
//     }
//     hourColumn.append(hourIcon);
//
//
//     // Date column
//
//     function short_month(dt){
//       let shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//       return shortMonths[dt.getMonth()];
//     }
//
//     let todoDate = new Date(todo.dueTo);
//     let abrevDate = short_month(todoDate) + ' ' + todoDate.getDate();
//
//     let thirdColumn = $('<td>',{
//       class:'task_deadline',
//       text: abrevDate});
//     if(todo.frequency>0){
//       thirdColumn.css('font-style','italic');
//       thirdColumn.css('color','#1551b5');
//     }
//
//
//     //Urgency column
//
//     function get_urgency_icon(urgency){
//       switch (urgency) {
//         case 'High':
//           return Icons.urgHigh();
//         case 'Normal':
//           return Icons.urgNormal();
//         case 'Low':
//           return Icons.urgLow();
//       }
//     }
//
//
//
//     let urgencyIcon = get_urgency_icon(todo.urgency);
//     urgencyIcon.addClass('std_menuIcon');
//
//     let forthColumn = $('<td>',{
//       class:'task_arrow_container'});
//
//     forthColumn.append(urgencyIcon);
//
//
//     //Menu column
//
//     let menuIcon = Icons.menu();
//     menuIcon.addClass('std_menuIcon');
//
//     let fifthColumn = $('<td>',{
//       class:'std_listItem_MenuCol',
//       id: 'task_menu_' + todo._id});
//
//
//     // Menu btn handler
//     fifthColumn.click( (e) => {
//
//       // Remove any possible existing menus first.
//       $('#contextMenu_floater').remove();
//       $('.stdListItem').css('background-color','white');
//
//       // Get icon jquery item to locate its position
//       let sourceBtn = $('#task_menu_' + todo._id);
//
//       // Call menu through TaskMenu class
//       let taskMenu = new TaskMenu(this._controller, todo, this._swipe);
//       taskMenu.displayTaskMenu(sourceBtn);
//
//       return false;
//     });
//
//     fifthColumn.append(menuIcon);
//
//
//     //Put all columns together
//
//     let firstRow = $('<tr>');
//     firstRow.append(firstColumn)
//             .append(secondColumn)
//             .append(hourColumn)
//             .append(thirdColumn)
//             .append(forthColumn)
//             .append(fifthColumn);
//
//
//
//     //Put rows together
//
//     let tableBody = $('<tbody>');
//     tableBody.append(firstRow);
//
//
//     //Put row in table
//
//     let todoTable = $('<table>',{});
//     todoTable.append(tableBody);
//
//
//     //Include table into a div.
//
//     let upperDiv = $('<div>',{
//       class:'stdListItemContainer'
//     });
//     upperDiv.append(todoTable);
//
//     let notes = (todo.hasOwnProperty('notes')) ? todo.notes : '';
//
//
//     //List item
//
//     let listItem = $('<li>',{
//       class: 'stdListItem ' + todo.type,
//       id:todo._id,
//       'data-date':todo.dueTo,
//       'data-hours': todo.hours,
//       'data-progress': todo.progress,
//       'data-name': todo.name,
//       'data-notes': notes});
//       listItem.css('background-color','white');
//
//     listItem.append(upperDiv);
//
//     // Second div for containing the progress bar (when there is)
//
//     if(todo.hours!='Score'){
//
//       let lowerDiv = $('<div>',{
//         class:'std_listItem_progressBar'});
//
//
//         let totalProgress = (todo.progress>0) ? Math.round((todo.progress/Number(todo.hours))*100) : 0;
//
//         lowerDiv.css('width',totalProgress+'%');
//         listItem.append(lowerDiv);
//
//     }
//
//     // Adding a mouseover event to display the drag and menu buttons
//     // when hovering the task. (only for desktop version)
//
//     if($( window ).width()>950){
//
//       listItem.hover(e => fifthColumn.animate({opacity: 1}, 0),
//                      e => fifthColumn.animate({opacity: 0}, 0));
//
//        listItem.hover(e => dragIcon.animate({opacity: 1}, 0),
//                       e => dragIcon.animate({opacity: 0}, 0));
//
//       }
//
//     this._theList.append(listItem);
//
//   }
//
//
//
//
//   /**
//    * printListHeader - Prints period headers into the todo list.
//    *
//    * @param  {string} title text that will display in the header.
//    * @return directly appends the header to the list.
//    */
//   printListHeader(title, minimized){
//
//     let listHeader = $('<li>',{
//       class: 'demo-no-reorder demo-no-swipe list_header',
//       text: title
//     });
//
//     if(minimized){
//       listHeader.css('margin-top','30px');
//     }
//
//     this._theList.append(listHeader);
//   }
//
// };
