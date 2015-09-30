document.getElementById("price").focus();
var btn = document.getElementById('submit_btn');
btn.onclick = function() { //给对象绑定事件
  var upperPrice = document.getElementById('price').value;
  var addPrice = document.getElementById('add_price').value;
  var shotTime = document.getElementById('shot_time').value;
  var cbox = document.getElementById('cbox').checked;
  console.log("checkbox:" + cbox);
  console.log(upperPrice);
  chrome.tabs.getSelected(null, function(tab) { //获取当前tab
    //向tab发送请求
    chrome.tabs.sendRequest(tab.id, {
      action: "submit",
      price: upperPrice,
      add_price: addPrice,
      shot_time: shotTime,
      checkbox: cbox
    }, function(response) {
      console.log(response.kw);
      window.close();
    });
  });
}
