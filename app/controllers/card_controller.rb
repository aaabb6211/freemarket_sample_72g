class CardController < ApplicationController
  require "payjp"
  before_action :create_hash

  def new
    card = Card.where(user_id: current_user.id)
    redirect_to action: "show" if card.exists?
  end

  def pay
    Payjp.api_key = ENV["PAYJP_PRIVATE_KEY"]
    if params['payjp-token'].blank?
      redirect_to action: "new"
    else
      customer = Payjp::Customer.create(
      card: params['payjp-token'],
      metadata: {user_id: current_user.id}
      )
      @card = Card.new(user_id: current_user.id, customer_id: customer.id, card_id: customer.default_card)
      if @card.save
        redirect_to action: "show"
      else
        redirect_to action: "pay"
      end
    end
  end

  def delete
    card = Card.find_by(user_id: current_user.id)
    if card.blank?
    else
      Payjp.api_key = ENV["PAYJP_PRIVATE_KEY"]
      customer = Payjp::Customer.retrieve(card.customer_id)
      customer.delete
      card.delete
    end
      redirect_to action: "new"
  end


  def show
    card = Card.find_by(user_id: current_user.id)
    if card.blank?
      redirect_to action: "new" 
    else
      Payjp.api_key = ENV['PAYJP_PRIVATE_KEY']
      customer = Payjp::Customer.retrieve(card.customer_id)
      @default_card_information = customer.cards.retrieve(card.card_id)
    end
  end

  private
  def create_hash
    @contents = ["マイページ","お知らせ","やることリスト","いいね！一覧","出品する","下書き一覧","出品した商品-出品中","出品した商品-取引中","出品した商品-売却済み","購入した商品-取引中","購入した商品-過去の取引","ニュース一覧","評価一覧","ガイド","お問い合わせ"]
    @options = ["プロフィール","発送元・お届先住所変更","支払い方法","メール/パスワード","本人情報","電話番号の確認","ログアウト"]
    
    @bland = ["//pcweb-assets.mercdn.net/assets/img/card/visa.svg?1152353370","//pcweb-assets.mercdn.net/assets/img/card/master-card.svg?1152353370","//pcweb-assets.mercdn.net/assets/img/card/saison-card.svg?1152353370","//pcweb-assets.mercdn.net/assets/img/card/jcb.svg?1152353370","//pcweb-assets.mercdn.net/assets/img/card/american_express.svg?1152353370","//pcweb-assets.mercdn.net/assets/img/card/dinersclub.svg?1152353370","//pcweb-assets.mercdn.net/assets/img/card/discover.svg?1152353370"]
  end

end
