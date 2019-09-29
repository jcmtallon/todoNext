
module.exports = class PieChart{

  render(className, dataset, title){
    this.dataset = dataset;
    this.className = className;
    this.title = title;
    this.winWidth = $(window).width();
    this._renderGraph();

    //Resize event to make chart responsive.
    $(window).resize(() => {
      if ($(window).width() == this.winWidth) return;
      this.winWidth = $(window).width();
      this._resizeGraph();
    });
  }

  refresh(dataset){
    this.dataset = dataset;
    const displayLabels = true;
    this._refresh(displayLabels);
  }


  //----------------------- Private methods ---------------//


  _renderGraph(displayLabels = false) {

    const className = this.className;
    const wrapper = this._getWrapperAtts(className);

    let svg = d3.select("." + className)
      .append("svg")
      .append("g");

    svg.append("g").attr("class", "slices");
    svg.append("g").attr("class", "labels");
    svg.append("g").attr("class", "lines");

    let width = wrapper.width,
       height = wrapper.height,
       radius = Math.min(width, height) / 2;

    let pie = d3.layout.pie()
      .sort(null)
      .value(function(d) {return d[1];});

    let arc = d3.svg.arc()
      .outerRadius(radius * 0.7)
      .innerRadius(radius * 0.5);

    let outerArc = d3.svg.arc()
      .innerRadius(radius * 0.7)
      .outerRadius(radius * 0.7);

    svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    const key = function(d) {return d.data[0];};


    /*-------------- REFRESH DATA -------------------------*/

    this._refresh = (displayLabels = false) => {

      this._renderSlices();

      if (displayLabels){
        this._renderCaptions();
        this._renderBtn();
        this._setToolTip();
        setTimeout( () => {this._displayLabels();}, 1000);
      }
    };



    /* ------- SLICES-------*/

    this._renderSlices = () => {

      this.slice = svg.select(".slices").selectAll("path.slice")
        .data(pie(this.dataset), key);

      this.slice.enter()
        .insert("path")
        .style("fill", function(d) {return d.data[2];})
        .attr("class", "slice");

      this.slice
        .transition().duration(1000)
        .attrTween("d", function(d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            return arc(interpolate(t));
          };
        });

      this.slice.exit().remove();
    };




    /* ------- TEXT LABELS + POLYLINES -------*/

    this._displayLabels = () => {

      let total = this.dataset.map((el)=>{return el[1];})
                              .reduce((total, el)=>{return total + el;});

      /* ------- TEXT LABELS -------*/
      var text = svg.select(".labels").selectAll("text")
        .data(pie(this.dataset), key);

      text.enter()
        .append("text")
        .attr("class", "label")
        .attr("dy", ".35em")
        .text(function(d) {
          let pct = Math.round((d.data[1]/total)*100);
          return (isNaN(pct)) ? '0%': pct + '%';
        });

      function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
      }

      text.transition().duration(1000)
        .attrTween("transform", function(d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            var d2 = interpolate(t);
            var pos = outerArc.centroid(d2);
            pos[0] = (radius * 0.85) * (midAngle(d2) < Math.PI ? 1 : -1);
            return "translate("+ pos +")";
          };
        })
        .styleTween("text-anchor", function(d){
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            var d2 = interpolate(t);
            return midAngle(d2) < Math.PI ? "start":"end";
          };
        });

      text.exit().remove();

      /* ------- SLICE TO TEXT POLYLINES -------*/
      var polyline = svg.select(".lines").selectAll("polyline")
        .data(pie(this.dataset), key);

      polyline.enter().append("polyline");

      polyline.transition().duration(1000)
        .attrTween("points", function(d){
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            var d2 = interpolate(t);
            var pos = outerArc.centroid(d2);
            pos[0] = radius * 0.80 * (midAngle(d2) < Math.PI ? 1 : -1);
            return [arc.centroid(d2), outerArc.centroid(d2), pos];
          };
        });

      polyline.exit().remove();
    };

    /*------------------- GRAPH TITLE -------------------*/

    this._renderCaptions = () => {

      svg.append("text")
          .attr("x", '0')
          .attr("y", '0')
          .attr("class", "chartTitle")
          .attr("text-anchor", "middle")
          .text(this.title)
          .attr("transform", "translate(0,-16)");

      svg.append("text")
          .attr("x", '0')
          .attr("y", '0')
          .attr("class", "centerCounter")
          .attr("text-anchor", "middle")
          .text(Math.max(this.dataset.length -1, 0))
          .attr("transform", "translate(0,26)");

    };




    /*------------------- OTHER BTN -------------------*/

    this._renderBtn = () => {

      let btn = d3.select("." + className).append("div")
          .attr("style", "left:" + width/2 + "px; top:" + height + "px;")
          .attr("class", "other-btn select-btn select-btn--off primary-btn")
          .text("Other Off")
          .on("click", () => {

            let $btn = $(btn[0][0]);

            if($btn.hasClass('select-btn--off')){

              // Change btn look
              $btn.text('Other On');
              $btn.removeClass('select-btn--off');

              // Get other index in dataset array
              this.otherIndex = this._getOtherIndex();

              // Give a 0 value to other
              // (saving a backup of the real value first)
              this.otherValMemory = this.dataset[this.otherIndex][1];
              this.dataset[this.otherIndex][1] = 0;

              // Remove labels and lines
              svg.selectAll(".labels").remove();
              svg.selectAll(".lines").remove();

              // Add new empty label and line containers
              svg.append("g").attr("class", "labels");
              svg.append("g").attr("class", "lines");

              //Re-render the stuff
              this._renderSlices();
              this._displayLabels();

            }else{

              // Change btn look
              $btn.text('Other Off');
              $btn.addClass('select-btn--off');

              // Recover other value.
              this.dataset[this.otherIndex][1] = this.otherValMemory;

              // Remove labels and lines
              svg.selectAll(".labels").remove();
              svg.selectAll(".lines").remove();

              // Add new empty label and line containers
              svg.append("g").attr("class", "labels");
              svg.append("g").attr("class", "lines");

              //Re-render the stuff
              this._renderSlices();
              this._displayLabels();
            }
          });

    };








    /*------------------- TOOLTIP -------------------*/

    this._setToolTip = () => {

      const tooltip = d3.select("." + className).append("div")
        .attr("class", "tooltip")
        .style("display", "none");

      const tooltipDate = tooltip.append("div")
        .attr("class", "tooltip-name");

      const tooltipPoints = tooltip.append("div");
      tooltipPoints.append("span")
        .attr("class", "tooltip-title")
        .text("Points: ");

      const tooltipPointValue = tooltipPoints.append("span")
        .attr("class", "tooltip-points");

      this.slice.on('mouseover', function(d) {
        tooltip.select(".tooltip-name").text(d.data[3]);
        tooltip.select("." + className + " .tooltip-points").text(d.data[1]);
        tooltip.style('display', 'block');
      });

      this.slice.on('mouseout', function() {
        tooltip.style('display', 'none');
       });

      this.slice.on('mousemove', function(d) {
        tooltip.style('top', (d3.event.layerY + 10) + 'px')
               .style('left', (d3.event.layerX + 10) + 'px');
      });
    };


    this._refresh(displayLabels);
  }



  _resizeGraph(){
    const container = $('.' + this.className);

    if(container.length == 0){
      $(window).off('resize');
      return;
    }

    container.empty();
    const displayLabels = true;
    this._renderGraph(displayLabels);
  }



  _getWrapperAtts(className){
    const elem = $('.' + className);
    return {
      width: elem.width(),
      height: elem.height()
    };
  }

  _getOtherIndex(){
    let i;
      $.each(this.dataset,(index, ele)=>{
        if(ele[0]=="Other"){
          i = index;
          return false;
        }
      });
   return i;
  }
};
