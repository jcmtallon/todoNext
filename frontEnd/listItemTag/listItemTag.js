/*jshint esversion: 6 */
const OPTIONS = require('./../optionHandler/OptionHandler');
const InfoHint = require('./../hints/infoHint');

module.exports = class ListItemTag{
  constructor(){

  }

  /**
   * Returns a tag element with the letter "L" of learning in it
   * and the same color as the corresponding category of the task.
   * If category id does not exist anymore, a blue color is applied
   * by default to the tag.
   */
  getLearningTag(isLearning, catId){

    if(isLearning){

      let catDeets = getCategoryDeets(catId);

      let tag;
      tag = $('<span>',{
        text: 'L',
        class: 'std_listItem_tag'});
      tag.css('background-color',catDeets.color);
      tag.css('opacity','0.75');

      return tag;
    }

  }

  /**
   * Returns a tag element with the letter "N" of notes in it
   * and the same color as the corresponding category of the task.
   * If category id does not exist anymore, a blue color is applied
   * by default to the tag.
   * It also attaches a description hint to the tag that
   * activates with a hover action.
   */
  getNotesTag(notes, catId){

    if(notes!=undefined && notes!=''){
      let catDeets = getCategoryDeets(catId);

      let tag;
      tag = $('<span>',{
        text: 'N',
        class: 'std_listItem_tag'});
      tag.css('background-color',catDeets.color);
      tag.css('opacity','0.75');

      let hintFab = new InfoHint(tag);
      let tagWhEvent = hintFab.loadHint(notes);

      return tagWhEvent;
    }
  }


  /**
   * Returns a tag element with the corresponding text and color
   * to the received category id.
   * If category id does not exist anymore, a 'Other' category
   * is generated by default.
   */
  getProjectTag(projId){

    let projDeets = getProjectDeets(projId);
    if (projDeets == undefined){return;}

    let catDeets = getCategoryDeets(projDeets.categoryId);

    let tag;
    tag = $('<span>',{
      text: projDeets.title,
      class: 'std_listItem_tag'});
    tag.css('background-color',catDeets.color);

    return tag;

  }


  /**
   * Returns a tag element with the corresponding text and color
   * to the received category id.
   * If category id does not exist anymore, a 'Other' category
   * is generated by default.
   */
  getCategoryTag(catId){

    let catDeets = getCategoryDeets(catId);

    let tag;
    tag = $('<span>',{
      text: catDeets.title,
      class: 'std_listItem_tag'});
    tag.css('background-color',catDeets.color);

    return tag;
  }
};



function getCategoryDeets(catId) {

  let catTitle = 'Other';
  let catColor = '#263e65';

  if (catId!=''){
    let catObj = OPTIONS.categories.getCategoryById(catId);
    if (catObj != undefined){
      catTitle = catObj.title;
      catColor = catObj.color;
    }
  }

  return {title: catTitle, color: catColor};
}

function getProjectDeets(projId) {


  if (projId!=''){
    let projObj = OPTIONS.projects.getProjectById(projId);
    if (projObj != undefined){
      let projTitle = projObj.title;
      let projCatId = projObj.categoryId;
      return {title: projTitle, categoryId: projCatId};
    }
  }
}
