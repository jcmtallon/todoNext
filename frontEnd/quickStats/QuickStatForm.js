const Form = require('./../forms/form');
const ProgressBar = require('./../otherMethods/ProgressBar');
const icons = require('./../icons/icons.js');
const OPTIONS = require('./../optionHandler/OptionHandler');


module.exports = class QuickStatForm extends Form{
  constructor(){
    super();

    // Tells the Form parent to center the form vertically.
    this.isCentered = true;
    this.formWidth = 400;
    this.content = 'tasks';
  }


  show(){

    const updateDb = true;
    OPTIONS.checkForRecords(updateDb);

    this.removeGlobalShortcuts();

    // Build header
    this.header = this.buildHeader('Quick stats', icons.stats('#1551b5'));

    // Each form section will push their rows to this object.
    this.bodyRows = [];

    this._buildComTaskSection();
    this._buildTypeBtnRow();

    this.body = this.buildBody(this.bodyRows);
    this.form = this.buildForm(this.header,
                               this.body);

     // Adds form to document.
     setTimeout( () => {this.setFormShortcuts();}, 100);
     $(document.body).append(this.form);

  }

  _refreshView(){
    this.body.empty();
    this.bodyRows = [];
    this._buildComTaskSection();
    this._buildTypeBtnRow();
    this.body.append(this._rebuildBodyContents(this.bodyRows));
  }

  _rebuildBodyContents(rows){

    function buildBodyRow(row){
      let tbody;
      tbody = $('<tbody>',{});
      tbody.append(row);

      let table;
      table = $('<table>',{});
      table.css('width','100%');
      table.append(tbody);
      return table;
    }

    let iframe = $('<div>', {class:'form_bodyIframe'});
    $.each(rows, (index, row) =>{iframe.append(buildBodyRow(row));});
    return iframe;
  }


  _buildTypeBtnRow(){

    let taskBtn = $('<div>', {text: 'Tasks', class: 'primary-btn primary-btn--small-size'})
                  .click(()=>{
                    taskBtn.removeClass('primary-btn--disabled');
                    pointBtn.addClass('primary-btn--disabled');
                    this.content = 'tasks';
                    this._refreshView();
                  });
    let pointBtn = $('<div>', {text: 'Points', class: 'primary-btn primary-btn--small-size'})
                   .css('margin-left', '3px')
                   .click(() =>{
                     pointBtn.removeClass('primary-btn--disabled');
                     taskBtn.addClass('primary-btn--disabled');
                     this.content = 'points';
                     this._refreshView();
                   });

    switch (this.content) {
      case 'tasks':
        pointBtn.addClass('primary-btn--disabled');
        break;
      default:
        taskBtn.addClass('primary-btn--disabled');

    }
    let col = $('<td>').append(taskBtn)
                       .append(pointBtn)
                       .css('display', 'flex')
                       .css('justify-content', 'flex-end')
                       .css('padding-top','6px')
                       .css('padding-right','14px')
                       .css('padding-bottom','6px');

    let row = $('<tr>').append(col);

    this.bodyRows.push(row);
  }


  _buildComTaskSection(){

    if(this.content == 'tasks'){
      this.todayTaskCnt = OPTIONS.stats.comTaskToday;
      this.thisWeekTaskCnt = OPTIONS.stats.comTaskWeek;
      this.thisMonthTaskCnt = OPTIONS.stats.comTaskMonth;

      this.dailyTaskRecord = OPTIONS.stats.comTaskBestDay;
      this.monthlyTaskRecord = OPTIONS.stats.comTaskBestWeek;
      this.yearlyTaskRecord = OPTIONS.stats.comTaskBestMonth;

      this.bodyRows.push(this._buildTitleRow('Completed Tasks'));

      this.bodyRows.push(this._buildStatRow('Today', this.todayTaskCnt, this.dailyTaskRecord, true));
      this.bodyRows.push(this._buildBarRow(this.todayTaskCnt, this.dailyTaskRecord));

      this.bodyRows.push(this._buildStatRow('This week', this.thisWeekTaskCnt, this.monthlyTaskRecord));
      this.bodyRows.push(this._buildBarRow(this.thisWeekTaskCnt, this.monthlyTaskRecord));

      this.bodyRows.push(this._buildStatRow('This month', this.thisMonthTaskCnt, this.yearlyTaskRecord));
      this.bodyRows.push(this._buildBarRow(this.thisMonthTaskCnt, this.yearlyTaskRecord));

    }else{

      this.todayPointCnt = OPTIONS.stats.comPointToday;
      this.thisWeekPointCnt = OPTIONS.stats.comPointWeek;
      this.thisMonthPointCnt = OPTIONS.stats.comPointMonth;

      this.dailyPointRecord = OPTIONS.stats.comPointBestDay;
      this.monthlyPointRecord = OPTIONS.stats.comPointBestWeek;
      this.yearlyPointRecord = OPTIONS.stats.comPointBestMonth;

      this.bodyRows.push(this._buildTitleRow('Points'));

      this.bodyRows.push(this._buildStatRow('Today', this.todayPointCnt, this.dailyPointRecord, true));
      this.bodyRows.push(this._buildBarRow(this.todayPointCnt, this.dailyPointRecord));

      this.bodyRows.push(this._buildStatRow('This week', this.thisWeekPointCnt, this.monthlyPointRecord));
      this.bodyRows.push(this._buildBarRow(this.thisWeekPointCnt, this.monthlyPointRecord));

      this.bodyRows.push(this._buildStatRow('This month', this.thisMonthPointCnt, this.yearlyPointRecord));
      this.bodyRows.push(this._buildBarRow(this.thisMonthPointCnt, this.yearlyPointRecord));
    }
  }


  _buildStatRow(text, currentVal, recordVal, isFirst = false){
    let row = $('<tr>');

    let labelCol = $('<td>', {text: text})
                   .css('width','100%')
                   .css('padding-left','12px');

    if (currentVal > recordVal) labelCol.addClass('quick-stats__stat-label--new-record');

    let currentValCol = $('<td>', {text: Math.floor(currentVal)})
                   .css('min-width','34px')
                   .css('text-align','right');

    if (currentVal > recordVal) currentValCol.css('font-weight','bold').css('color','#1551b5');

    let slashCol = $('<td>', {text: '/'})
                   .css('min-width','10px')
                   .css('text-align','center');

    let recordValCol = $('<td>', {text: Math.floor(recordVal)})
                   .css('min-width','34px')
                   .css('text-align','left');

    if (isFirst) recordValCol.addClass('quick-stats__record-value--record-label');

    row.append(labelCol)
       .append(currentValCol)
       .append(slashCol)
       .append(recordValCol);

    return row;
  }

  _buildBarRow(currentVal, recordVal){

    const progresBarFact = new ProgressBar();
    const progresBar = progresBarFact.getElement(currentVal, recordVal);

    const wrapper = $('<div>')
                    .css('padding','3px 10px 22px 5px')
                    .append(progresBar);

    const col = $('<td>').append(wrapper);
    return $('<tr>') .append(col);
  }

  _buildTitleRow(text) {
    let title = $('<div>', {text: text})
                 .css('text-align', 'center')
                 .css('padding-top','18px')
                 .css('padding-bottom','26px')
                 .css('font-weight', 'bold')
                 .css('font-size','15px');

    let col = $('<td>').append(title);
    return $('<tr>').append(col);
  }
};
