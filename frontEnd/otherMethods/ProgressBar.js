let successBlue = '#81a7e5';
let exceedingBlue = '#4c76be';
let justStartedRed = successBlue; //#ed7b42
let lessThanHalfOrange = successBlue; //#f3c4ad
let equatorYellow = successBlue; //#ede88f
let almostThereGreen = successBlue; //#a7e3b6

module.exports = class ProgressBar{
  constructor(){
    this.elementColor = '#f1f1f1'; //Default value
    this.barColor = '#f1f1f1'; //Default value
    this.width = '0%'; //Default value

    this._buildElement();
  }


  getElement(val, totalVal){

    switch (true) {
      case val > (totalVal * 2):
        this.width = '100%';
        this.elementColor = successBlue;
        this.barColor = exceedingBlue;
        break;

      case val > totalVal:
        this.width = Math.round((val/(totalVal * 2))*100) + '%';
        this.elementColor = successBlue;
        this.barColor = exceedingBlue;
        break;

      case val == totalVal:
        this.width = '100%';
        this.barColor = successBlue;
        break;

      case val > totalVal * 0.75:
        this.width = Math.round((val/totalVal)*100) + '%';
        this.barColor = almostThereGreen;
        break;

      case val > totalVal * 0.5:
        this.width = Math.round((val/totalVal)*100) + '%';
        this.barColor = equatorYellow;
        break;

      case val > totalVal * 0.25:
        this.width = Math.round((val/totalVal)*100) + '%';
        this.barColor = lessThanHalfOrange;
        break;

      case val > 0:
        this.width = Math.round((val/totalVal)*100) + '%';
        this.barColor = justStartedRed;
        break;

      default:
        this.width = '0%';
    }

    this.bar.css('background-color', this.barColor)
            .css('padding', '0x 5px')
            .css('width', this.width);

    this.element.css('background-color', this.elementColor);

    return this.element;
  }

  //----------------------- Private methods ---------------//

  _buildElement(){
    this.bar = $('<div>')
               .css('height', '2.5px')
               .css('text-align', 'center')
               .css('border-radius','10px');

    this.element = $('<div>')
                   .css('border-radius','10px')
                   .append(this.bar);
  }
};
