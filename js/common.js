(function($) {
	$.fn.extend({
		zSelect: function() {
			var zselect = $(this),
			zP=zselect.find("p").eq(0),//当前选项
			zUl=zselect.find("ul").eq(0),//下拉菜单
			zLi=zselect.find("li"),//所有选项
			swch=true;//开关
			zP.click(function(){//点击显示隐藏
				if(swch){
					zselect.addClass("select-act");
					swch=false;
				}
				else{
					zselect.removeClass("select-act");
					swch=true;
				}
			})
			zLi.hover(function(){//鼠标移动到li显示当前状态
				$(this).addClass("act")
			},function(){
				$(this).removeClass("act")
			})
			zLi.click(function(){
				zP.html($(this).html()).click()
			})
		},
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
		zTab:function(b){
			var zBanner=$(this),
			zUl=zBanner.find("ul").eq(0),
			zLi=zUl.find("li"),
			zSpan=zBanner.find("p span"),
			zIndex=0,
			swch=setInterval(function(){
				zIndex++;
				movement()
			},b["time"]);

			zUl.css("width",zLi.length*zLi.width())
			zBanner.hover(function(){
				clearInterval(swch)
			},function(){
				swch=setInterval(function(){
					zIndex++;
					movement()
				},b["time"])
			})
			function movement(){
				if(zIndex>=zLi.length){
					zIndex=0;
				}
				zUl.stop().animate({"left":zIndex*-zLi.width()})
				zSpan.removeClass("act").eq(zIndex).addClass("act")
			}
			zSpan.mouseover(function(i){
				zIndex=$(this).index()
				movement()
			})
		},
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
		}
	})
})(jQuery);


