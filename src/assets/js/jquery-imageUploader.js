
(function($) {
	/*
	 * imageUploader
	 *
	 * Copyright (c) 2017 iseyoshitaka
	 * 
	 * Description:
	 * ファイル非同期アップローダー
	 */
	$.fn.imageUploader = function(options) {
	
		var params = $.extend({}, $.fn.imageUploader.defaults, options);

		var THUMBNAIL_WIDTH = 500; // 画像リサイズ後の横の長さの最大値
		var THUMBNAIL_HEIGHT = 500; // 画像リサイズ後の縦の長さの最大値
		var nowLoading = false; // 処理中フラグ
		var dropAreaSelector = params.dropAreaSelector;
		var maxFileSize = params.maxFileSize;
		var successCallback = params.successCallback;
		var errorCallback = params.errorCallback;

		var init = function(target) {

			// ファイルドロップ時のイベントリスナー
			var dropArea = $(dropAreaSelector);
			dropArea.on('dragenter', function (event) {
				event.preventDefault();
				event.stopPropagation();
			});
			dropArea.on('dragover', function (event) {
				event.preventDefault();
				event.stopPropagation();
			});
			dropArea.on('drop', function (event) {
				event.preventDefault();
				event.stopPropagation();
				var files = event.originalEvent.dataTransfer.files;
				if (files.length === 0) {
					return;
				}
				exec(event.originalEvent.dataTransfer);
			});
			
			// ファイル選択時のイベントリスナー
			$(target).change(function(){
				if (this.files.length === 0) {
					return;
				}
				exec(this);
			});
		}

		var exec = function(obj) {

			if (nowLoading) {
				// 処理中です。
				return;
			}
		
			nowLoading = true;

			// ファイルAPIに対応している場合は、画像チェックとサイズチェックをクライアント側でも行う。
			if (window.File && window.FileReader && window.FileList && window.Blob){
				var errors = [];
				$.each(obj.files, function(i, file){
					// 画像ファイルチェック
					if( !file.type.match("image.*") ){
						errors.push('画像ファイルが不正です。');
					}
					// ファイルサイズチェック
					if( maxFileSize < file.size ){
						errors.push('画像ファイルのファイルサイズが最大値('+(maxFileSize/1000000)+'MB)を超えています。');
					}
				});

				if (0 < errors.length) {
					nowLoading = false;
					errorCallback(errors);
				}
				
				$.each(obj.files, function(i, file){
					var image = new Image();
					var fr=new FileReader();
					fr.onload=function(evt) {
						// リサイズする
						image.onload = function() {
							var width, height;
							if(image.width > image.height){
								// 横長の画像は横のサイズを指定値にあわせる
								var ratio = image.height/image.width;
								width = THUMBNAIL_WIDTH;
								height = THUMBNAIL_WIDTH * ratio;
							} else {
								// 縦長の画像は縦のサイズを指定値にあわせる
								var ratio = image.width/image.height;
								width = THUMBNAIL_HEIGHT * ratio;
								height = THUMBNAIL_HEIGHT;
							}
							// サムネ描画用canvasのサイズを上で算出した値に変更
							var canvas = $('<canvas id="canvas" width="0" height="0" ></canvas>')
								.attr('width', width)
								.attr('height', height);
							var ctx = canvas[0].getContext('2d');
							// canvasに既に描画されている画像をクリア
							ctx.clearRect(0,0,width,height);
							// canvasにサムネイルを描画
							ctx.drawImage(image,0,0,image.width,image.height,0,0,width,height);
			
							// canvasからbase64画像データを取得
							var base64 = canvas.get(0).toDataURL('image/jpeg');
							// base64からBlobデータを作成
							var barr, bin, i, len;
							bin = atob(base64.split('base64,')[1]);
							len = bin.length;
							barr = new Uint8Array(len);
							i = 0;
							while (i < len) {
								barr[i] = bin.charCodeAt(i);
								i++;
							}
							blob = new Blob([barr], {type: 'image/jpeg'});

							successCallback({
								ofileData: evt.target.result,
								fileData: base64,
								fileName: file.name,
								ofileSize: file.size,
								fileSize: blob.size,
								fileType: blob.type
							});
							
							nowLoading = false;
						}
						image.src = evt.target.result;

					}
					fr.readAsDataURL(file);
				});
			}

		}

		$(this).each(function() {
			init(this);
		});

		return this;
	}
	
	$.fn.imageUploader.defaults = {
		dropAreaSelector: '',
		maxFileSize : 10485760, // 10BM
		successCallback : function(res) {console.log(res);},
		errorCallback : function(res) {console.log(res);}
	}

})(jQuery);

