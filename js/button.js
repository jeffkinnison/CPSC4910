window.onload = function() {
	var button = document.getElementById("btn-generate");

	var preset1;
	var preset2;

	var severe;
	var moderate;
	var suggestion;

    // add onclick event 
	button.onclick = function() { 
		preset1 = $("#p1").bootstrapSwitch('state');
		preset2 = $("#p2").bootstrapSwitch('state');

		severe = $('#sev').is(':checked');
		moderate = $('#mod').is(':checked');
		suggestion = $('#sug').is(':checked');
		
		window.location.href = "results.html?p1="+preset1+"&p2="+preset2+"&sev="+severe+"&mod="+moderate+"&sug="+suggestion;
	}
}