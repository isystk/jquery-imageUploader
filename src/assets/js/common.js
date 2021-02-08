
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
					'<td><img class="js-view-canvas" src="'+res.fileData+'" /></td>',
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

    $(document).on('click', '.js-view-canvas', function() {
        //2Dコンテキストのオブジェクトを生成する
        var canvasEdit = $('#canvas-edit');
        var ctx= canvasEdit[0].getContext('2d');
        //画像オブジェクトを生成
        var image = new Image();
        image.src = $(this).attr('src');
        var thumbnail_width = '300';
        var thumbnail_height = '300';
        //画像をcanvasに設定
        image.onload = function(){
    		var width, height;
			if(image.width > image.height){
				// 横長の画像は横のサイズを指定値にあわせる
				var ratio = image.height/image.width;
				width = thumbnail_width;
				height = thumbnail_width * ratio;
			} else {
				// 縦長の画像は縦のサイズを指定値にあわせる
				var ratio = image.width/image.height;
				width = thumbnail_height * ratio;
				height = thumbnail_height;
			}
            canvasEdit.attr('width', width)
                .attr('height', height);
            ctx.drawImage(image, 0, 0, width, height);
        }
        canvasEdit.click(function() {
            var width = 300;
            var height = 300;
            // コンテキストを保存する
            ctx.clearRect(0, 0, canvasEdit.width, canvasEdit.height);
            // 回転の中心に原点を移動する
            ctx.translate(width, height);
            // canvasを回転する
            ctx.rotate(90 * Math.PI/180);
            // 画像サイズの半分だけずらして画像を描画する
            ctx.drawImage(image, -(width/2), -(height/2));
            // コンテキストを元に戻す
        });
    });

});


