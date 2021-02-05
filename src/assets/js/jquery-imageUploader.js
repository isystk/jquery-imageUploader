
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
					var fr=new FileReader();
					fr.onload=function(evt) {
						var res = {
							fileData: evt.target.result
						};
					
						// エラー処理
						if (res.errors) {
							errorCallback(res.errors);
							return false;
						}

						console.log(res, file)

						successCallback({
							fileData: res.fileData,
							fileName: file.name,
							fileSize: file.size,
							fileType: file.type
						});

						nowLoading = false;
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

