
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
	$('.js-uploadImage').imageUploader({
		dropAreaSelector: '#drop-zone',
		successCallback: function(res) {

			$([
				'<tr>',
					'<td>'+res.fileName+'</td>',
					'<td><img src="'+res.ofileData+'" /></td>',
					'<td><a href="#" class="js-view-canvas" ><img src="'+res.fileData+'" /></a></td>',
					'<td>'+res.ofileSize+'</td>',
					'<td>'+res.fileSize+'</td>',
					'<td>'+res.fileType+'</td>',
				'</tr>'
			].join('')).appendTo('#select-image table');
			$('.error-message').empty();
		},
		errorCallback: function(res) {
			$('.error-message').text(res[0]);
		}
	});

	$(document).on('click', '.js-view-canvas', function(e) {
		var self = $(this);
		e.preventDefault();
		//2Dコンテキストのオブジェクトを生成する
		var canvasEdit = $('#canvas-edit');
		var canvasBackground = canvasEdit.closest('.canvas-background');
		var ctx= canvasEdit[0].getContext('2d');
		//画像オブジェクトを生成
		var image = new Image();
		image.src = $(this).find('img').attr('src');
		var canvas_width = '300';
		var canvas_height = '300';
		var width, height;
		var angle = 0;
		//画像をcanvasに設定
		image.onload = function(){
			if(image.width > image.height){
				// 横長の画像は横のサイズを指定値にあわせる
				var ratio = image.height/image.width;
				width = canvas_width;
				height = canvas_width * ratio;
			} else {
				// 縦長の画像は縦のサイズを指定値にあわせる
				var ratio = image.width/image.height;
				width = canvas_height * ratio;
				height = canvas_height;
			}
			canvasEdit.closest('.canvas-background')
				.css({
					'width': canvas_width,
					'height': canvas_height,
					'margin': '0 auto'
				})
			canvasEdit.attr('width', width)
					.attr('height', height)
					.css('margin-top', Math.floor((canvas_height-height)/2));
			ctx.drawImage(image, 0, 0, width, height);
		}
		canvasBackground.click(function() {
			angle += 90;
			if (360 <= angle) {
				angle = 0;
			}
			if ((angle%180)===0) {
				canvasEdit.attr('width', width)
						.attr('height', height)
						.css('margin-top', Math.floor((canvas_height-height)/2));
			} else {
				canvasEdit.attr('width', height)
						.attr('height', width)
						.css('margin-top', 0);
			}
			ctx.clearRect(0, 0, canvasEdit[0].width, canvasEdit[0].height);
			ctx.translate(canvasEdit[0].width / 2, canvasEdit[0].height / 2);
			ctx.rotate(angle * Math.PI / 180);
			ctx.translate(- width / 2, -height / 2);
			ctx.drawImage(image, 0, 0, width, height);
			
			// 回転させたcanvasを一覧に反映する
			var base64 = canvasEdit.get(0).toDataURL('image/jpeg');
			self.find('img').attr('src', base64);
		});

		// モーダルを
		$('#js-edit-modal').show().find('.js-close').click(function(e) {
			e.preventDefault();
			// モーダルを閉じる
			$('#js-edit-modal').hide();
		});
	});

});


