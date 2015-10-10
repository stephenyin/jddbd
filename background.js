var map = new Map();

chrome.runtime.onMessage.addListener(
	function(msg, sender, sendResponse) {
		if (msg.add) {
			console.log("recv add msg from tab:" + sender.tab.id);
			console.log("wait:" + msg.left_time + "secs");
			map.put(sender.tab.id, setTimeout(function() {
				chrome.tabs.update(sender.tab.id, {
					selected: true
				});
			}, msg.left_time - 10));

			sendResponse("Got your add message from tab " + sender.tab.id);

			return true;
		} else if (msg.del) {
			console.log("recv del msg from tab:" + sender.tab.id);
			clearTimeout(map.get(sender.tab.id));
			map.remove(sender.tab.id);
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