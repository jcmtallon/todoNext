
module.exports = class PieChart{
  constructor(){

  }

  render(className, dataset){
    this.dataset = dataset;
    this.className = className;
    this._renderGraph();
  }

  refresh(dataset){
    this.dataset = dataset;
    const displayLabels = true;
    this._refresh(displayLabels);
  }


  //----------------------- Private methods ---------------//


  _renderGraph() {

    const className = this.className;
    const wrapper = this._getWrapperAtts(className);

    var svg = d3.select("." + className)
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
    this._refresh = (displayLabels = false) => {

    	var slice = svg.select(".slices").selectAll("path.slice")
    		.data(pie(this.dataset), key);

    	slice.enter()
    		.insert("path")
    		.style("fill", function(d) {return d.data[2];})
    		.attr("class", "slice");

    	slice
    		.transition().duration(1000)
    		.attrTween("d", function(d) {
    			this._current = this._current || d;
    			var interpolate = d3.interpolate(this._current, d);
    			this._current = interpolate(0);
    			return function(t) {
    				return arc(interpolate(t));
    			};
    		})

    	slice.exit().remove();

      if (displayLabels) setTimeout( () => {this._displayLabels();}, 1000);
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
            pos[0] = radius * 0.80 * (midAngle(d2) < Math.PI ? 1 : -1);
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
            pos[0] = radius * 0.75 * (midAngle(d2) < Math.PI ? 1 : -1);
            return [arc.centroid(d2), outerArc.centroid(d2), pos];
          };
        });

      polyline.exit().remove();
    };

    this._refresh();
  }

  _getWrapperAtts(className){
    const elem = $('.' + className);
    return {
      width: elem.width(),
      height: elem.height()
    };
  }


};
