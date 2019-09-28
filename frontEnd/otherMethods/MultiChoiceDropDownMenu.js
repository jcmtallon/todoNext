
const style__container = 'multichoice';
const style__row = 'multichoice_row';
const style_leftCol = 'multichoice_left-col';
const style_rightCol = 'multichoice_right-col';
const style__circle = 'multichoice_circle';
const style__icon = 'multichoice_icon';
const style__selected = 'multichoice--selected';
const style__slideIn = 'animate slideIn';
const style__active = 'multichoice_row--active';
const style_rightCol_default = 'multichoice_right-col--default';

// Use to apply local keydown and click events.
const eventNameSpace = 'multichoice';

// Remember the current active row in the ddm.
let _activeRowNb = 0;




module.exports = class MultiChoiceDropDownMenu {

  /**
   * Builds the jquery element without displaying it.
   * Important: The menu will move together with
   * the element that is appended to when the user
   * scrolls, that is why you can get undesir]ed results
   * in the positioning of the menu if you don't append it
   * to the right root.
   * @param  {Object} params {options:[], width: 110, root:jquery , trigger:jquery}
   */
  constructor(params){
    this.width = (params.hasOwnProperty('width')) ? params.width : 100;
    this.root = (params.hasOwnProperty('root')) ? params.root : $(document);
    this.triggerHeight = (params.hasOwnProperty('triggerHeight')) ? params.triggerHeight : 21;
    this.fontSize = (params.hasOwnProperty('fontSize')) ? params.fontSize : undefined;

    this.trigger = params.trigger;
    this.offsetX = 0;
    this.ddmHeight = 41 * params.options.length;
    this.ddmMaxHeight = 300;
    this.options = params.options;
    this.selected = (params.selected!='') ? JSON.parse(params.selected) : this._setSelectedArray(params.options);
  }

  /**
   * Appens menu to the specified root element
   * and applies a click event to the document
   * to the menu is removed from the screen as soon
   * the menu or any other place in the screen is clicked.
   */
  show(){
    //Removes all existing ddm of the same type from the document.
    $(`.${style__container}`).remove();

    this._setClickEvent();
    this._setKeyDownEvents();

    this.root.append(this._buildElement());
    this._updateActiveRow();
  }


  //-----------------Build methods ------------------//

  _buildElement(){
    this.element = this._buildMenu(this.options);
    this.element.css('min-width', `${this.width}px`);
    this.element.css('top', this._getYPosition());
    this.element.css('left', this._getXPosition());
    if(this.fontSize!=undefined) this.element.css('font-size', this.fontSize + 'px');
    return this.element;
  }

  _buildMenu(options){
    let container;
    container = $('<div>',{class: style__container})
               .addClass(style__slideIn)
               .css('max-height', this.ddmMaxHeight);

    if (options.length == 0){
      container.append(this._getNoItemsRow());
      return container;
    }

    $.each(options, (index, option) => {
      let row = this._buildOptions(option, index);
      container.append(row);
    });

    if(this.ddmHeight > this.ddmMaxHeight){container.css('overflow-y', 'scroll');}
    return container;
  }

  _buildOptions(option, index){
    let leftContent;

    if (option.color != undefined){
      leftContent = $('<div>', {class: style__circle})
                    .css('background-color',option.color);
    }else{
      leftContent = $('<div>', {class: style__icon}).append(option.icon);
    }

    const leftCol = $('<div>', {class: style_leftCol})
                    .append(leftContent);

    const rigtCol = $('<div>', {text: option.text, class: style_rightCol})
                    .css('max-width', this.width - 76);
                    //76 is the combined width of the circle column and the
                    //check mark that appears when an item is selected.

    let element = $('<div>',{class: style__row})
                  .append(leftCol).append(rigtCol);

    if(this.selected[index]) element.addClass(style__selected);

    element.hover((e)=>{_activeRowNb = index;
                        this._updateActiveRow();
                        });

    element.mousedown((e)=>{e.stopPropagation();
                            e.preventDefault();
                            });

    element.click((e)=>{e.stopPropagation();
                        e.preventDefault();
                       _activeRowNb = index;
                       this._updateActiveRow();
                       this._updateSelected(index);
                       this._highlightOption(element, index);
                       option.action(this.trigger, this.selected);});
    return element;
  }


  _getNoItemsRow(){
    const circle = $('<div>', {class: style__circle}).css('background-color', '#cc6a6a'); //RED
    const leftCol = $('<div>', {class: style_leftCol}).append(circle);
    const rigtCol = $('<div>', {text: 'No items available yet', class: style_rightCol})
                    .css('max-width', this.width - 76)
                    .addClass(style_rightCol_default);
                    //76 is the combined width of the circle column and the
                    //check mark that appears when an item is selected.
    return $('<div>',{class: style__row}).append(leftCol).append(rigtCol);
  }

  //------------------------------- Events ----------------------------------//

  _setClickEvent(){
    $(document).on('click.' + eventNameSpace, (e) =>{
      e.stopPropagation();
      this._removeMenu();
    });
  }

  _setKeyDownEvents(){
    $(document).on('keydown.' + eventNameSpace, (e) => {

      //If key down - select next row
      if (e.keyCode == 40){
        e.preventDefault();
        e.stopPropagation();
        this._updateActiveRow(1);

      //If key up - move active up
      }else if(e.keyCode == 38){
        e.preventDefault();
        e.stopPropagation();
        this._updateActiveRow(-1);

      //If ENTER key --- save selection and remove from textbox
      }else if(e.keyCode ==13){
        e.preventDefault();
        e.stopPropagation();
        this._toogleSelectedStatus();

      //If TAB - close and reset table menu
    }else if(e.keyCode == 9){
          this._removeMenu();
        }
    });

    this.trigger.on('keydown', (e)=>{
      if(e.keyCode == 27){
        e.stopPropagation();
        this.trigger.off('keydown');
        this._removeMenu();
      }
    });
  }

  _removeMenu(){
    _activeRowNb = 0; //So the following menu displays with the value restarted.
    this.element.remove();
    $(document).off('click.' + eventNameSpace);
    $(document).off('keydown.' + eventNameSpace);
  }

  _updateActiveRow(value = 0){
    _activeRowNb = this._updateRowIndex(value);
    const el = $('.' + style__container);
    el.children().removeClass(style__active);
    el.children().eq(_activeRowNb).addClass(style__active);
  }

  _updateRowIndex(value){
    const rows = $('.' + style__container).children().length;
    let index = _activeRowNb + value;
    if (index > rows - 1) index = 0;
    if (index < 0) index = rows - 1;
    return index;
  }

  _toogleSelectedStatus(){
    const row = $('.' + style__container).children().eq(_activeRowNb);
    this._updateSelected(_activeRowNb);
    this._highlightOption(row, _activeRowNb);
    this.options[_activeRowNb].action(this.trigger, this.selected);
  }

  _highlightOption(element, index){
    if(this.selected[index]){
      element.addClass(style__selected);
    }else{
      element.removeClass(style__selected);
    }
  }


  // ------------------- Calculates position ------------------------//

  _getYPosition() {
    let triggerTop = this.trigger.offset().top - $(document).scrollTop();
    let rootScroll = this.root[0].scrollTop;
    let offset = this.triggerHeight;
    let ddmHeight = this.ddmHeight;

    return triggerTop + rootScroll + offset;
  }

  _getXPosition(){
    let triggerLeft = this.trigger.offset().left;

    if ((triggerLeft + this.width) >= $( window ).width()){
         return triggerLeft - this.width + this.offsetX;
     }else{
         return triggerLeft;
     }
   }

   //----------------- Manipulating selected array -----------------//


   // Returns an array with as many false values as options received.
   _setSelectedArray(options){
     let arr = [];
     $.each(options,(index, option)=>{
       arr.push(false);
     });
     return arr;
   }

   //Inverts boolean value of indicated array element.
   _updateSelected(index){
     this.selected[index] = !this.selected[index];
   }
};
