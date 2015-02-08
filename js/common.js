$.fn.extend({   
	/*
	 *tab选项卡参数为切换时的事件。
	 */

	tabs:function(movement){  
		aOption=$(this).find("p a");
		aCenter=$(this).find(".tab_center");
		aOption.each(function(i)
		{
			$(this)[movement?movement:"mouseover"](function()
			{
				aOption.removeClass("active")
				aOption.eq(i).addClass("active")
				aCenter.hide()
				aCenter.eq(i).show();

			})
		})
	},
	/*
		 * Jumovepop弹窗层插件
		 *
		 * 这是一个弹窗层插件，可以制作可移动的弹出层。
		 * 下面它的调用方法
		 * $(".popContent").Jumovepop({move:true,follow:true,bg:true,close:true,bgcss:{opacity:0.1},boxcss:{}})
		 *
		 * FunctionJson={move:true,follow:true,bg:true,bgcss:{opacity:0.1}}
		 * move:目标是否可拖拽,参数true or false
		 * follow:目标是否随滚动条滚动或窗口大小改变时自动居中,参数参数true or false
		 * close:是否显示关闭按钮(diaplay:none&block),按钮trigger仍然可以使用
		 * bg:是否有透明背景,参数true or false
		 * bgcss:自定义bg的css样式,参数json格式。例如{background:"red",opacity:0.1},可随意添加
		 * parent：弹窗div
		 */
		Jumovepop:function (json) {

			var ThisBtn = $(this),
				ThisMove = json["move"],
				Bg = null,
				ThisFollow = json["follow"],
				ThisBg = json["bg"],
				This = null, Close = null;
				This = $('<div class="popContent"><div class="popHtml"></div><div class="popClose"></div></div>');

				if ($(".popContent").length == 0) {
				  $(".index_main").length && $(".index_main").after(This);
				  $(".domy_guide").length && $(".domy_guide").after(This);
				}
				This = json["parent"];
				Close = This.find(".popClose");

			var Common = { // 常用
				clientWidth:parseInt($(document.body).width()),
				clientHeight:parseInt($(window).height()),
				documentHeight:parseInt($(document).height()),
				scrollTop:parseInt($(window).scrollTop()),
				scrollLeft:parseInt($(window).scrollLeft()),
				popWidth:parseInt(This.css("width")),
				popHeight:parseInt(This.css("height"))
			};

			var bgdefault = { // 灰色bg默认样式
				position:"absolute",
				left:0,
				top:0,
				background:"#1e3240",
				opacity:".5",
				filter:"alpha(opacity=50)",
				width:Common["clientWidth"],
				height:Common["documentHeight"]
			};

			function startshow(){ // 启动函数

				defaultload(); // box居中定位

				ThisBg && createBg(); // 创建bg添加样式

				closeBtnFn();
			}

			ThisBtn.each(function (e, i) {
				var ThisAjax = $(this).attr("data-ajax");

				$(this).bind("click", function(){

					followFn();

					ThisAjax ? ajaxFn(ThisAjax, $(this).attr("id")) : startshow();

					ThisFollow && windowFn(); // 是否跟随滚动条

					ThisMove && moveFn(); // 是否可以拖拽

					if (Close.length>0) {  // 关闭按钮
						Close.bind("click", function(){
							closeFn();
						});
					}
				});
			});

			function defaultload(){ // box居中函数
				Common.popWidth = This.width();
				
				Common.popHeight = This.height();
				$.extend(Common, json['boxcss']);

				This.css({
					left:(Common["clientWidth"] - Common.popWidth) / 2,
					top:(Common["clientHeight"] - Common.popHeight) / 2
				}).css({width:Common.popWidth}).show();
				
				This.css({width:Common.popWidth}).show();
				// alert(This.style.left)
				popPosition(Common["scrollTop"]);
			}

			function ajaxFn (url, id) { // ajax获取数据
				var request = $.ajax({
				  url: url,
				  type: "GET",
				  dataType: "HTML",
				  cache : false
				});

				request.done(function (msg) {
				  This.find('.popHtml').html(msg);
				  startshow();
				  if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) { // 解决IE6下弹出层上遮罩无法盖住select的 BUG
		        $("select").css({display:"none"});
		      }
				  json.callback && json.callback(id);
				});
			}

			function moveFn(){ // box拖拽函数
				This.bind("mousedown", function (e) {
					var disX = e.pageX - $(this).offset().left;
					var disY = e.pageY - $(this).offset().top;

					$(window).bind({
						mousemove:function (e) {
							var X = e.pageX - disX;
							var Y = e.pageY - disY;
							This.css({left:X,top:Y});
						},
						mouseup:function(){
							$(window).unbind("mousemove").unbind("mouseup");
						}
					});
					return false;
				});
			}

			function windowFn(){ // 滚动改变窗口函数
				$(window).bind({
					scroll : function(){
						followFn();
					},
					resize : function(){
						followFn();
					}
				});
			}

			function followFn(){
				Common.scrollTop = parseInt($(window).scrollTop());
				popPosition(Common.scrollTop);
			}

			function popPosition(scrollTop){ // 滚动改变窗口后重新定位box的函数
				This.css({
					left:(Common["clientWidth"] - Common["popWidth"]) / 2,
					top:(Common["clientHeight"] - Common["popHeight"]) / 2 + scrollTop
				});
			}

			function createBg(){ // 创建bg添加样式函数

				json['bgcss'] && $.extend(bgdefault, json['bgcss']);

				if ($(".popUp").length) {
					Bg = $(".popUp");
					Bg.show();
				} else {
					$("body").prepend('<div class="popUp">&nbsp;</div>').find("div.popUp").css(bgdefault);
					Bg = $(".popUp");
				}

				Bg.css({opacity:0, background:bgdefault.background}).stop().animate({opacity: bgdefault.opacity});
			}

			function closeFn(){ // 关闭函数

				Bg && Bg.stop().animate({opacity:0}, 100, function(){
					Bg.hide();
				});
				This.hide();
				// json['close'] && json['close']();
			}

			resize();

			function resize(){
				$(window).bind('resize', function(){
					_width = parseInt($(document.body).width());

					$(".popUp").css({width : _width});
					followFn();
				});
			}

			function closeBtnFn(){
				if (json.closebtn == false) {
					Close.hide();
				} else {
					Close.show();
				}
			}
		} // Jumovepop
})     
