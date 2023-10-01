# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'ツールエリアのバリデーションチェック', :js, :login_required do
  before do
    # ログイン
    visit log_out_path
    visit root_path
    click_button 'ログイン'

    # データの作成
    tree = create(:tree, user: User.find_by(uid: '1234'))
    root_node = create(:node, tree:, name: 'ルート', value: 1000, value_format: '万', unit: '円', is_value_locked: true)
    create(:node, tree:, name: '子1', value: 5000, value_format: 'なし', unit: '人', is_value_locked: false,
                  parent: root_node)
    create(:node, tree:, name: '子2', value: 2000, value_format: 'なし', unit: '円', is_value_locked: false,
                  parent: root_node)
    create(:layer, tree:, operation: 'multiply', fraction: 0, parent_node: root_node)

    # ツリー編集画面を表示し、ノードをクリックしてツールエリアを開く
    visit edit_tree_path(tree)
    find('g > text', text: '子1').ancestor('g.rd3t-leaf-node').click
  end

  describe 'ノードの単項目のチェック' do
    it('バリデーションエラーがないときは、エラー文言が表示されず、更新ボタンが押せる') do
      # 初期表示でバリデーションエラーがない状態
      expect(page).not_to have_css('span.text-error')
      expect(page).not_to have_field('input.input-error')
      expect(page).to have_css('label.btn.btn-primary:not(.btn-disabled)', text: '更新')
    end

    it('名前は必須項目なので、空のときはエラーメッセージが表示される') do
      # 名前が空になると、エラーメッセージが表示され、nameのinput要素がエラー色に変わり、更新ボタンが押せなくなる
      find_by_id('node-detail-1').find('input[name="name"]').set('')
      expect(page).to have_css('span.text-error', text: '必須項目です', count: 1)
      expect(find_by_id('node-detail-1').find('input[name="name"]')['class']).to include('input-error')
      expect(page).to have_css('label.btn.btn-primary.btn-disabled', text: '更新')

      # 名前を入力すると、エラーが消え、更新ボタンが押せるようになる
      find_by_id('node-detail-1').find('input[name="name"]').set('再入力したノード名')
      expect(page).not_to have_css('span.text-error')
      expect(find_by_id('node-detail-1').find('input[name="name"]')['class']).not_to include('input-error')
      expect(page).to have_css('label.btn.btn-primary:not(.btn-disabled)', text: '更新')
    end

    it('数値は必須項目なので、空のときはエラーメッセージが表示される') do
      # 数値が空になると、エラーメッセージが表示され、valueのinput要素がエラー色に変わり、更新ボタンが押せなくなる
      find_by_id('node-detail-1').find('input[name="value"]').set('')
      expect(page).to have_css('span.text-error', text: '必須項目です', count: 1)
      expect(find_by_id('node-detail-1').find('input[name="value"]')['class']).to include('input-error')
      expect(page).to have_css('label.btn.btn-primary.btn-disabled', text: '更新')

      # 数値を入力すると、エラーが消え、更新ボタンが押せるようになる
      find_by_id('node-detail-1').find('input[name="value"]').set(100)
      expect(page).not_to have_css('span.text-error')
      expect(find_by_id('node-detail-1').find('input[name="value"]')['class']).not_to include('input-error')
      expect(page).to have_css('label.btn.btn-primary:not(.btn-disabled)', text: '更新')
    end

    it('名前・数値共に空のときは必須項目エラーがそれぞれ出る') do
      find_by_id('node-detail-1').find('input[name="name"]').set('')
      find_by_id('node-detail-1').find('input[name="value"]').set('')
      expect(page).to have_css('span.text-error', text: '必須項目です', count: 2)
      expect(find_by_id('node-detail-1').find('input[name="name"]')['class']).to include('input-error')
      expect(find_by_id('node-detail-1').find('input[name="value"]')['class']).to include('input-error')
      expect(page).to have_css('label.btn.btn-primary.btn-disabled', text: '更新')
    end

    it('名前・数値共にスペース入力時も必須項目エラーがそれぞれ出る') do
      find_by_id('node-detail-1').find('input[name="name"]').set('　') # 全角スペース
      find_by_id('node-detail-1').find('input[name="value"]').set(' ') # 半角スペース
      expect(page).to have_css('span.text-error', text: '必須項目です', count: 2)
      expect(find_by_id('node-detail-1').find('input[name="name"]')['class']).to include('input-error')
      expect(find_by_id('node-detail-1').find('input[name="value"]')['class']).to include('input-error')
      expect(page).to have_css('label.btn.btn-primary.btn-disabled', text: '更新')
    end

    it('必須項目エラーが出ている時に他の項目を変更しても、エラーは消えない') do
      find_by_id('node-detail-1').find('input[name="name"]').set('')
      expect(page).to have_css('span.text-error', text: '必須項目です', count: 1)
      expect(find_by_id('node-detail-1').find('input[name="name"]')['class']).to include('input-error')
      expect(page).to have_css('label.btn.btn-primary.btn-disabled', text: '更新')
      # 別な要素を変更しても、必須項目エラーは消えない
      find_by_id('node-detail-1').find('select[name="valueFormat"]').select('万')
      expect(page).to have_css('span.text-error', text: '必須項目です', count: 1)
      expect(find_by_id('node-detail-1').find('input[name="name"]')['class']).to include('input-error')
      expect(page).to have_css('label.btn.btn-primary.btn-disabled', text: '更新')
    end

    it('数値は数値のみ入力可能なので、数値以外の文字を入力するとエラーメッセージが表示される') do
      # 数値が空になると、エラーメッセージが表示され、valueのinput要素がエラー色に変わり、更新ボタンが押せなくなる
      find_by_id('node-detail-1').find('input[name="value"]').set('文字列')
      expect(page).to have_css('span.text-error', text: '数値を入力してください', count: 1)
      expect(find_by_id('node-detail-1').find('input[name="value"]')['class']).to include('input-error')
      expect(page).to have_css('label.btn.btn-primary.btn-disabled', text: '更新')

      # 数値を入力すると、エラーが消え、更新ボタンが押せるようになる
      find_by_id('node-detail-1').find('input[name="value"]').set(100)
      expect(page).not_to have_css('span.text-error')
      expect(find_by_id('node-detail-1').find('input[name="value"]')['class']).not_to include('input-error')
      expect(page).to have_css('label.btn.btn-primary:not(.btn-disabled)', text: '更新')
    end

    it('数値が空→数値以外の文字に変更した場合、表示されるエラーメッセージが変わる') do
      find_by_id('node-detail-1').find('input[name="value"]').set('')
      expect(page).to have_css('span.text-error', text: '必須項目です', count: 1)
      expect(find_by_id('node-detail-1').find('input[name="value"]')['class']).to include('input-error')
      expect(page).to have_css('label.btn.btn-primary.btn-disabled', text: '更新')

      find_by_id('node-detail-1').find('input[name="value"]').set('文字列')
      expect(page).not_to have_css('span.text-error', text: '必須項目です', count: 1)
      expect(page).to have_css('span.text-error', text: '数値を入力してください', count: 1)
      expect(find_by_id('node-detail-1').find('input[name="value"]')['class']).to include('input-error')
      expect(page).to have_css('label.btn.btn-primary.btn-disabled', text: '更新')
    end
  end

  describe '端数の数値形式チェック' do
    it('端数が空白のときは、エラーは表示されない') do
      find('input[name="fraction"]').set('')
      expect(page).not_to have_css('span.text-error')
      expect(page).not_to have_field('input.input-error')
      expect(page).to have_css('label.btn.btn-primary:not(.btn-disabled)', text: '更新')
    end

    it('端数に数値を入力すると、エラーは表示されない') do
      find('input[name="fraction"]').set(50)
      expect(page).not_to have_css('span.text-error')
      expect(page).not_to have_field('input.input-error')
      expect(page).to have_css('label.btn.btn-primary:not(.btn-disabled)', text: '更新')
    end

    it('端数に文字列を入力すると、エラーが表示される') do
      find('input[name="fraction"]').set('aaa')
      expect(page).to have_css('span.text-error', text: '数値を入力してください', count: 1)
      expect(find('input[name="fraction"]')['class']).to include('input-error')
      expect(page).to have_css('label.btn.btn-primary.btn-disabled', text: '更新')
    end

    it('端数に負の数を入力するとき、-を入力した時点ではエラーが表示され、続けて数値を入力するとエラーは消える') do
      find('input[name="fraction"]').set('-')
      expect(page).to have_css('span.text-error', text: '数値を入力してください', count: 1)
      expect(find('input[name="fraction"]')['class']).to include('input-error')
      expect(page).to have_css('label.btn.btn-primary.btn-disabled', text: '更新')

      find_field('fraction').send_keys '50'
      expect(find('input[name="fraction"]')['value']).to eq('-50')
      expect(page).not_to have_css('span.text-error')
      expect(page).not_to have_field('input.input-error')
      expect(page).to have_css('label.btn.btn-primary:not(.btn-disabled)', text: '更新')
    end

    it('端数に符号以外の文字列を入力するとき、続けて数値を入力してもエラーは消えない') do
      find('input[name="fraction"]').set('-')
      expect(page).to have_css('span.text-error', text: '数値を入力してください', count: 1)
      expect(find('input[name="fraction"]')['class']).to include('input-error')
      expect(page).to have_css('label.btn.btn-primary.btn-disabled', text: '更新')

      find_field('fraction').send_keys '--'
      expect(page).to have_css('span.text-error', text: '数値を入力してください', count: 1)
      expect(find('input[name="fraction"]')['class']).to include('input-error')
      expect(page).to have_css('label.btn.btn-primary.btn-disabled', text: '更新')
    end
  end

  describe '表示形式が%のときは、単位は入力できない' do
    it('単位入力なし・表示形式%の状態から、単位を入力するとエラーを表示する') do
      tree = create(:tree, user: User.find_by(uid: '1234'))
      root_node = create(:node, tree:, name: 'ルート', value: 1000, value_format: '万', unit: '円', is_value_locked: true)
      create(:node, tree:, name: '子1', value: 5000, value_format: '%', unit: '', is_value_locked: false,
                    parent: root_node)
      create(:node, tree:, name: '子2', parent: root_node)
      create(:layer, tree:, operation: 'multiply', parent_node: root_node)
      visit edit_tree_path(tree)
      find('g > text', text: '子1').ancestor('g.rd3t-leaf-node').click

      find_by_id('node-detail-1').find('input[name="unit"]').set('円')
      expect(page).to have_css('span.text-error', text: '％表示のときは単位を空にしてください', count: 2)
      expect(find_by_id('node-detail-1').find('input[name="unit"]')['class']).to include('input-error')
      expect(find_by_id('node-detail-1').find('select[name="valueFormat"]')['class']).to include('select-error')
      expect(page).to have_css('label.btn.btn-primary.btn-disabled', text: '更新')
    end

    it('単位入力あり・表示形式万の状態から、表示形式を%に変更するとエラーを表示する') do
      find_by_id('node-detail-1').find('select[name="valueFormat"]').select('%')
      expect(page).to have_css('span.text-error', text: '％表示のときは単位を空にしてください', count: 2)
      expect(find_by_id('node-detail-1').find('input[name="unit"]')['class']).to include('input-error')
      expect(find_by_id('node-detail-1').find('select[name="valueFormat"]')['class']).to include('select-error')
      expect(page).to have_css('label.btn.btn-primary.btn-disabled', text: '更新')
    end

    it('単位入力あり・表示形式%でエラーを表示している状態で、表示形式を「なし」に変更するとエラーが消える') do
      find_by_id('node-detail-1').find('select[name="valueFormat"]').select('%')
      expect(page).to have_css('span.text-error', text: '％表示のときは単位を空にしてください', count: 2)

      find_by_id('node-detail-1').find('select[name="valueFormat"]').select('なし')
      expect(page).not_to have_css('span.text-error')
      expect(page).not_to have_field('input.input-error')
      expect(page).to have_css('label.btn.btn-primary:not(.btn-disabled)', text: '更新')
    end

    it('単位入力あり・表示形式%でエラーを表示している状態で、単位を空に変更するとエラーが消える') do
      find_by_id('node-detail-1').find('select[name="valueFormat"]').select('%')
      expect(page).to have_css('span.text-error', text: '％表示のときは単位を空にしてください', count: 2)

      find_by_id('node-detail-1').find('input[name="unit"]').set('')
      expect(page).not_to have_css('span.text-error')
      expect(page).not_to have_field('input.input-error')
      expect(page).to have_css('label.btn.btn-primary:not(.btn-disabled)', text: '更新')
    end

    it('単位入力あり・表示形式%でエラーを表示している状態で、単位を空にしてエラーを消す→再び単位を入力するとエラーが表示される') do
      find_by_id('node-detail-1').find('select[name="valueFormat"]').select('%')
      expect(page).to have_css('span.text-error', text: '％表示のときは単位を空にしてください', count: 2)

      find_by_id('node-detail-1').find('input[name="unit"]').set('')
      expect(page).not_to have_css('span.text-error')
      expect(page).not_to have_field('input.input-error')
      expect(page).to have_css('label.btn.btn-primary:not(.btn-disabled)', text: '更新')

      find_by_id('node-detail-1').find('input[name="unit"]').set('再び単位を入力')
      expect(page).to have_css('span.text-error', text: '％表示のときは単位を空にしてください', count: 2)
    end

    it('単位入力あり・表示形式%でエラーを表示している状態で、表示形式を万にしてエラーを消す→再び表示形式を%にするとエラーが表示される') do
      find_by_id('node-detail-1').find('select[name="valueFormat"]').select('%')
      expect(page).to have_css('span.text-error', text: '％表示のときは単位を空にしてください', count: 2)

      find_by_id('node-detail-1').find('select[name="valueFormat"]').select('万')
      expect(page).not_to have_css('span.text-error')
      expect(page).not_to have_field('input.input-error')
      expect(page).to have_css('label.btn.btn-primary:not(.btn-disabled)', text: '更新')

      find_by_id('node-detail-1').find('select[name="valueFormat"]').select('%')
      expect(page).to have_css('span.text-error', text: '％表示のときは単位を空にしてください', count: 2)
    end
  end

  describe 'ルートノードのときにもバリデーションチェックが存在する' do
    before do
      # データの作成
      tree = create(:tree, user: User.find_by(uid: '1234'))
      root_node = create(:node, tree:, name: 'ルート', value: 1000, value_format: '万', unit: '円', is_value_locked: true)
      create(:node, tree:, name: '子1', parent: root_node)
      create(:node, tree:, name: '子2', parent: root_node)
      create(:layer, tree:, parent_node: root_node)

      # ツリー編集画面を表示し、ノードをクリックしてツールエリアを開く
      visit edit_tree_path(tree)
      find('g > text', text: 'ルート').ancestor('g.custom-node').click
    end

    it('名前の必須チェック') do
      # 名前が空になると、エラーメッセージが表示され、nameのinput要素がエラー色に変わり、更新ボタンが押せなくなる
      find_by_id('node-detail-1').find('input[name="name"]').set('')
      expect(page).to have_css('span.text-error', text: '必須項目です', count: 1)
      expect(find_by_id('node-detail-1').find('input[name="name"]')['class']).to include('input-error')
      expect(page).to have_css('label.btn.btn-primary.btn-disabled', text: '更新')

      # 名前を入力すると、エラーが消え、更新ボタンが押せるようになる
      find_by_id('node-detail-1').find('input[name="name"]').set('再入力したノード名')
      expect(page).not_to have_css('span.text-error')
      expect(find_by_id('node-detail-1').find('input[name="name"]')['class']).not_to include('input-error')
      expect(page).to have_css('label.btn.btn-primary:not(.btn-disabled)', text: '更新')
    end
  end

  describe 'バリデーションエラーが出ている状態で別な階層を開く' do
    before do
      tree = create(:tree, user: User.find_by(uid: '1234'))
      root_node = create(:node, tree:, name: 'ルート', value: 1000, value_format: '万', unit: '円', is_value_locked: true)
      child_node1 = create(:node, tree:, name: '子1', parent: root_node)
      create(:node, tree:, name: '子2', parent: root_node)
      create(:layer, tree:, parent_node: root_node)
      create(:node, tree:, name: '孫1-1', parent: child_node1)
      create(:node, tree:, name: '孫1-2', parent: child_node1)
      create(:layer, tree:, parent_node: child_node1)
      visit edit_tree_path(tree)
      find('g > text', text: '子1').ancestor('g.rd3t-node').click
    end

    it('別な階層を開くと、エラー表示は消える') do
      # すべてのバリデーションエラーが出ている状態
      find_by_id('node-detail-1').find('input[name="name"]').set('')
      find_by_id('node-detail-1').find('input[name="value"]').set('aaa')
      find_by_id('node-detail-1').find('input[name="unit"]').set('円')
      find_by_id('node-detail-1').find('select[name="valueFormat"]').select('%')
      find_field('fraction').set('----')
      expect(page).to have_css('span.text-error', text: '必須項目です', count: 1)
      expect(page).to have_css('span.text-error', text: '数値を入力してください', count: 2)
      expect(page).to have_css('span.text-error', text: '％表示のときは単位を空にしてください', count: 2)

      # 別な階層を開くと、エラーは表示されていない
      find('g > text', text: '孫1-1').ancestor('g.rd3t-leaf-node').click
      expect(page).not_to have_css('span.text-error')
      expect(page).not_to have_field('input.input-error')
      expect(page).to have_css('label.btn.btn-primary:not(.btn-disabled)', text: '更新')

      # 最初の階層に戻ると、エラーは表示されていない
      find('g > text', text: '子1').ancestor('g.rd3t-node').click
      expect(page).not_to have_css('span.text-error')
      expect(page).not_to have_field('input.input-error')
      expect(page).to have_css('label.btn.btn-primary:not(.btn-disabled)', text: '更新')
    end
  end
end
