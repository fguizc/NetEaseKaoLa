$(function(){
  //input[type='checkbox'] click event
  //change the style of checkbox
  $('.new-checkbox').click(function(){
    $(this).prop('checked') ?
     $(this).css('background-position','0 0') :
     $(this).css('background-position','0 -24px')
    })

  // '删除' to delete this parentsNode '.goods-item'==>li
  // judge this parentsNode '.your-cart-goods'==>ul childrenNode.length == 1
  // datech this li and show cart-empty
  $('.delete-this').click(function(){
    if($(this).parents('.your-cart-goods').children().length==1){
      $(this).parents('.goods-item').detach();
      $('.cart-exist').css('display', 'none');
      $('.cart-empty').css('display', 'block');
    }
    $(this).parents('.goods-item').detach();
  })
  //'收藏' to collect this goods and show Dialog UI and detach this node
  $('.collect-this').click(function() {
    //show Dialog UI
    //detach this parentsNode
    $(this).parents('.goods-item').detach();
  });
  //increase num or reduce num of goods
  $('.col4').find('button').click(function(){
    let currentNum  = $(this).siblings('.this-goods-num').val();
    if(currentNum != 1){
      $(this).index() ? $(this).siblings('.this-goods-num').val(++currentNum) :
                        $(this).siblings('.this-goods-num').val(--currentNum) ;
    }else if (currentNum == 1 && $(this).index() == 0) {
      $(this).prop('disabled', 'disabled');
      $(this).css('cursor','not-allowed');
      $(this).siblings('.this-goods-num').val(1) ;
    }else if ($(this).index()) {
      $(this).siblings('.this-goods-num').val(++currentNum);
      $(this).prevAll('.reduce-goods-num').removeAttr('disabled').css('cursor', 'pointer');
    }
  })

})
