$(function(){

  //解析URL来判断传入具体商品信息
  // console.log(window.location.href);
  let currentUrl = window.location.href;
  let id = null;
  currentUrl = currentUrl.split('?');
  console.log(currentUrl);
  for(let i in currentUrl){
    if (/^id\d*$/.test(currentUrl[i])) {
       id = currentUrl[i].replace('id','');
    }
  }
  $.getJSON("../src/goods.json",function(json){
    for(let i in json){
      if (json[i].id == id) {
        for(let j in json[i]){
          switch (j) {
            case 'online':
              if (!json[i][j]) {
                $('.outline').hide();
                $('.outline-show').show();
              }
              break;
            case 'middle_src':
              $('.goods-bigpic>img').attr('src', json[i][j]);
              break;
            case 'small_src':
              $('.goods-thumb>ul>li').eq(0).find('img').attr('src', json[i][j]);
              break;
            case 'big_src':
              $('.goods-showdetail').find('img').attr('src', json[i][j]);
              break;
            case 'country':
              switch (json[i][j]) {
                case 'France':
                  $('.orig-country>img').attr('src', '../src/img/flag/French-flag.png');
                  $('.country').html('法国')
                  break;
                case 'Japan':
                  $('.orig-country>img').attr('src', '../src/img/flag/Japanese-flag.png');
                  $('.orig-country>.country').html('日本')
                  break;
                case 'China':
                  $('.orig-country>img').attr('src', '../src/img/flag/China-flag.png');
                  $('.country').html('中国')
                  break;
                case 'Taiwan':
                  $('.orig-country>img').attr('src', '../src/img/flag/China-flag.png');
                  $('.country').html('台湾')
                  break;
                case 'USA':
                  $('.orig-country>img').attr('src', '../src/img/flag/USA-flag.png');
                  $('.country').html('美国')
                  break;
                case 'UK':
                  $('.orig-country>img').attr('src', '../src/img/flag/UK-flag.png');
                  $('.country').html('英国')
                  break;
                case 'Korea':
                  $('.orig-country>img').attr('src', '../src/img/flag/Korea-flag.png');
                  $('.country').html('韩国')
                  break;
                case 'Australia':
                  $('.orig-country>img').attr('src', '../src/img/flag/Australia-flag.png');
                  $('.country').html('澳大利亚')
                  break;
                default:
                  break;
              }
              break;
            case 'brand':
              $('.brand').html(json[i][j]);
              break;
            case 'self':
              json[i].self ? $('.tag-self-employed').show() : $('.tag-self-employed').hide();
              break;
            case 'cross':
              json[i].cross? $('.tag-cross-country').show() : $('.tag-cross-country').hide();
              break;
            case 'name':
              $('.goods-name').html(json[i][j]);
              $('#thisGoodsName').html(json[i][j])
              break;
            case 'des':
              json[i].des ? $('.goods-defined').html(json[i].des) : $('.goods-defined').hide();
              break;
            case 'discount_price':
              $('.current-price>em>span').html(json[i][j]);
              break;
            case 'discount':
              for(let m in json[i].discount){
                let newSpanNode =$('<span class="discount">'+json[i].discount[m]+'</span>')
                newSpanNode.appendTo('.current-price');
              }
              break;
            case 'active_name':
              json[i][j] == undefined && typeof json[i][j] == 'object' ? $('.active-promotions').hide() : $('.active-promotions>.active').html(json[i][j]);
              break;
            case 'active_content':
              $('.active-promotions>.active-des').html(json[i][j]);
              break;
            case 'tax':
              json[i][j].length>10 ? $('.taxrate>.current-taxrate').html("<span class='hotkey'>"+json[i][j]+"</span>") : $('.taxrate>.current-taxrate').html("本商品使用税为"+json[i][j]);
              break;
            default:

          }
        }
      }
    }
  })


// existCookie();
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

  //放大镜功能
  var _smallImg=$(".goods-bigpic");
  var _smallArea=$("#mouseArea");
  var _bigImg=$(".goods-showdetail img");
  var _bigArea=$(".goods-showdetail");

  //bigImg.width/smallImg.width=bigArea.width/smallArea.width
  //计算小区域的宽高
  //width==innnerWidth()==outerWidth()
  _smallArea.width(_bigArea.width()*_smallImg.width()/_bigImg.width()/2);
  _smallArea.height(_bigArea.height()*_smallImg.height()/_bigImg.height()/2);

  //放到系数/放大倍数
  var scale = _bigImg.width() / _smallImg.width()/2;    //scale=4

  //mousemove
  _smallImg.mousemove(function (e) {
      _smallArea.show();
      _bigArea.show();

      var x = e.pageX - _smallImg.offset().left - _smallArea.width()/2;
      var y = e.pageY - _smallImg.offset().top - _smallArea.height()/2;

      if(x <= 0){
          x = 0;
      }
      else if(x >= _smallImg.width() - _smallArea.width()){
          x = _smallImg.width() - _smallArea.width();
      }
      if(y<=0){
          y=0;
      }
      else if(y >= _smallImg.height() - _smallArea.height()){
          y = _smallImg.height() - _smallArea.height();
      }
      //移动小区域
      _smallArea.css({left:x,top:y});
      //移动大图
      _bigImg.css({'left':-x*scale,'top':-y*scale});
  });
  _smallImg.mouseleave(function () {
      _smallArea.hide();
      _bigArea.hide();
  });

  //滚动条改变右侧边栏导航的定位
  let asideOffTop = $('.aside-right').offset().top;
  $(window).scroll(function(){
    if ($(window).scrollTop()>asideOffTop+50) {
      $('.aside-right').removeClass('goods-right-nav').addClass('goods-right-nav-new');
    }else {
      $('.aside-right').removeClass('goods-right-nav-new').addClass('goods-right-nav');
    }
  })
  //右侧边栏的二级展开
  $('.aside-right>div:first-child').hover(function(){
    $(this).find('.checkin_content').show()
  },function(){
    $(this).find('.checkin_content').hide()
  })

  $('.aside-right>div:nth-of-type(3)').hover(function(){
    $(this).find('.appQRcode').show();
  },function(){
    $(this).find('.appQRcode').toggle();
  })
  //右侧边栏的TOP回到顶部
  $('.aside-right>div:last-child').click(function(){
    $('body').animate({'scrollTop':0},"fast")
  })

  //改变当前商品数量
  $('.computed-component').find('button').click(function(){
    let that = this;
    let currentNum  = $(this).siblings('.current-goods-num').val();
    // 如果当前input text 的值不为1  也就是说当前所在位置的商品数量>1
    if(currentNum != 1){
      $(this).index() ? $(this).siblings('.current-goods-num').val(++currentNum) :
                        $(this).siblings('.current-goods-num').val(--currentNum) ;
      // computePay(that);

    }else{
      // console.log($(this).index());
      if (!$(this).index()) {
        $(this).css('cursor','not-allowed').prop('disabled','disabled');
        $(this).addClass('default-button');
      }else {
        $(this).siblings('.current-goods-num').val(++currentNum) ;
        $('.decrease-num').removeClass('default-button');
        $(this).parent().children(':button').removeAttr('disabled').css('cursor','pointer');
      }
    }
  })

  //收藏
  $('#btnCollect').click(function() {
    //show Dialog UI
    //detach this parentsNode
    let that =$(this);
    let dialogObj = {
      dialogTit: '提示',
      dialogContentTxt: '确定加入我的收藏？',
      dialogDesTxt: '收藏商品获取一手折扣动态',
      btnConfirm: '确定',
      btnCancle : '取消',
     }
     // 拼接modal htmL结构
    const dialog1 = $('<div class="dialog-Component" id="dialogComponent">'+
    '<div class="dialog-container abcenter">'+
             '<div class="dialog-tit">'+
              '<div class="tit" id="dialogTit">提示</div>'+
              '<div class="btn-cls" title="关闭弹窗口"></div>'+
          '  </div>'+
          '  <div class="dialog-content">'+
          '    <div class="content-txt">'+
          '      <div class="content-tit">'+
          '        <i class="notice-icon" id="dialogContentIcon">!</i>'+
          '        <h2 class="notice-txt" id="dialogContentTxt">确定移入我的收藏？</h2>'+
          '      </div>'+
          '      <div class="content" id="dialogDesTxt">'+
          '       收藏该商品以后购买'+
          '      </div>'+
          '    </div>'+
              '<div class="content-button">'+
                '<button type="button" name="button" class="btn-confirm" id="btnConfirm">确定</button>'+
                '<button type="button" name="button" class="btn-cancle btn-cls" id="btnCancle">取消</button>'+
              '</div>'+
            '</div>'+
        '</div>'+
        '<div class="body-mask"></div>'+
      '</div>');

    //把modal添加到body中
    $('body').append(dialog1);
    //遍历modal的自定义文字内容
    for(let i in dialogObj){
      $("#"+i).html(dialogObj[i]);
    }
    //当前商品点击‘移动到收藏’时，添加border
    // $(this).parents('.goods-item').css('border', '1px solid red');
    //显示mask遮罩
    $('.body-mask').css('display', 'block');
    //过渡显示modal主体部分
    $('.dialog-container').fadeIn('1000', function() {});
    //点击 X 或者 取消时，过渡隐藏modal主体
    $('.btn-cls').click(function() {
      $('.body-mask').fadeOut('400', function() {
        $(this).detach();
      });
      $('.dialog-container').fadeOut('400', function() {
        $(this).detach();
      });
    });

    //点击确定按钮时
    $('.btn-confirm').click(function(){
      $('#btnCollect>i').addClass('icon-heart');
      $('#dialogContentTxt').html('成功添加到收藏中');
      $('#dialogDesTxt').html('您可以通过"个人中心"查找您的收藏记录<br>窗口自动在2秒钟后关闭');
      $('#dialogContentIcon').css('background-color','rgb(20, 199, 75)').html('√');
      $('#btnConfirm').detach();$('#btnCancle').detach();
      $('#dialogComponent').delay(2000).fadeOut('300',function(){$(this).detach();$('.goods-item').css('border','none');});
    })

  });

  //立即购买弹出登陆框
  $('#btnBuy').click(function(){

  })

  let clickCount = 0;
  //飞入购物车
  $("#btnAddCart").click(function(e){
        //调用飞入动画
        clickCount++;
					var flyer = $("<img class='u-flyer'/>");
					flyer.attr("src", $('.active-thumb img').attr('src'));

					flyer.fly({
						start: {
							left: e.pageX,
							top: e.pageY-$('body').scrollTop(),
							width: 90,
							height: 90
						},
						end: {
							left: $(".aside-right>div:nth-of-type(2)").offset().left+10,
							top: $(".aside-right>div:nth-of-type(2)").offset().top+50-$('body').scrollTop(),
							width: 0,
							height: 0
						},
						onEnd: function(){
							console.log("加入购物车成功!")
              if (clickCount===1) {
                $('#btnShowCartNum').show();
              }
						}
					});

          existCookie();

				})


function existCookie(){
  //判断是否存在购物车cookie
  let goods =  $.cookie("goods") ? JSON.parse($.cookie("goods")) : [] ;
  let allGoodsNum = null;
  let currentGoods = {
    goodsId:id,
    goodsNum:clickCount
  }
  let flag = 0;
  console.log(goods);
  if (goods.length) {

    for(let i = 0 ; i<goods.length ; i++){
      //判断是否是相同商品
      if (currentGoods.goodsId==goods[i].goodsId) {
          flag = 1;
          goods[i].goodsNum=goods[i].goodsNum+parseInt($('.current-goods-num').val())
      }
      allGoodsNum += goods[i].goodsNum;
    }
    if (!flag) {
      goods.push(currentGoods);
    }
  }else {
    goods.push(currentGoods);
  }

  $('#btnShowCartNum').html(allGoodsNum);
  if ($('#btnShowCartNum').html()) {
    $('#btnShowCartNum').html()>=99?$('#btnShowCartNum').html('99+'):'';
    $('#btnShowCartNum').show();
  }else {
      $('#btnShowCartNum').hide()
  }
  $.cookie("goods",JSON.stringify(goods),{expires:10,path:"/"});
  console.log($.cookie("goods"));
}


})
