window.onload=function(){
  let success = $.cookie("signin");
  if (success) {
    let count = JSON.parse($.cookie("user"));
    $('#userName').val(count[0].name);
    $('#userPass').val(count[0].pass);
    $('#remeber-signin').prop('checked',true);
  }

  let arr = $.cookie("user"),
      registerCount=null,
      registerPass =null,
      currentCount =null,
      currentPass  =null;
  if (arr) {
    arr = JSON.parse(arr);
        registerCount = arr[0].name,
        registerPass  = arr[0].pass;
  }


  $('.btn-signin').click(function(event) {
    currentCount = $('#userName').val();
    currentPass  = $('#userPass').val();
    if (currentCount === registerCount && currentPass === registerPass) {
      //成功登陆，判断是否勾选了十天免登陆
      if ($('.free-box>input:checked')) {
        $.cookie('signin',true,{expires:10,path:"/"});
      }
      location.href="http://localhost:3000/src/index.html"
    }
  });
}
