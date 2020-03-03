
$(function() {

	// 動くマーカー線
	$(window).scroll(function (){
		$(".entry-content strong").each(function(){
			var position = $(this).offset().top;
			var scroll = $(window).scrollTop();
			var windowHeight = $(window).height();
			if (scroll > position - windowHeight){
				$(this).addClass('active');
			}
		});
	});

	// ページトップに戻るボタンを表示
	(function () {
		$('<span id="page-top" class="link"><a href="#">^</a></span>').appendTo('body');
		var topBtn = $('#page-top'),
			showFlg = false;
		var scroll = function (scrollTop) {
			if (scrollTop > 100) {
				if (showFlg == false) {
					showFlg = true;
					topBtn.removeClass('hide');
				}
			} else {
				if (showFlg) {
					showFlg = false;
					topBtn.addClass('hide');
				}
			}
		} 
		//スクロールが100に達したらボタン表示
		$(window).scroll(function () {
			scroll($(this).scrollTop());
		});
		//スクロールしてトップ
		topBtn.click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 500);
			return false;
		});
		scroll($(window).scrollTop());
	}());

	// ソースコードの表示
	$('pre.code').each(function() {
		var self = $(this),
			code = self.find('code'),
			text = code.text();
		self.addClass('prettyprint');
		self.addClass('linenums');
		code.empty().text(text);
	});
	prettyPrint();

  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('.sidebar-wrapper').addClass('fixed');
    } else {
      $('.sidebar-wrapper').removeClass('fixed');
    }
	});
	
	// ページ内見出しナビゲーション
	$('#sticky-navigator').stickyNavigator({wrapselector: '.entry-content'});


	// 画像ファイルアップロード
	(function() {

  // 画像ファイル選択時
		$('.js-uploadImage').change(function(){

			if (this.files.length === 0) {
				return;
			}
			
			// Loading画像
			$('<div id="site_loader_overlay"><div class="site_loader_spinner" ></div></div>').appendTo('body');

			var fileLength = this.files.length;
			var count = 0;
			imageUpload(this, function(image) {

				if (!image) {
					// Loading画像
					$('#site_loader_overlay').remove();
					return false;
				}
				
				var li = $('<li><p></p></li>');
				image.width('103px');
				li.find('p').append(image);
				$('.gallery ul').append(li);

				count = count + 1;
				if (fileLength == count) {
					// Loading画像
					$('#site_loader_overlay').remove();
				}
			});
		});

		// 画像アップロード
		var imageUpload = function(obj, callbackfunc){
			var self = $(obj);
			
			// 未選択の場合は何もしない。
			if (self.val() === '') {
				return;
			}

			// アップロード中は、「ファイル選択」ボタンを非活性にする。
			self.attr('disabled', 'disabled');

			_.each(obj.files, function(file) {
				var fr = new FileReader();
				fr.onload = function() {
					var img = $('<img>').attr('src', fr.result);
					if (callbackfunc) {
						callbackfunc(img);
					}
				};
				fr.readAsDataURL(file);
			});

		// 	$.imageUploader({
		// 		uploadUrl: '/jquery-imageUploader/imageUpload/',
		// 		successCallback : function(res) {

		// 			var img = $('<img>').attr('src', res.imagePath);
		// 			if (callbackfunc) {
		// 				callbackfunc(res);
		// 			}
					
		// 		},
		// 		errorsCallback : function(errors) {
		// 			self.removeAttr('disabled');

		// 			if (callbackfunc) {
		// 				callbackfunc();
		// 			}
		// s
		// 			return false;
		// 		}
				
		//     }).fileUpload(obj);

		};
		
	})();
	
});


