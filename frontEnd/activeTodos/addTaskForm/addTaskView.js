const EventEmitter = require('events');
const Hints = require('./../../hints/help_hint');
const shortcuts = require('./../../shortcuts/shortcuts');
const SetCurlet = require('./../../otherMethods/setCaret');
const Icons = require('./../../icons/icons.js');

/**
 * Builds the form base UI.
 * Sets the form event handlers.
 * Prints and modifies the form UI elements.
 */

 let activeRow;

 module.exports = class NewTaskView extends EventEmitter{
   //Builds the form base UI
   constructor(model, options){
     super();
     this._model = model;
     this._options = options;

     //Listeners
     model.on('typeSaved', () => this.changeTaskType());
     model.on('learningSaved', () => this.updateLearningIcon());
     model.on('urgencySaved', () => this.updateUrgencyIcon());
     model.on('hoursSaved', () => this.updateHourIcon());
     model.on('categorySaved', () => this.updateCategory());
     model.on('projectSaved', () => this.updateProject());
     model.on('newTask',() => this.closeModal());

     this._textInput = '';
     //Stores user tag input (text input after summoning a menu)


     // Print base structure
     this._modal = this.buildModal();
     $(document.body).append(this._modal);


     // Print icons into the icon bar.
     this.printIcons();


     // Focuses modal text box.
     this._textBox = $('.modal_addTask_body_textBox');
     this._textBox.focus();

     // Set datapicker and date eventhandlers
     this.setDateBox();

     // Add recognize function to datebox.
     this._dateBox.on("input", () => this.recognizeDate());
     this._dateBox.on("change", () => this.recognizeDate());

     // Set the actions that can close this modal.
     this.setCloseEvents();

     this._projectTagContainer = $('.modal_addTask_caption_proj');
     this._categoryTagContainer = $('.modal_addTask_caption_cat');
     this._taskBtn = $('#addTask_radio_task');
     this._habitBtn = $('#addTask_radio_habit');
     this._iconBarHolder = $('.modal_addTask_body_icons_col');

     // Set type buttons.
     this.setTaskTypeButtons();

     // Set event handlers for option drop down menus
     this.setDropDownTables();

     // Set icon button actions
     this.setIconActions();

     // Set submit button
     this.setSubmit();

   }

   // Sends date and task name to database
   // Once data is correctly saved, a different method
   // interacts with the dbHandler class to add the task to the system.
   setSubmit(){

       this._submit = $('#modal_addTask_body_submit_btn');
       this._submit.on("click", () => {

       this.emit('saveNameDate', this._textBox.text(),
                                 this._dateBox.val());

       });

   }




   //Puts form header and body together into one div element.
   buildModal(){

     let modalHeader = this.buildModalHeader();
     let modalBody = this.buildModalBody();

     // Body and header container
     let modalContent = $('<div>', {id:'form_container', class:'form_container'});
     modalContent.append(modalHeader).append(modalBody);

     // Modal container
     let modal = $('<div>', {
       class: 'modal_blackBackground',
       id:'modal_addTask'});
     modal.append(modalContent);

     return modal;

   }


   buildModalHeader(){

     // task and habit radio buttons
     let radioControlGroup = $('<div>',{
       class: 'addTask_radio_container'});
     let radioInputTask = $('<input>',{
       type: 'radio',
       name: 'addTask_radio',
       id: 'addTask_radio_task',
       checked: 'checked'});
     let radioLabelTask = $('<label>',{
       for: 'addTask_radio_task',
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
       .append(radioInputTask)
       .append(radioLabelTask)
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
       class: 'modal_addTask_header_table_captionClm'});
       modalHeaderTableCaptionColumn.append(captionLeft).append(captionRight);


     // close button
     let modalHeaderTableCloseColumn = $('<td>',{});
     let emptyDiv = $('<div>',{});
     let emptySpan = $('<span>',{});
     let closeBtn = Icons.close();
     closeBtn.addClass('form_closeBtnIcon');

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
         class: 'form_headerTable'});

       modalHeaderTable.append(modalHeaderTableBody);
       let header = $('<div>', {
         class: 'form_headerContainer',
         id:'modal_addTask_header'});
       header.append(modalHeaderTable);

       return header;
   }


   buildModalBody(){

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

    this._iconBar = $('<td>',{
       class:'modal_addTask_body_icons_col'});

     let submit_Btn = $('<div>',{
       class:'blue_botton',
       id:'modal_addTask_body_submit_btn',
       tabindex: 3,
       text: 'Add task'});

     let add_btn_col = $('<td>',{
       class:'modal_addTask_body_submit_col'});
     add_btn_col.append(submit_Btn);

     let buttonsTableBodyRow = $('<tr>',{});
     buttonsTableBodyRow.append(add_btn_col).append(this._iconBar);

     let buttonsTableBody = $('<tbody>',{});
     buttonsTableBody.append(buttonsTableBodyRow);

     let buttonsTable = $('<table>',{
       class:'modal_addTask_body_buttonsRow_table'});
     buttonsTable.append(buttonsTableBody);


     //modal body frame
     let modalBody_manager = $('<div>',{
       class:'form_bodyIframe'});
     modalBody_manager.append(taskNameTable).append(buttonsTable);

     let modalBody_EmptyDiv = $('<div>',{});
     modalBody_EmptyDiv.append(modalBody_manager);

     let modalBody_iframe = $('<div>',{
       class:'modal_addTask_iframe'});
     modalBody_iframe.append(modalBody_EmptyDiv);

     let modalBody = $('<div>', {
       class:'form_bodyContainer',
       id:'modal_addTask_body'});
     modalBody.css('margin-top','10px');
     modalBody.append(modalBody_iframe);

     return modalBody;

   }

    //(old_remove) createIconPackage
    // Prints the necessary icons into the UI based on the
    // type of task selected by the user.
    printIcons(){

      //Create icon container
      let iconContainer = $('<span>',{
          class:'modal_addTask_body_icons_iconHolder'});

      let category_icon = {
        class:'modal_addTask_menuIcon',
        id:'modal_addTask_categoryIcon',
        image: Icons.categories()
      };

      let  project_icon = {
        class:'modal_addTask_menuIcon',
        id:'modal_addTask_projectIcon',
        image: Icons.projects()
      };

      let priority_icon = {
        class:'modal_addTask_menuIcon',
        id:'modal_addTask_priorityIcon',
        image: Icons.urgNormal()
      };

      let learning_icon = {
        class:'modal_addTask_menuIcon',
        id:'modal_addTask_learningIcon',
        image: Icons.learning('#c6c6c6')
      };

      let hours_icon = {
        class:'modal_addTask_menuIcon',
        id:'modal_addTask_hoursIcon',
        image:Icons.hours()
      };

    let icons =  [priority_icon,
                 learning_icon,
                 project_icon,
                 category_icon,
                 hours_icon];

    //If habit, project and learning icons are removed.
    if (this._model._type == 'habit'){icons = [priority_icon,
                                              category_icon,
                                              hours_icon];}

    for (let i=0; i<icons.length; i++){

      let divContainer = $([]);
      let content = $([]);

      divContainer = $('<div>',{
        class: icons[i].class
      });

      content = icons[i].image;
      content.attr({class:'modal_icon hintHolder',
                    id:icons[i].id});

      divContainer.append(content);
      iconContainer.append(divContainer);
      }

      this._iconBar.append(iconContainer);

      //Loads a hint into each icon.
      Hints.loadHints('.modal_addTask_body_icons_col .hintHolder');
    }

    // Set datapicker and date eventhandlers
    setDateBox(){

      // Jquery ui datapicker container
      let dataContainer = $('.modal_addTask_body_dueDate');

      // Date textbox
      this._dateBox = $('#modal_addTask_body_dueDate');

      if(this._model.type=='task'){

        // Set jquery ui datapicker
        dataContainer.datepicker({ minDate: 0, maxDate: "+5Y +10D" });
        dataContainer.datepicker( "option", "dateFormat","d M, y");

        // Give a default value of Today
        const today = new Date();
        this._dateBox.val('Today');
        this._dateBox.addClass('recognized_dueDate');

        // Change placeholder
        this._dateBox.attr("placeholder", "Date");

      }else{

        // Disable when habit
        dataContainer.datepicker( "destroy" );

        // Remove default value and show "days" placeholder.
        this._dateBox.val('');
        this._dateBox.attr("placeholder", "N Days");
        this._dateBox.removeClass('recognized_dueDate');
      }

    }

    // If the user inputs a valid date format, this method
    // highlights the date textbox text by attaching a
    // class to it.
    recognizeDate(){

      //Function used to validate dates.
      function isValidDate(date) {
        return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
      }

      //We transform input into date so we can try to validate it.
      let inputDate = new Date(this._dateBox.val());
      let inputYear = inputDate.getYear();

      // Dates used to validate the input date.
      let today = new Date();
      let thisYear = today.getYear();
      let nextYear = thisYear+1;

      if (this._model.type == 'task'){
        switch(true){
          case (isValidDate(inputDate) && (inputYear>=thisYear && inputYear<=nextYear)):
            this._dateBox.addClass('recognized_dueDate');
            break;
          case this._dateBox.val() == 'Today':
            this._dateBox.addClass('recognized_dueDate');
            break;
          case this._dateBox.val() == 'TMR':
            this._dateBox.addClass('recognized_dueDate');
            break;
          case this._dateBox.val() == 'DAT':
            this._dateBox.addClass('recognized_dueDate');
            break;
          case this._dateBox.val() == '1 week':
            this._dateBox.addClass('recognized_dueDate');
            break;
          case this._dateBox.val() == '2 weeks':
            this._dateBox.addClass('recognized_dueDate');
            break;
          case this._dateBox.val() == '1 month':
            this._dateBox.addClass('recognized_dueDate');
            break;
          case !isNaN(this._dateBox.val()) && this._dateBox.val()<365 && this._dateBox.val()>0:
            this._dateBox.addClass('recognized_dueDate');
            break;
          default:
            this._dateBox.removeClass('recognized_dueDate');
        }
      }else{
        if(!isNaN(this._dateBox.val()) && this._dateBox.val()<365 && this._dateBox.val()>0){
          this._dateBox.addClass('recognized_dueDate');
        }else{
          this._dateBox.removeClass('recognized_dueDate');
        }
      }
    }

    // Set actions that can close this modal.
    setCloseEvents(){

      // Set close button.
      this._closeBtn = $('.form_closeBtnIcon');
      this._closeBtn.on('click', () => this.closeModal());

      // closing modal when clicking outside
      this._modal.on('click', (e) =>{
        let notModal = document.getElementById('modal_addTask');
        if(e.target == notModal){this.closeModal();}
      });

      // ESCAPE key pressed
      this.setEscapeKey();

      // SHITF + TAB key pressed.
      this.setTabBehavior();
    }

    // Sets return tab key so the curlet is always placed
    // at the end of the task name textbox.
    setTabBehavior(){

      this._modal.keydown((e) => {

        //shift was down when tab was pressed
        if(e.shiftKey && e.keyCode == 9) {

          // If the activeElement (by the moment the key was pressed) is the date selector,
          // then we focus the taskName textbox and place the curlet at the end.
          if(document.activeElement.classList.contains('modal_addTask_body_dueDate')){
            e.preventDefault();
            let textBoxNode = document.getElementsByClassName('modal_addTask_body_textBox')[0];
            SetCurlet.setEndOfContenteditable(textBoxNode);
          }
        }

      });
    }

    // Sets escape key for closing modal and ENTER for submit.
    setEscapeKey(){

      //Reset first to make sure that we are not adding
      // the same event multiple times.
      this._modal.off('keydown');

      this._modal.keydown((e) => {
        if (e.keyCode == 27) {this.closeModal();}
        if (e.keyCode == 13){
          e.preventDefault();
          this.emit('saveNameDate', this._textBox.text(),
                                    this._dateBox.val());
        }
      });

    }

    // Closes modal div and reactivates main page shortcuts.
    closeModal(){
      this._modal.remove();

      // Removes any main page shortcuts that could affect this modal (if there are).
      shortcuts.removeAllGlobalShortcuts();

      // Sets new shortcuts.
      shortcuts.setAllGlobalShortcuts();
    }

    // sets the event handlers for the task and habit buttons.
    setTaskTypeButtons(){

      this._taskBtn.on('click',() => {
        this.emit('saveType', 'task');
      });

      this._habitBtn.on('click',() =>{
        this.emit('saveType', 'habit');
      });
    }

    // Removes current icons, prints new icons, reloads hints
    // sets icon actions and remove selected tags.
    changeTaskType(){
      this._iconBarHolder.children().remove();
      this.printIcons();
      this.setIconActions();
      this.emit('saveProject','','');
      this.emit('saveCategory','','');
      this.emit('saveHours', 'Fast task');
      this.emit('saveLearning', false);
      this.emit('saveUrgency', 'Normal');
      this.setDateBox();
      this._textBox.focus();
    }

    // Set event handlers for option drop down menus
    setDropDownTables(){

      this._textBox.on('input',() =>{

        // Text in the textBox
        let text = this._textBox.text();

        // Stores text inserted before last point in textBox.
        this._textInput = text.substr(this._textBox[0].innerText.lastIndexOf('#') + 1);

        // The following inputs (specific character + . ), provided that there
        // are no more than 2 points in the text, will summon the corresponding menu.
        // For projects or learning menus to show up, it is a condition that
        // the Task button is selected.
        if ((text.match( RegExp('\#','g'))||[]).length < 2){

          if(text.indexOf('c#') >= 0){
            this.displayDropDownTable('categories');

          }else if(text.indexOf('p#') >= 0 && this._model.type=='task'){
            this.displayDropDownTable('projects');

          }else if(text.indexOf('h#') >= 0){
            this.displayDropDownTable('hours');

          }else if(text.indexOf('u#') >= 0){
            this.displayDropDownTable('urgency');

          }else if(text.indexOf('l#') >= 0 && this._model.type=='task'){
            this.displayDropDownTable('learning');

          }else{
            this._textInput = "";
            this.hideDropDownTable();
          }

        }else{
          this._textInput = "";
          this.hideDropDownTable();
        }

      });
    }

    // Builds corresponding drop down menu
    // and sets menu event listeners
    displayDropDownTable(userChoice){

      // First remove whatever menu might be open.
      this.hideDropDownTable();

      //Variable to remember the index of the active row
      activeRow = 0;

      //Build corresponding menu
      let menu = this.buildDropDownMenu(userChoice);

      if(menu){

        //Selects first available row as active.
        let rows = menu.find('tr');
        rows[activeRow].classList.add("addTask_tableOption_active");

        this._modal.off('keydown');

        //Add listener to keydown so we can navigate through the menu
        $(document).keydown((e) =>{

          //If key down - select next row
          if (e.keyCode == 40){
            e.preventDefault();
            this.changeActiveRow('down', rows);

          //If key up - move active up
          }else if(e.keyCode == 38){
            e.preventDefault();
            this.changeActiveRow('up', rows);


          //If tab or ENTER key --- save selection and remove from textbox
          }else if(e.keyCode == 9 || e.keyCode ==13){
            e.preventDefault();
            this.saveMenuSelection(rows);

          //If escape or SPACE key - close and reset table menu
          }else if(e.keyCode == 27){
            this.removeSelectionFromTextBox();
            this._textInput='';
            this.hideDropDownTable();
            this.setEscapeKey();
            this.setTabBehavior();
          }

        });



        // Hightlights selected row.
        $('.ddm_table tr').mouseover(function(e){
          rows[activeRow].classList.remove("addTask_tableOption_active");
          activeRow = $(this).index();
          rows[activeRow].classList.add("addTask_tableOption_active");
        });


        $('.ddm_table tr').on('click',() =>{
          this.saveMenuSelection(rows);
        });

      }
    }



    // Removes tag text from textbox. Resets input memory.
    // Hides menu. Sets escape key back.
    saveMenuSelection(rows){

      let currentMenu = rows[activeRow].getAttribute('data-value');
      let currentOption = rows[activeRow].children[0].children[0].children[1].textContent;
      let currentInput =  this._textInput;

      this.removeSelectionFromTextBox();

      this._textInput='';

      // Close table and reset input memory
      this.hideDropDownTable();

      // Set escape key so it can close the modal again.
      this.setEscapeKey();

      // Set tab key so it can set the curlet to the end in the taskName textBox
      this.setTabBehavior();

      switch (currentMenu) {
        case 'learning':
          this.emit('saveLearning', currentOption);
          break;

        case 'urgency':
          this.emit('saveUrgency', currentOption);
          break;

        case 'hours':
          this.emit('saveHours', currentOption);
          break;

        case 'categories':
        case 'new_categories':
          this.emit('saveCategory', currentOption, currentInput);
          break;

        case 'projects':
        case 'new_projects':
          this.emit('saveProject', currentOption, currentInput);
        break;

        default:
      }

    }

    updateLearningIcon(){

      // Retrieve selected option data so we can know the corresponding icon image.
      let option = this._options.learning.find( obj => {
        return obj.title == 'Also a learning';
      });

      // Reflects image in modal.
      let nodeToReplace = $('#modal_addTask_learningIcon');
      let nodeParent = nodeToReplace.parent();

      nodeToReplace.remove();
      let newNode;

      if (this._model._learning == true) {
          newNode = Icons.learning('#1551b5');
      }else{
          newNode = Icons.learning('#c6c6c6');
      }

      newNode.attr({id:'modal_addTask_learningIcon',
                    class:'modal_icon hintHolder'});

      newNode.on('click',(e) =>{
        this.iconAction(e);
      });

      nodeParent.append(newNode);


    }

    updateUrgencyIcon(){

      // Retrieve selected option data so we can know the corresponding icon image.
      let option = this._options.urgency.find( obj => {
        return obj.title == this._model._urgency;
      });

      let nodeToReplace = $('#modal_addTask_priorityIcon');
      let nodeParent = nodeToReplace.parent();

      nodeToReplace.remove();
      let newNode = Icons[option.icon]();

      newNode.attr({id:'modal_addTask_priorityIcon',
                    class:'modal_icon hintHolder'});

      newNode.on('click',(e) =>{
        this.iconAction(e);
      });

      nodeParent.append(newNode);

    }

    updateHourIcon(){
      // Retrieve selected option data so we can know the corresponding icon image.
      let option = this._options.hours.find( obj => {
        return obj.value == this._model._hours;
      });

      let nodeToReplace = $('#modal_addTask_hoursIcon');
      let nodeParent = nodeToReplace.parent();

      nodeToReplace.remove();
      let newNode = Icons[option.active]();

      newNode.attr({id:'modal_addTask_hoursIcon',
                    class:'modal_icon hintHolder'});

      newNode.on('click',(e) =>{
        this.iconAction(e);
      });

      nodeParent.append(newNode);

    }


    updateCategory(){

      let nodeToReplace = $('#modal_addTask_categoryIcon');
      let nodeParent = nodeToReplace.parent();

      nodeToReplace.remove();
      let newNode;

      if (this._model.project!=''){
        newNode = Icons.categoriesActive();

      }else if(this._model._category == ''){
        newNode = Icons.categories();

      }else {
        newNode = Icons.categoriesActive();
      }

      newNode.attr({id:'modal_addTask_categoryIcon',
                    class:'modal_icon hintHolder'});

      newNode.on('click',(e) =>{
        this.iconAction(e);
      });

      nodeParent.append(newNode);

      this.removeCategoryTag();
      this.insertTag('category');

    }

    updateProject(){
      let nodeToReplace = $('#modal_addTask_projectIcon');
      let nodeParent = nodeToReplace.parent();

      nodeToReplace.remove();
      let newNode;

      if (this._model._project == ''){
        newNode = Icons.projects();
      }else{
        newNode = Icons.projectsActive();
      }

      newNode.attr({id:'modal_addTask_projectIcon',
                    class:'modal_icon hintHolder'});

      newNode.on('click',(e) =>{
        this.iconAction(e);
      });

      nodeParent.append(newNode);

      this.removeProjectTag();
      this.insertTag('project');
    }

    removeProjectTag(){
      let projContainer = $('.modal_addTask_caption_proj');
      projContainer.children().remove();
    }

    removeCategoryTag(){
      let tagContainer = $('.modal_addTask_caption_cat');
      tagContainer.children().remove();

    }

    insertTag(type){

      let targetContainer;
      let tagText;
      let tagColor;
      let addTag;

      // Default color used when it is a new category, new project
      // or a undefined category.
      let othercolor = '#263e65 ';
      // Retrieves tag text and color from model, and decides if
      // the tag must be added or not.

      if (type=='category'){

        targetContainer = $('.modal_addTask_caption_cat');

        if (this._model._isNewCategory){
            tagText = this._model.category;
            tagColor = othercolor;
            addTag = true;

        }else if (this._model.category!= ''){
          let categoryModel = this._options.categories.find( obj => {
            return obj.title == this._model.category;});

          tagText = this._model.category;
          tagColor = categoryModel.color;
          addTag = true;

        }else if (this._model._isNewProject || (this._model.category== '' && this._model.project!= '')){
          tagText = 'Other';
          tagColor = othercolor;
          addTag = true;
        }

      }else{

        targetContainer = $('.modal_addTask_caption_proj');

        if (this._model._isNewProject){
          tagText = this._model.project;
          tagColor = othercolor;
          addTag = true;

        }else if (this._model._project!=''){
          let projectModel = this._options.projects.find( obj => {
            return obj.title == this._model.project;});
          tagText = this._model.project;
          tagColor = projectModel.color;
          addTag = true;
        }
      }

      // Constructs the tag
      if (addTag){

        let tagBody = $('<a>',{
          class: 'modal_addTask_tagBody',
          text: tagText
        });
        tagBody.css("background-color",tagColor);

        let tagIcon = Icons.whiteClose();
        tagIcon.addClass('modal_addTask_tagIcon');

        let tagButton = $('<a>',{
          class: 'modal_addTask_tagButton',
        });

        tagButton.css("background-color",tagColor);
        tagButton.append(tagIcon);

        let tag = $('<div>', {
          class: 'modal_addTask_tag'
        });

        tag.append(tagBody).append(tagButton);
        targetContainer.append(tag);

        if (type == 'category'){
          $('.modal_addTask_caption_cat .modal_addTask_tagButton').on('click',() => {
            this.emit('saveProject', '', '');
            this.emit('saveCategory', '', '');
          });

        }else{
          $('.modal_addTask_caption_proj .modal_addTask_tagButton').on('click',() => {
            this.emit('saveProject', '', '');});
        }
      }

    }


    // Removes currently selected menu option text from
    // the modal user input text box.
    removeSelectionFromTextBox(){

      // Removes selection text.
      this._textBox.text(
        this._textBox.text().replace(new RegExp(this._textInput + '$'), '')
      );

      // Removes remaining shortcuts
      this._textBox.text(
        this._textBox.text().replace(new RegExp('c#' + '|' + 'p#' + '|' + 'l#' + '|' + 'u#' + '|' + 'h#' + '|', 'g'), '')
      );

      // Trims white spaces
      this._textBox.text(this._textBox.text().trim());

      // Place curlet at the end of the text box
      let textBoxNode = document.getElementsByClassName('modal_addTask_body_textBox')[0];
      SetCurlet.setEndOfContenteditable(textBoxNode);

    }


    // Changes the selected drop down table row based on
    // the user's action.
    changeActiveRow(direction, rows){

        // Remove highlight from active row
        rows[activeRow].classList.remove("addTask_tableOption_active");

        // Move active row up or down depending on the user input.
        if (direction=='down'){
            if(activeRow<rows.length-1){activeRow++;}else{activeRow=0;}
        }else{
            if(activeRow>0){activeRow--;}else{activeRow=rows.length-1;}
        }

        // Add highlight to new active row.
        rows[activeRow].classList.add("addTask_tableOption_active");
    }

    // Removes whatever drop down menu might be open.
    hideDropDownTable(){

      //Remove menu
      $(".ddm_Container").remove();

      //Remove key up-down listener
      $(document).off('keydown');
      $(document).off('keyup');

      this.setCloseEvents();

    }

    // Builds passed menu.
    buildDropDownMenu(userChoice){


      // This array will store all the available menu options for this action.
      let optionArray = [];

      let textInput = this._textInput.toLowerCase();
      // Function used later for filtering options matching input text.
      function takeIfContains(item){
        let title = item.title.toLowerCase();
        return title.includes(textInput);
      }

      // If there is no input yet, show all options. If input, show matching options only.
      if (this._textInput!= ''){
        optionArray = this._options[userChoice].filter(takeIfContains);
      }else{
        optionArray = this._options[userChoice].slice();
      }

      // If the current type is task and the user has selected the hours menu
      // we have to remove from the menu all the habit exclusive options.
      // We do this by filtering those hour options that are not both type.
      function takeIfBoth(item){return item.type == 'both';}
      if (userChoice == 'hours' && this._model.type == 'task'){
        let tempArray = optionArray.filter(takeIfBoth);
        optionArray = tempArray.slice();
      }

      // Build tbody
      let optTbody = $('<tbody>',{});

      // Construct table row for each option in optionArray
      if (optionArray.length>0){
        for (let i = 0; i < optionArray.length; i++){
          let optTbRow = this.constructTableRow(optionArray, userChoice, i);
          optTbody.append(optTbRow);
        }

      // If we got an empty array
      }else{

        let otherOptions = [];
        if (userChoice =='categories' || userChoice =='projects'){otherOptions.push({title: 'Add new', property: userChoice});}
        let optTbRow = this.constructTableRow(otherOptions, 'new_' + userChoice , 0);

        if (optTbRow){optTbody.append(optTbRow);}
        else{return null;}
      }

      // Build option table
      let optTable = $('<table>',{
        id:'ddm_table_' + userChoice,
        class:'ddm_table'});
      optTable.append(optTbody);

      // Build inner holder
      let innerHolder = $('<div>',{
        id:'ddm_frame_' + userChoice,
        class:'ddm_frame'});
      innerHolder.append(optTable);

      //Build base div container
      let outerHolder = $('<div>',{
        id:'addTask_floater_' + userChoice,
        class:'ddm_Container'});
      outerHolder.append(innerHolder);

      $('#form_container').append(outerHolder);

      //The drop down table receives its position and width from the text box.
      let textBoxFrame = $('.modal_addTask_body_taskNameRow_table');
      let refPos = textBoxFrame.offset();
      let refWidth = this._textBox[0].parentNode.offsetWidth;

      //Position and display menu.
      outerHolder.css({top: refPos.top + 38 - window.scrollY,left: refPos.left,width:refWidth});
      outerHolder.show();

      return outerHolder;
    }

    //Builds each menu table row
    constructTableRow(optionArray, property, index){

      //If we get an empty array because all possible options have been filtered
      //we retun a null object
      if (optionArray.length==0){return null;}

      let itemIcon = $([]);

      //Icon changes depending on the property.
      switch (property) {
        case 'categories':
          itemIcon = $('<div>',{
            class:'ddm_colorCircle'});
          itemIcon.css("background-color",optionArray[index].color);
          break;

        case 'projects':
          itemIcon = $('<div>',{
            class:'addTask_tableOption_proIcon'});
          itemIcon.css("background-color",optionArray[index].color);
          break;

        case 'hours':
          itemIcon = Icons[optionArray[index].icon]();
          itemIcon.addClass('svgDefaultStyle');
          break;

        case 'urgency':
          itemIcon = Icons[optionArray[index].icon]();
          itemIcon.addClass('svgDefaultStyle');
          break;

        case 'learning':
          itemIcon = Icons[optionArray[index].icon]();
          itemIcon.addClass('svgDefaultStyle');
          break;

        case 'new_categories':
          itemIcon = Icons.plus();
          itemIcon.attr({class:'svgDefaultStyle',
                        'data-value':optionArray[index].property});
          break;

        case 'new_projects':
          itemIcon = Icons.plus();
          itemIcon.attr({class:'svgDefaultStyle',
                        'data-value':optionArray[index].property});
          break;
      }

      // Row structure
      let leftPart = $('<div>',{
        class:'ddm_menu_rowLeftCol'});
      leftPart.append(itemIcon);

      let rightPart = $('<div>',{
        class:'ddm_menu_rowRightCol',
        text: optionArray[index].title});

      let emptyDiv = $('<div>',{});
      emptyDiv.css('display','flex');
      emptyDiv.css('align-items','center');
      emptyDiv.append(leftPart).append(rightPart);

      let optTbCol = $('<td>',{
        class:'ddm_menu_rowColumn'});
      optTbCol.append(emptyDiv);

      let optTbRow = $('<tr>',{
        'data-value':property
      });

      optTbRow.append(optTbCol);

      return optTbRow;

    }

    // Set icon button actions
    setIconActions(){

      let iconBtn = $('.modal_icon');

      iconBtn.on('click',(e) =>{
        this.iconAction(e);
      });

    }

    iconAction(e){

      let keyword;
      let choice;

      switch (e.currentTarget.id) {
        case 'modal_addTask_categoryIcon':
          keyword='c#';
          choice='categories';
          break;
        case 'modal_addTask_projectIcon':
          keyword='p#';
          choice='projects';
          break;

        case 'modal_addTask_hoursIcon':
          keyword='h#';
          choice='hours';
          break;

        case 'modal_addTask_learningIcon':
          keyword='l#';
          choice='learning';
          break;

        case 'modal_addTask_priorityIcon':
          keyword='u#';
          choice='urgency';
          break;
      }

      //Remove input
      this.removeSelectionFromTextBox();

      //Adds the selected icon shorcut to the end of the text box
      if (this._textBox.text()==""){
        this._textBox.text(keyword);
      }else{
        this._textBox.text(this._textBox.text() + ' ' + keyword);
      }

      // Place curlet at the end of the text box
      let textBoxNode = document.getElementsByClassName('modal_addTask_body_textBox')[0];
      SetCurlet.setEndOfContenteditable(textBoxNode);

      this._textInput = '';

      //Display corresponding menu
      this.displayDropDownTable(choice);
    }


 };
