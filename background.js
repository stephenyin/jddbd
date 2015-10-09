var map = new Map();

chrome.runtime.onMessage.addListener(
	function(msg, _, sendResponse) {
		if (msg.add) {
			console.log("recv msg from tab:" + msg.tab_id);
			console.log("price:" + msg.price);
			console.log("shot-time:" + msg.shot_time);

			sendResponse("Got your add message from tab " + msg.tab_id);

			chrome.tabs.sendMessage(msg.tab_id, {
					add: true,
					price: msg.price,
					shot_time: msg.shot_time
				},
				function(response) {
					console.log("wait:" + response.time + "secs");
					map.put(msg.tab_id, setTimeout(function() {
						chrome.tabs.update(msg.tab_id, {
							selected: true
						});
					}, response.time - 10));	
				});

			return true;
		} else if (msg.del) {
			clearTimeout(map.get(msg.tab_id));
			map.remove(msg.tab_id);

			chrome.tabs.sendMessage(msg.tab_id, {
					del: true
				},
				function(response) {});
			return true;
		}
	}
);

function Map() {
	this.container = new Object();
}


Map.prototype.put = function(key, value) {
	this.container[key] = value;
}


Map.prototype.get = function(key) {
	return this.container[key];
}


Map.prototype.keySet = function() {
	var keyset = new Array();
	var count = 0;
	for (var key in this.container) {
		// 跳过object的extend函数
		if (key == 'extend') {
			continue;
		}
		keyset[count] = key;
		count++;
	}
	return keyset;
}


Map.prototype.size = function() {
	var count = 0;
	for (var key in this.container) {
		// 跳过object的extend函数
		if (key == 'extend') {
			continue;
		}
		count++;
	}
	return count;
}


Map.prototype.remove = function(key) {
		delete this.container[key];
	}
	
// chrome.tabs.update(option_tab[0].id,{selected:true});