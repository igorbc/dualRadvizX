/**
 * Created by igorcorrea on 03/12/2015.
 */

addSvgLegend = function(classNames, svgContainer) {
    svgContainer.selectAll("legendRect")
        .data(classNames)
        .enter()
        .append("rect")
        .attr("class", "legendRect")
        .attr("y", function(d, i) {
            return 30 + 30*i
        })
        .style("fill", function(d){return vc.colorScheme(d)})
        .on("click", function(d){
            //console.log("click");
            vc.confusionClass = d;
            vc.updateColor(sa.delay);
        })
        .on("dblclick", function(d){
            vc.confusionClass = 0;
            //console.log("dbl");
            vc.updateColor(sa.delay);
        });

    svgContainer.selectAll("legendText")
        .data(classNames)
        .enter()
        .append("text")
        .attr("class", "legendText")
        .attr("x", 30)
        .attr("y", function(d, i) {
            return 45 + 30*i
        })
        .text(function(d){ return d;})
}
