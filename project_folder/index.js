      
       // To get DOM attribute of aframe elements in javascript --> document.getElementById("main").getDOMAttribute('geometry').width;

       var ewidth = document.getElementById("main").getDOMAttribute('geometry').width;
       //  console.log(ewidth);
             
       // Accessing the main DOM entity which acts as a placeholder for the three axes. Giant Invisible box with predefined width, height and depth.
           
          var entity = d3.select("a-scene").select("#main");
       
       //Padding for x y and z axis
         var padding = -7.5;
       
       //convert csv to array for months(string)
         var months = [];
       
     
       // Loading csv file and converting it into array of objects with proper data-type ***  IMPORTANT: Asynchronous method first above then third call and second function itself executes OR just put the entire logic code inside this function ****
       
      
       
       d3.csv("./data/bank-additional - Copy.csv", function(error, data){
           data.forEach(function(d) {
               d.age = parseInt(d.age);
               d.campaign = +d.campaign;
               d["cons.conf.idx"] = +d["cons.conf.idx"];
               d["cons.price.idx"] = +d["cons.price.idx"];
               d.duration = +d.duration;
               d["emp.var.rate"] = +d["emp.var.rate"];
               d.euribor3m = +d.euribor3m;
               d["nr.employed"] = +d["nr.employed"];
               d.pdays = +d.pdays;
               d.previous = +d.previous;
               
            //   console.log(d);
               months.push(d.month);
               months;
           });
           
           // x scale age variable
           var xscale = d3.scaleLinear()
                          .domain([d3.min(data, function(d) { return d.age; }),d3.max(data, function(d) { return d.age; })])
                          .range([padding , (2 * ewidth)-padding]);
         //  console.log(xscale.invert(-7.5));
           
           
           
           // y scale duration variable
           var yscale = d3.scaleLinear()
                          .domain([d3.max(data, function(d) { return d.duration; }),d3.min(data, function(d) { return d.duration; })])
                          .range([(2 * ewidth)-padding , padding]);
           
           
           // z scale months variable
           var zscale = d3.scalePoint()
                          .domain(months)
                          .range([padding , (2 * ewidth)-padding]);
           
           // size campaign variable
           var size = d3.scaleLinear()
                        .domain([d3.min(data, function(d) { return d.campaign; }),d3.max(data,function(d){ return d.campaign; })])
                        .range([0.2,0.8])
           
           // color job variable
              var color = d3.scaleOrdinal(d3.schemePaired);
           
           //color marital status
           var colorm = d3.scaleOrdinal(d3.schemeSet2);
           
           //color education
           var colore = d3.scaleOrdinal(d3.schemePaired);
           
         //  console.log(xscale(18)); 
          // console.log(zscale.step());
         //  console.log(yscale(3643));
         //  console.log(color(15));
           
        //   var tooltest = document.getElementById('test');
           
         var tooltest = document.querySelector('#test');
           
           // x-axis  2 * ewidth = 16 units for axis line. for the empty placeholder its a bit different
        
           entity.append("a-entity")
                 .attr("meshline","path : -"+ewidth+" -8 -8, "+ ewidth*3 +" -8 -8; lineWidth : 5; color : #000;");
        //         .call(xaxis);     
           
           // y-axis
           
           entity.append("a-entity")
                 .attr("meshline","path : -8 -"+ewidth+" -8,-8 "+ ewidth*3 +" -8; lineWidth : 5; color : #000;");
           
           
           // z-axis 
           
           entity.append("a-entity")
                 .attr("meshline","path : -8 -8 -"+ewidth+",-8 -8 "+ ewidth*3+"; lineWidth : 5; color : #000;");
     
        
           // boxes for the data itself. less polygons less rendering time
           
           entity.select("#sub").selectAll("a-box")
                 .data(data)
                 .enter().append("a-box")
                 .attr("position", function(d,i){
                 var x = xscale(d.age);
                 var y = yscale(d.duration);
                 var z = zscale(months[i]);
                               
                 return x +" "+ y +" "+ z;
             })
                 .attr("geometry","segmentsHeight : 1; segmentsWidth : 1")
                 .attr("material",function(d){
                         return "color : " + colorm(d.marital);
             })
                 .attr("geometry",function(d,i){
                   return "width :" + size(d.campaign) + ";depth :" + size(d.campaign) + "; height :" + size(d.campaign);
             })
                 .on("click",function(d,i){
                //     console.log(months[i])
                     tooltest.emit('fade')
                     tooltest.setAttribute('visible','true')
                  //   console.log(d3.select(this).size())
                     tooltest.setAttribute("text",{
                                       value : 
                                        "Age (X axis) :\t\t\t\t\t\t\t " + d.age + "\n" +
                                        "Month (Z axis) :\t\t\t\t\t\t " + months[i] + "\n" +
                                        "Duration (Y axis) :\t\t\t\t\t " + d.duration + " secs \n" +
                                        "Job Type :\t\t\t\t\t\t\t\t   " + d.job + "\n" + 
                                        "Marital Status :\t\t\t\t\t\t  " + d.marital + "\n" +
                                        "Education :\t\t\t\t\t\t\t\t " + d.education + "\n" +
                                        "Campaign :\t\t\t\t\t\t\t\t " + d.campaign + "\n" +
                                        "Default :\t\t\t\t\t\t\t\t\t  " + d.default + "\n" +
                                        "Housing :\t\t\t\t\t\t\t\t    " + d.housing + "\n" +
                                        "Loan :\t\t\t\t\t\t\t\t\t\t  " + d.loan,
                                       align : 'left',
                                       anchor : 'center',
                                       width : 2,
                                       color : 'white',
                     })
            //    setTimeout(function(){tooltest.setAttribute('visible','false')},10000)
     
             })
                 .on("mouseenter",function(d,i){
             //  console.log(d3.rgb(color(d.job)))
                     d3.select(this)
                       .attr("scale","1.5 1.5 1.5")
           })
                 .on("mouseleave",function(d,i){
                     d3.select(this)
                       .attr("scale","1 1 1")
           })
           
          /*     .transition()                         // Animation for the term deposit YES
                 .duration(1000)
                 .ease(d3.easeElasticInOut)
                 .on("start", function repeat() {
                           d3.active(this)
                             .attr("rotation", function(d){
                               if(d.y === "yes")
                                   return "0 90 0";
                           })
                             .transition().ease(d3.easeElasticInOut)
                             .attr("rotation", function(d){
                               if(d.y === "yes")
                                   return "0 0 0";})
                             .transition().ease(d3.easeElasticInOut)
                             .on("start", repeat);
             });
             
          */
          // console.log("Total points"+entity.selectAll('a-box').size());
 
           
           var legendMarital = document.querySelector('#legend_marital');
           var legendJob = document.querySelector('#legend_job');
           var legendEdu = document.querySelector('#legend_edu');
           
           var jobtype = document.querySelector('#jobtype');
           var edu = document.querySelector('#education');
           var marital = document.querySelector('#marital');
           
           
           jobtype.addEventListener('click',function(){
               entity.selectAll('a-box').attr('material',function(d){
                   return "color :" + color(d.job);
               })
 
               legendMarital.setAttribute('visible','false');
               legendJob.setAttribute('visible','true');
               legendEdu.setAttribute('visible','false');
               
               jobtype.setAttribute('material','src','assets/jobtype_1_selected.png');
               edu.setAttribute('material','src','assets/education_1.png');
               marital.setAttribute('material','src','assets/marital_1.png');
               
           })
           
           
           edu.addEventListener('click',function(){
               entity.selectAll('a-box').attr('material',function(d){
                   return "color :" + colore(d.education);
               })
               
               legendMarital.setAttribute('visible','false');
               legendJob.setAttribute('visible','false');
               legendEdu.setAttribute('visible','true');
               
               
               jobtype.setAttribute('material','src','assets/jobtype_1.png');
               edu.setAttribute('material','src','assets/education_1_selected.png');
               marital.setAttribute('material','src','assets/marital_1.png');
               
           })
           
           
           
           marital.addEventListener('click',function(){
               entity.selectAll('a-box').attr('material',function(d){
                   return "color :" + colorm(d.marital);
               })
               
               legendMarital.setAttribute('visible','true');
               legendJob.setAttribute('visible','false');
               legendEdu.setAttribute('visible','false');
               
               
               jobtype.setAttribute('material','src','assets/jobtype_1.png');
               edu.setAttribute('material','src','assets/education_1.png');
               marital.setAttribute('material','src','assets/marital_1_selected.png');
               
           })
         
           
           
           
         var el = document.querySelector('#cam');
         var toggle = document.getElementById('toggle');
         var status = true;
           
           el.addEventListener("gamepadbuttondown",function(e){
              
               var gp = navigator.getGamepads()[0];
               console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",gp.index, gp.id,gp.buttons.length, gp.axes.length);
               
               if(gp.buttons[0].pressed == true){
                   
                     console.log(e.value);
                     tooltest.setAttribute('visible','false');
                   
                   }
               
              if(gp.buttons[1].pressed == true && status == true){
                 toggleDataAttributes('false');
                 status = false;
               } else if(gp.buttons[1].pressed == true && status == false){
                 toggleDataAttributes('true');
                 status = true;
               } 
              
           });
          
            
           window.addEventListener("keypress", keyPress, false);
           window.addEventListener("keydown", keyDown, false);
           
           function keyPress(e){
               if(e.keyCode == "120" || e.keyCode == "88"){
                //   console.log("X is pressed");
                   tooltest.setAttribute('visible','false');
               }
            
           }
           
           function keyDown(e){
               if(e.keyCode=="104" || e.keyCode == "72" && status == true){
                 toggleDataAttributes('false');
                 status = false;
               }
               else if(e.keyCode=="104" || e.keyCode == "72" && status == false){
                 toggleDataAttributes('true');
                 status = true;
               }
           }
 
           function toggleDataAttributes(value){
             toggle.setAttribute('visible', value);
             marital.setAttribute('visible', value);
             edu.setAttribute('visible', value);
             jobtype.setAttribute('visible', value);
           }
           
            
            
       
       });