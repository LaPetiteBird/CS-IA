
//SUVAT variables;
var sf, u, vf, vp, a, tf, tp, sp, ang, xypresent, sfzero, sx, angle, uy, knowntype;

function shiftSys(){
	
	switch ($("#system").val()){
		case "freefall":
			console.log("freefall mode");
			var $optionsAcc = $("<select id='acc' onchange='shiftAcc()'><option value='choose'>choose downward acceleration </option><option value = '-9.8'>-9.8</option> <option value = '-9.81'>-9.81</option><option value = '-10'>-10</option> <option value = 'other'>other</option></select>");
			$("#setting").append($optionsAcc);
			$("#setting").append('<span id="appendage">m/s<sup>2</sup></span>.');
			break;
		case "accelerated":
			a = 1;
			console.log("accelerated mode");
	}
}
//flag to prevent creating custom inputs for acceleration everytime it's changed
var presentAcc = false;
function shiftAcc(){	
	switch($("#acc").val()){

		case "other":
			//can't get the input value
			var $custAcc = $("<input id = 'cust' onchange='shiftAcc()'>");
			a = $('#cust').val();
			$('#appendage').remove();
			if (!presentAcc){
				$("#setting").append($custAcc, 'm/s<sup>2</sup>');
				presentAcc = true;
			}
			console.log("custom");
			break;

		default:
			a = $("#acc").val();
			console.log("default accs");
	}
}

function shiftDis(){
	switch($("#lands").val()){
		case "lands":
			sf = 0;
			console.log("sf 0");
			sfzero=true;
			break;
		case "reaches":
			sf = "enter user input";
			console.log("sf ui");
			break;
		case "other":
			console.log("sf user custom");
	}
}

//default ang since default angle is 90 - vertical
angle = Math.PI/2;
//flag to prevent appending angleEl over and over again
var presentDir = false;
function shiftDir(){
	switch($("#direction").val()){
		case "angle":
			var $angleEl = $("<input type=number id='angle' onchange='shiftDir()'>");
			if(!presentDir){
				$("#dirspan").append($angleEl);
				$("#dirspan").append('degrees');
				presentDir=true;
			}						
			//angle in radians
			angle = $('#angle').val()*Math.PI/180;
			//ang is a constant to find uy
			// ang = Math.sin(angle);
			
			xypresent = true;
			break;
	}
}

var knownPresent = false
function shiftKnown(){
	switch($("#known").val()){
		case "Vi":
			knowntype = 'Initial velocity(m/s)';
			console.log("initial velocity given");
			if (!knownPresent) {
				$('#description').append('m/s.');
				knownPresent=true;
			}			
			u = $("#val").val();
			// uy = u*Math.sin(angle);
			// ux = u*Math.cos(angle);
			
			break;
		case "Vf":
			knowntype = 'Final velocity(m/s)';
			console.log("final velocity given");
			if (!knownPresent) {
				$('#description').append('m/s.');
				knownPresent=true;
			}			
			vf = $("#val").val();
			//calculating u from vf. note sf zero bc projectile landed back on the ground
			if(sfzero){
				tf=2*vf/a;
			}
			u = vf - a*tf;
			break;
		case "Tf":
			console.log("final time given");
			knowntype = 'Final time(s)';
			if (!knownPresent) {
				$('#description').append('s.');
				knownPresent=true;
			}
			tf = $("#val").val();
			u = (sf-(a*Math.pow(tf, 2)))/(2*tf);
			if(sfzero){
				u = -0.5*a*tf;
 			}
 			break;
 		case "Tp":
 			knowntype = 'Time of the peak(s)';
 			console.log("time of the peak given");
			if (!knownPresent) {
				$('#description').append('s.');
				knownPresent=true;
			}
			tp = $("#val").val();
			u = (sf-(a*Math.pow(2*tp, 2)))/(2*2*tp);
			if(sfzero){
				u = -a*tp;
 			}
 			break;
 		case "Vp":
 			knowntype = 'Velocity at a point(m/s)';
 			console.log("velocity given at a point");
			if (!knownPresent) {
				var $extraEl = $("<select id='extraPoint'><option value='time'>in time</option><option value='space'>at height</option> </select><input id='extrainput'><span id='appx'></span>");
				
				$('#extra').append($extraEl);
				$('#description').append('m/s.');
				knownPresent=true;
			}
			vp = $("#val").val();
			switch($("#extraPoint").val()){
					case "time":
						console.log("point in time given");
						tf = $("#extrainput").val();
						$("#appx").append('s');
						break;
					case "space":
						console.log("point at height given");
						sp = $("#extrainput").val();
						//going back to finding the time:
						tf = (vp-Math.sqrt(Math.pow(vp, 2)-2*a*sp))/a;
						$("#appx").append('m');
						break;
			}
			u=vp-(a*tf);
			break;	



	}
	uvecomponents(u, angle);
}
//calculating x and y components of a vector (here - u)
function uvecomponents(vector, angie){
	uy = vector*Math.sin(angie);
	ux = vector*Math.cos(angie);
}


function calculate(){
	$('body').append('<div id="graphscont"><h1>The Graphs</h1></div><div id="allresults">All results:</div><div id="solcontent"><h1>The solutions</h1><h3>Known quantities:</h3><table id="knowns"><tr><th>Quantity</th><th>Value</th></tr><tr><td>Downward acceleration(m/s<sup>2</sup>):</td><td id="tabacc"></td></tr><tr><td>Displacement(m):</td><td id="tabdis"></td></tr><tr><td class="tabknown"></td><td class="tabknownval"></td></tr></table><p>Based on these three quantities, everything else can be calculated using SUVAT equations as follows:</p><h3>Step 1</h3><p>Start by listing all relevant quantities from the given information (conditions of the problem). Sometimes they are implicit, like magnitude of downward acceleration equal to 9.8m/s<sup>2</sup> when the action takes place on Earth, or total displacement equal to zero, when it is stated that it lands back on the ground. Once this system is clear, you only need one more quantity, which, once again, will be present in the problem description. Here, it is: </p> <span class="tabknown"></span>=<span class="tabknownval"></span>.<h3>Step 2</h3><p>Find a SUVAT formula that contains all of your known quantities, and one unknown you are interested in. You can use this table below with all variations of rearranged equations:</p><img src="https://jameskennedymonash.files.wordpress.com/2016/11/suvat-rearranged1.png?w=724"><h3>Step 3</h3><p>Check your results against the graphs above. </p></div>');
	var $grapht = $("<div id='grapht' style='border:solid'></div>");
	$("#graphscont").append($grapht);
	var ura = uy+'x';
	var ara = 0.5*a+"x^2";
	var func1 = ura+ara;
	console.log('ura', ura);
	console.log('func1', func1);

	//calculating final time
	tf = (Math.sqrt((2*a*sf)+Math.pow(u, 2))-uy)/a;
	if(sfzero){
		tf = -2*uy/a;
	}
	tp = tf/2;
	vf = -u;

	//sx - displacement in x direction (horizontal), as opposed to height
	sx = ux*tf;
	//using example of functionplot.js
	var params1 = {
	  target: '#grapht',
	  title: 'height vs time',
	  data: [{
	    fn: func1,
	    derivative:{
	    	fn: uy+a+'x',
	    	updateOnMouseMove: true
	    }, 
	    color: 'red'
	 }],
	  grid: true,
	  yAxis: {
	  	//domain: [-10, 10],
	  	label: 'height(m)'
	  },
	  xAxis: {
	  	label: 'time(s)',
	  	domain: [0, 10]
	  }
	};
	//params1.data[0].fn = func1;
	functionPlot(params1);

	if (xypresent) {
		var $graphxy = $("<div id='graphxy' style='border:solid'></div>")
		$("#graphscont").append($graphxy);
		var ura2 = Math.tan(angle)+"x";
		var ora2 = a/(2*Math.pow(u, 2)*Math.pow(Math.cos(angle), 2));
		var ara2 = ora2+"x^2";
		var func2 = ura2+ara2;
		console.log('ura2', ura2);
		console.log('func2', func2);
		var params2 = {
		  target: '#graphxy',
		  title: 'Trajectory of projectile',
		  data: [{
		    fn: func2, 
		    color: 'blue'
		 }],
		  grid: true,
		  yAxis: {
		  	//domain: [-10, 10],
		  	label: 'height(m)'
		  },
		  xAxis: {
		  	label: 'x distance(m)',
		  	domain: [0, 10]
		  }
		};
	//params2.data[0].fn = func2;
	functionPlot(params2);
	}
	$("#tabacc").text(a);
	$("#tabdis").text(sf);
	$(".tabknown").text(knowntype);
	$(".tabknownval").text($('#val').val());
	var ures='Initial velocity(m/s) u='+u;
	var vres='Final velocity(m/s) v='+vf;
	var tfres='Final(total) time(s) tf='+tf;
	var tpres='Time of the peak(s) tp='+tp;
	var sxres='Horizontal displacement(m) sx='+sx;
	$("#allresults").append(ures+' .'+vres+' .'+tfres+' .'+tpres+' .'+sxres);
	

}
