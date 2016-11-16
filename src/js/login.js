$(function(){


  //========================== 表单验证 Start================================

  function changeIptBorder(regResult){
    regResult ? $(this).removeClass('errorBorder').css('border','1px solid rgb(15, 157, 85)') : $(this).addClass('errorBorder');
  }


  //账号验证
  $('#user-count').blur(function(){
    let countVal = $('#user-count').val();
    let regCount = /^(?!0)[a-zA-Z0-9]{6,18}$/;
    changeIptBorder.call(this,regCount.test(countVal));
  })

  //密码验证
  $('#user-pass').blur(function(){
    let passVal = $(this).val();
    let regPass = /^\w{6,16}$/;
    changeIptBorder.call(this,regPass.test(passVal));

  })

  //判断两次输入密码是否一致
  $('#user-confirm').blur(function(){
    let repassVal = $(this).val();
    if ($(this).val() != $('#user-pass').val() || $(this).val().length == 0) {
      $(this).addClass('errorBorder')
    }
  })

  //拖曳滑块

  let flag = 1;
  $('.move-div').mousedown(function(e){
    let currentMouseX = e.pageX,
        currentMouseY = e.pageY,
        mouseoffsetX  = 0,
        mouseoffsetY  = 0;


    console.log(mouseoffsetX,mouseoffsetY);


    $('.bg-code').mousemove(function(e){
      let mouseX = e.pageX;//获取鼠标当位置
      let mouseY = e.pageY;

      let moveX = 0;
      let moveY = 0;


        mouseoffsetX = e.pageX - $(this).offset().left;
        mouseoffsetY = currentMouseY - $(this).offset().top;

        mouseoffsetX = Math.min(249,Math.max(0,mouseoffsetX));

        $('.move-div').css({'left':mouseoffsetX,'top':0})
        if (mouseoffsetX >= 245 ) {
          $('.move-div>img').attr('src','img/slider_valid.png');
        }else{
            $('.move-div>img').attr('src','img/slider.png');
        }
    })
  })

  $(window).mouseup(function(){
    $('.bg-code').off('mousemove');})

  //判断手机号
  $('#user-phone').blur(function(){
    let phoneVal = $(this).val();
    let regPhone = /^1(3|4|5|7|8)\d{9}$/;
    changeIptBorder.call(this,regPhone.test(phoneVal));
  })

  //点击切换国际手机
  $('.switch-internation-num').click(function(){
      if ($(this).find('a').html() === '切换到国际手机') {
          $(this).find('a').html('切换到国内手机');
          $('.user-phone>label').html('国际手机号：');
      }else {
          $(this).find('a').html('切换到国际手机');
          $('.user-phone>label').html('手机号：');
      }
  })

  //获取验证码
  $('#btnGetMsgCode').click(function(){
    const randomNUm = Math.floor(Math.random()*8999)+1000;
    // console.log(randomNUm);
    $(this).prev().val(randomNUm);
  })


  //满足以上所有条件 注册 按钮亮起 实现伪注册功能
  $("#btnLogin").hover(function() {
    $(this).prop('disabled',false)
    if ($('form>div').find('.errorBorder').length==0
        && $('form input').eq(0).val().length != 0
        && $('form input').eq(1).val().length != 0
        && $('form input').eq(2).val().length != 0
        && $('form input').eq(3).val().length != 0
        && $('form input').eq(4).val().length != 0

       ) {
      $(this).css('cursor','pointer');
      $(this).css('opacity',1);
      console.log('满足');

      $(this).click(function(){
        let userName = $('form input').eq(0).val()+$('.user-count-mail-type').find('option:selected').html(),
            userPass = $('form input').eq(1).val(),
            userPhone= $('form input').eq(3).val();
        let User ={
          name: userName,
          pass: userPass,
          phone:userPhone
        };
        alert('注册成功!您的账号为：'+userName +" 请牢记您的账号用于网易所有服务的登陆。两秒后为您跳转到网易考拉登陆界面")
        let arr = [];
        arr.push(User);
        $.cookie("user",JSON.stringify(arr),{expires:30,path:"/"});
        $(window).delay(2000,function(){
          location.href="http://localhost:3000/src/signin.html"
        })
      })
    }else {
      $(this).css('cursor','not-allowed');
      console.log('不满足')
    }
  }, function() {
    $(this).css('opacity',.6)
  });
})
