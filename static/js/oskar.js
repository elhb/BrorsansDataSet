d3.csv("oskar_data.csv", function (data) {
                
    // initiate variables defining the size of the image
    var width = 400,
    height = 300,
    padding = 50,
    move_left = 60,
    move_down = 5;
    
    // data in csv:
    // first fileter things: time,year,age,sex,civilstatus,ships,department,timeAtSea
    // then the actual questions: ,q1,q2,q3,q4.1,q4.2,q4.3,q51,q52,q53,q61,q62,q63,q71,q72,q73,q81,q82,q83,q9,q10,q11,q12.1,q122,q123,q13,q14,q15
    
//#########  age
    // get all the numbers as integers
    var age_map = data.map( function (i) { return parseInt(i.age); } );
    var age_chart_info = makeChartNumbers(data,"age",d3.max(age_map),"#age")

    //// based on the values found define the bins so that there always are 100 bins
    //var age_bin_width = d3.max(age_map)/50;
    //var age_bins = [];
    //for (var i = 0; i < d3.max(age_map)+1; i=i+age_bin_width) {
    //    age_bins.push(i);
    //}
    //
    //// get the histogram
    //var age_histogram = d3.layout.histogram()
    //    .bins(age_bins)
    //    (age_map);
    //
    //// create the scales for the x and y axes for the age histogram
    //var age_y = d3.scale.linear()
    //    .domain([0, d3.max(age_histogram.map( function (i) { return i.length; } ) )])
    //    .range([height-move_down, 0]);
    //
    //var age_x = d3.scale.linear()
    //    .domain([0, d3.max(age_map)])
    //    .range([0, width-move_left]);
    //        
    //var age_xAxis = d3.svg.axis()
    //    .scale(age_x)
    //    .orient("bottom");
    //
    //var age_yAxis = d3.svg.axis()
    //    .scale( age_y )
    //    .orient("left");
    //
    //// define the image canvas to paint on
    //var age_canvas = d3.select("#age").append("svg")
    //    .attr("width",width)
    //    .attr("height",height + padding )
    //    .append("g")
    //        .attr( "transform", "translate( " + move_left + " ,  " + move_down + "  )" ) ;
    //        
    //// add x axis text
    //var group = age_canvas.append("g")
    //    .attr("transform","translate(0," + (height-move_down) + ")" )
    //    .style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})
    //    .call(age_xAxis)
    //    .selectAll("text")
    //        .attr("y", 0)
    //        .attr("x", 9)
    //        .attr("dy", ".35em")
    //        .attr("transform", "rotate(90)")
    //        .style("text-anchor", "start");
    //
    //// add y axis text
    //var group2 = age_canvas.append("g")
    //    .style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})
    //    .call(age_yAxis);
    //
    //// add the bars for the bins in the histogram
    //var age_bars = age_canvas.selectAll("rect")
    //    .data(age_histogram)
    //    .enter()
    //    .append("svg:rect")
    //        .attr("class","ageBar")
    //        .attr("x", function (d) { return age_x(d.x) } )
    //        .attr("y", function (d) { return age_y(d.y) } )
    //        .attr("width", function (d) { return age_x(d.dx) } )
    //        .attr("height", function (d) { return age_y(0) - age_y(d.y) } );
    //    
    //var age_chart_info.brush = d3.svg.brush()
    //    .x(age_x)
    //    .on("brushend", brushed);
    //
    //var gBrush = age_canvas.append("g")
    //    .call(age_chart_info.brush)
    //    .selectAll("rect")
    //        .attr("y", height-300)
    //        .attr("height", 300);

//############# another graph ###################

    var sex_map = data.map( function (i) { return i.sex; } );
    var sex_histogram = countUniqStrings(sex_map,sex_map)

    // create the scales for the x and y axes for the age histogram
    var sex_y = d3.scale.linear()
        .domain([0, d3.max(sex_histogram.map( function (i) { return i.count; } ) )])
        .range([height-move_down, 0]);

    var sex_x = d3.scale.ordinal()
        .domain(getUniqStrings(sex_map))
        .rangeBands([0, (width-move_left)]);
   
    var sex_xAxis = d3.svg.axis()
        .scale(sex_x)
        .orient("bottom");

    var sex_yAxis = d3.svg.axis()
        .scale( sex_y )
        .orient("left");

    // define the image canvas to paint on
    var sex_canvas = d3.select("#sex").append("svg")
        .attr("width",width)
        .attr("height",height + padding )
        .append("g")
            .attr( "transform", "translate( " + move_left + " ,  " + move_down + "  )" ) ;

    // add x axis text
    var group3 = sex_canvas.append("g")
        .attr("transform","translate(0," + (height-move_down) + ")" )
        .style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})
        .call(sex_xAxis)
        .selectAll("text")
            .attr("y", 10)
            .attr("x", 0)
            //.attr("dy", ".35em")
            //.attr("transform", "rotate(90)")
            //.style("text-anchor", "start");

    // add y axis text
    var group4 = sex_canvas.append("g")
        .style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})
        .call(sex_yAxis);
    
    var nSexCutoff = makeFilterVar(sex_map);
    // add the bars for the bins in the histogram
    var sex_bars = sex_canvas.selectAll("rect")
        .data(sex_histogram)
        .enter()
        .append("svg:rect")
            .attr("x", function (d) { return sex_x(d.name) } )
            .attr("y", function (d) { return sex_y(d.count) } )
            .attr("width", function (d) { return ((width-move_left)/getUniqStrings(sex_map).length) } )
            .attr("height", function (d) { return sex_y(0) - sex_y(d.count) } )
            .on("click", function (d) {
                if (nSexCutoff[d.name]) {
                    nSexCutoff[d.name] = 0
                    //sex_canvas.selectAll("rect").style("fill","steelblue")
                    d3.select(this).style("fill","steelblue")
                }else{
                    nSexCutoff[d.name] = 1
                    //nSexCutoff = d.name
                    //sex_canvas.selectAll("rect").style("fill","steelblue")
                    d3.select(this).style("fill","black")
                }
                //update(age_chart_info.brush.extent(),nSexCutoff)
                update()
            })

    var tas_bins = d3.max(data.map( function (i) { return parseInt(i["timeAtSea"]); } ))
    var tas_chart_info = makeChartNumbers(data,"timeAtSea",tas_bins,"#timeatsea");
        
    function brushed() {
      //redraw(age_chart_info.brush.extent(),nSexCutoff)
      update()
    }
    
    // the update the funtion to call when cutof changes
    function update() {
          
        // redraw the image with the new cutof
        //redraw(age_chart_info.brush.extent(),nSexCutoff)
        redraw()
    }
    
    // the redraw function that actually redraws the image
    //function redraw(nAgeCutoff,nSexCutoff) {
    function redraw() {

        // filter all the integers based on the defined cutof

        var tas_map = data
        tas_map = categoryFilter(tas_map,nSexCutoff,"sex")
        tas_map = brushFilter(tas_map,age_chart_info.brush.extent(),"age")
        tas_map = tas_map.map( function (i) { return parseFloat(i.timeAtSea.replace(",",".")); })
        updateChartNumbers(tas_chart_info, tas_map)

        console.log(age_chart_info.brush.extent())
        console.log(nSexCutoff)
        console.log(tas_chart_info.brush.extent())

        // filter all the integers based on the defined cutof
        var age_map = data
        var age_map_max = d3.max(age_map.map( function (i) { return parseInt(i.age); }))
        age_map = categoryFilter(age_map,nSexCutoff,"sex")
        age_map = brushFilter(age_map,tas_chart_info.brush.extent(),"timeAtSea")
        age_map = age_map.map( function (i) { return parseInt(i.age); } )
        updateChartNumbers(age_chart_info , age_map)
            
        //// get the histogram data
        //var age_histogram = d3.layout.histogram()
        //    .bins(age_chart_info.bins)
        //    (age_map)
        //    
        //// update the axes max values
        //age_y.domain([0, d3.max(age_histogram.map( function (i) { return i.length; } ) )])
        ////age_x.domain([0, age_map_max]) // shouldn't change currently only have a lower cutoff
        //
        //// make the y axis transition
        //group2.transition()
        //    .duration(1000)
        //    .call(age_yAxis);
        //
        //// repaint the bars with the new histogram data
        //age_canvas.selectAll("rect")
        //        .data(age_histogram)
        //        .transition()
        //            .duration(1000)
        //            //.attr("x", function (d) { return age_x(d.x) } )
        //            .attr("y", function (d) { return age_y(d.y) } )
        //            //.attr("width", function (d) { return age_x(d.dx) } )
        //            .attr("height", function (d) { return age_y(0) - age_y(d.y) } )

        var sex_map = data
        var sex_map_unfiltered = data.map( function (i) { return i.sex; } );
        sex_map = brushFilter(sex_map,age_chart_info.brush.extent(),"age")
        sex_map = sex_map.map( function (i) { return i.sex; } )
                
        var sex_histogram = countUniqStrings(sex_map, sex_map_unfiltered)
            
        // update the axes max values
        sex_y.domain([0, d3.max(sex_histogram.map( function (i) { return i.count; } ) )])

        // make the y axis transition
        group4.transition()
            .duration(1000)
            .call(sex_yAxis);
        
        // repaint the bars with the new histogram data
        sex_canvas.selectAll("rect")
                .data(sex_histogram)
                .transition()
                    .duration(1000)
                    .attr("x", function (d) { return sex_x(d.name) } )
                    .attr("y", function (d) { return sex_y(d.count) } )
                    .attr("width", function (d) { return ((width-move_left)/getUniqStrings(sex_map_unfiltered).length) } )
                    .attr("height", function (d) { return sex_y(0) - sex_y(d.count) } )
    }

    //filters:
    function categoryFilter(data,cutOffVar,prop) {
        includedTerms = {}
        includedTermsCount = 0
        for (name in cutOffVar){
            if (cutOffVar[name]) {
                includedTerms[name] = 1
                includedTermsCount += 1
            }
        }
        if (includedTermsCount != 0) {  data = data.filter(function(i) { return (i[prop] in includedTerms) })  }
        return data
    }
    function brushFilter(data,extent,prop) {
        //if ( age_chart_info.brush.extent()[0] !=  age_chart_info.brush.extent()[1]  ) { data = data.filter(function(i) { return parseInt(i.age) >= age_chart_info.brush.extent()[0] && parseInt(i.age) <= age_chart_info.brush.extent()[1]}) }
        if ( extent[0] !=  extent[1]  ) { data = data.filter(function(i) { return parseInt(i[prop]) >= extent[0] && parseInt(i[prop]) <= extent[1]}) }
        return data
    }
    
    // misc stuff
    function addItem(dict,item) {
        if (item in dict) {
            dict[item] += 1
        }else {
            dict[item] = 1
        }
    }
    function max(dict) {
        var max_value = 0
        for (item in dict) {
            if (dict[item] > max_value) {
                max_value = dict[item]
            }
        }
        return max_value
    }

    // category histogram making
    function makeFilterVar(strings) {
        //outPutDict = {"NoFilter":1}
        outPutDict = {}
        uniq_strings = getUniqStrings(strings)
        for (index in uniq_strings) {
            outPutDict[uniq_strings[index]] = 0
        }
        return outPutDict
    }
    function getUniqStrings(inputList) {
        tmpDict = {}
        tmpList = []
        inputList.sort()
        for (index in inputList) {
            tmpDict[inputList[index]] = 1
        }
        for (name in tmpDict) {
            tmpList.push(name)
        }
        return tmpList
    }
    function countUniqStrings(inputList, originalList) {
        tmpList = getUniqStrings(originalList)
        tmpDict = {}
        objectArray = []
        for (index in tmpList) {
            tmpDict[tmpList[index]] = 0
        }
        for ( index in inputList ) {
            tmpDict[inputList[index]] += 1
        }
        for (name in tmpDict){
            objectArray.push({"name":name,"count":tmpDict[name]})
        }
        return objectArray
    }

    // chart createion and updating
    function makeChartNumbers(data,whatToPlot,numberOfBins,divId) {

        // get all the numbers as integers
        var data_map = data.map( function (i) { return parseInt(i[whatToPlot]); } );
    
        // based on the values found define the bins so that there always are 100 bins
        var bin_width = d3.max(data_map)/numberOfBins;
        var bins = [];
        for (var i = 0; i < d3.max(data_map)+1; i=i+bin_width) {
            bins.push(i);
        }
        
        // get the histogram
        var histogram = d3.layout.histogram()
            .bins(bins)
            (data_map);
        
        // create the scales for the x and y axes for the age histogram
        var y = d3.scale.linear()
            .domain([0, d3.max(histogram.map( function (i) { return i.length; } ) )])
            .range([height-move_down, 0]);
        var yAxis = d3.svg.axis()
            .scale( y )
            .orient("left");
        var x = d3.scale.linear()
            .domain([0, d3.max(data_map)])
            .range([0, width-move_left]);
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
    
        // define the image canvas to paint on
        var canvas = d3.select(divId).append("svg")
            .attr("width",width)
            .attr("height",height + padding )
            .append("g")
                .attr( "transform", "translate( " + move_left + " ,  " + move_down + "  )" );
                
        // add x axis text
        var x_axis_text_group = canvas.append("g")
            .attr("transform","translate(0," + (height-move_down) + ")" )
            .style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})
            .call(xAxis)
            .selectAll("text")
                .attr("y", 0)
                .attr("x", 9)
                .attr("dy", ".35em")
                .attr("transform", "rotate(90)")
                .style("text-anchor", "start");
    
        // add y axis text
        var y_axis_text_group = canvas.append("g")
            .style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})
            .call(yAxis);
    
        // add the bars for the bins in the histogram
        var bars = canvas.selectAll("rect")
            .data(histogram)
            .enter()
            .append("svg:rect")
                .attr("class","ageBar")
                .attr("x", function (d) { return x(d.x) } )
                .attr("y", function (d) { return y(d.y) } )
                .attr("width", function (d) { return x(d.dx) } )
                .attr("height", function (d) { return y(0) - y(d.y) } );
            
        var brush = d3.svg.brush()
            .x(x)
            .on("brushend", brushed);
        
        var gBrush = canvas.append("g")
            .call(brush)
            .selectAll("rect")
                .attr("y", height-300)
                .attr("height", 300);
        
        // needed to do update: canvas, y, yAxis, y_axis_text_group, bins
        return {"canvas":canvas, "y_scale":y, "yAxis":yAxis, "y_axis_text_group":y_axis_text_group, "brush":brush, "bins":bins}
    }
    function updateChartNumbers(chart_info , filtered_data) {
            
        // get the histogram data
        var histogram = d3.layout.histogram()
            .bins(chart_info.bins)
            (filtered_data)
            
        // update the axes max values
        chart_info.y_scale.domain([0, d3.max(histogram.map( function (i) { return i.length; } ) )])

        // make the y axis transition
        chart_info.y_axis_text_group.transition()
            .duration(1000)
            .call(chart_info.yAxis);
        
        // repaint the bars with the new histogram data
        chart_info.canvas.selectAll("rect")
            .data(histogram)
            .transition()
                .duration(1000)
                //.attr("x", function (d) { return x(d.x) } )
                .attr("y", function (d) { return chart_info.y_scale(d.y) } )
                //.attr("width", function (d) { return x(d.dx) } )
                .attr("height", function (d) { return chart_info.y_scale(0) - chart_info.y_scale(d.y) } )
    }
})