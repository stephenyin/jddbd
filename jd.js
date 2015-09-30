var buyFun = function(price, add_price, shot_time, checkbox) {
	console.log("buyFun-上限价格:" + price + "元");
	console.log("buyFun-增加幅度:" + add_price + "元");
	console.log("buyFun-提交时间:最后" + shot_time + "秒");
	console.log("buyFun-仅最后时刻提交上限价格:" + checkbox);

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
			input = document.getElementById('bid-info').children[0].children[1];
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
				console.log("设置价格:" + input.value + "元");
				console.log("提交!!!!");
				document.getElementById('buy-btn').click();
			}
		}, 300);
	}, (secs - 60) * 1000);
};

chrome.extension.onRequest.addListener( //监听扩展程序进程或内容脚本发送的请求
	function(request, sender, sendResponse) {
		if (request.action == "submit") {
			console.log("上限价格:" + request.price + "元");
			console.log("增加幅度:" + request.add_price + "元");
			console.log("提交时间:最后" + request.shot_time + "秒");
			console.log("仅最后时刻提交上限价格:" + request.checkbox);


			var keyText = document.getElementById('bid-info').children[0].children[0].innerText;
			if (keyText == "即将拍卖") {
				console.log("即将拍卖");
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
					kw: "设置成功"
				});

				setTimeout(function() {
					buyFun(request.price, request.add_price, request.shot_time, request.checkbox);
				}, (secs + 60) * 1000);
			} else {
				///////price box
				//var inputValue = document.getElementById('bid-info').children[0].children[1].value;
				// input.value = 77;
				//sendResponse({ kw: value });
				//console.log("my price" + inputValue);

				///////current price
				// var lastPrice = document.getElementById('bidRecordItem').children[0].children[0].children[1].innerText;
				// console.log("last price:" + lastPrice);
				//sendResponse({ kw: lastPrice.innerText});

				///////submit btn
				//var btn = document.getElementById('buy-btn');
				//btn.click();
				//sendResponse({ kw: btn.innerHTML });

				///////time countdown
				sendResponse({
					kw: "设置成功"
				});
				
				buyFun(request.price, request.add_price, request.shot_time, request.checkbox);
			}
		}
	}
);