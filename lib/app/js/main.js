(function($) {
	var chartDataService = new ChartDataService();
	$(function() {
		var data = chartDataService.getData(onSuccess);
		
		function onSuccess(data) {
			$("#chart").pieAndDonutChart({
				chartData: {
					donut: {
						values: data.dValues
					},
					pie: {
						values: data.pValues
					}
				} 
			});
		}
	});
}(jQuery));