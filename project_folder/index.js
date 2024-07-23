
var ewidth = document.getElementById("main").getAttribute('geometry').width;
// Accessing the main DOM entity which acts as a placeholder for the three axes. Giant Invisible box with predefined width, height and depth.
var entity = d3.select("a-scene").select("#main");
//Padding for x y and z axis
var padding = -7.5;
//convert csv to array for months(string)
var months = [];


d3.csv("./data/bank-additional - Copy.csv", function (error, data) {
    data.forEach(function (d) {
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

        months.push(d.month);
        months;
    });

    // x scale age variable
    var xscale = d3.scaleLinear()
        .domain([d3.min(data, function (d) { return d.age; }), d3.max(data, function (d) { return d.age; })])
        .range([padding, (2 * ewidth) - padding]);

    // y scale duration variable
    var yscale = d3.scaleLinear()
        .domain([d3.max(data, function (d) { return d.duration; }), d3.min(data, function (d) { return d.duration; })])
        .range([(2 * ewidth) - padding, padding]);

    // z scale months variable
    var zscale = d3.scalePoint()
        .domain(months)
        .range([padding, (2 * ewidth) - padding]);

    // size campaign variable
    var size = d3.scaleLinear()
        .domain([d3.min(data, function (d) { return d.campaign; }), d3.max(data, function (d) { return d.campaign; })])
        .range([0.2, 0.8])

    // color job variable
    var color = d3.scaleOrdinal(d3.schemePaired);
    //color marital status
    var colorm = d3.scaleOrdinal(d3.schemeSet2);
    //color education
    var colore = d3.scaleOrdinal(d3.schemePaired);

    var tooltest = document.querySelector('#test');
    // x-axis  2 * ewidth = 16 units for axis line. for the empty placeholder its a bit different
    entity.append("a-entity").attr("line","start: -"+ewidth+" -8 -8, end: "+ ewidth*3 +" -8 -8; color: #000");
    // // y-axis
    entity.append("a-entity").attr("line","start: -8 -"+ewidth+" -8, end:-8 "+ ewidth*3 +" -8; color: #000;");
    // // z-axis 
    entity.append("a-entity").attr("line","start: -8 -8 -"+ewidth+", end: -8 -8 "+ ewidth*3+"; color: #000;");


    // boxes for the data itself. less polygons less rendering time
    entity.select("#sub").selectAll("a-box")
        .data(data)
        .enter().append("a-box")
        .attr("position", function (d, i) {
            var x = xscale(d.age);
            var y = yscale(d.duration);
            var z = zscale(months[i]);

            return x + " " + y + " " + z;
        }).attr("geometry", "segmentsHeight: 1; segmentsWidth: 1")
            .attr("material", function (d) {
            return "color: " + colorm(d.marital);
        }).attr("geometry", function (d, i) {
            return "width:" + size(d.campaign) + ";depth:" + size(d.campaign) + "; height:" + size(d.campaign);
        }).on("click", function (d, i) {
            tooltest.emit('fade')
            tooltest.setAttribute('visible', 'true')
            tooltest.setAttribute("text", {
                value:
                    "Age (X axis):\t\t\t\t\t\t\t " + d.age + "\n" +
                    "Month (Z axis):\t\t\t\t\t\t " + months[i] + "\n" +
                    "Duration (Y axis):\t\t\t\t\t " + d.duration + " secs \n" +
                    "Job Type:\t\t\t\t\t\t\t\t   " + d.job + "\n" +
                    "Marital Status:\t\t\t\t\t\t  " + d.marital + "\n" +
                    "Education:\t\t\t\t\t\t\t\t " + d.education + "\n" +
                    "Campaign:\t\t\t\t\t\t\t\t " + d.campaign + "\n" +
                    "Default:\t\t\t\t\t\t\t\t\t  " + d.default + "\n" +
                    "Housing:\t\t\t\t\t\t\t\t    " + d.housing + "\n" +
                    "Loan:\t\t\t\t\t\t\t\t\t\t  " + d.loan,
                anchor: 'center',
                width: 2,
                color: 'white',
            })
        }).on("mouseenter", function (d, i) {
            d3.select(this).attr("scale", "1.5 1.5 1.5")
        }).on("mouseleave", function (d, i) {
            d3.select(this).attr("scale", "1 1 1")
        });

    var legmarital = document.querySelector('#legmarital');
    var legjob = document.querySelector('#legjob');
    var legedu = document.querySelector('#legedu');

    var jobtype = document.querySelector('#jobtype');
    var edu = document.querySelector('#education');
    var marital = document.querySelector('#marital');


    jobtype.addEventListener('click', function () {
        entity.selectAll('a-box').attr('material', function (d) {
            return "color:" + color(d.job);
        })

        legmarital.setAttribute('visible', 'false');
        legjob.setAttribute('visible', 'true');
        legedu.setAttribute('visible', 'false');

        jobtype.setAttribute('material', 'src', 'assets/jobtype_1_selected.png');
        edu.setAttribute('material', 'src', 'assets/education_1.png');
        marital.setAttribute('material', 'src', 'assets/marital_1.png');

    })

    edu.addEventListener('click', function () {
        entity.selectAll('a-box').attr('material', function (d) {
            return "color:" + colore(d.education);
        })

        legmarital.setAttribute('visible', 'false');
        legjob.setAttribute('visible', 'false');
        legedu.setAttribute('visible', 'true');


        jobtype.setAttribute('material', 'src', 'assets/jobtype_1.png');
        edu.setAttribute('material', 'src', 'assets/education_1_selected.png');
        marital.setAttribute('material', 'src', 'assets/marital_1.png');

    })

    marital.addEventListener('click', function () {
        entity.selectAll('a-box').attr('material', function (d) {
            return "color:" + colorm(d.marital);
        })

        legmarital.setAttribute('visible', 'true');
        legjob.setAttribute('visible', 'false');
        legedu.setAttribute('visible', 'false');


        jobtype.setAttribute('material', 'src', 'assets/jobtype_1.png');
        edu.setAttribute('material', 'src', 'assets/education_1.png');
        marital.setAttribute('material', 'src', 'assets/marital_1_selected.png');

    })

    var el = document.querySelector('#cam');
    var toggle = document.getElementById('toggle');
    var status = true;

    el.addEventListener("gamepadbuttondown", function (e) {

        var gp = navigator.getGamepads()[0];
        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", gp.index, gp.id, gp.buttons.length, gp.axes.length);

        if (gp.buttons[0].pressed == true) {
            console.log(e.value);
            tooltest.setAttribute('visible', 'false');
        }

        if (gp.buttons[1].pressed == true && status == true) {
            toggleDataAttributes('false');
            status = false;
        } else if (gp.buttons[1].pressed == true && status == false) {
            toggleDataAttributes('true');
            status = true;
        }

    });

    window.addEventListener("keypress", onKeyPress, false);
    window.addEventListener("keydown", onKeyDown, false);

    function onKeyPress(e) {
        if (e.keyCode == "120" || e.keyCode == "88") {
            tooltest.setAttribute('visible', 'false');
        }

    }

    function onKeyDown(e) {
        if (e.keyCode == "104" || e.keyCode == "72" && status == true) {
            toggleDataAttributes('false');
            status = false;
        }
        else if (e.keyCode == "104" || e.keyCode == "72" && status == false) {
            toggleDataAttributes('true');
            status = true;
        }
    }

    function toggleDataAttributes(value) {
        toggle.setAttribute('visible', value);
        marital.setAttribute('visible', value);
        edu.setAttribute('visible', value);
        jobtype.setAttribute('visible', value);
    }

    console.log = function () { }

});