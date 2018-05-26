'use strict';
require("./index.css");
require('page/common/nav/index.js');
var _mm = require('util/mm.js');
var _address = require('service/address-service.js');
var _order = require('service/order-service.js');
var addresTemplate = require('./address.string');
var productTemplate = require('./product.string');
var order_check = {
	data: {
		selectedAddressId: ""
	},
	init: function () {
		this.bindEvent();
		this.load();
	},
	load: function () {
		this.loadAddress();
		this.loadProductlist();
	},
	loadAddress: function () {
		var _this = this;
		_address.getAddressList(function (res) {
			var addressListHtml = _mm.renderHtml(addresTemplate, res);
			$(".address-con").html(addressListHtml);
		}, function (errMsg) {
			$(".address-con").html('<p>' + errMsg + '</p>')
		})
	},
	loadProductlist: function () {
		var _this = this;
		_order.getProductList(function (res) {
			var productListHtml = _mm.renderHtml(productTemplate, res);
			$(".product-con").html(productListHtml);
		}, function (errMsg) {
			$(".product-con").html('<p>' + errMsg + '</p>');
		})

	},
	bindEvent: function () {
		var _this = this;
		//地址选择
		$(document).on("click", ".address-item", function () {
			$(this).addClass('active').siblings('.address-item').removeClass("active");
			_this.data.selectedAddressId = $(this).data('id');
		});
		//订单提交
		$(document).on("click", ".order-submit", function () {
			var shippingId = _this.data.selectedAddressId;
			if (shippingId) {
				_order.createOrder({shippingId: shippingId},
					function (res) {
						window.location.href = './payment.html?orderNumber=' + res.orderNo;
					}, function (errMsg) {
						_mm.errorTips(errMsg);
					});
			} else {
				_mm.errorTips('请选择地址后再提交');
			}
		});
		$(document).on("click", ".address-add", function () {
			$(".cover").show();
			$(".modal").fadeIn(1000);
		});
		$(".close").click(function () {
			$(".cover").hide();
			$(".modal").hide();
		})
	}
}

$(function () {
	order_check.init();
})
