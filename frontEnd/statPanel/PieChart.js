
module.exports = class PieChart{
  constructor(){

  }

  render(className, dataset, title){
    this.dataset = dataset;
    this.className = className;
    this.title = title;
    this._renderGraph();

    //Resize event to make chart responsive.
    $(window).resize(() => {this._resizeGraph();});
  }

  refresh(dataset){
    this.dataset = dataset;
    const displayLabels = true;
    this._refresh(displayLabels);
  }


  //----------------------- Private methods ---------------//


  _renderGraph(displayLabels = false, instantly = false) {

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

    // Refreshes slice display.
    // If displayLabels is true, displays labels too after
    // waiting for the slice animation to finish.
    this._refresh = (displayLabels = false, instantly = false) => {

      /* ------- SLICES-------*/

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
    		})

    	this.slice.exit().remove();

      if (displayLabels){
        if (instantly){
          this._displayLabels();
        }else{
          setTimeout( () => {this._displayLabels();}, 1000);
        }
      }
    };

    // Displays labels and label polylines.
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
        .text(function(d) {return Math.round((d.data[1]/total)*100) + '%';});

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
            pos[0] = radius * 0.85 * (midAngle(d2) < Math.PI ? 1 : -1);
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



      /*------------------- GRAPH TITLE -------------------*/

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
          .text(this.dataset.length -1)
          .attr("transform", "translate(0,26)");

      /*------------------- OTHER BTN -------------------*/

      let btn = d3.select("." + className).append("div")
          .attr("style", "left:" + width/2 + "px; top:" + height + "px;")
          .attr("class", "other-btn select-btn select-btn--off primary-btn")
          .text("Other Off")
          .on("click", () => {
            this.otherValue = this.dataset[0][1];
            this.dataset[0][1] = 0;
            const container = $('.' + this.className);
            container.empty();
            this._renderGraph(true, true);

            // re render labels too.
            // Change btn class.
            // Add opposite effect.
          });

      /*------------------- TOOLTIP -------------------*/

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

    this._refresh(displayLabels, instantly);
  }


  _resizeGraph(){
    const container = $('.' + this.className);

    if(container.length == 0){
      $(window).off('resize');
      return;
    }

    container.empty();
    const displayLabels = true;
    const refreshLabelsInstantly = true;
    this._renderGraph(displayLabels, refreshLabelsInstantly);
  }

  _getWrapperAtts(className){
    const elem = $('.' + className);
    return {
      width: elem.width(),
      height: elem.height()
    };
  }
};
