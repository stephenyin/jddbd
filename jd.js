function getRamdomNumber() {
	var num = "";
	for (var i = 0; i < 6; i++) {
		num += Math.floor(Math.random() * 10);
	}
	return num;
}

function handle_response(response) {
    if (response.result == "200") {
        show_msg("成功抢拍一次...");
    } else {
        show_msg("失败了..." + response.message);
    }
}

chrome.extension.onMessage.addListener(
	function(msg, _, sendResponse) {
		if (msg.add) {
			//var keyText = document.getElementById('bid-info').children[0].children[0].innerText;
			//if (keyText == "即将拍卖") {
			if (0) {
				console.log("Not start yet!!!");
				return true;

				///////time countdown
				var timeString = document.getElementById('product-intro').children[1].children[1].children[4].children[0].innerText;
				var str = timeString.replace("小时", ",").replace("分", ",").replace("秒", ",");
				var strs = new Array(); //定义一数组 
				var secs = 0;
				strs = str.split(","); //字符分割
				if (strs.length == 4) {
					secs = strs[0] * 3600;
					secs += strs[1] * 60;
					secs += parseInt(strs[2]);
				} else if (strs.length == 3) {
					secs = strs[0] * 60;
					secs += parseInt(strs[1]);
				} else if (strs.length == 2) {
					secs = parseInt(strs[0]);
				} else {
					alert("Get left time error:" + timeString);
				}
				console.log("距离开拍:" + strs[0] + ":" + strs[1] + ":" + strs[2]);
				console.log("等待" + secs + "秒" + "开拍");
				sendResponse({
					time: secs
				});

				// setTimeout(function() {
				// 	buyFun(request.price, request.add_price, request.shot_time, request.checkbox);
				// }, (secs + 60) * 1000);
			} else {
				console.log("set price: " + msg.price);
				console.log("set shot-time: " + msg.shot_time);
				var time1 = document.getElementById('auction3Timer').children[0];
				var time2 = document.getElementById('auction3Timer').children[1];
				var time3 = document.getElementById('auction3Timer').children[2];
				var time;
				var counter = 0;
				var secs = 0;

				if (time1) {
					counter++;
					time = time1.innerText;
				}

				if (time2) {
					counter++;
					time += time2.innerText;
				}

				if (time3) {
					counter++;
					time += time3.innerText;
				}

				if (counter == 3) {
					secs = time1.innerText * 3600;
					secs += time2.innerText * 60;
					secs += parseInt(time3.innerText);
				} else if (counter == 2) {
					secs = time1.innerText * 60;
					secs += parseInt(time2.innerText);
				} else if (counter == 1) {
					secs = parseInt(time1.innerText);
				} else {
					alert("Get left time error:" + time);
					return;
				}

				sendResponse({
					time: secs
				});

				ontime_buy(msg.price, msg.shot_time, secs);
			}
		} else if (msg.del) {
			clearTimeout(timeout_id);
		}
	}
);

var ontime_buy = function(uid) {
	var price = parseInt($('#max_price').val(), 10);
	var shot_time = parseInt($('#shot_time').val(), 10);
	var left_time = 0;
	var queryIt;

	console.log("ontime_buy--price: " + price);
	console.log("ontime_buy--shot-time: " + shot_time);
	console.log("ontime_buy--left-time: " + left_time);

	var input = document.getElementById('bidPrice');
	input.value = price;

	var i = self.setInterval(function() {
		queryIt = "http://paimai.jd.com/json/current/englishquery?paimaiId=" + uid + "&skuId=0&t=" + getRamdomNumber() + "&start=0&end=9";
		$.get(queryIt, function(data) {
			console.log("current price: " + data.currentPrice);
			jQuery('#auction3dangqianjia').val(data.currentPrice);
			if (price > data.currentPrice * 1) {
				left_time = get_left_time();
				if (left_time <= shot_time) {
					var buyIt = "http://paimai.jd.com/services/bid.action?t=" + getRamdomNumber() + "&paimaiId=" + uid + "&price=" + price + "&proxyFlag=0&bidSource=0";
					$.get(buyIt, function(data) {
						if (data !== undefined) {
							if (data.result == "200") {
							}
							handle_response(data);
						}
					}, 'json');
				} else {
					show_msg("等待出价( "+ (left_time * 1 - shot_time * 1) + " secs )");
				}
			} else {
				show_msg("超过上限价了，亲爱的...");
			}
		});
	}, 1000);

	// var t = setTimeout(function() {
	// 	buy(price);
	// }, (left_time - shot_time) * 1000);

	return i;
}

var auto_buy = function(uid) {
	var my_price = 0;
	var price = 0;
	var priceMax = parseInt($('#max_price').val(), 10);
	var increase = parseInt($('#increase').val(), 10);
	var queryIt;
	var left_time;

	var i = self.setInterval(function() {
		queryIt = "http://paimai.jd.com/json/current/englishquery?paimaiId=" + uid + "&skuId=0&t=" + getRamdomNumber() + "&start=0&end=9";
		$.get(queryIt, function(data) {
			console.log("current price: " + data.currentPrice);
			if (my_price < data.currentPrice) {
				price = data.currentPrice * 1 + increase;
				jQuery('#auction3dangqianjia').val(data.currentPrice);

				left_time = get_left_time();
				//if (left_time < 10) {
				if (1) {
					if (price <= priceMax) {
						show_msg("抢拍中...");
						var buyIt = "http://paimai.jd.com/services/bid.action?t=" + getRamdomNumber() + "&paimaiId=" + uid + "&price=" + price + "&proxyFlag=0&bidSource=0";
						$.get(buyIt, function(data) {
							if (data !== undefined) {
								if (data.result == "200") {
									my_price = price;
								}
								handle_response(data);
							}
						}, 'json');
					} else {
						show_msg("超过上限价了，亲爱的...");
					}
				} else {
					//show_msg("最后时刻抢拍中...");
				}
			} else {
				show_msg("该商品正在你的手中...");
			}
		});
	}, 200);

	return i;
}
var buy = function(price) {
	console.log("buy--price:" + price);
	var input = document.getElementById('bidPrice');
	input.value = price;

	var btn = document.getElementById('auctionStatus1').children[1].children[0];
	btn.click();
}

var get_left_time = function() {
	var time1 = document.getElementById('auction3Timer').children[0];
	var time2 = document.getElementById('auction3Timer').children[1];
	var time3 = document.getElementById('auction3Timer').children[2];
	var counter = 0;
	var secs = 0;

	if (time1) {
		counter++;
	}

	if (time2) {
		counter++;
	}

	if (time3) {
		counter++;
	}

	if (counter == 3) {
		secs = time1.innerText * 3600;
		secs += time2.innerText * 60;
		secs += parseInt(time3.innerText);
	} else if (counter == 2) {
		secs = time1.innerText * 60;
		secs += parseInt(time2.innerText);
	} else if (counter == 1) {
		secs = parseInt(time1.innerText);
	} else {
		alert("Get left time error");
		return -1;
	}

	return secs;
}

function show_msg(msg) {
	if ($(".p_msg").length === 0) {
		$(".ftx").append("<p class='p_msg'>" + msg + "</p>");
		setTimeout(function() {
			$('.p_msg').remove();
		}, 500);
	}
}

var code = "<div id='control_bar'>" +
	"上限价（元）：<input type='text' id='max_price' />" +
	"抢拍加价（元）：<input type='text' id='increase' />" +
	"上限价出价时间（秒）：<input type='text' id='shot_time' />" +
	"<input type='button' value='上限价拍' id='btn_single_pai' class='qp_btn'/>" +
	"<input type='button' value='自动抢拍' id='btn_auto_pai' class='qp_btn'/>" +
	"</div>";

$('body').prepend(code);

var addr = document.location.href;
var uid = /[\d]{4,8}/.exec(addr)[0];
var interval_id;
var timeout_id;
var my_price = 0;

//$('#max_price').val(parseInt(priceLimit * 0.2, 10));
$('#increase').val(parseInt(1, 10));
$('#shot_time').val(parseInt(2, 10));

$('#btn_single_pai').on('click', function() {
	if (this.value == '上限价拍') {
		timeout_id = ontime_buy(uid);
		show_msg("已打开上限价拍...");
		this.value = '关闭上限价拍';

		var btn = document.getElementById('btn_auto_pai');
		if (btn.value != '自动抢拍') {
			window.clearInterval(interval_id);
			btn.value = '自动抢拍';
		} else {
			chrome.runtime.sendMessage({
				add: true,
				left_time: get_left_time()
			}, function(response) {});
		}
	} else {
		window.clearInterval(timeout_id);
		show_msg("已关闭上限价拍...");
		this.value = '上限价拍';

		chrome.runtime.sendMessage({
			del: true
		}, function(response) {});
	}
});

$('#btn_auto_pai').on('click', function() {
	if (this.value == '自动抢拍') {
		interval_id = auto_buy(uid);
		show_msg("已打开自动抢拍...");
		this.value = '关闭自动抢拍';

		var btn = document.getElementById('btn_single_pai');
		if (btn.value != '上限价拍') {
			window.clearInterval(timeout_id);
			btn.value = '上限价拍';
		} else {
			chrome.runtime.sendMessage({
				add: true,
				left_time: get_left_time()
			}, function(response) {});
		}
	} else {
		window.clearInterval(interval_id);
		show_msg("已关闭自动抢拍...");
		this.value = '自动抢拍';

		chrome.runtime.sendMessage({
			del: true
		}, function(response) {});
	}
});