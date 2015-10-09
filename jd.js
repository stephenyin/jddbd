var timeout_id;

chrome.extension.onMessage.addListener(
	function(msg, _, sendResponse) {
		if (msg.add) {
			//var keyText = document.getElementById('bid-info').children[0].children[0].innerText;
			//if (keyText == "即将拍卖") {
			if(0){
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

var ontime_buy = function(price, shot_time, left_time) {
	console.log("ontime_buy--price: " + price);
	console.log("ontime_buy--shot-time: " + shot_time);
	console.log("ontime_buy--left-time: " + left_time);

	var input = document.getElementById('bidPrice');
	input.value = price;

	timeout_id = setTimeout(function() {
		buy(price);
	}, (left_time - shot_time) * 1000);
}

var buy = function(price) {
	console.log("buy--price:" + price);
	var input = document.getElementById('bidPrice');
	input.value = price;

	var btn = document.getElementById('auctionStatus1').children[1].children[0];
	btn.click();
}

var buyFun = function(price, shot_time) {
	console.log("buyFun-price:" + price);
	console.log("buyFun-shot-time" + shot_time);

	/*
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
	console.log("剩余时间:" + strs[0] + ":" + strs[1] + ":" + strs[2]);
	console.log("等待" + secs + "秒");
*/
	setTimeout(function() {
		var input;
		var lastPrice = 0;
		var timeString;
		var str;
		var strs = new Array(); //定义一数组 

		// chrome.runtime.sendMessage({
		// 	cmd: "reloadBegin"
		// }, function(response) {
		// 	console.log(response);
		// });

		var interval = setInterval(function() {
			input = document.getElementById('bidPrice');
			//input = document.getElementById('bid-info').children[0].children[1];
			timeString = document.getElementById('product-intro').children[1].children[1].children[4].children[0].innerText;
			str = timeString.replace("小时", ",").replace("分", ",").replace("秒", ",");
			strs = str.split(","); //字符分割
			if (strs.length == 3) {
				secs = strs[0] * 60;
				secs += parseInt(strs[1]);
			} else if (strs.length == 2) {
				secs = parseInt(strs[0]);
			} else {
				alert("Get left time error:" + timeString);
			}
			console.log("等待" + secs + "秒");
			lastPrice = document.getElementById('bidRecordItem').children[0].children[0].children[1].innerText;
			console.log("当前最高出价:" + lastPrice + "元");
			if (parseInt(lastPrice) >= parseInt(price)) {
				clearInterval(interval);
				alert("当前最高出价" + lastPrice + "元" + ",已高于上限" + price + "元");
				return;
			}

			console.log("提交时间:" + shot_time + "秒");
			if (parseInt(secs) <= parseInt(shot_time)) {
				clearInterval(interval);
				if (checkbox) {
					input.value = price;
				} else {
					if (parseInt(lastPrice) + parseInt(add_price) > parseInt(price)) {
						input.value = price;
					} else {
						input.value = parseInt(lastPrice) + parseInt(add_price);
					}
				}
				console.log("set price:" + input.value);
				console.log("submit!!!!");
				document.getElementById('buy-btn').click();
			}
		}, 300);
	}, (secs - 60) * 1000);
};