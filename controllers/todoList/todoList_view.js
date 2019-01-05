/*jshint esversion: 6 */
const EventEmitter = require('events');
const Swipe = require('./../swipe/swipe');

module.exports = class TodoListView extends EventEmitter{
  constructor(war,listController){
    super(war);

    // War file
    this._war= war;
    this._controller = listController;
    this._war.on('printTodos', printRequest => this.printTodos(printRequest));
    this._war.on('todoRemoved', id => this.removetodo(id));

    // Editor parent
    this._editorParent = $('#content');
  }


  /**
   * printTodos - Splits todos in four categories: overdue, today, tomorrow and to come,
   * and requests printListTodo to print both todos and corresponding headers too.
   *
   * @param  {object} printRequest Includes a warTodo object (config file data with todos index info),
   *                                and also todos object (collection of active todos in db)
   */
  printTodos(printRequest){

    // Remove editor DOM
    $('#editor').remove();

    // Create new editor
    this._theEditor = $('<div>',{
      id:'editor'
    });

    // Create new list
    this._theList = $('<ol>',{
      id:'mainList'
    });

    // Collections used to divide todos into their respective period category.
    let overdueCol = [];
    let todayCol = [];
    let tomorrowCol = [];
    let toComeCol = [];

    for (let i=0;i<printRequest.warData.todoList.length;i++){
      for (let j=0; j<printRequest.warData.todoList[i].todos.length;j++){

        let today = new Date();
        today.setHours(0,0,0,0);

        let warTodo = printRequest.warData.todoList[i].todos.find (obj => {
          return obj.index == j;
        });

        let currentTodo = printRequest.todos.find (obj => {
          return obj._id == warTodo.id;
        });

        let todoDate = new Date(printRequest.warData.todoList[i].date);

        switch (true) {

          case todoDate < today:
            overdueCol.push(currentTodo);
            break;

          case todoDate < today.setDate(today.getDate()+1):
            todayCol.push(currentTodo);
            break;

            case todoDate < today.setDate(today.getDate()+1):
            tomorrowCol.push(currentTodo);
            break;

          default:
            toComeCol.push(currentTodo);
        }
      }
    }


    // Overdue header goes out of the list so the user can never
    // place anything on top of it.
    let overDueHeader = $('<div>',{
      id:'overDueHeader',
      class:'list_header_top',
      text: 'Overdue'
    });


    // Nest four arrays into one parent array.
    let periods = [overdueCol,
                   'Today', todayCol,
                   'Tomorrow', tomorrowCol,
                   'To come', toComeCol];

    // Determines if the header needs a big margin top or not.
    // Used to minimize the headers when they have no items inside.
    let minimizeNextHeader = false;

    // Finally prints todos and headers into the list.
    for (let index=0; index<periods.length; index++){

      // If object, check items inside.
      if(typeof periods[index] === 'object')

        // If periods, print periods
        if(periods[index].length>0){

          for(let o=0;o<periods[index].length;o++){
          this.printListTodo(periods[index][o], printRequest.warData);}

        // If no items in one period, we reduce the top margin of the next header.
        }else{
          minimizeNextHeader=true;

      // If string, print header with string.
      // If minimize header, changes the size of the top margin to a smaller one.
      }else{
        let minimized = (minimizeNextHeader) ? true : false;
        this.printListHeader(periods[index],minimized);
        minimizeNextHeader=false;
      }
    }

    // Append overdue header and list to the editor and print editor
    this._theEditor.append(overDueHeader).append(this._theList);

    // If no new todos are being added to the list, the editor is printed
    // with a general fade in effect.
    if (printRequest.newTodoId==0){
      this._theEditor.hide().fadeIn(800);
      this._editorParent.append(this._theEditor);

    // When there is a new todo, the window scrolls to show the new todo
    // and the todo is highlighted for a few seconds so it is easier to spot.
    }else{
      this._editorParent.append(this._theEditor);
      this._newTodo = $('#' + printRequest.newTodoId);
      this._newTodo.get(0).scrollIntoView();

      // Scroll correction to avoid that the new task shows behind the top
      // bar.
      if(window.scrollY != (document.body.offsetHeight-window.innerHeight)){
        window.scrollBy(0, -200);
      }

      this._newTodo.animate({backgroundColor: "#fff4bf"}, 500 )
                   .animate({backgroundColor: 'white'}, 4000 );
    }

    this._swipe = new Swipe(this._controller);


  }





  /**
   * printListTodo - receives a todo item, builds the html,
   * applies the necessary css classes, picks up the category and
   * project tag colors and prints the item into the main todo list
   * in the main page.
   *
   * @param  {object} todo the target todo to print
   * @param  {object} war  an object with all the most recent war data
   *
   */
  printListTodo(todo, war){

    let firstColumn = $('<td>');
    let dragIcon = $('<img>',{
      class: 'task_drag_btn instant',
      src:'/assets/btn_list_drag.svg'});
    firstColumn.append(dragIcon);

    let todoTitle = $('<div>',{
      text: todo.name});

    let labelContainer = $('<div>',{
      class: 'task_label_container'
    });


    // Get tag color from resource file.
    let tagColor = war.categories.find (obj => {
      return obj.id == todo.categoryId;
    });


    // If category, add category to tag container, else add Other.
    let categoryText = (todo.categoryId!='')? todo.category : 'Other';
      let categoryTag = $('<span>',{
        class:'task_category_label',
        id: todo.categoryId,
        text:categoryText});
      categoryTag.css('background-color',tagColor.color);
      labelContainer.append(categoryTag);


    //If project, add project to tag container.
    if (todo.project!=''){
      let projectTag = $('<span>',{
        class:'task_category_label',
        id: todo.projectId,
        text:todo.project});
      projectTag.css('background-color', tagColor.color);
      labelContainer.append(projectTag);
    }

    // If learning, add learning icon
    if (todo.learning){
      let learningTag = $('<span>',{
        class:'task_category_label',
        id:'learningTag',
        text:'L'});
      learningTag.css('background-color', tagColor.color);
      learningTag.css('opacity', '0.75');
      labelContainer.append(learningTag);
    }

    let secondColumn = $('<td>',{
      class:'task_title_cats'});
    secondColumn.append(todoTitle).append(labelContainer);


    // Hours column
    let hourColumn = $('<td>',{
      class:'hour_icon_container'});

    let hourIcon;

    // If Score, displays star icon.
    // If value, displays progress (ej. 0/0h)
    // If nothing, display invisible '0/0' to keep the same margin in all todos.
    if(todo.hours!='Fast task'){
      if(todo.hours=='Score'){
        hourIcon = $('<img>',{
          class:'task_menu_btn',
          src: '/assets/icon_star_active.svg'});
      }else{
        hourIcon = $('<div>',{
          text: todo.progress + '/' + todo.hours});
        hourIcon.css({
          'color':'#1551b5',
          'text-align':'right'
      });
      }
    }else{
      hourIcon = $('<div>',{
        text: '0/0'});
      hourIcon.css('opacity','0');
    }
    hourColumn.append(hourIcon);


    // Date column

    function short_month(dt){
      let shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return shortMonths[dt.getMonth()];
    }

    let todoDate = new Date(todo.dueTo);
    let abrevDate = short_month(todoDate) + ' ' + todoDate.getDate();

    let thirdColumn = $('<td>',{
      class:'task_deadline',
      text: abrevDate});
    if(todo.type=='habit'){
      thirdColumn.css('font-style','italic');
      thirdColumn.css('color','#1551b5');
    }


    //Urgency column

    function get_urgency_icon(urgency){
      switch (urgency) {
        case 'High':
          return '/assets/icon_arrow_up.svg';
        case 'Normal':
          return '/assets/icon_arrow_left.svg';
        case 'Low':
          return '/assets/icon_arrow_down.svg';
      }
    }



    let urgencyArrowIcon = get_urgency_icon(todo.urgency);

    let urgencyIcon = $('<img>',{
      class:'task_menu_btn',
      src: urgencyArrowIcon});

    let forthColumn = $('<td>',{
      class:'task_arrow_container'});

    forthColumn.append(urgencyIcon);


    //Menu column

    let menuIcon = $('<img>',{
      class:'task_menu_btn',
      src: '/assets/btn_task_menu.svg'});

    let fifthColumn = $('<td>',{
      class:'task_menu_container'});

    fifthColumn.append(menuIcon);


    //Put all columns together

    let firstRow = $('<tr>');
    firstRow.append(firstColumn)
            .append(secondColumn)
            .append(hourColumn)
            .append(thirdColumn)
            .append(forthColumn)
            .append(fifthColumn);



    //Put rows together

    let tableBody = $('<tbody>');
    tableBody.append(firstRow);


    //Put row in table

    let todoTable = $('<table>',{
      cellpadding: '0',
      cellspacing: '0',
      class: 'task_table'});
    todoTable.append(tableBody);


    //Include table into a div.

    let upperDiv = $('<div>',{
      class:'task_item_container_div'
    });
    upperDiv.append(todoTable);

    //List item

    let listItem = $('<li>',{
      class: 'task_item ' + todo.type,
      id:todo._id,
      'data-date':todo.dueTo});
      listItem.css('background-color','white');

    listItem.append(upperDiv);

    // Second div for containing the progress bar (when there is)

    if(todo.hours!='Score' && todo.hours!='Fast task' && todo.progress>0){

      let lowerDiv = $('<div>',{
        class:'task_item_progress_bar'});

        let totalProgress = Math.round((todo.progress/Number(todo.hours))*100);
        lowerDiv.css('width',totalProgress+'%');
        listItem.append(lowerDiv);

    }
    this._theList.append(listItem);
  }




  /**
   * printListHeader - Prints period headers into the todo list.
   *
   * @param  {string} title text that will display in the header.
   * @return directly appends the header to the list.
   */
  printListHeader(title, minimized){

    let listHeader = $('<li>',{
      class: 'demo-no-reorder demo-no-swipe list_header',
      text: title
    });

    if(minimized){
      listHeader.css('margin-top','30px');
    }

    this._theList.append(listHeader);


  }

};
