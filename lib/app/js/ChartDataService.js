(function() {
	var ChartDataService = function() {
		
		function getData(success) {
			success(getRandomData());
		}

		return {
			getData: getData
		}
	};
	
	function getRandomData() {
		var count=parseInt(5+Math.random()*10, 10);
		var values = [];
		var sum = 0;
		while(count--) {
			var val = (count===1) ? (100-sum) : (parseInt(Math.random()*(100-sum), 10));
			values.push(val);
			sum += val;
		}
		var chartVal1 = Math.random()*40;
		return {
			dValues: values,
			pValues: [chartVal1, 100-chartVal1] 
		}
	}
	
	window.ChartDataService = ChartDataService;
}());