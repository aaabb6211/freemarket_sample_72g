$(document).on('turbolinks:load', function(){
  $(function(){
    var label_box = $('.label-box')
    var label_content = $('.label-content')
    //プレビューのhtmlを定義
    function buildHTML(count) {
      var html = `<div class="preview-box" id="preview-box__${count}">
                    <div class="upper-box">
                      <img src="" alt="preview">
                    </div>
                    <div class="lower-box">
                      <div class="update-box">
                        <label class="edit_btn">編集</label>
                      </div>
                      <div class="delete-box" id="delete_btn_${count}">
                        <span>削除</span>
                      </div>
                    </div>
                  </div>`
      return html;
    }

    if (window.location.href.match(/\/goods\/\d+\/edit/)){
      //登録済み画像のプレビュー表示欄の要素を取得する
      var prevContent = $('.label-content').prev();
      labelWidth = (620 - $(prevContent).css('width').replace(/[^0-9]/g, ''));
      $('.label-content').css('width', labelWidth);
      //プレビューにidを追加
      $('.preview-box').each(function(index, box){
        $(box).attr('id', `preview-box__${index}`);
      })
      //削除ボタンにidを追加
      $('.delete-box').each(function(index, box){
        $(box).attr('id', `delete_btn_${index}`);
      })
      var count = $('.preview-box').length;
      //プレビューが4あるときは、投稿ボックスを消しておく
      if (count == 4) {
        $('.label-content').hide();
      }
    }

    // ラベルのwidth操作
    function setLabel() {
      //プレビューボックスのwidthを取得し、maxから引くことでラベルのwidthを決定
      var prevContent = label_content.prev();
      labelWidth = (520 - $(prevContent).css('width').replace(/[^0-9]/g, ''));
      label_content.css('width', labelWidth);
    }

    // プレビューの追加
    $(document).on('change', '.hidden-field', function() {
      setLabel();
      //hidden-fieldのidの数値のみ取得
      var id = $(this).attr('id').replace(/[^0-9]/g, '');
      //labelボックスのidとforを更新
      label_box.attr({id: `label-box--${id}`,for: `item_images_attributes_${id}_image`});
      //選択したfileのオブジェクトを取得
      var file = this.files[0];
      var reader = new FileReader();
      //readAsDataURLで指定したFileオブジェクトを読み込む
      reader.readAsDataURL(file);
      //読み込み時に発火するイベント
      reader.onload = function() {
        var image = this.result;
        //プレビューが元々なかった場合はhtmlを追加
        if ($(`#preview-box__${id}`).length == 0) {
          var count = $('.preview-box').length;
          var html = buildHTML(id);
          //ラベルの直前のプレビュー群にプレビューを追加
          var prevContent = label_content.prev();
          $(prevContent).append(html);
        }
        //イメージを追加
        $(`#preview-box__${id} img`).attr('src', `${image}`);
        var count = $('.preview-box').length;
        //プレビューが4個あったらラベルを隠す 
        if (count == 4) { 
          label_content.hide();
        }

        if ($(`#item_images_attributes_${id}__destroy`)){
          $(`#item_images_attributes_${id}__destroy`).prop('checked',false);
        } 

        //ラベルのwidth操作
        setLabel();
        //ラベルのidとforの値を変更
        if(count < 4){
          //プレビューの数でラベルのオプションを更新する
          label_box.attr({id: `label-box--${count}`,for: `item_images_attributes_${count}_image`});
        }
      }
    });
    
    // 画像消去
    $(document).on('click', '.delete-box', function() {
      var count = $('.preview-box').length;
      setLabel(count);
      //delete-boxのidの数値のみ取得
      var id = $(this).attr('id').replace(/[^0-9]/g, '');
      $(`#preview-box__${id}`).remove();
      //新規投稿
      if ($(`#item_images_attributes_${id}__destroy`).length == 0) {
        $(`#item_images_attributes_${id}_image`).val("");
        //削除時のラベル操作
        var count = $('.preview-box').length;
        //4個めが消されたらラベルを表示
        if (count == 3) {
          label_contentshow();
        }
        setLabel(count);
        if(id < 4){
          //削除された際に、空っぽになったfile_fieldをもう一度入力可能にする
          label_box.attr({id: `label-box--${id}`,for: `item_images_attributes_${id}_image`});
        }
      //編集
      } else {
        $(`#item_images_attributes_${id}__destroy`).prop('checked',true);
        //5個めが消されたらラベルを表示
        if (count == 3) {
          $('.label-content').show();
        }
        //ラベルのwidth操作
        setLabel();
        //ラベルのidとforの値を変更
        //削除したプレビューのidによって、ラベルのidを変更する
        if(id < 4){
          $('.label-box').attr({id: `label-box--${id}`,for: `item_images_attributes_${id}_image`});
        }
      }    
    })
  });
})
