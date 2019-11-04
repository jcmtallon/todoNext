
/**
 * Object in charge of applying and removing
 * global shortcuts in the app. Shorcuts are fabricated
 * first by the shortcutFabric.
 */

let shortcuts = [];

class Shortcuts{
  constructor(){
    this._mainPage = $(document);
  }


  /**
   * Receives all available global shortcuts and
   * saves them into a private array variable.
   */
  loadShortcuts(shortcutArray){
    shortcuts = shortcutArray;
    this.setAllGlobalShortcuts();
  }


  /**
   * Applies a keydown event to the document and adds an
   * keycode conditional for each passed shortcut together
   * with the required action for each shortcut.
   */
  setAllGlobalShortcuts(){
    this._mainPage.keydown((e) => {

      $.each(shortcuts, (idx, shortcut) => {
        if (e.keyCode == shortcut.keyCode){
          e.preventDefault();
          if(shortcut.keydownOff){this.removeAllGlobalShortcuts();}
          shortcut.action();
        }
      });

    });
  }


  /**
   * Removes all global shortcuts from the document
   */
  removeAllGlobalShortcuts(){
    this._mainPage.off('keydown');
  }

}

module.exports = new Shortcuts();
