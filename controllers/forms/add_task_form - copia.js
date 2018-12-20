/*jshint esversion: 6 */
const helpHint = require('./../hints/help_hint');
const setCurlet = require('./../otherMethods/setCaret');

//Stores the user text input
let textinput;

//Dummy object with available projects and categories.
const availables = {
  categories: [
    ['Salud','green'],
    ['Dinero','red'],
    ['Estudiar','black'],
    ['Descansar todo lo que pueda hasta mañana','blue']
  ],
  projects:[
    ['Correr maratón','Salud','green'],
    ['Dormir 8 horas','Descansar','yellow'],
    ['Ahorrar x yenes','Dinero','red']
  ],
  hours:[
    ['0 hours', 1],
    ['1 hours', 2],
    ['2 hours', 3],
    ['3 hours', 4],
    ['4 hours', 5],
    ['5 hours', 6],
    ['6 hours', 7],
    ['7 hours', 8],
    ['8 hours', 9],
    ['9 hours', 10]
  ],
  habitHours:[
    ['Score',0],
    ['0 hours', 1],
    ['1 hours', 2],
    ['2 hours', 3],
    ['3 hours', 4],
    ['4 hours', 5],
    ['5 hours', 6],
    ['6 hours', 7],
    ['7 hours', 8],
    ['8 hours', 9],
    ['9 hours', 10]
  ],
  urgency:[
    ['High','/assets/icon_arrow_up.svg'],
    ['Normal','/assets/icon_arrow_left.svg'],
    ['Low','/assets/icon_arrow_down.svg']
  ],
  learning:[
    ['Learning']
  ]
};

//Displays modal and loads all necessary functionality
exports.showModal = function(){

  //Build modal and display
  let modal = buildModal();
  $(document.body).append(modal);


  // Displays hint box when hovering elements with hints
  loadHinter();

  // Focus on task name text date_box
  $('.modal_addTask_body_textBox').focus();

  //setting jquery ui data picker functionality
  setDatePicker();

  // close button functionality
  setModalCloser();

  // swapping task-habit modes
  setTodoTypeButtons();

  // Set event handlers for option drop down menus
  setDropDownTables();

  // Set icon button actions
  setIconActions();
};

// Set icon button actions
function setIconActions(){

  let iconBtn = $('.modal_icon');
  let keyword ='';
  let choice = '';

  iconBtn.on('click',function(e){
    switch (e.target.id) {
      case 'modal_addTask_categoryIcon':
        keyword='c.';
        choice='categories';
        break;
      case 'modal_addTask_projectIcon':
        keyword='p.';
        choice='projects';
        break;

      case 'modal_addTask_hoursIcon':
        keyword='h.';

        if($('#addTask_radio_todo').is(':checked')){
          choice='hours';
        }else{
          choice='habitHours';
        }
        break;

      case 'modal_addTask_learningIcon':
        keyword='l.';
        choice='learning';

        //If learning icon actived, deactivate icon.
        let learningIcon = $('#modal_addTask_learningIcon');
        if( learningIcon.parent().attr('data-value') == 'true'){
          learningIcon.parent().attr('data-value','false');
          learningIcon.attr('src','/assets/icon_learning.svg');
          return;}
        break;


      case 'modal_addTask_priorityIcon':
        keyword='u.';
        choice='urgency';
        break;
    }

    let textBox = $('.modal_addTask_body_textBox');


    //Removes inserted tag text
    textBox.text(textBox.text().replace(new RegExp(textinput + '$'), ''));
    textBox.text(textBox.text().replace(new RegExp('c\\.' + '|' + 'p\\.' + '|' + 'l\\.' + '|' + 'u\\.' + '|' + 'h\\.' + '|', 'g'), ''));
    textBox.text(textBox.text().trim());


    //Adds the selected icon shorcut to the end of the text box
    if (textBox.text()==""){
      textBox.text(keyword).focus().text(keyword);
    }else{
      textBox.text(textBox.text() + ' ' + keyword);
    }

    //Get text box node, focus and place the curlet at the end
    textBoxNode = document.getElementsByClassName('modal_addTask_body_textBox')[0];
    setCurlet.setEndOfContenteditable(textBoxNode);

    textinput="";

    //Display corresponding menu
    displayDropDownTable(choice);

    });
}

// Build add task modal
function buildModal(){
  // modal header
  let modalHeader =buildModalHeader();

  // modal modal
  let modalBody = buildModalBody();

  // Modal frame
  let modalContent = $('<div>', {
    class: 'modal_addTask_content',
    id:'modal_addTask_content'});
  modalContent.append(modalHeader).append(modalBody);

  let modal = $('<div>', {
    class: 'modal_addTask',
    id:'modal_addTask'});
  modal.append(modalContent);

  return modal;
}

// Builds modal header
function buildModalHeader(){

  // todo and habit radio buttons
  let radioControlGroup = $('<div>',{
    class: 'addTask_radio_container'});
  let radioInputTodo = $('<input>',{
    type: 'radio',
    name: 'addTask_radio',
    id: 'addTask_radio_todo',
    checked: 'checked'});
  let radioLabelTodo = $('<label>',{
    for: 'addTask_radio_todo',
    text: 'Task',
    class: 'radio_label'});
  let radioInputHabit = $('<input>',{
    type: 'radio',
    name: 'addTask_radio',
    id: 'addTask_radio_habit'});
  let radioLabelHabit = $('<label>',{
    for: 'addTask_radio_habit',
    text: 'Habit',
    class: 'radio_label'});
  radioControlGroup
    .append(radioInputTodo)
    .append(radioLabelTodo)
    .append(radioInputHabit)
    .append(radioLabelHabit);
  let modalHeaderTableRadioColumn = $('<td>',{
    class: 'modal_addTask_header_table_radioClm'});
  modalHeaderTableRadioColumn.append(radioControlGroup);


  // Modal header middle column
  let captionLeft = $('<div>',{
    class:'modal_addTask_caption_cat'
  });

  let captionRight = $('<div>',{
    class:'modal_addTask_caption_proj'
  });

  let modalHeaderTableCaptionColumn = $('<td>',{
    class: 'modal_addTask_header_table_captionClm',
    text: ''});
    modalHeaderTableCaptionColumn.append(captionLeft).append(captionRight);

  // close button
  let modalHeaderTableCloseColumn = $('<td>',{
    class: 'modal_addTask_header_table_closeClm'});
  let emptyDiv = $('<div>',{});
  let emptySpan = $('<span>',{});
  let closeBtn = $('<img>',{
    class:'modal_addTask_closeBtn',
    src: '/assets/btn_close_modal.svg',
    id: 'modal_addTask_closeBtn'});
  emptySpan.append(closeBtn);
  emptyDiv.append(emptySpan);
  modalHeaderTableCloseColumn.append(emptyDiv);


  // compile header
  let modalHeaderTableBody = $('<tbody>',{});
  modalHeaderTableBody
    .append(modalHeaderTableRadioColumn)
    .append(modalHeaderTableCaptionColumn)
    .append(modalHeaderTableCloseColumn);

    let modalHeaderTable = $('<table>',{
      class: 'modal_addTask_header_table',
      id:'modal_addTask_header_table'});

    modalHeaderTable.append(modalHeaderTableBody);
    let header = $('<div>', {
      class: 'modal_addTask_header',
      id:'modal_addTask_header'});
    header.append(modalHeaderTable);

    return header;
}

// Builds modal modal body
function buildModalBody(){

  //modal body top part
  let text_box_container = $('<div>',{
    class:'modal_addTask_body_textBox',
    tabindex:'1',
    autocomplete:'off',
    contenteditable:'true',
    placeholder:"Write your task or habit here..."});

  let text_box_clm = $('<td>',{
    class:'modal_addTask_body_textBox_col'});
  text_box_clm.append(text_box_container);

  let date_box_container = $('<input>',{
    type:'text',
    class:'modal_addTask_body_dueDate',
    id: 'modal_addTask_body_dueDate',
    name:'modal_addTask_body_dueDate',
    tabindex:'2',
    autocomplete:'off'});

  let date_box_clm = $('<td>',{
    class:'modal_addTask_body_dueDate_col'});
  date_box_clm.append(date_box_container);

  let taskNameTableBodyRow = $('<tr>',{});
  taskNameTableBodyRow.append(text_box_clm).append(date_box_clm);

  let taskNameTableBody = $('<tbody>',{});
  taskNameTableBody.append(taskNameTableBodyRow);

  let taskNameTable = $('<table>',{
    class:'modal_addTask_body_taskNameRow_table'});
  taskNameTable.append(taskNameTableBody);


  //modal body lower part
  let icon_holder = createIconPackage('task');

  let add_icons = $('<td>',{
    class:'modal_addTask_body_icons_col'});
  add_icons.append(icon_holder);

  let submit_Btn = $('<div>',{
    class:'blue_botton',
    id:'modal_addTask_body_submit_btn',
    text: 'Add task'});

  let add_btn_col = $('<td>',{
    class:'modal_addTask_body_submit_col'});
  add_btn_col.append(submit_Btn);

  let buttonsTableBodyRow = $('<tr>',{});
  buttonsTableBodyRow.append(add_btn_col).append(add_icons);

  let buttonsTableBody = $('<tbody>',{});
  buttonsTableBody.append(buttonsTableBodyRow);

  let buttonsTable = $('<table>',{
    class:'modal_addTask_body_buttonsRow_table'});
  buttonsTable.append(buttonsTableBody);

  //modal body frame
  let modalBody_manager = $('<div>',{
    class:'modal_addTask_body_manager',
    id:'modal_addTask_body_manager'});
  modalBody_manager.append(taskNameTable).append(buttonsTable);

  let modalBody_EmptyDiv = $('<div>',{});
  modalBody_EmptyDiv.append(modalBody_manager);

  let modalBody_iframe = $('<div>',{
    class:'modal_addTask_iframe'});
  modalBody_iframe.append(modalBody_EmptyDiv);

  let modalBody = $('<div>', {
    class:'modal_addTask_body',
    id:'modal_addTask_body'});
  modalBody.append(modalBody_iframe);

  return modalBody;
}

// Displays hint box when hovering elements with hints
function loadHinter(){

  let hintHoldersModal = $('.modal_addTask_body_icons_col .hintHolder');
  const hintBox = $('.hintBox_frame');

  hintHoldersModal.hover(function(e){
    helpHint.showHint(e,hintBox);
  }, function(e){
    helpHint.hideHint(e,hintBox);
  });
}

//setting jquery ui data picker functionality
function setDatePicker(){

  //Set jquery ui date picker
  let dueDate_container = $('.modal_addTask_body_dueDate');
  dueDate_container.datepicker({ minDate: 0, maxDate: "+5Y +10D" });
  dueDate_container.datepicker( "option", "dateFormat","d M, y");

  //Updates dueDate value and style when recognizes a date.
  const dueDateInput = $('#modal_addTask_body_dueDate');
  const today = new Date();

  dueDateInput.on("input", function(){
    recognizeDate(dueDateInput, today);});

  dueDateInput.on("change", function(){
      recognizeDate(dueDateInput, today);});

  //By default set current date (today) to task
  dueDateInput.val('Today');
  dueDateInput.addClass('recognized_dueDate');
}

// close button functionality
function setModalCloser(){

  let modal = $('.modal_addTask');

  // closing modal with x button
  $('.modal_addTask_closeBtn').on('click', function(){
    closeModal(modal);
  });

  // closing modal when clicking outside
  modal.on('click', function(e){
    let notModal = document.getElementById('modal_addTask');
    if(e.target == notModal){
      closeModal(modal);
    }
  });

  // ESCAPE key pressed
  modal.keydown(function(e) {
    if (e.keyCode == 27) {
        closeModal(modal);
    }
  });
}

// closes modal and remove all unnecessary DOMS
function closeModal(modal){
  modal.remove();
  for (let property in availables){
    if(availables.hasOwnProperty(property)){
      $('#addTask_floater_'+property).remove();
    }
  }
}

// Applies font/color formatting to duedate item when the
// selected dueDate matches with a recognizable date.
// Also transforms inserted dates into these recognizable strings.
function recognizeDate(dueDateInput, today){
  switch(dueDateInput.val()){
    case 'Today':
      dueDateInput.addClass('recognized_dueDate');
      break;
    case 'TMR':
      dueDateInput.addClass('recognized_dueDate');
      break;
    case 'DAT':
      dueDateInput.addClass('recognized_dueDate');
      break;
    case '1 week':
      dueDateInput.addClass('recognized_dueDate');
      break;
    case '2 weeks':
        dueDateInput.addClass('recognized_dueDate');
        break;
    case '1 month':
        dueDateInput.addClass('recognized_dueDate');
        break;
    default:
      dueDateInput.removeClass('recognized_dueDate');
  }

  const inputDate = new Date(dueDateInput.val());

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate()+1);
  const dayAfterTom = new Date();
  dayAfterTom.setDate(dayAfterTom.getDate()+2);
  const oneWeek = new Date();
  oneWeek.setDate(oneWeek.getDate()+7);
  const twoWeeks = new Date();
  twoWeeks.setDate(twoWeeks.getDate()+14);
  const oneMonth = new Date();
  oneMonth.setDate(oneMonth.getDate()+30);

    switch (inputDate.getDate() + '/' + inputDate.getMonth()) {
      case today.getDate() + '/' + today.getMonth():
          dueDateInput.val('Today');
          dueDateInput.addClass('recognized_dueDate');
          break;
      case tomorrow.getDate() + '/' + tomorrow.getMonth():
        dueDateInput.val('TMR');
        dueDateInput.addClass('recognized_dueDate');
        break;
      case dayAfterTom.getDate() + '/' + dayAfterTom.getMonth():
        dueDateInput.val('DAT');
        dueDateInput.addClass('recognized_dueDate');
        break;
      case oneWeek.getDate() + '/' + oneWeek.getMonth():
        dueDateInput.val('1 week');
        dueDateInput.addClass('recognized_dueDate');
        break;
      case twoWeeks.getDate() + '/' + twoWeeks.getMonth():
        dueDateInput.val('2 weeks');
        dueDateInput.addClass('recognized_dueDate');
        break;
      case oneMonth.getDate() + '/' + oneMonth.getMonth():
        dueDateInput.val('1 month');
        dueDateInput.addClass('recognized_dueDate');
        break;
      default:
    }

}

// Fills the modal with the necessary icons depending on the chosen type
function createIconPackage(type){

  //Create icon container
  let iconContainer = $('<span>',{
      class:'modal_addTask_body_icons_iconHolder'});

  const category_icon = {
    class:'modal_addTask_menuIcon',
    id:'modal_addTask_categoryIcon',
    image:'/assets/icon_category.svg',
    type: 'icon',
    dataValue: ''
  };

  const project_icon = {
    class:'modal_addTask_menuIcon',
    id:'modal_addTask_projectIcon',
    image:'/assets/icon_project.svg',
    type: 'icon',
    dataValue: ''
  };

  const priority_icon = {
    class:'modal_addTask_menuIcon',
    id:'modal_addTask_priorityIcon',
    image:'/assets/icon_arrow_left.svg',
    type: 'icon',
    dataValue: 'Normal'
  };

  const learning_icon = {
    class:'modal_addTask_menuIcon',
    id:'modal_addTask_learningIcon',
    image:'/assets/icon_learning.svg',
    type: 'icon',
    dataValue: 'false'
  };

  const hours_icon = {
    class:'modal_addTask_menuIcon',
    id:'modal_addTask_hoursIcon',
    image:'/assets/icon_hours.svg',
    type: 'icon',
    dataValue: '0'
  };

let icons =  [priority_icon,learning_icon,project_icon,category_icon,hours_icon];

//If habit, project and learning icons are removed.
if (type == 'habit'){icons = [priority_icon,category_icon,hours_icon];}

for (i=0;i<icons.length;i++){

  let divContainer = $([]);
  let content = $([]);

  if (icons[i].type == 'icon'){

    divContainer = $('<div>',{
      class: icons[i].class,
      'data-value':icons[i].dataValue});

    content = $('<img>',{
      class:'modal_icon hintHolder',
      id: icons[i].id,
      src:icons[i].image});
  }

  divContainer.append(content);
  iconContainer.append(divContainer);

  }

  return iconContainer;
}

// Adds event handlers to Task/Habit selection buttons.
function setTodoTypeButtons(){

  // Tag controlers
  let projContainer = $('.modal_addTask_caption_proj');
  let catContainer = $('.modal_addTask_caption_cat');

  let taskBtn = $('#addTask_radio_todo');
  let habitBtn = $('#addTask_radio_habit');
  let iconHolder = $('.modal_addTask_body_icons_iconHolder');
  let iconHolderParent = $('.modal_addTask_body_icons_col');

  taskBtn.on('click',function(){
    iconHolder.remove();
    iconHolder=createIconPackage('task');
    iconHolderParent.append(iconHolder);
    loadHinter();
    setIconActions();
    projContainer.children().remove();
    catContainer.children().remove();
    $('.modal_addTask_body_textBox').focus();
  });

  habitBtn.on('click',function(){
    iconHolder.remove();
    iconHolder=createIconPackage('habit');
    iconHolderParent.append(iconHolder);
    loadHinter();
    setIconActions();
    projContainer.children().remove();
    catContainer.children().remove();
    $('.modal_addTask_body_textBox').focus();
  });

}

//Builds loaded drop down menu and attatches it to the body
function buildDropDownTables(property, active){


  // This array will store all the available menu options for this action.
  let optionArray = [];

  // Function used for filtering options matching input text.
  function takeIfContains(item){
    return item[0].includes(textinput);
  }

  // If there is no input yet, show all options. If input, show matching options only.
  if (textinput!= "" && property!="learning"){
    optionArray = availables[property].filter(takeIfContains);
  }else{
    optionArray = availables[property].slice();
  }

  // Build tbody
  let optTbody = $('<tbody>',{});

  // Construct table row for each option in optionArray
  if (optionArray.length>0){
    for (let i=0; i < optionArray.length; i++){
          let optTbRow = constructTableRow(optionArray, property, i);
          optTbody.append(optTbRow);}

  // If we got an empty array
  }else{

    let otherOptions = [];
    if (property=="categories" || property=="projects"){otherOptions.push(['Add new',property]);}
    let optTbRow = constructTableRow(otherOptions, 'new_' + property , 0);

    if (optTbRow){optTbody.append(optTbRow);}
    else{return null;}
  }

  // Build option table
  let optTable = $('<table>',{
    id:'addTask_optTb_' + property,
    class:'addTask_optTb'});
  optTable.append(optTbody);

  // Build inner holder
  let innerHolder = $('<div>',{
    id:'addTask_innerHolder_' + property,
    class:'addTask_innerHolder'});
  innerHolder.append(optTable);

  //Build base div container
  let outerHolder = $('<div>',{
    id:'addTask_floater_' + property,
    class:'addTask_floater'});
  outerHolder.append(innerHolder);

  $('#modal_addTask_content').append(outerHolder);

  //The drop down table receives its position and width from the text box.
  let textBoxFrame = $('.modal_addTask_body_taskNameRow_table');
  let refPos = textBoxFrame.offset();

  let textBox = $('.modal_addTask_body_textBox');
  let refWidth = textBox[0].parentNode.offsetWidth;

  //Position and display menu.
  outerHolder.css({top: refPos.top + 36,left: refPos.left,width:refWidth});
  outerHolder.show();

  return outerHolder;
}

//Builds each menu table row
function constructTableRow(optionArray, property, index){

  //If we get an empty array because all possible options have been filtered
  //we retun a null object
  if (optionArray.length==0){return null;}

  let itemIcon = $([]);

  //Icon changes depending on the property.
  switch (property) {
    case 'categories':
      itemIcon = $('<div>',{
        class:'addTask_tableOption_catIcon'});
      itemIcon.css("background-color",optionArray[index][1]);
      break;
    case 'projects':
      itemIcon = $('<div>',{
        class:'addTask_tableOption_proIcon',
        'data-value':optionArray[index][1]});
      itemIcon.css("background-color",optionArray[index][2]);
      break;
    case 'hours':
      itemIcon = $('<img>',{
        class:'addTask_tableOption_icon',
        'data-value':optionArray[index][1],
        src: '/assets/icon_hours.svg'});
      break;
    case 'habitHours':
      let iconFile = '/assets/icon_hours.svg';
      if(optionArray[index][0]=='Score'){iconFile = '/assets/icon_star.svg';}
      itemIcon = $('<img>',{
        class:'addTask_tableOption_icon',
        'data-value':optionArray[index][1],
        src: iconFile});
      break;
    case 'urgency':
      itemIcon = $('<img>',{
        class:'addTask_tableOption_icon',
        'data-value':optionArray[index][0],
        src: optionArray[index][1]});
      break;
    case 'learning':
      itemIcon = $('<img>',{
        class:'addTask_tableOption_icon',
        'data-value':optionArray[index][0],
        src: '/assets/icon_learning.svg'});
        break;
    case 'new_categories':
    itemIcon = $('<img>',{
      class:'addTask_tableOption_icon',
      'data-value':optionArray[index][1],
      src: '/assets/btn_plus.svg'});
      break;
    case 'new_projects':
    itemIcon = $('<img>',{
      class:'addTask_tableOption_icon',
      'data-value':optionArray[index][1],
      src: '/assets/btn_plus.svg'});
      break;
  }

  // Row structure
  let leftPart = $('<div>',{
    class:'addTask_tableOption_leftPart'});
  leftPart.append(itemIcon);

  let rightPart = $('<div>',{
    class:'addTask_tableOption_rightPart',
    text: optionArray[index][0]});

  let emptyDiv = $('<div>',{});
  emptyDiv.css('display','flex');
  emptyDiv.css('align-items','center');
  emptyDiv.append(leftPart).append(rightPart);
  let optTbCol = $('<td>',{
    class:'addTask_tableOption'});
  optTbCol.append(emptyDiv);

  let optTbRow = $('<tr>',{
    'data-value':property
  });
  optTbRow.append(optTbCol);

  return optTbRow;
}

// Set event handlers for option drop down menus
function setDropDownTables(){

  //On input
  let textBox = $('.modal_addTask_body_textBox');
  textBox.on('input',function(){

    let text = textBox.text();
    textinput = textBox.text().substr(textBox[0].innerText.lastIndexOf(".") + 1);

      if(text.indexOf('c.') >= 0 && (text.match( RegExp('\\.','g')).length)<2){
        displayDropDownTable('categories');

      }else if(text.indexOf('p.') >= 0 && (text.match( RegExp('\\.','g')).length)<2){
        if($('#addTask_radio_todo').is(':checked')){displayDropDownTable('projects');}

      }else if(text.indexOf('h.') >= 0 && (text.match( RegExp('\\.','g')).length)<2){
        if($('#addTask_radio_todo').is(':checked')){
          displayDropDownTable('hours');
        }else{
          displayDropDownTable('habitHours' );}

      }else if(text.indexOf('u.') >= 0 && (text.match( RegExp('\\.','g')).length)<2){
        displayDropDownTable('urgency');

      }else if(text.indexOf('l.') >= 0 && (text.match( RegExp('\\.','g')).length)<2){
        if($('#addTask_radio_todo').is(':checked')){displayDropDownTable('learning');}

      }else{
          //Reset user input memory
          textinput = "";
          hideDropDownTable();
      }
  });
}

//Hides passed drop down menu and resets table
function hideDropDownTable(){

  //deselect all rows
  $(".addTask_floater").remove();

  //Remove key up-down listener
  $(document).off('keydown');
  $(document).off('keyup');

  setModalCloser();

}

//Displays passed drop down menu and sets necessary event listeners
function displayDropDownTable(choice){

  hideDropDownTable();

  //Dim text box elements
  let textBox = $('.modal_addTask_body_textBox');

  //Variable to remember the index of the active row
  let active = 0;

  //Build corresponding menu
  let menu = buildDropDownTables(choice, active);

  //If no menu, the following step is skipped.
  if(menu){

    //Selects first available row as active.
    let rows = menu.find('tr');
    rows[active].classList.add("addTask_tableOption_active");

    //disable esc key
    let modal = $('.modal_addTask');
    modal.off('keydown');


    //Add listener to keydown so we can navigate through the menu
    $(document).keydown(function(e){

        //If key down - move active down
        if (e.keyCode == 40){
          e.preventDefault();
          rows[active].classList.remove("addTask_tableOption_active");
          if(active<rows.length-1){active++;}else{active=0;}
          rows[active].classList.add("addTask_tableOption_active");

        //If key up - move active up
        }else if(e.keyCode == 38){
          e.preventDefault();
          rows[active].classList.remove("addTask_tableOption_active");
          if(active>0){active--;}else{active=rows.length-1;}
          rows[active].classList.add("addTask_tableOption_active");


        //If tab or ENTER key --- save selection and remove from textbox
        }else if(e.keyCode == 9 || e.keyCode ==13){

          e.preventDefault();

          let currentMenu = rows[active].getAttribute('data-value');
          let currentOption = rows[active].children[0].children[0].children[1].textContent;
          let currentInput =  textinput;

          //Remove tags
          textBox.text(textBox.text().replace(new RegExp(textinput + '$'), ''));
          textBox.text(textBox.text().replace(new RegExp('c\\.' + '|' + 'p\\.' + '|' + 'l\\.' + '|' + 'u\\.' + '|' + 'h\\.' + '|', 'g'), ''));
          textBox.text(textBox.text().trim());


          // Place curlet at the end
          textBoxNode = document.getElementsByClassName('modal_addTask_body_textBox')[0];
          setCurlet.setEndOfContenteditable(textBoxNode);


          // Close modal and reset
          textinput = "";
          hideDropDownTable();
          modal.keydown(function(e) {
            if (e.keyCode == 27) {
                closeModal(modal);
            }
          });

          // Categories are stored in the project row icons.
          let linkedCategory='';
          if (currentMenu == 'projects'){
            linkedCategory = rows[active].children[0].children[0].children[0].children[0].getAttribute('data-value');
          }


          //If category or project, and not New, retrieves color
          let currentColor = "";
          if (currentMenu == 'categories' || currentMenu == 'projects'){
            currentColor= rows[active].children[0].children[0].children[0].children[0].style.backgroundColor;

          }

          // Saves menu selection input
          saveMenuSelection(currentMenu,currentOption,currentInput, currentColor, linkedCategory);



        //If escape or SPACE key - close and reset table menu
        }else if(e.keyCode == 27){
          //Remove tags
          textBox.text(textBox.text().replace(new RegExp(textinput + '$'), ''));
          textBox.text(textBox.text().replace(new RegExp('c\\.' + '|' + 'p\\.' + '|' + 'l\\.' + '|' + 'u\\.' + '|' + 'h\\.' + '|', 'g'), ''));
          textBox.text(textBox.text().trim());

          //Place curlet at the end
          textBoxNode = document.getElementsByClassName('modal_addTask_body_textBox')[0];
          setCurlet.setEndOfContenteditable(textBoxNode);

          //close modal and reset
          textinput = "";
          hideDropDownTable();
          modal.keydown(function(e) {
            if (e.keyCode == 27) {
                closeModal(modal);
            }
          });
        }

    });

    //Saves the introduced string after the dot.
    // $(document).keyup(function(e){
    //
    // });


    $('.addTask_optTb tr').mouseover(function(e){
      rows[active].classList.remove("addTask_tableOption_active");
      active =$(this).index();
      rows[active].classList.add("addTask_tableOption_active");
    });

    $('.addTask_optTb tr').on('click',function(){

      let currentMenu = rows[active].getAttribute('data-value');
      let currentOption = rows[active].children[0].children[0].children[1].textContent;
      let currentInput =  textinput;

      //Remove tags
      textBox.text(textBox.text().replace(new RegExp(textinput + '$'), ''));
      textBox.text(textBox.text().replace(new RegExp('c\\.' + '|' + 'p\\.' + '|' + 'l\\.' + '|' + 'u\\.' + '|' + 'h\\.' + '|', 'g'), ''));
      textBox.text(textBox.text().trim());


      // Place curlet at the end
      textBoxNode = document.getElementsByClassName('modal_addTask_body_textBox')[0];
      setCurlet.setEndOfContenteditable(textBoxNode);


      // Close modal and reset
      textinput = "";
      hideDropDownTable();
      modal.keydown(function(e) {
        if (e.keyCode == 27) {
            closeModal(modal);
        }
      });

      // Categories are stored in the project row icons.
      let linkedCategory='';
      if (currentMenu == 'projects'){
        linkedCategory = rows[active].children[0].children[0].children[0].children[0].getAttribute('data-value');
      }

      //If category or project, and not New, retrieves color
      let currentColor = "";
      if (currentMenu == 'categories' || currentMenu == 'projects'){
        currentColor= rows[active].children[0].children[0].children[0].children[0].style.backgroundColor;
      }

      // Saves menu selection input
      saveMenuSelection(currentMenu,currentOption,currentInput, currentColor,linkedCategory);

    });
 }
}

// Registers user menu selection and saves it.
// Different mechanics depending on the type of selection.
function saveMenuSelection(currentMenu,currentOption,currentInput, currentColor, linkedCategory){

  switch (currentMenu) {

    //If learning, highlights the learning icon and changes
    //its parent's data value to true.
    case 'learning':
    let learningNode = $('#modal_addTask_learningIcon');
    learningNode.parent().attr('data-value', 'true');
    learningNode.attr('src','/assets/icon_learning_active.svg');
      break;

    //Change icon parent's data value to current selection.
    //If hight or low urgency, changes icon.
    case 'urgency':
    let urgencyNode = $('#modal_addTask_priorityIcon');
    urgencyNode.parent().attr('data-value', currentOption);

    if (currentOption=='High'){urgencyNode.attr('src','/assets/icon_arrow_up.svg');}
    if (currentOption=='Low'){urgencyNode.attr('src','/assets/icon_arrow_down.svg');}
    if (currentOption=='Normal'){urgencyNode.attr('src','/assets/icon_arrow_left.svg');}
      break;

    //Change icon parent's data value to current selection.
    //If more than 0, changes icon.
    case 'hours':
    let hoursNode = $('#modal_addTask_hoursIcon');
    let hours = Number(currentOption.charAt(0));
    hoursNode.parent().attr('data-value', hours);
    if(hours>0){hoursNode.attr('src','/assets/number ' + hours + '.svg');}
    else{hoursNode.attr('src','/assets/icon_hours.svg');}
      break;


    //Change icon parent's data value to current selection.
    //If more than 0, changes icon.
    case 'habitHours':
    let habitHoursNode = $('#modal_addTask_hoursIcon');

    if (currentOption=='Score'){
      habitHoursNode.parent().attr('data-value', 'Score');
      habitHoursNode.attr('src','/assets/icon_star_active.svg');
    }else{
      let hours = Number(currentOption.charAt(0));
      habitHoursNode.parent().attr('data-value', hours);
      if(hours>0){habitHoursNode.attr('src','/assets/number ' + hours + '.svg');}
      else{habitHoursNode.attr('src','/assets/icon_hours.svg');}
    }
      break;

    case 'categories':
    case 'new_categories':

    let finalCat = (currentOption == 'Add new') ? currentInput : currentOption;
    let categoryNode = $('#modal_addTask_categoryIcon');

    categoryNode.parent().attr('data-value',finalCat);
    categoryNode.attr('src','/assets/icon_category_active.svg');

    //Get color if is existing category. Else dark blue.
    let catColor = (currentColor!='') ? currentColor : '#263e65';
    saveCategory(finalCat, catColor);
      break;

    case 'projects':
    case 'new_projects':

    let finalProj = (currentOption == 'Add new') ? currentInput : currentOption;
    let projectNode = $('#modal_addTask_projectIcon');

    projectNode.parent().attr('data-value',finalProj);
    projectNode.attr('src','/assets/icon_project_active.svg');

    //Get color if is existing project. Else dark blue.
    let projColor = (currentColor!='') ? currentColor : '#263e65';
    saveProject(finalProj, projColor, linkedCategory);
      break;
  }
}

// Resets project selection and adds project previsualization tag.
// If project has no category, adds default category.
// If existing category is not compatible, replaces category.
function saveProject(finalProj, color,linkedCategory){

  let projContainer = $('.modal_addTask_caption_proj');

  //Remove existing project
  projContainer.children().remove();

  //Add project
  let tagBody = $('<a>',{
    class: 'modal_addTask_tagBody',
    text: finalProj
  });
  tagBody.css("background-color",color);

  let tagIcon = $('<img>',{
    class:'modal_addTask_tagIcon',
    src: '/assets/btn_close_modal_white.svg'
  });

  let tagButton = $('<a>',{
    class: 'modal_addTask_tagButton',
  });
  tagButton.css("background-color",color);
  tagButton.append(tagIcon);

  let tag = $('<div>', {
    class: 'modal_addTask_tag',
    'data-value': finalProj
  });

  tag.append(tagBody).append(tagButton);
  projContainer.append(tag);

  //Remove existing category
  let catContainer = $('.modal_addTask_caption_cat');
  catContainer.children().remove();

  //If received empty category, we add the project to "Other" category.
  let finalCategory = (linkedCategory!='') ? linkedCategory : 'Other';


  // Icon controllers
  let projectNode = $('#modal_addTask_projectIcon');
  let categoryNode = $('#modal_addTask_categoryIcon');


  addCategoryTag(finalCategory, color);

  //Update category icon
  categoryNode.parent().attr('data-value',finalCategory);
  categoryNode.attr('src','/assets/icon_category_active.svg');



  //Add event handler for project close button
  $('.modal_addTask_caption_proj .modal_addTask_tagButton').on('click',function(){
    projContainer.children().remove();
    projectNode.parent().attr('data-value','');
    projectNode.attr('src','/assets/icon_project.svg');
  });


  // Add event handler for tag close button.
  // Removes also the project, as a project cannot exists without a category.
  $('.modal_addTask_caption_cat .modal_addTask_tagButton').on('click',function(){
    catContainer.children().remove();
    projContainer.children().remove();

    projectNode.parent().attr('data-value','');
    projectNode.attr('src','/assets/icon_project.svg');

    categoryNode.parent().attr('data-value','');
    categoryNode.attr('src','/assets/icon_category.svg');
  });

}
// Resets category selection and adds category previsualization tag.
// If project is not compatible with category, project gets removed.
function saveCategory(finalCat, color){

  let tagContainer = $('.modal_addTask_caption_cat');
  let projContainer = $('.modal_addTask_caption_proj');

  // Get value of already registered category (if there is)
  let previousCat = '';
  if (tagContainer.is(':parent')) {
    previousCat = tagContainer.children().text();
  }

  // Icon controllers
  let projectNode = $('#modal_addTask_projectIcon');
  let categoryNode = $('#modal_addTask_categoryIcon');

  //If previous category tag is different to the new one,
  //it means the previous project (if there is), must not be
  //compatible with this category and therefore it needs to be removed.
  if (finalCat!=previousCat && previousCat!=''){
    projContainer.children().remove();
    projectNode.parent().attr('data-value','');
    projectNode.attr('src','/assets/icon_project.svg');
  }

  // Remove existing category
  tagContainer.children().remove();

  // Add category
  addCategoryTag(finalCat, color);

  // Add event handler for tag close button.
  // Removes also the project, as a project cannot exists without a category.
  $('.modal_addTask_caption_cat .modal_addTask_tagButton').on('click',function(){
    tagContainer.children().remove();
    projContainer.children().remove();

    projectNode.parent().attr('data-value','');
    projectNode.attr('src','/assets/icon_project.svg');

    categoryNode.parent().attr('data-value','');
    categoryNode.attr('src','/assets/icon_category.svg');
  });
}

// Function to add category to previsualization tag.
function addCategoryTag(finalCat, color){

  let tagContainer = $('.modal_addTask_caption_cat');

  let tagBody = $('<a>',{
    class: 'modal_addTask_tagBody',
    text: finalCat
  });
  tagBody.css("background-color",color);

  let tagIcon = $('<img>',{
    class:'modal_addTask_tagIcon',
    src: '/assets/btn_close_modal_white.svg'
  });

  let tagButton = $('<a>',{
    class: 'modal_addTask_tagButton',
  });
  tagButton.css("background-color",color);
  tagButton.append(tagIcon);

  let tag = $('<div>', {
    class: 'modal_addTask_tag',
    'data-value': finalCat
  });

  tag.append(tagBody).append(tagButton);
  tagContainer.append(tag);

}
