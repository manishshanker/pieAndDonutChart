/**
 * Copyright 2012 Manish Shanker
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @author Manish Shanker
 * Based on RaphaelJS pie chart. 
 */

(function($, Raphael) {
	"use strict";

	if ($) {
		var defaultChartOptions = {
			donut: {
				bcolors: ["#324158", "#4590C1", "#1CAEFF", "#D4FFFF", "#8EF3FF", "#9BA18E", "#A26F90", "#5D2123", "#3F5267", "#0C61AE", "#5FADB8", "#4B6A25", "#00A9EE"]
			},
			pie: {
				bcolors: ["#FFFFFF","#4B6A25"]
			}
		};
		
		$.fn.pieAndDonutChart = function(options) {
			return this.each(function() {
				var $ele = $(this);
				var size = $ele.width();
				if ($ele.height() !== size) {
					throw new Error("Height and Width needs to be same");
				}
				options = $.extend(true, {
					centerX: size/2,
					centerY: size/2,
					donutWidth: 20,
					chartData: defaultChartOptions 
				}, options);
				Raphael(this, size, size).pieAndDonutChart(options.centerX, options.centerY, (size/2), (size/2)-options.donutWidth, options.chartData, options.colors, options.stroke);
			})
		};
	}
	
	Raphael.fn.pieAndDonutChart = function (centerX, centerY, fullRadius, innerRadius, chartData, colors, stroke) {
		var paper = this;
		donutChart.call(paper, centerX, centerY, fullRadius, innerRadius, fullRadius, chartData.donut.values, chartData.donut.labels, chartData.donut.bcolors, colors, stroke);
		pieChart.call(paper, centerX, centerY, innerRadius, chartData.pie.values, chartData.pie.labels, chartData.pie.bcolors, colors, stroke);	
	};

	function pieChart(cx, cy, r, values, labels, bcolors, colors, stroke) {
		var paper = this,
			rad = Math.PI / 180,
			chart = this.set();
		function sector(cx, cy, r, startAngle, endAngle, params) {
			var x1 = cx + r * Math.cos(-startAngle * rad),
				x2 = cx + r * Math.cos(-endAngle * rad),
				y1 = cy + r * Math.sin(-startAngle * rad),
				y2 = cy + r * Math.sin(-endAngle * rad);
			return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
		}
		var angle = 90,
			total = 0,
			start = 0,
			process = function (j) {
				var value = values[j],
					angleplus = 360 * value / total,
					popangle = angle + (angleplus / 2),
					color = (colors && colors[j]) || Raphael.hsb(start, .75, 1),
					ms = 500,
					delta = 30,
					bcolor = (bcolors && bcolors[j]),
					fillColor = bcolor ||  ("90-" + Raphael.hsb(start, 1, 1) + "-" + color); 
					var p = sector(cx, cy, r, angle, angle + angleplus, {fill: fillColor, stroke: stroke || "#ccc", "stroke-width": 1});
				//var txt = paper.text(cx + (r + delta + 55) * Math.cos(-popangle * rad), cy + (r + delta + 25) * Math.sin(-popangle * rad), labels[j]).attr({fill: bcolor, stroke: "none", opacity: 0, "font-size": 20});
				/*p.mouseover(function () {
					p.stop().animate({transform: "s1.1 1.1 " + cx + " " + cy}, ms, "elastic");
					txt.stop().animate({opacity: 1}, ms, "elastic");
				}).mouseout(function () {
					p.stop().animate({transform: ""}, ms, "elastic");
					txt.stop().animate({opacity: 0}, ms);
				});*/
				p.blur(1);
				angle += angleplus;
				chart.push(p);
				//chart.push(txt);
				start += .1;
			};
		for (var i = 0, ii = values.length; i < ii; i++) {
			total += values[i];
		}
		for (i = 0; i < ii; i++) {
			process(i);
		}
		return chart;
	}

	function donutChart(cx, cy, r, rin, rout, values, labels, bcolors, colors, stroke) {
		var paper = this,
			rad = Math.PI / 180,
			chart = this.set();
		function sector(cx, cy, r, r2, startAngle, endAngle, params) {
			var x1 = cx + r * Math.cos(-startAngle * rad),
				x2 = cx + r * Math.cos(-endAngle * rad),
				y1 = cy + r * Math.sin(-startAngle * rad),
				y2 = cy + r * Math.sin(-endAngle * rad),
				xx1 = cx + r2 * Math.cos(-startAngle * rad),
				xx2 = cx + r2 * Math.cos(-endAngle * rad),
				yy1 = cy + r2 * Math.sin(-startAngle * rad),
				yy2 = cy + r2 * Math.sin(-endAngle * rad);
			
			
			return paper.path(["M", xx1, yy1,
							   "L", x1, y1, 
							   "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, 
							   "L", xx2, yy2, 
							   "A", rin, rin, 0, +(endAngle - startAngle > 180), 1, xx1, yy1, "z"]
							 ).attr(params);
			
		}
		
		var angle = 0,
			total = 0,
			start = 0,
			process = function (j) {
				var value = values[j],
					angleplus = 360 * value / total,
					popangle = angle + (angleplus / 2),
					color = (colors && colors[j]) || Raphael.hsb(start, .75, 1),
					ms = 500,
					delta = 30,
					bcolor = (bcolors && bcolors[j]),
					fillColor = bcolor ||  ("90-" + Raphael.hsb(start, 1, 1) + "-" + color),
					p = sector(cx, cy, r, rin,angle, angle + angleplus, {fill: fillColor, stroke: stroke || "#ccc", "stroke-width": 1}),
					bigp = sector(cx, cy, rout, rin, angle, angle + angleplus, {fill: fillColor, stroke: stroke || "#ccc", "stroke-width": 1}).hide();
				//var txt = paper.text(cx + (r + delta + 55) * Math.cos(-popangle * rad), cy + (r + delta + 25) * Math.sin(-popangle * rad), labels[j]).attr({fill: bcolor, stroke: "none", opacity: 0, "font-size": 20});
				p.blur(0.5);	
				angle += angleplus;
				chart.push(p);
				//chart.push(txt);
				start += .1;
			};
		for (var i = 0, ii = values.length; i < ii; i++) {
			total += values[i];
		}
		for (i = 0; i < ii; i++) {
			process(i);
		}
		return chart;
	}
}(jQuery, Raphael));