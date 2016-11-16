$(function(){

  //判断是否存在商品cookie
  let goodsCookie = $.cookie("goods");
  // console.log($.cookie("goods"));
  // console.log(goodsCookie);
  // console.log(goodsCookie.length);
  //根据是否存在商品来显示不同的主界面
  if (goodsCookie && goodsCookie.length!=0) {
    $('.cart-empty').hide();
    $('.cart-exist').show()
  }else {
    $('.cart-exist').hide();
    $('.cart-empty').show();
  }
  goodsCookie = JSON.parse(goodsCookie);
  console.log(goodsCookie);
  for(let i in goodsCookie){
    //i可以用来表明cookie中存放的不同Id的商品的数量
      // console.log(goodsCookie[i].goodsId); //获得当前goodsCookie[i]下的商品ID
      let currentId      = goodsCookie[i].goodsId,
          currentGoodNum = goodsCookie[i].goodsNum;
      $.getJSON('../src/goods.json',function(json){
        //获取商品数据JSON，并通过ID来遍历整个数据，查找到该ID商品的详细信息
        for(let j in json){
          if (json[j].id==currentId) {//在JSON数据中正确找到相同ID的商品
            let currentImg       = json[j].small_src,
                currentOrigPirce = json[j].orig_price,
                currentDisPrice  = json[j].discount_price,
                currentName      = json[j].name,
                currentTaxRate   = json[j].tax.length>=10 ? "[本商品包税]无需额外交税" : (parseFloat(json[j].tax)/100).toFixed(3),
                currentTax       = json[j].tax.length>=10 ? "[本商品包税]无需额外交税" : (currentTaxRate * parseFloat(currentDisPrice.slice(1)) * currentGoodNum).toFixed(2);
                console.log(json[4].tax.length)
                console.log(currentTaxRate);
            let newLiNode = $('<li class="goods-item">'+
                                  '<div class="col col1">'+
                                    '<input type="checkbox" name="name" value="" class="new-checkbox">'+
                                  '</div>'+
                              '    <div class="col col2">'+
                              '      <img src='+currentImg+' alt="">'+
                              '      <div class="current-goods-info">'+
                              '        <div class="current-goods-name">'+currentName+'</div>'+
                              '        <div class="current-goods-type"></div>'+
                              '        <div class="current-goods-tax" data-taxrate="'+currentTaxRate+'">预计税费：￥'+currentTax+'</div>'+
                              '      </div>'+
                              '    </div>'+
                              '    <div class="col col3">'+
                              '      <del class="old-price">'+currentOrigPirce+'</del>'+
                              '      <p class="new-price">'+currentDisPrice+'</p>'+
                              '    </div>'+
                              '    <div class="col col4">'+
                              '      <button class="reduce-goods-num">-</button>'+
                              '      <input type="text" class="this-goods-num" value='+currentGoodNum+'>'+
                              '      <button class="increase-goods-num">+</button>'+
                              '    </div>'+
                              '    <div class="col col5">'+
                              '      <p class="current-goods-total-price">￥'+(currentGoodNum*(currentDisPrice).slice(1))+'</p>'+
                              '    </div>'+
                              '    <div class="col col6">'+
                              '      <p class="delete-this" id="deleteThisLi">删除</p>'+
                              '      <p class="collect-this">移入我的收藏</p>'+
                              '    </div>'+
                              '    <div class="vine-line"></div></li>');
            newLiNode.appendTo('.your-cart-goods');
          }
        }

        //勾选改变样式
        $('.goods-item>.col1>input').click(function(event) {
          /* Act on the event */
          let flag = $(this).prop('checked');
          if (flag) {
            $(this).parents('.goods-item').addClass('active-item')
            $(this).parent().siblings('.vine-line').show();
            if ($(this).parents('.goods-item').index()+1===$('.your-cart-goods>li').length) {
              $(this).parent().siblings('.vine-line').css('height','54px');
            }
          }else {
            $(this).parents('.goods-item').removeClass('active-item');
            $(this).parent().siblings('.vine-line').hide();
          }
        });
        //税费规则
        $('.current-goods-tax').hover(function(evt){
          let  a =   $(this).offset().left;
          let  b = $(this).offset().top;
          $('.tax-rule').css({'display':'block','top':b+26,'left':a-135});
          },function(){
          $('.tax-rule').delay(3000).hide();
        })

        //删除选中商品
        $('#btn-total-deleteSelect').click(function() {
          $('.mycart .goods-item .col1 input:checked').parent().parent().detach();
          //当删除商品时，判断是否被勾选，
          //若勾选，则还需减去当前商品对应的数量

          judgeLi();
        });

        //'收藏' to collect this goods and show Dialog UI and detach this node
        $('.collect-this').eq(i).click(function() {
          //show Dialog UI
          //detach this parentsNode
          let that =$(this);
          let dialogObj = {
            dialogTit: '提示',
            dialogContentTxt: '确定移入我的收藏？',
            dialogDesTxt: '商品买不起，将不在购物车显示',
            btnConfirm: '确定哈哈哈',
            btnCancle : '呵呵取消',
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
                '        商品移入我的收藏后，将不在购物车显示'+
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
          //遍历modal的自定义文字内容
          for(let i in dialogObj){
            $("#"+i).html(dialogObj[i]);
          }
          //把modal添加到body中
          $('body').append(dialog1);
          //当前商品点击‘移动到收藏’时，添加border
          $(this).parents('.goods-item').css('border', '1px solid red');
          //显示mask遮罩
          $('.body-mask').css('display', 'block');
          //过渡显示modal主体部分
          $('.dialog-container').fadeIn('1000', function() {});
          //点击 X 或者 取消时，过渡隐藏modal主体
          $('.btn-cls').click(function() {
            that.parents('.goods-item').css('border','none');
            $('.body-mask').fadeOut('400', function() {
              $(this).detach();
            });
            $('.dialog-container').fadeOut('400', function() {
              $(this).detach();
            });
          });

          //点击确定按钮时
          $('.btn-confirm').click(function(){
            that.parents('.goods-item').detach();
            $('#dialogContentTxt').html('成功添加到收藏中');
            $('#dialogDesTxt').html('您可以通过"个人中心"查找您的收藏记录<br>窗口自动在2秒钟后关闭');
            $('#dialogContentIcon').css('background-color','rgb(20, 199, 75)').html('√');
            $('#btnConfirm').detach();$('#btnCancle').detach();
            $('#dialogComponent').delay(2000).fadeOut('300',function(){$(this).detach();$('.goods-item').css('border','none');judgeLi();});
          })

        });

        //商品数目的增加或减少按钮的点击事件
        // $('.col4').find('button').off("click");
        $('.col4').eq(i).find('button').click(function(e){
          // e.stopPropagation();
          let that = this;
          let currentNum  = $(this).siblings('.this-goods-num').val();
          // 如果当前input text 的值不为1  也就是说当前所在位置的商品数量>1
          if(currentNum != 1){
            $(this).index() ? $(this).siblings('.this-goods-num').val(++currentNum) :
                              $(this).siblings('.this-goods-num').val(--currentNum) ;
            computeThisMoney(that);
            computePay(that);
          }else{
            console.log($(this).index());
            if (!$(this).index()) {
              $(this).css('cursor','not-allowed').prop('disabled','disabled');
            }else {
              $(this).siblings('.this-goods-num').val(++currentNum) ;
              computeThisMoney(that);
              computePay(that);
              $(this).parent().children(':button').removeAttr('disabled').css('cursor','pointer');
            }
          }

        })

        // 操作中的 '删除' to delete this parentsNode '.goods-item'==>li
        // judge this parentsNode '.your-cart-goods'==>ul childrenNode.length == 1
        // datech this li and show cart-empty
        $('.delete-this').click(function(){
          let index = $(this).parents('.goods-item').index();
          console.log('当前点击的删除按钮所在li在所属jquery对象中的下标'+index);
          $(this).parents('.goods-item').detach();
          //当删除商品时，同时删除对应的cookie
          // console.log('操作前'+goodsCookie);
          goodsCookie.splice(index,1);
          // console.log('操作后'+goodsCookie,goodsCookie.length);
          if (goodsCookie.length) {
            $.cookie("goods",JSON.stringify(goodsCookie),{expires:10,path:"/"});
          }else {
            $.cookie("goods","",{expires:0,path:"/"});
          }

          //当删除商品时，判断是否被勾选，
          //若勾选，则还需减去当前商品对应的数量
          if ($(this).parents('.goods-item').find('.col1>input').prop('checked')) {

          }
          judgeLi();
        })

        //input[type='checkbox'] click event
        //change the style of checkbox
        //点击改变 input checkbox 的样式
        $('.new-checkbox').click(function(){
          let that = this ;
          $(this).prop('checked') ? $(this).css('background-position','0 0') : $(this).css('background-position','0 -24px') ;
          activeBtnPay();
          computePay(that);
          })

        // '全选' input checkbox click to select all checkbox
        $('.btn-all-select').click(function() {
          //if checkbox checked false , it be true , otherwise it be false .
          //当进入事件时，按钮被点击，已被选中
          if ($(this).prop('checked')) {
            $(':checkbox').css('background-position', '0 0').prop('checked', 'true');
            console.log('此时全选按钮的初始状态为 被选中')
          }else {
            $(':checkbox').css('background-position', '0 -24px').prop('checked',false);
            // console.log($(':checked'))
            console.log('此时全选按钮的初始状态为 未选中')
          }

          // console.log($(this).prop('checked'))
          activeBtnPay();
          computePay();
        });

        // 区域选择，勾选部分相同地区的商品
        $('.location-send>input:checkbox').click(function(){
          if ($(this).prop('checked')===true) {
            let currentItem = $(this).parent().next().find('.show-goods>.your-cart-goods>li>.col1>input:checkbox') ;
            currentItem.prop('checked','true');
            // if (currentItem.length === ) {
            //
            // }
          }else {
            $(this).parent().next().find('.show-goods>.your-cart-goods>li>.col1>input:checkbox').prop('checked',false);
          }
          activeBtnPay();
          computePay()
        })

        //判断页面中是否存在 被添加到购物车中的商品，若不存在 则显示提示购买页面
        function judgeLi() {
          // console.log('进入判断');
          if (  $('.mycart').find('.goods-item').length == 0  ) {
            $('.your-cart-goods').parents('.cart-exist').css('display','none');
            $('.your-cart-goods').parents('.cart-exist').prev().css('display','block')}}

        //商品项目若有被勾上，则亮起 结算按钮
        function activeBtnPay(){
          if ($('.goods-item .col1 input:checked').length) {
          // console.log('打勾');
              $('#btn-total-pay').css({'background-color':'#e31436','cursor':'pointer'});
            }else{
              // console.log('全场没有checkbox被打勾');
              $('#btn-total-pay').css({'background-color':'#ccc','cursor':'auto'});
              let a = ".00";
              $('.total-goods-money').text(a);
              $('.selected-goods-num').html(0);
            }
          }

        //计算当前页面商品的价格
        function computePay(that){
          let totalNum = 0 ,
              totalPrice = 0;

        for(let i = 0 ; i < $('.goods-item>.col1>input:checked').length ; i++){
            totalNum   += parseInt($('.goods-item>.col1>input:checked').eq(i).parent().siblings('.col4').find('.this-goods-num').val());
            totalPrice += parseFloat($('.goods-item>.col1>input:checked').eq(i).parent().siblings('.col5').find('.current-goods-total-price').html().slice(1));
          }
          // console.log(totalPrice,totalNum);
          $('.selected-goods-num').html(totalNum);
          $('.total-goods-money').html(totalPrice);
        }

        //计算当前商品的总金额
        function computeThisMoney(that){
          let totalMoney = parseFloat($(that).parents('.goods-item').find('.col3>.new-price').html().slice(1))*$(that).siblings('.this-goods-num').val();
          $(that).parent().next().find('p').html('￥'+totalMoney);
          let totalTax   = parseFloat($(that).parent().siblings('.col2').find('.current-goods-tax').attr('data-taxrate'))* totalMoney;
          $(that).parent().siblings('.col2').find('.current-goods-tax').html("预计税费：￥"+totalTax.toFixed(2));
        }
      })









  }
})
