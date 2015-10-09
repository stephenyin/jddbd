document.getElementById("price").focus();
var btn = document.getElementById('submit_btn');
btn.onclick = function() { //给对象绑定事件
  var expectPrice = document.getElementById('price').value;
  var shotTime = document.getElementById('shot_time').value;
  chrome.tabs.getSelected(null, function(tab) {
    chrome.runtime.sendMessage({
      add: true,
      tab_id: tab.id,
      price: expectPrice,
      shot_time: shotTime
    }, function(response) {
      setTimeout(function() {
        window.close();
      }, 1000);
    });
  });
}