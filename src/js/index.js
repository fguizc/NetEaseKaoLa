$(function(){

  //ajax请求获取随机热搜词汇
  $.ajax({
    url:'http://localhost:3000/src/index.json',
    dataType:'json',
    success:function(data){
      console.log(data)
      $('.loadingPic').parent().detach();
      for(let i in data ){
        for(let j in data[i]){
            // console.log(data[i][j])
            console.log(j);
            // if(j == "searchHotKey"){
            //     let num = Math.floor(Math.random()*data[i][j].length);
            //     $('.searchIpt>input').attr('placeholder',data[i][j][num])
            // }
            switch (j) {
              case "searchHotKey":
                let num = Math.floor(Math.random()*data[i][j].length);
                $('.searchIpt>input').attr('placeholder',data[i][j][num]);
              break;
              case "sildePic":
                let newUlnode   = $('<ul></ul>');
                newUlnode.addClass('changebg');
                newUlnode.appendTo($('.m-bannerBox'));
                let count = data[i][j].length;
                for(let picPath = 0 ; picPath < data[i][j].length ; picPath++){
                  let newPicNode = $('<li><img src='+ data[i][j][picPath] +'></li>');
                  newPicNode.css({'z-index': picPath ===0 ? 10 : 9,'opacity': picPath ===0 ? 1 : 0});
                  newPicNode.appendTo('.m-bannerBox>ul:first-child');
                  let toggleRoundNode = $('<li class=circle data-num='+(picPath+1)+'></li>')
                  picPath === 0 ? toggleRoundNode.addClass('active-circle') : '' ;
                  toggleRoundNode.appendTo(newUlnode);
                }

                function nextPage(){
                  let currentIndex = $('.m-bannerBox>ul:last-child>.active-circle').index();
                  currentIndex =  currentIndex === 6 ? -1 : currentIndex;

                  $('.m-bannerBox>ul:first-child>li').eq(currentIndex).animate({'opacity':0,'z-index':9},400,'linear',function(){});
                  $('.m-bannerBox>ul:first-child>li').eq(currentIndex+1).animate({'opacity':1,'z-index':10},400);

                  //当前这一张图片对应的圆点
                  $('.m-bannerBox>ul:last-child>.circle').eq(currentIndex+1).siblings().removeClass('active-circle');
                  $('.m-bannerBox>ul:last-child>.circle').eq(currentIndex+1).addClass('active-circle');
                }

                //点击切换
                $('.m-bannerBox>i').click(function(){
                  let currentIndex = $('.m-bannerBox>ul:last-child>.active-circle').index();
                  console.log('上一次被亮起的小圆点的index()值： '+currentIndex);
                  let picLength = $('.m-bannerBox>ul:first-child>li').length;
                  if ($(this).index() === 1) {//点击上一张图片

                    currentIndex===0 ? 6 : currentIndex;

                    $('.m-bannerBox>ul:first-child>li').eq(currentIndex).animate({'opacity':0,'z-index':9},400,'linear',function(){});
                    $('.m-bannerBox>ul:first-child>li').eq(currentIndex-1).animate({'opacity':1,'z-index':10},400);

                    //当前这一张图片对应的圆点
                    $('.m-bannerBox>ul:last-child>.circle').eq(currentIndex-1).siblings().removeClass('active-circle');
                    $('.m-bannerBox>ul:last-child>.circle').eq(currentIndex-1).addClass('active-circle');
                  }else if($(this).index() === 2){//点击下一张图片
                    nextPage();
                  }

                })

                function hoverPage(){
                  let currentIndex = $('.m-bannerBox>ul:last-child>.active-circle').index();
                  $(this).siblings().removeClass('active-circle');
                  $(this).addClass('active-circle');
                  // console.log('打印小圆点的index'+ $(this).index());
                  if (currentIndex === $(this).index()) {
                    return ;
                  }
                  $('.m-bannerBox>ul:first-child>li').eq(currentIndex).animate({'opacity':0,'z-index':9},400);
                  $('.m-bannerBox>ul:first-child>li').eq($(this).index()).animate({'opacity':1,'z-index':10},400);
                }

                $('.circle').hover(function(){
                  hoverPage();
                },function(){})
                let obj = {};
                obj.timer = setInterval(function(){
                  nextPage();
                },3500);

                $('.m-bannerBox>ul:first-child>li').hover(function(){
                  clearInterval(obj.timer);
                },function(){
                  obj.timer = setInterval(function(){
                    nextPage();
                  },3500);
                })
                $('.m-bannerBox>i').hover(function(){
                  clearInterval(obj.timer);
                },function(){
                  obj.timer = setInterval(function(){
                    nextPage();
                  },3500);
                })
                break;
              default:

            }
          }
        }
      }
  })
  $.getJSON("../src/goods.json",function(json){
    let count = 0;
    let flag  = 0;
    for(let i in json){
      if ( flag===4  ) {
        flag=0;
        count++;
      }
      let goodsName = json[i].name,
          goodsOrigPrice = json[i].orig_price,
          goodsDisPrice  = json[i].discount_price,
          goodsPic  = json[i].small_src,
          goodsId   = json[i].id;
      // console.log(goodsName,goodsDisPrice,goodsOrigPrice,goodsPic);
      let aimNode = $('.prolist').eq(0).find('.itemgroup').eq(count-1).find('.item-hot-sale').eq(flag);
      aimNode.attr('id', goodsId);
      aimNode.find('a>img').attr('src',goodsPic);
      aimNode.find('.item-info>.item-tit').html(goodsName);
      aimNode.find('.item-info>.price>.new-price').html(goodsDisPrice);
      aimNode.find('.item-info>.price>.old-price').html(goodsOrigPrice);

      flag++;
      // console.log(flag);
    }
    //小轮播
    $('.partr>ul>li').mouseenter(function(event) {
      let currentIndex = $(this).index();
      console.log(currentIndex);
      $(this).parent().prev().find('.itemgroup').eq(currentIndex).show().css('opacity',1);
      $(this).parent().prev().find('.itemgroup').eq(currentIndex).siblings().hide().css('opacity',0);
    });

    $('.itemgroup>.item-hot-sale').click(function(){
      // console.log($(this).attr('id'));
      location.href="http://localhost:3000/src/goodDetail.html?id"+$(this).attr('id');
    })
  })
  //首页轮播图
  //获取对应json
  //首先判断有多少张图片 动态创建对应的切换小圆点 默认第一个小圆点样式不一样
  //实现 鼠标移动到某个小圆点就显影第几张图片
  //图片切换方式默认淡入淡出

  // 判断是否有cookie用来改变侧边栏购物车上的角标
   function cartCookie(){
     let existOldCookie = $.cookie('goods');
     if (existOldCookie) {
       existOldCookie = JSON.parse(existOldCookie);
       let newNum = null;
       for(let i in existOldCookie){
        //  console.log();
         newNum += existOldCookie[i].goodsNum;
       }
       newNum>=99 ? $('#btnShowCartNum').show().html("99+") : $('#btnShowCartNum').show().html(newNum);
     }
   }
   cartCookie();


  //主界面的登陆
  $('.hd-NavTopL1>a:nth-of-type(1)').click(function(event){
    event.preventDefault();
    let success = $.cookie("signin");
    if (success) {
      let usercount =(JSON.parse($.cookie("user")))[0].name ;
      $(this).html("<span class='hotkey'>"+usercount+"</span>" )
      // $(this).siblings().hide();
      $(this).next().next().html("退出");
    }else {
      location.href="http://localhost:3000/src/signin.html";
    }
  })
  $('.hd-NavTopL1>a:nth-of-type(2)').click(function(){

    if ($(this).html() == "免费注册") {
      location.href="http://localhost:3000/src/login.html"
    }else {
      $(this).prev().prev().html("登录") ;
      $(this).html("免费注册");
    }
  })



  //二级菜单的展开
  $('.hideIcon+span+ul>li>.more-goods').hide();
  $('.hideIcon+span+ul>li').hover(function(){
    $(this).find('.more-goods').show();
  },function(){
    $(this).find('.more-goods').hide();
  })

  //左侧边栏
  //1.点击跳转到对应的专区
  $('#asideLeft>ul>li').click(function(){
      console.log($(this).html())
      $('body,html').animate({'scrollTop': $('[data-name="'+$(this).html()+'"]').offset().top-80 },"400")
  })

  //右侧边栏
  //1.点击  TOP 回到顶部
  $('#asideRight>div:last-child').click(function(){
    $('body,html').animate({'scrollTop':0},"fast")
  })


  //当window scroll 时，判断滑动条距离顶部的距离大于 649 时。左右两侧的边栏变为固定定位
  //hd中的搜索栏和logo变为顶上部fixed定位
  $(window).scroll(function(){
    if ($(window).scrollTop()>=649){
      $('#asideRight').removeClass('indexRight').addClass('newRight');
      $('#asideLeft').removeClass('indexLeft').addClass('newLeft');

    }else {
      $('#asideRight').removeClass('newRight').addClass('indexRight');
      $('#asideLeft').removeClass('newLeft').addClass('indexLeft');
    }

      if ($(window).scrollTop()>$('.m-bannerBox').offset().top) {
        $('.hd-index').addClass('hd-index-new-layout');
        $('.hd-index-wrap').addClass('hd-index-new-wrap');
        $('.hd-kaolaLogo>img').attr('src','img/logosmall.png');
        $('.hd-shopCart').hide()
        $('.hd-searchBottom').hide()
      }else {
        $('.hd-index').removeClass('hd-index-new-layout');
        $('.hd-index-wrap').removeClass('hd-index-new-wrap');
        $('.hd-kaolaLogo>img').attr('src','img/kaolaLogo.png');
        $('.hd-shopCart').show()
        $('.hd-searchBottom').show()
      }
  })



  //===============右侧边栏的二级菜单 start===================
  $('#asideRight>div:first-child').hover(function(){
    $(this).find('.checkin_content').show()
  },function(){
    $(this).find('.checkin_content').hide()
  })

  $('#asideRight>div:nth-of-type(3)').hover(function(){
    $(this).find('.appQRcode').show();
  },function(){
    $(this).find('.appQRcode').toggle();
  })
  //=====================END==========================


  $('.round-items').hover(function(){
    $(this).addClass('active-items');
    $(this).siblings().removeClass('active-items');
  },function(){})
})
