function CouponManager (input) {
  this.input = input
  this.couponCodeField = this.input.couponCodeField
  this.couponApplied = false
  this.couponStatus = this.input.couponStatus
}

CouponManager.prototype.applyCoupon = function () {
  this.couponCode = $.trim($(this.couponCodeField).val())
  if (this.couponCode !== '') {
    if (this.couponStatus.length === 0) {
      this.couponStatus = $('<div/>', {
        id: 'coupon_status'
      })
      this.couponCodeField.parent().after(this.couponStatus)
    }
    this.couponStatus.removeClass()
    this.sendRequest()
    return this.couponApplied
  } else {
    return true
  }
}

CouponManager.prototype.sendRequest = function () {
  return $.ajax({
    async: false,
    method: 'PATCH',
    url: Spree.routes.api_v2_storefront_cart_apply_coupon_code,
    dataType: 'json',
    headers: {
      'X-Spree-Order-Token': Spree.current_order_token
    },
    data: {
      coupon_code: this.couponCode
    }
  }).done(function () {
    this.couponCodeField.val('')
    this.couponCodeField.addClass('alert-success animated flash')
    this.couponApplied = true

    setTimeout(function(){
        $('.form-control').removeClass('alert-success animated flash');
    }, 3000);

    return $.ajax({
      url: Spree.pathFor('summary_adjustments')
    }).done(function (data) {
      return $('.summary_adjustments').html(data)
    })

    return $.ajax({
      url: Spree.pathFor('summary_adjustments')
    }).done(function (data) {
      return $('.order-total').html(data)
    })

  }.bind(this)).fail(function (xhr) {
    var handler = xhr.responseJSON
    this.couponCodeField.val('')
    this.couponCodeField.addClass('alert-error animated shake')

    setTimeout(function(){
        $('.form-control').removeClass('alert-error animated shake');
    }, 1000);

  }.bind(this))
}
