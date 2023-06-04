# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'ツールエリアのバリデーションチェック', js: true do
  describe '単項目のチェック' do
    it('バリデーションエラーがないときは、エラー文言が表示されず、更新ボタンが押せる') do
      tree1 = create(:tree)
      nodes1 = create_list(:node, 3, tree: tree1)
      create(:layer, tree: tree1, parent_node: nodes1[0])
      nodes1[1].name = '子1'
      nodes1[0].children = [nodes1[1], nodes1[2]]
      visit edit_tree_path(tree1)
      find('g > text', text: '子1').ancestor('g.rd3t-leaf-node').click
      expect(page).not_to have_css('span.text-error')
      expect(page).not_to have_field('input.input-error')
      # 更新ボタンが押せる
      expect(page).to have_css('label.btn.btn-primary:not(.btn-disabled)', text: '更新')
    end

    it('名前は必須項目なので、空のときはエラーメッセージが表示される') do
      tree1 = create(:tree)
      nodes1 = create_list(:node, 3, tree: tree1)
      create(:layer, tree: tree1, parent_node: nodes1[0])
      nodes1[1].name = '子1'
      nodes1[0].children = [nodes1[1], nodes1[2]]
      visit edit_tree_path(tree1)
      find('g > text', text: '子1').ancestor('g.rd3t-leaf-node').click

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
      tree1 = create(:tree)
      nodes1 = create_list(:node, 3, tree: tree1)
      create(:layer, tree: tree1, parent_node: nodes1[0])
      nodes1[1].name = '子1'
      nodes1[0].children = [nodes1[1], nodes1[2]]
      visit edit_tree_path(tree1)
      find('g > text', text: '子1').ancestor('g.rd3t-leaf-node').click

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
      tree1 = create(:tree)
      nodes1 = create_list(:node, 3, tree: tree1)
      create(:layer, tree: tree1, parent_node: nodes1[0])
      nodes1[1].name = '子1'
      nodes1[0].children = [nodes1[1], nodes1[2]]
      visit edit_tree_path(tree1)
      find('g > text', text: '子1').ancestor('g.rd3t-leaf-node').click

      find_by_id('node-detail-1').find('input[name="name"]').set('')
      find_by_id('node-detail-1').find('input[name="value"]').set('')
      sleep 5
      expect(page).to have_css('span.text-error', text: '必須項目です', count: 2)
      expect(find_by_id('node-detail-1').find('input[name="name"]')['class']).to include('input-error')
      expect(find_by_id('node-detail-1').find('input[name="value"]')['class']).to include('input-error')
      expect(page).to have_css('label.btn.btn-primary.btn-disabled', text: '更新')
    end

    it('必須項目エラーが出ている時に他の項目を変更しても、エラーは消えない') do
      tree1 = create(:tree)
      nodes1 = create_list(:node, 3, tree: tree1)
      create(:layer, tree: tree1, parent_node: nodes1[0])
      nodes1[1].name = '子1'
      nodes1[0].children = [nodes1[1], nodes1[2]]
      visit edit_tree_path(tree1)
      find('g > text', text: '子1').ancestor('g.rd3t-leaf-node').click

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
      tree1 = create(:tree)
      nodes1 = create_list(:node, 3, tree: tree1)
      create(:layer, tree: tree1, parent_node: nodes1[0])
      nodes1[1].name = '子1'
      nodes1[0].children = [nodes1[1], nodes1[2]]
      visit edit_tree_path(tree1)
      find('g > text', text: '子1').ancestor('g.rd3t-leaf-node').click

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
      tree1 = create(:tree)
      nodes1 = create_list(:node, 3, tree: tree1)
      create(:layer, tree: tree1, parent_node: nodes1[0])
      nodes1[1].name = '子1'
      nodes1[0].children = [nodes1[1], nodes1[2]]
      visit edit_tree_path(tree1)
      find('g > text', text: '子1').ancestor('g.rd3t-leaf-node').click

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

  describe '表示形式が%のときは、単位は入力できない' do
    it('単位入力なし・表示形式%の状態から、単位を入力するとエラーを表示する') do
      tree1 = create(:tree)
      nodes1 = create_list(:node, 3, tree: tree1)
      create(:layer, tree: tree1, parent_node: nodes1[0])
      nodes1[1].name = '子1'
      nodes1[1].value_format = 1 # %
      nodes1[1].unit = ''
      nodes1[0].children = [nodes1[1], nodes1[2]]
      visit edit_tree_path(tree1)
      find('g > text', text: '子1').ancestor('g.rd3t-leaf-node').click

      find_by_id('node-detail-1').find('input[name="unit"]').set('円')
      expect(page).to have_css('span.text-error', text: '％表示のときは単位を空にしてください', count: 2)
      expect(find_by_id('node-detail-1').find('input[name="unit"]')['class']).to include('input-error')
      expect(find_by_id('node-detail-1').find('select[name="valueFormat"]')['class']).to include('select-error')
      expect(page).to have_css('label.btn.btn-primary.btn-disabled', text: '更新')
    end

    it('単位入力あり・表示形式万の状態から、表示形式を%に変更するとエラーを表示する') do
      tree1 = create(:tree)
      nodes1 = create_list(:node, 3, tree: tree1)
      create(:layer, tree: tree1, parent_node: nodes1[0])
      nodes1[1].name = '子1'
      nodes1[0].children = [nodes1[1], nodes1[2]]
      visit edit_tree_path(tree1)
      find('g > text', text: '子1').ancestor('g.rd3t-leaf-node').click

      find_by_id('node-detail-1').find('select[name="valueFormat"]').select('%')
      expect(page).to have_css('span.text-error', text: '％表示のときは単位を空にしてください', count: 2)
      expect(find_by_id('node-detail-1').find('input[name="unit"]')['class']).to include('input-error')
      expect(find_by_id('node-detail-1').find('select[name="valueFormat"]')['class']).to include('select-error')
      expect(page).to have_css('label.btn.btn-primary.btn-disabled', text: '更新')
    end

    it('単位入力あり・表示形式%でエラーを表示している状態で、表示形式を「なし」に変更するとエラーが消える') do
      tree1 = create(:tree)
      nodes1 = create_list(:node, 3, tree: tree1)
      create(:layer, tree: tree1, parent_node: nodes1[0])
      nodes1[1].name = '子1'
      nodes1[0].children = [nodes1[1], nodes1[2]]
      visit edit_tree_path(tree1)
      find('g > text', text: '子1').ancestor('g.rd3t-leaf-node').click

      find_by_id('node-detail-1').find('select[name="valueFormat"]').select('%')
      expect(page).to have_css('span.text-error', text: '％表示のときは単位を空にしてください', count: 2)

      find_by_id('node-detail-1').find('select[name="valueFormat"]').select('なし')
      expect(page).not_to have_css('span.text-error')
      expect(page).not_to have_field('input.input-error')
      expect(page).to have_css('label.btn.btn-primary:not(.btn-disabled)', text: '更新')
    end

    it('単位入力あり・表示形式%でエラーを表示している状態で、単位を空に変更するとエラーが消える') do
      tree1 = create(:tree)
      nodes1 = create_list(:node, 3, tree: tree1)
      create(:layer, tree: tree1, parent_node: nodes1[0])
      nodes1[1].name = '子1'
      nodes1[0].children = [nodes1[1], nodes1[2]]
      visit edit_tree_path(tree1)
      find('g > text', text: '子1').ancestor('g.rd3t-leaf-node').click

      find_by_id('node-detail-1').find('select[name="valueFormat"]').select('%')
      expect(page).to have_css('span.text-error', text: '％表示のときは単位を空にしてください', count: 2)

      find_by_id('node-detail-1').find('input[name="unit"]').set('')
      expect(page).not_to have_css('span.text-error')
      expect(page).not_to have_field('input.input-error')
      expect(page).to have_css('label.btn.btn-primary:not(.btn-disabled)', text: '更新')
    end

    it('単位入力あり・表示形式%でエラーを表示している状態で、単位を空にしてエラーを消す→再び単位を入力するとエラーが表示される') do
      tree1 = create(:tree)
      nodes1 = create_list(:node, 3, tree: tree1)
      create(:layer, tree: tree1, parent_node: nodes1[0])
      nodes1[1].name = '子1'
      nodes1[0].children = [nodes1[1], nodes1[2]]
      visit edit_tree_path(tree1)
      find('g > text', text: '子1').ancestor('g.rd3t-leaf-node').click

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
      tree1 = create(:tree)
      nodes1 = create_list(:node, 3, tree: tree1)
      create(:layer, tree: tree1, parent_node: nodes1[0])
      nodes1[1].name = '子1'
      nodes1[0].children = [nodes1[1], nodes1[2]]
      visit edit_tree_path(tree1)
      find('g > text', text: '子1').ancestor('g.rd3t-leaf-node').click

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
    it('名前の必須チェック') do
      tree2 = create(:tree)
      create(:node, name: 'ルート', tree: tree2)
      visit edit_tree_path(tree2)
      find('g > text', text: 'ルート').ancestor('g:not([class])').click

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
end
