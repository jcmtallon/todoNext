/*jshint esversion: 6 */
const addTaksForm = require('./../forms/add_task_form');


class Shortcuts{
  constructor(){
    this._mainPage = $(document);
  }

  setMainPageShortcuts(){

    this._mainPage.keydown((e) =>{

      //(q) Opens addtask panel.
      if (e.keyCode == 81){
        e.preventDefault();
        this._mainPage.off('keydown');
        addTaksForm.showModal();

      }
  });
  }

  removeMainPageShortctus(){
    this._mainPage.off('keydown');
  }

}

module.exports = new Shortcuts();
