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
    
    // create sex chart
    var sex_map = data.map( function (i) { return i.sex; } );
    var sex_chart_info = makeCategoryChart(sex_map,"#sex",0)
    
    // create age chart
    var age_map = data.map( function (i) { return parseInt(i.age); } );
    var age_chart_info = makeChartNumbers(data,"age",d3.max(age_map),"#age")

    // create timeAtSea chart
    var tas_bins = d3.max(data.map( function (i) { return parseInt(i["timeAtSea"]); } ))
    var tas_chart_info = makeChartNumbers(data,"timeAtSea",tas_bins,"#timeatsea");
    
    // create department chart
    var department_map = data.map( function (i) { return i.department; } );
    var department_chart_info = makeCategoryChart(department_map,"#department",0)

    // create year chart
    var year_map = data.map( function (i) { return i.year; } );
    var year_chart_info = makeCategoryChart(year_map,"#year",0)

    // create civilstatus chart
    var civilstatus_map = data.map( function (i) { return i.civilstatus; } );
    var civilstatus_chart_info = makeCategoryChart(civilstatus_map,"#civilstatus",0)

    // create ships chart
    var ships_map = data.map( function (i) { return i.ships; } );
    var ships_chart_info = makeCategoryChart(ships_map,"#ships",1)

    //"q1"
    var q1_map = data.map( function (i) { return i.q1; } );
    var q1_chart_info = makeCategoryChart(q1_map,"#q1",1)
    
    //"q15"
    var q15_map = data.map( function (i) { return i.q15; } );
    var q15_chart_info = makeCategoryChart(q15_map,"#q15",1)
    
    // create questions charts
    var question_names = ["q2","q3","q4_1","q4_2","q4_3","q5_1","q5_2","q5_3","q6_1","q6_2","q6_3","q7_1","q7_2","q7_3","q8_1","q8_2","q8_3","q9","q10","q11","q12_1","q12_2","q12_3","q13","q14"]
    var questions_chart_info = {}
    for (index in question_names) {
        qname = question_names[index]
        tmp_map = data.map( function (i) { return parseInt(i[qname]); } );
        questions_chart_info[qname] = makeChartNumbers(data,qname,d3.max(tmp_map)*2,"#"+qname)
    }
    
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

        var txt_div = d3.select("#currentFilters")
            .select('p')
            .html( cutoffsAsText() );
        
        // log the cutoffs
        console.log(age_chart_info.brush.extent())
        console.log(sex_chart_info.filterVar)
        console.log(tas_chart_info.brush.extent())
        console.log(department_chart_info.filterVar)

        // filter and update sex chart
        var filtered_data = filterData(data, "sex" )
        sex_map = filtered_data.map( function (i) { return i.sex; } )
        updateCategoryChart(sex_map,sex_chart_info)

        // filter and update age chart
        var filtered_data = filterData(data, "age" )
        age_map = filtered_data.map( function (i) { return parseInt(i.age); } )
        updateChartNumbers(age_chart_info , age_map)

        // filter and update timeAtSea chart
        var filtered_data = filterData(data, "timeAtSea" )
        tas_map = filtered_data.map( function (i) { return parseFloat(i.timeAtSea.replace(",",".")); })
        updateChartNumbers(tas_chart_info, tas_map)

        // filter and update department chart
        var filtered_data = filterData(data, "department" )
        department_map = filtered_data.map( function (i) { return i.department; } )
        updateCategoryChart(department_map,department_chart_info)

        // filter and update year chart
        var filtered_data = filterData(data, "year" )
        year_map = filtered_data.map( function (i) { return i.year; } )
        updateCategoryChart(year_map,year_chart_info)

        // filter and update civilstatus chart
        var filtered_data = filterData(data, "civilstatus" )
        civilstatus_map = filtered_data.map( function (i) { return i.civilstatus; } )
        updateCategoryChart(civilstatus_map,civilstatus_chart_info)

        // filter and update ships chart
        var filtered_data = filterData(data, "ships" )
        ships_map = filtered_data.map( function (i) { return i.ships; } )
        updateCategoryChart(ships_map,ships_chart_info)

        // filter and update q1 chart
        var filtered_data = filterData(data, "q1" )
        q1_map = filtered_data.map( function (i) { return i.q1; } )
        updateCategoryChart(q1_map,q1_chart_info)
        
        // filter and update q1 chart
        var filtered_data = filterData(data, "q15" )
        q15_map = filtered_data.map( function (i) { return i.q15; } )
        updateCategoryChart(q15_map,q15_chart_info)
        
        // filter and update questions charts
        var question_names = ["q2","q3","q4_1","q4_2","q4_3","q5_1","q5_2","q5_3","q6_1","q6_2","q6_3","q7_1","q7_2","q7_3","q8_1","q8_2","q8_3","q9","q10","q11","q12_1","q12_2","q12_3","q13","q14"]
        for (index in question_names) {
            qname = question_names[index]
            
            var filtered_data = filterData(data, qname )
            map = filtered_data.map( function (i) { return parseInt(i[qname]); } )
            updateChartNumbers(questions_chart_info[qname] , map)
        }


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
    function filterData(data,skip) {
        
        if (skip != "age" )        { data = brushFilter(   data,age_chart_info.brush.extent(),  "age") }
        if (skip != "timeAtSea" )  { data = brushFilter(   data,tas_chart_info.brush.extent(),  "timeAtSea")}
        if (skip != "department" ) { data = categoryFilter(data, department_chart_info.filterVar,"department")}
        if (skip != "sex" )        { data = categoryFilter(data,        sex_chart_info.filterVar,"sex")}
        if (skip != "ships" )      { data = categoryFilter(data,      ships_chart_info.filterVar,"ships")}
        if (skip != "civilstatus" ){ data = categoryFilter(data,civilstatus_chart_info.filterVar,"civilstatus")}
        if (skip != "year" )       { data = categoryFilter(data,       year_chart_info.filterVar,"year")}
        if (skip != "q1" )         { data = categoryFilter(data,         q1_chart_info.filterVar,"q1")}
        if (skip != "q15" )        { data = categoryFilter(data,        q15_chart_info.filterVar,"q15")}


        for (index in question_names) {
            tmp_qname = question_names[index]
            if (skip != tmp_qname )  {
                data = brushFilter(   data,questions_chart_info[tmp_qname].brush.extent(),  tmp_qname)
            }
        }
        
        return data
    }
    function cutoffsAsText() {
        text =  ""

        text += "Sexs is: "
        for (tmp_name in sex_chart_info.filterVar) {
            if (sex_chart_info.filterVar[tmp_name]) {
                text += tmp_name + " "
            }            
        }

        text += "<br>Age range from "
        if (age_chart_info.brush.extent()[0] == age_chart_info.brush.extent()[1]) {
            text += "NoFilter"
        }else{
            text += precise_round(age_chart_info.brush.extent()[0],1)+" to "+precise_round(age_chart_info.brush.extent()[1],1)+"."
        }

        text += "<br>Time at sea range from "
        if (tas_chart_info.brush.extent()[0] == tas_chart_info.brush.extent()[1]) {
            text += "NoFilter"
        }else{
            text += precise_round(tas_chart_info.brush.extent()[0],1)+" to "+precise_round(tas_chart_info.brush.extent()[1],1)+"."
        }
        
        text += "<br>Departments is : "
        for (tmp_name in department_chart_info.filterVar) {
            if (department_chart_info.filterVar[tmp_name]) {
                text += tmp_name + " "
            }            
        }

        text += "<br>Year is : "
        for (tmp_name in year_chart_info.filterVar) {
            if (year_chart_info.filterVar[tmp_name]) {
                text += tmp_name + " "
            }            
        }
        
        text += "<br>Civilstatus is : "
        for (tmp_name in civilstatus_chart_info.filterVar) {
            if (civilstatus_chart_info.filterVar[tmp_name]) {
                text += tmp_name + " "
            }            
        }
        
        text += "<br>Ships is : "
        for (tmp_name in ships_chart_info.filterVar) {
            if (ships_chart_info.filterVar[tmp_name]) {
                text += tmp_name + " "
            }            
        }
        return text
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

    // stolen from http://stackoverflow.com/questions/1726630/formatting-a-number-with-exactly-two-decimals-in-javascript
    function precise_round(num, decimals) {
        var t=Math.pow(10, decimals);   
        return (Math.round((num * t) + (decimals>0?1:0)*(Math.sign(num) * (10 / Math.pow(100, decimals)))) / t).toFixed(decimals);
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
            .domain([0, 1+d3.max(data_map)])
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
    function makeCategoryChart(data,divId,rotate) {

        var histogram = countUniqStrings(data,data)
    
        // create the scales for the x and y axes for the age histogram
        var y = d3.scale.linear()
            .domain([0, d3.max(histogram.map( function (i) { return i.count; } ) )])
            .range([height-move_down, 0]);

        var x = d3.scale.ordinal()
            .domain(getUniqStrings(data))
            .rangeBands([0, (width-move_left)]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale( y )
            .orient("left");

        // define the image canvas to paint on
        var canvas = d3.select(divId).append("svg")
            .attr("width",width)
            .attr("height",height + padding )
            .append("g")
                .attr( "transform", "translate( " + move_left + " ,  " + move_down + "  )" ) ;

        // add y axis text
        var y_axis_text_group = canvas.append("g")
            .style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})
            .call(yAxis);

        var filterVar = makeFilterVar(data);
        barWidth = ((width-move_left)/getUniqStrings(data).length)
        
        // add the bars for the bins in the histogram
        var bars = canvas.selectAll("rect")
            .data(histogram)
            .enter()
            .append("svg:rect")
                .attr("x", function (d) { return x(d.name) } )
                .attr("y", function (d) { return y(d.count) } )
                .attr("width", function (d) { return barWidth } )
                .attr("height", function (d) { return y(0) - y(d.count) } )
                .on("click", function (d) {
                    if (filterVar[d.name]) {
                        filterVar[d.name] = 0
                        d3.select(this).style("fill","steelblue")
                    }else{
                        filterVar[d.name] = 1
                        d3.select(this).style("fill","black")
                    }
                    update()
                })
        
                // add x axis text
        var x_axis_text_group = canvas.append("g")
            .attr("transform","translate(0," + (height-move_down) + ")" )
            .style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})
            .call(xAxis)
            .selectAll("text")
//                .attr("y", 10)
//                .attr("x", 0)
                //.attr("dy", ".35em")
                //.attr("transform", "rotate(90)")
                //.style("text-anchor", "start");
        
        if (rotate) {
            x_axis_text_group
                .attr("transform", "rotate(90)")
                .attr("y", -5)
                .attr("x", -height)
                .style("text-anchor", "start")
                .style("z-index", 0);
        }else{
            x_axis_text_group
                .attr("y", 10)
                .attr("x", 0)
        }
        
        return {"canvas":canvas, "y_scale":y, "yAxis":yAxis, "y_axis_text_group":y_axis_text_group, "barWidth":barWidth, "filterVar":filterVar, "categories":getUniqStrings(data)}
    }
    function updateCategoryChart(data,chart_info) {

        var histogram = countUniqStrings(data, chart_info.categories)
            
        // update the axes max values
        chart_info.y_scale.domain([0, d3.max(histogram.map( function (i) { return i.count; } ) )])

        // make the y axis transition
        chart_info.y_axis_text_group.transition()
            .duration(1000)
            .call(chart_info.yAxis);
        
        // repaint the bars with the new histogram data
        chart_info.canvas.selectAll("rect")
                .data(histogram)
                .transition()
                    .duration(1000)
                    .attr("y", function (d) { return chart_info.y_scale(d.count) } )
                    .attr("height", function (d) { return chart_info.y_scale(0) - chart_info.y_scale(d.count) } )
    }
})