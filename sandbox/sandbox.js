/*jshint esversion: 6 */

class Sandbox{

  checkDays(){

    let a = {a:"1", b:"2"};
    let arra = [];
    arra.push(a);

    a.a="2";
    arra.push(a);

    console.log(arra);


    let today = new Date();
    let flatToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    let otherday = new Date(today.getFullYear(), today.getMonth()+2, today.getDate()+3, 10, 0, 0);
    console.log(otherday);
    console.log(differenceOfDays(flatToday,today));
  }

}

function differenceOfDays(date1,date2){

  let res = Math.abs(date1 - date2) / 1000;
  let difference = Math.floor(res / 86400);

  return difference;
}

//For testing purposes
const Sb = new Sandbox();

$('#filter_container').on('click', function(){
    Sb.checkDays();
});
