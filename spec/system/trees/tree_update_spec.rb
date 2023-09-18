# frozen_string_literal: true

require 'rails_helper'

RSpec.describe '階層・ノードのプロパティを編集・更新', js: true, login_required: true do
  before do
    visit log_out_path
    visit root_path
    click_button 'Googleでログイン'
  end

  describe('選択した階層のノードのプロパティを編集・更新') do
    before do
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

    it('なにもせずに更新ボタンを押すと、ツリーは更新されるが値は変わらず、ツールエリアが閉じる') do
      # 値をなにも編集せずに更新を実行
      find('#updateButton label', text: '更新').click
      find('.modal-action label', text: '更新する').click

      # 更新後のツリー表示が想定どおりであることを確認
      expect_tree_node(
        name: 'ルート',
        display_value: '1000万円',
        is_value_locked: true,
        operation: '',
        is_leaf: false
      )

      expect_tree_node(
        name: '子1',
        display_value: '5000人',
        is_value_locked: false,
        operation: 'multiply',
        is_leaf: true
      )

      expect_tree_node(
        name: '子2',
        display_value: '2000円',
        is_value_locked: false,
        operation: '',
        is_leaf: true
      )

      # 要素未選択状態に戻り、ツールエリアが閉じていることを確認
      all('g.custom-node > rect').each do |rect|
        expect(rect[:style]).not_to include('fill: moccasin')
      end
      expect(find_by_id('toolWrapper')).to have_content('要素を選択すると、ここに詳細が表示されます。')
    end

    it('ノードのプロパティを変更して更新を実行すると、更新後の値でツリーが表示される') do
      # 値を編集
      node_detail1 = find_by_id('node-detail-1')
      node_detail1.find('input[name="name"]').set('変更後のノード名1')
      node_detail1.find('input[name="unit"]').set('人（変更後）')
      node_detail1.find('input[name="value"]').set(2)
      node_detail1.find('select[name="valueFormat"]').select('千')
      node_detail1.find('input[name="isValueLocked"]').set(true)

      node_detail2 = find_by_id('node-detail-2')
      node_detail2.find('input[name="name"]').set('変更後のノード名2')
      node_detail2.find('input[name="unit"]').set('円（変更後）')
      node_detail2.find('input[name="value"]').set(4000)
      node_detail2.find('select[name="valueFormat"]').select('なし')
      node_detail2.find('input[name="isValueLocked"]').set(true)

      # 更新を実行
      find('#updateButton label', text: '更新').click
      find('.modal-action label', text: '更新する').click

      # 更新後のツリー表示が想定どおりであることを確認
      expect_tree_node(
        name: 'ルート',
        display_value: '1000万円',
        is_value_locked: true,
        operation: '',
        is_leaf: false
      )
      expect_tree_node(
        name: '変更後のノード名1',
        display_value: '2千人（変更後）',
        is_value_locked: true,
        operation: 'multiply',
        is_leaf: true,
        has_inconsistent_value: true
      )

      expect_tree_node(
        name: '変更後のノード名2',
        display_value: '4000円（変更後）',
        is_value_locked: true,
        operation: '',
        is_leaf: true,
        has_inconsistent_value: true
      )
    end

    it('要素間の関係を変更して更新すると、更新後の値でツリーが表示される') do
      # 値を編集
      click_button('たし算')

      # 更新を実行
      find('#updateButton label', text: '更新').click
      find('.modal-action label', text: '更新する').click

      # 更新後のツリー表示が想定どおりであることを確認
      expect_tree_node(
        name: 'ルート',
        display_value: '1000万円',
        is_value_locked: true,
        operation: '',
        is_leaf: false
      )

      expect_tree_node(
        name: '子1',
        display_value: '5000人',
        is_value_locked: false,
        operation: 'add',
        is_leaf: true,
        has_inconsistent_value: true
      )

      expect_tree_node(
        name: '子2',
        display_value: '2000円',
        is_value_locked: false,
        operation: '',
        is_leaf: true,
        has_inconsistent_value: true
      )
    end

    it('端数を変更して更新できる') do
      # 値を編集
      find('input[name="fraction"]').set(-50)

      # 更新を実行
      find('#updateButton label', text: '更新').click
      find('.modal-action label', text: '更新する').click

      # ツリー再読み込み後、更新後の値がセットされていることを確認
      find('g > text', text: '子1').ancestor('g.rd3t-leaf-node').click
      expect(find('input[name="fraction"]').value).to eq '-50'
    end

    it('要素間の関係、端数、ノード名、単位、数値、表示形式、数値の自動更新の全項目を変更し、更新すると、更新後の値でツリーが表示される') do
      # 値を編集
      click_button('たし算')
      find('input[name="fraction"]').set(50)

      node_detail1 = find_by_id('node-detail-1')
      node_detail1.find('input[name="name"]').set('子1\'')
      node_detail1.find('input[name="unit"]').set('人（変更後）')
      node_detail1.find('input[name="value"]').set(2)
      node_detail1.find('select[name="valueFormat"]').select('千')
      node_detail1.find('input[name="isValueLocked"]').set(true)

      node_detail2 = find_by_id('node-detail-2')
      node_detail2.find('input[name="name"]').set('子2\'')
      node_detail2.find('input[name="unit"]').set('円（変更後）')
      node_detail2.find('input[name="value"]').set(4000)
      node_detail2.find('select[name="valueFormat"]').select('なし')
      node_detail2.find('input[name="isValueLocked"]').set(true)

      # 更新を実行
      find('#updateButton label', text: '更新').click
      find('.modal-action label', text: '更新する').click

      # 更新後のツリー表示が想定どおりであることを確認
      expect_tree_node(
        name: 'ルート',
        display_value: '1000万円',
        is_value_locked: true,
        operation: '',
        is_leaf: false
      )
      expect_tree_node(
        name: '子1\'',
        display_value: '2千人（変更後）',
        is_value_locked: true,
        operation: 'add',
        is_leaf: true,
        has_inconsistent_value: true
      )

      expect_tree_node(
        name: '子2\'',
        display_value: '4000円（変更後）',
        is_value_locked: true,
        operation: '',
        is_leaf: true,
        has_inconsistent_value: true
      )

      find('g > text', text: '子2\'').ancestor('g.rd3t-leaf-node').click
      expect(find('input[name="fraction"]').value).to eq '50'
    end

    it('ルートノードを選択し、値を更新できる') do
      find('g > text', text: 'ルート').ancestor('g.rd3t-node').click

      # 値を編集
      node_detail1 = find_by_id('node-detail-1')
      node_detail1.find('input[name="name"]').set('ルート\'')
      node_detail1.find('input[name="unit"]').set('円\'')
      node_detail1.find('input[name="value"]').set(500)
      node_detail1.find('select[name="valueFormat"]').select('千')
      node_detail1.find('input[name="isValueLocked"]').set(false)

      # 更新を実行
      find('#updateButton label', text: '更新').click
      find('.modal-action label', text: '更新する').click

      # 更新後のツリー表示が想定どおりであることを確認
      expect_tree_node(
        name: 'ルート\'',
        display_value: '500千円\'',
        is_value_locked: false,
        operation: '',
        is_leaf: false
      )
      expect_tree_node(
        name: '子1',
        display_value: '5000人',
        is_value_locked: false,
        operation: 'multiply',
        is_leaf: true,
        has_inconsistent_value: true
      )
      expect_tree_node(
        name: '子2',
        display_value: '2000円',
        is_value_locked: false,
        operation: '',
        is_leaf: true,
        has_inconsistent_value: true
      )
    end

    it('更新操作を繰り返し（3回続けて）行うことができる') do
      # 編集と更新（1回目）
      find_by_id('node-detail-1').find('input[name="name"]').set('子1\'')
      find_by_id('node-detail-1').find('input[name="value"]').set(4)
      find_by_id('node-detail-1').find('select[name="valueFormat"]').select('千')
      find('#updateButton label', text: '更新').click
      find('.modal-action label', text: '更新する').click

      expect_tree_node(
        name: '子1\'',
        display_value: '4千人',
        is_value_locked: false,
        operation: 'multiply',
        is_leaf: true,
        has_inconsistent_value: true
      )

      # 編集と更新（2回目）
      find('g > text', text: '子1\'').ancestor('g.rd3t-leaf-node').click
      find_by_id('node-detail-1').find('input[name="name"]').set('子1\'\'')
      find_by_id('node-detail-1').find('input[name="value"]').set(1.5)
      find_by_id('node-detail-1').find('select[name="valueFormat"]').select('万')
      find('#updateButton label', text: '更新').click
      find('.modal-action label', text: '更新する').click

      expect_tree_node(
        name: '子1\'\'',
        display_value: '1.5万人',
        is_value_locked: false,
        operation: 'multiply',
        is_leaf: true,
        has_inconsistent_value: true
      )

      # 編集と更新（3回目）
      find('g > text', text: '子1\'\'').ancestor('g.rd3t-leaf-node').click
      find_by_id('node-detail-1').find('input[name="name"]').set('子1\'\'\'')
      find_by_id('node-detail-1').find('input[name="value"]').set(2500.1)
      find_by_id('node-detail-1').find('select[name="valueFormat"]').select('なし')
      find('#updateButton label', text: '更新').click
      find('.modal-action label', text: '更新する').click

      expect_tree_node(
        name: '子1\'\'\'',
        display_value: '2500.1人',
        is_value_locked: false,
        operation: 'multiply',
        is_leaf: true,
        has_inconsistent_value: true
      )
    end

    it('更新するボタンを押すと、モーダルが開く、キャンセルボタンを押すとモーダルが閉じる') do
      expect(page).not_to have_css('.modal-box')
      find('#updateButton label', text: '更新').click
      expect(page).to have_css('.modal-box')
      find('label[for="updateLayerModal"]', text: 'キャンセル').click
      expect(page).not_to have_css('.modal-box')
    end

    it('項目を編集してからツリー上で任意のノードをホバーしても、ツールエリアの表示は変わらない') do
      find_by_id('node-detail-1').find('input[name="name"]').set('変更後のノード名1')
      click_button 'たし算'
      find('g.custom-node', text: '子1').hover
      expect(find_by_id('node-detail-1').find('input[name="name"]').value).to eq '変更後のノード名1'
      expect(page).to have_button('たし算', class: 'bg-base-100 border border-neutral')
    end

    it('項目を編集してからツリー上で任意のノードをクリックすると、編集内容は失われてクリックしたノードを含む階層の情報でツールエリアが表示される') do
      find_by_id('node-detail-1').find('input[name="name"]').set('変更後のノード名1')
      click_button 'たし算'
      find('g.custom-node', text: '子1').click
      expect(find_by_id('node-detail-1').find('input[name="name"]').value).not_to eq '変更後のノード名1'
      expect(find_by_id('node-detail-1').find('input[name="name"]').value).to eq '子1'
      expect(page).to have_button('かけ算', class: 'bg-base-100 border border-neutral')
    end

    it('親ノードの数値と合わない状態で！アイコンが表示されているノードについて、数値が合うように編集して更新すると！アイコンが消える') do
      tree = create(:tree, user: User.find_by(uid: '1234'))
      root_node = create(:node, tree:, name: 'ルート', value: 1000, unit: '円', is_value_locked: true)
      create(:node, tree:, name: '子1', value: 500, unit: '円', is_value_locked: false,
                    parent: root_node)
      create(:node, tree:, name: '子2', value: 200, unit: '円', is_value_locked: false,
                    parent: root_node)
      create(:layer, tree:, operation: 'add', fraction: 10, parent_node: root_node)

      visit edit_tree_path(tree)
      expect_tree_node(name: 'ルート', display_value: '1000円', is_value_locked: true, is_leaf: false)
      expect_tree_node(name: '子1', display_value: '500円', is_value_locked: false, is_leaf: true,
                       has_inconsistent_value: true)
      expect_tree_node(name: '子2', display_value: '200円', is_value_locked: false, is_leaf: true,
                       has_inconsistent_value: true)
      find('g > text', text: '子1').ancestor('g.rd3t-leaf-node').click
      expect(find('.calculation')).to have_css('svg.fa-triangle-exclamation')
      find_by_id('node-detail-2').find('input[name="value"]').set(490)

      find('#updateButton label', text: '更新').click
      find('.modal-action label', text: '更新する').click

      expect_tree_node(name: 'ルート', display_value: '1000円', is_value_locked: true, is_leaf: false,
                       has_inconsistent_value: false)
      expect_tree_node(name: '子1', display_value: '500円', is_value_locked: false, is_leaf: true,
                       has_inconsistent_value: false)
      expect_tree_node(name: '子2', display_value: '490円', is_value_locked: false, is_leaf: true,
                       has_inconsistent_value: false)

      find('g > text', text: '子1').ancestor('g.rd3t-leaf-node').click
      expect(find('.calculation')).not_to have_css('svg.fa-triangle-exclamation')
    end
  end

  describe('選択した階層の更新を、祖先ノードにも反映') do
    it('孫ノードを選択して更新すると、その祖先ノードの値も更新される、数値を自動更新しないにチェックが入っているノードの値は更新されない') do
      # データの作成
      tree = create(:tree, user: User.find_by(uid: '1234'))
      root_node = create(:node, tree:, name: 'ルート', value: 1000, value_format: '万', unit: '円', is_value_locked: true)
      child_node1 = create(:node, tree:, name: '子1', value: 5000, value_format: 'なし', unit: '人', is_value_locked: false,
                                  parent: root_node)
      create(:node, tree:, name: '子2', value: 2000, value_format: 'なし', unit: '円', is_value_locked: false,
                    parent: root_node)
      create(:layer, tree:, operation: 'multiply', fraction: 0, parent_node: root_node)
      create(:node, tree:, name: '孫1-1', value: 500, value_format: 'なし', unit: '人', is_value_locked: false,
                    parent: child_node1)
      create(:node, tree:, name: '孫1-2', value: 2500, value_format: 'なし', unit: '人', is_value_locked: false,
                    parent: child_node1)
      create(:node, tree:, name: '孫1-3', value: 2000, value_format: 'なし', unit: '人', is_value_locked: false,
                    parent: child_node1)
      create(:layer, tree:, operation: 'add', fraction: 0, parent_node: child_node1)

      # ツリー編集画面を表示し、ノードをクリックしてツールエリアを開く
      visit edit_tree_path(tree)
      find('g > text', text: '孫1-1').ancestor('g.rd3t-leaf-node').click

      # 値を編集
      node_detail1 = find_by_id('node-detail-1')
      node_detail1.find('input[name="value"]').set(1)
      node_detail1.find('select[name="valueFormat"]').select('万')

      # 更新を実行
      find('#updateButton label', text: '更新').click
      find('.modal-action label', text: '更新する').click

      # 選択したノードの更新に基づいて親ノードの値も更新されていること、さらにその親ノードはisValueLocked: true なので、値は変わらないことを確認
      expect_tree_node(
        name: 'ルート',
        display_value: '1000万円', # isValueLocked: true なので、値は変わらない
        is_value_locked: true,
        operation: '',
        is_leaf: false
      )
      expect_tree_node(
        name: '子1',
        display_value: '14500人', # 1万 + 2500 + 2000 に更新される
        is_value_locked: false,
        operation: 'multiply',
        is_leaf: false,
        has_inconsistent_value: true
      )
    end
  end

  describe('ルートノードのみのツリー') do
    it('ルートノードを選択し、値を更新できる') do
      # ルートのみのツリーを作成
      tree = create(:tree, user: User.find_by(uid: '1234'))
      create(:node, tree:, name: 'ルート', value: 1000, value_format: '万', unit: '円', is_value_locked: true)

      # ツリー編集画面を表示し、ノードをクリックしてツールエリアを開く
      visit edit_tree_path(tree)
      find('g > text', text: 'ルート').ancestor('g.rd3t-leaf-node').click

      # 値を編集
      node_detail1 = find_by_id('node-detail-1')
      node_detail1.find('input[name="name"]').set('ルート\'')
      node_detail1.find('input[name="unit"]').set('円\'')
      node_detail1.find('input[name="value"]').set(500)
      node_detail1.find('select[name="valueFormat"]').select('千')
      node_detail1.find('input[name="isValueLocked"]').set(false)

      # 更新を実行
      find('#updateButton label', text: '更新').click
      find('.modal-action label', text: '更新する').click

      # 更新後のツリー表示が想定どおりであることを確認
      expect_tree_node(
        name: 'ルート\'',
        display_value: '500千円\'',
        is_value_locked: false,
        operation: '',
        is_leaf: true
      )
    end
  end

  describe('選択した階層にノードを追加') do
    before do
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

    it('要素を追加ボタンを押すと、新しい要素のエリアが表示される。') do
      click_button '要素を追加'
      expect(page).to have_selector('#node-detail-3')
      expect(page).to have_content('要素3')
      expect(page).to have_selector('#node-detail-3 input[name="name"][value="要素3"]')
      expect(page).to have_selector('#node-detail-3 input[name="value"][value="1"]')
      expect(page).to have_selector('#node-detail-3 input[name="unit"][value=""]')
      expect(page).to have_select('node-3-valueFormat', selected: 'なし')
      expect(page).to have_selector('#node-detail-3 input[name="isValueLocked"][type="checkbox"]:not(:checked)')
    end

    it('追加された要素のデフォルトの数値値が、階層内の要素間の関係ごとに設定されている。') do
      expect(page).to have_button('かけ算', class: 'bg-base-100 border border-neutral')
      click_button '要素を追加'
      expect(page).to have_selector('#node-detail-3 input[name="value"][value="1"]')
      click_button 'たし算'
      click_button '要素を追加'
      expect(page).to have_selector('#node-detail-4 input[name="value"][value="0"]')
    end

    it('要素を追加ボタンを押すと、計算式に要素が追加されている。') do
      click_button '要素を追加'
      within('#calc-member-3') do
        expect(page).to have_text('要素3')
        expect(page).to have_text('1')
      end
    end

    it('要素を追加ボタンを押しても、ツリーの表示はまだ変わらない。') do
      click_button '要素を追加'
      expect(page).not_to have_selector('g > text', text: '要素3')
      expect(page).to have_selector('g > text', text: '子1')
    end

    it('要素を追加ボタンを押して、更新ボタン→更新するを押すと、ツリーに要素が追加される。') do
      click_button '要素を追加'
      find('#updateButton label', text: '更新').click
      find('.modal-action label', text: '更新する').click
      expect_tree_node(
        name: '子1',
        display_value: '5000人',
        is_value_locked: false,
        operation: 'multiply',
        is_leaf: true
      )
      expect_tree_node(
        name: '子2',
        display_value: '2000円',
        is_value_locked: false,
        operation: 'multiply',
        is_leaf: true
      )
      expect_tree_node(
        name: '要素3',
        display_value: '1',
        is_value_locked: false,
        operation: '',
        is_leaf: true
      )
    end

    it('要素を追加ボタンを押して、追加した要素と既存の要素のプロパティを編集し、更新ボタン→更新するを押すと、ツリーにすべての編集内容が反映される。') do
      click_button '要素を追加'
      node_detail1 = find_by_id('node-detail-1')
      node_detail1.find('input[name="name"]').set('変更後のノード名1')
      node_detail1.find('input[name="unit"]').set('人（変更後）')
      node_detail1.find('input[name="value"]').set(2)
      node_detail1.find('select[name="valueFormat"]').select('千')
      node_detail1.find('input[name="isValueLocked"]').set(true)

      node_detail2 = find_by_id('node-detail-2')
      node_detail2.find('input[name="name"]').set('変更後のノード名2')
      node_detail2.find('input[name="unit"]').set('円（変更後）')
      node_detail2.find('input[name="value"]').set(4000)
      node_detail2.find('select[name="valueFormat"]').select('なし')
      node_detail2.find('input[name="isValueLocked"]').set(true)

      node_detail3 = find_by_id('node-detail-3')
      node_detail3.find('input[name="name"]').set('変更後のノード名3')
      node_detail3.find('input[name="unit"]').set('円')
      node_detail3.find('input[name="value"]').set(0.1)
      node_detail3.find('select[name="valueFormat"]').select('千')
      node_detail3.find('input[name="isValueLocked"]').set(true)

      find('#updateButton label', text: '更新').click
      find('.modal-action label', text: '更新する').click

      expect_tree_node(
        name: '変更後のノード名1',
        display_value: '2千人（変更後）',
        is_value_locked: true,
        operation: 'multiply',
        is_leaf: true,
        has_inconsistent_value: true
      )
      expect_tree_node(
        name: '変更後のノード名2',
        display_value: '4000円（変更後）',
        is_value_locked: true,
        operation: 'multiply',
        is_leaf: true,
        has_inconsistent_value: true
      )
      expect_tree_node(
        name: '変更後のノード名3',
        display_value: '0.1千円',
        is_value_locked: true,
        operation: '',
        is_leaf: true,
        has_inconsistent_value: true
      )
    end

    it('子要素を持つ階層に要素を追加できる。') do
      # データの作成
      tree = create(:tree, user: User.find_by(uid: '1234'))
      root_node = create(:node, tree:, name: 'ルート', value: 1000, value_format: '万', unit: '円', is_value_locked: true)
      child_node1 = create(:node, tree:, name: '子1', value: 5000, value_format: 'なし', unit: '人', is_value_locked: false,
                                  parent: root_node)
      create(:node, tree:, name: '子2', value: 2000, value_format: 'なし', unit: '円', is_value_locked: false,
                    parent: root_node)
      create(:layer, tree:, operation: 'multiply', fraction: 0, parent_node: root_node)
      create(:node, tree:, name: '孫1-1', value: 500, value_format: 'なし', unit: '人', is_value_locked: false,
                    parent: child_node1)
      create(:node, tree:, name: '孫1-2', value: 2500, value_format: 'なし', unit: '人', is_value_locked: false,
                    parent: child_node1)
      create(:node, tree:, name: '孫1-3', value: 2000, value_format: 'なし', unit: '人', is_value_locked: false,
                    parent: child_node1)
      create(:layer, tree:, operation: 'add', fraction: 0, parent_node: child_node1)

      # ツリー編集画面を表示し、ノードをクリックしてツールエリアを開く
      visit edit_tree_path(tree)
      find('g > text', text: '子1').ancestor('g.rd3t-node').click

      click_button '要素を追加'
      find('#updateButton label', text: '更新').click
      find('.modal-action label', text: '更新する').click

      expect_tree_node(
        name: '要素3',
        display_value: '1',
        is_value_locked: false,
        operation: '',
        is_leaf: true
      )
    end

    it('一度の更新で複数の要素を追加できる。') do
      click_button '要素を追加'
      click_button '要素を追加'
      find('#updateButton label', text: '更新').click
      find('.modal-action label', text: '更新する').click
      expect_tree_node(
        name: '子1',
        display_value: '5000人',
        is_value_locked: false,
        operation: 'multiply',
        is_leaf: true
      )
      expect_tree_node(
        name: '子2',
        display_value: '2000円',
        is_value_locked: false,
        operation: 'multiply',
        is_leaf: true
      )
      expect_tree_node(
        name: '要素3',
        display_value: '1',
        is_value_locked: false,
        operation: 'multiply',
        is_leaf: true
      )
      expect_tree_node(
        name: '要素4',
        display_value: '1',
        is_value_locked: false,
        operation: '',
        is_leaf: true
      )
    end

    it('要素の追加を繰り返して行うことができる。') do
      click_button '要素を追加'
      find('#updateButton label', text: '更新').click
      find('.modal-action label', text: '更新する').click
      expect_tree_node(
        name: '子1',
        display_value: '5000人',
        is_value_locked: false,
        operation: 'multiply',
        is_leaf: true
      )
      expect_tree_node(
        name: '子2',
        display_value: '2000円',
        is_value_locked: false,
        operation: 'multiply',
        is_leaf: true
      )
      expect_tree_node(
        name: '要素3',
        display_value: '1',
        is_value_locked: false,
        operation: '',
        is_leaf: true
      )

      find('g > text', text: '子2').ancestor('g.rd3t-leaf-node').click
      click_button '要素を追加'
      find('#updateButton label', text: '更新').click
      find('.modal-action label', text: '更新する').click
      expect_tree_node(
        name: '子1',
        display_value: '5000人',
        is_value_locked: false,
        operation: 'multiply',
        is_leaf: true
      )
      expect_tree_node(
        name: '子2',
        display_value: '2000円',
        is_value_locked: false,
        operation: 'multiply',
        is_leaf: true
      )
      expect_tree_node(
        name: '要素3',
        display_value: '1',
        is_value_locked: false,
        operation: 'multiply',
        is_leaf: true
      )
      expect_tree_node(
        name: '要素4',
        display_value: '1',
        is_value_locked: false,
        operation: '',
        is_leaf: true
      )
    end
  end

  describe('選択した階層のノードを削除') do
    before do
      # データの作成
      tree = create(:tree, user: User.find_by(uid: '1234'))
      root_node = create(:node, tree:, name: 'ルート', value: 1000, value_format: '万', unit: '円', is_value_locked: true)
      create(:node, tree:, name: '子1', value: 5000, value_format: 'なし', unit: '人', is_value_locked: false,
                    parent: root_node)
      child_node2 = create(:node, tree:, name: '子2', value: 2000, value_format: 'なし', unit: '円', is_value_locked: false,
                                  parent: root_node)
      create(:layer, tree:, operation: 'multiply', fraction: 0, parent_node: root_node)
      create(:node, tree:, name: '孫2-1', value: 200, value_format: 'なし', unit: '円', is_value_locked: false,
                    parent: child_node2)
      create(:node, tree:, name: '孫2-2', value: 1000, value_format: 'なし', unit: '円', is_value_locked: false,
                    parent: child_node2)
      create(:node, tree:, name: '孫2-3', value: 800, value_format: 'なし', unit: '円', is_value_locked: false,
                    parent: child_node2)
      create(:layer, tree:, operation: 'add', fraction: 0, parent_node: child_node2)

      # ツリー編集画面を表示し、ノードをクリックしてツールエリアを開く
      visit edit_tree_path(tree)
      find('g > text', text: '孫2-3').ancestor('g.rd3t-leaf-node').click
    end

    describe('削除ボタンの表示・非表示') do
      it('ルートノードを選択すると、要素のツールメニューが表示されない。') do
        find('g > text', text: 'ルート').ancestor('g.rd3t-node').click
        expect(find_by_id('node-detail-1')).not_to have_css('.tool-menu')
      end

      it('ルートノード以外のノードを選択したとき、要素のツールメニューが表示される。（ノードが2つの場合）') do
        find('g > text', text: '子2').ancestor('g.rd3t-node').click
        expect(find_by_id('node-detail-1')).to have_css('.tool-menu')
      end

      it('ルートノード以外のノードを選択したとき、要素のツールメニューが表示される。（ノードが3つ以上の場合）') do
        find('g > text', text: '孫2-3').ancestor('g.rd3t-leaf-node').click
        expect(find_by_id('node-detail-1')).to have_css('.tool-menu')
      end
    end

    describe('ツールエリア上の挙動') do
      it('要素を削除ボタンを押すと、ツールエリアからそのノードの表示が消える。') do
        find_by_id('node-detail-3').find('.tool-menu').click
        click_link '要素を削除'
        expect(page).not_to have_selector('#node-detail-3')
      end

      it('要素を削除ボタンを押すと、計算式からそのノードの表示が消える。計算結果の値も変わる。ツリーの表示は変わらない。') do
        expect(find_by_id('calc-member-parent')).to have_text('2,000')
        expect(page).to have_selector('#calc-member-3')
        find_by_id('node-detail-3').find('.tool-menu').click
        click_link '要素を削除'
        expect(page).not_to have_selector('#calc-member-3')
        expect(find_by_id('calc-member-parent')).to have_text('1,200')
        expect_tree_node(
          name: '孫2-3',
          display_value: '800円',
          is_value_locked: false,
          operation: '',
          is_leaf: true
        )
      end

      it('要素を削除ボタンを押して、更新を実行せずに別な階層を選択し、再び元の階層に戻ると、要素は削除前の状態に戻っている。') do
        expect(node_details.length).to eq 3
        find_by_id('node-detail-3').find('.tool-menu').click
        click_link '要素を削除'
        expect(node_details.length).to eq 2
        find('g > text', text: '子2').ancestor('g.rd3t-node').click
        find('g > text', text: '孫2-3').ancestor('g.rd3t-leaf-node').click
        expect(node_details.length).to eq 3
      end
    end

    describe('削除を実行') do
      it('葉ノードについて、要素を削除ボタンを押してから、更新ボタン→更新するを押すと、ツリーからそのノードが削除される。') do
        find_by_id('node-detail-3').find('.tool-menu').click
        click_link '要素を削除'
        find('#updateButton label', text: '更新').click
        find('.modal-action label', text: '更新する').click
        expect_tree_node(
          name: '孫2-1',
          display_value: '200円',
          is_value_locked: false,
          operation: 'add',
          is_leaf: true
        )
        expect_tree_node(
          name: '孫2-2',
          display_value: '1000円',
          is_value_locked: false,
          operation: '',
          is_leaf: true
        )
        expect(page).not_to have_selector('g > text', text: '孫2-3')
      end

      it('階層内のノードが全て葉ノードのとき、階層内のすべてのノードを削除できる') do
        find_by_id('node-detail-3').find('.tool-menu').click
        click_link '要素を削除'
        find_by_id('node-detail-2').find('.tool-menu').click
        click_link '要素を削除'
        find_by_id('node-detail-1').find('.tool-menu').click
        click_link '要素を削除'
        expect(page).not_to have_selector('[id^="node-detail-"]')
        find('#updateButton label', text: '更新').click
        find('.modal-action label', text: '更新する').click
        expect(page).not_to have_selector('g > text', text: '孫2-1')
        expect(page).not_to have_selector('g > text', text: '孫2-2')
        expect(page).not_to have_selector('g > text', text: '孫2-3')
        expect_tree_node(
          name: '子2',
          display_value: '2000円',
          is_value_locked: false,
          operation: '',
          is_leaf: true
        )
      end

      it('階層内のノードが全て葉ノードのとき、「選択中の全要素を削除」ボタンを押してから更新を実行すると、階層内のすべてのノードを削除できる') do
        find('.layer-tool-menu').click
        click_link '選択中の全要素を削除'
        expect(page).not_to have_selector('[id^="node-detail-"]')
        find('#updateButton label', text: '更新').click
        find('.modal-action label', text: '更新する').click
        expect(page).not_to have_selector('g > text', text: '孫2-1')
        expect(page).not_to have_selector('g > text', text: '孫2-2')
        expect(page).not_to have_selector('g > text', text: '孫2-3')
        expect_tree_node(
          name: '子2',
          display_value: '2000円',
          is_value_locked: false,
          operation: '',
          is_leaf: true
        )
      end

      it('非葉ノードについて、要素を削除ボタンを押してから、更新ボタン→更新するを押すと、ツリーからそのノードと子孫ノードが削除される。') do
        find('g > text', text: '子2').ancestor('g.custom-node').click
        find_by_id('node-detail-2').find('.tool-menu').click
        click_link '要素を削除'
        find('#updateButton label', text: '更新').click
        find('.modal-action label', text: '更新する').click
        expect_tree_node(
          name: '子1',
          display_value: '5000人',
          is_value_locked: false,
          operation: '',
          is_leaf: true,
          has_inconsistent_value: true
        )
        expect(page).not_to have_selector('g > text', text: '子2')
        expect(page).not_to have_selector('g > text', text: '孫2-1')
        expect(page).not_to have_selector('g > text', text: '孫2-2')
        expect(page).not_to have_selector('g > text', text: '孫2-3')
      end

      it('階層内に非葉ノードが含まれるとき、階層内のすべてのノードを削除でき、一緒に子孫のノードも削除される') do
        find('g > text', text: '子2').ancestor('g.custom-node').click
        find_by_id('node-detail-2').find('.tool-menu').click
        click_link '要素を削除'
        find_by_id('node-detail-1').find('.tool-menu').click
        click_link '要素を削除'
        expect(page).not_to have_selector('[id^="node-detail-"]')
        find('#updateButton label', text: '更新').click
        find('.modal-action label', text: '更新する').click
        expect(page).not_to have_selector('g > text', text: '子1')
        expect(page).not_to have_selector('g > text', text: '子2')
        expect(page).not_to have_selector('g > text', text: '孫2-1')
        expect(page).not_to have_selector('g > text', text: '孫2-2')
        expect(page).not_to have_selector('g > text', text: '孫2-3')
        expect_tree_node(
          name: 'ルート',
          display_value: '1000万円',
          is_value_locked: true,
          operation: '',
          is_leaf: true
        )
      end

      it('階層内に非葉ノードが含まれるとき、「選択中の全要素を削除」ボタンを押してから更新を実行すると階層内のノードがすべて削除され、一緒に子孫のノードも削除される。') do
        find('g > text', text: '子2').ancestor('g.custom-node').click
        find('.layer-tool-menu').click
        click_link '選択中の全要素を削除'
        expect(page).not_to have_selector('[id^="node-detail-"]')
        find('#updateButton label', text: '更新').click
        find('.modal-action label', text: '更新する').click
        expect(page).not_to have_selector('g > text', text: '子1')
        expect(page).not_to have_selector('g > text', text: '子2')
        expect(page).not_to have_selector('g > text', text: '孫2-1')
        expect(page).not_to have_selector('g > text', text: '孫2-2')
        expect(page).not_to have_selector('g > text', text: '孫2-3')
        expect_tree_node(
          name: 'ルート',
          display_value: '1000万円',
          is_value_locked: true,
          operation: '',
          is_leaf: true,
          has_inconsistent_value: false
        )
      end

      it('要素を削除ボタンを押して、更新ボタン→更新するを押すと、親ノードの値も計算結果に応じて更新される。') do
        find_by_id('node-detail-3').find('.tool-menu').click
        click_link '要素を削除'
        find('#updateButton label', text: '更新').click
        find('.modal-action label', text: '更新する').click
        expect_tree_node(
          name: 'ルート',
          display_value: '1000万円',
          is_value_locked: true,
          operation: '',
          is_leaf: false
        )
        expect_tree_node(
          name: '子1',
          display_value: '5000人',
          is_value_locked: false,
          operation: 'multiply',
          is_leaf: true,
          has_inconsistent_value: true
        )
        expect_tree_node(
          name: '子2',
          display_value: '1200円',
          is_value_locked: false,
          operation: '',
          is_leaf: false,
          has_inconsistent_value: true
        )
      end

      it('新しい要素の追加と既存の要素の削除を同時に行うことができる。') do
        click_button '要素を追加'
        find_by_id('node-detail-3').find('.tool-menu').click
        click_link '要素を削除'
        find('#updateButton label', text: '更新').click
        find('.modal-action label', text: '更新する').click
        expect_tree_node(
          name: '孫2-1',
          display_value: '200円',
          is_value_locked: false,
          operation: 'add',
          is_leaf: true
        )
        expect_tree_node(
          name: '孫2-2',
          display_value: '1000円',
          is_value_locked: false,
          operation: 'add',
          is_leaf: true
        )
        expect_tree_node(
          name: '要素4',
          display_value: '0',
          is_value_locked: false,
          operation: '',
          is_leaf: true
        )
      end

      it('要素の追加と削除を繰り返し行うことができる。') do
        3.times do
          find('g > text', text: '孫2-3').ancestor('g.rd3t-leaf-node').click
          click_button '要素を追加'
          find('#updateButton label', text: '更新').click
          find('.modal-action label', text: '更新する').click
          expect_tree_node(
            name: '孫2-1',
            display_value: '200円',
            is_value_locked: false,
            operation: 'add',
            is_leaf: true
          )
          expect_tree_node(
            name: '孫2-2',
            display_value: '1000円',
            is_value_locked: false,
            operation: 'add',
            is_leaf: true
          )
          expect_tree_node(
            name: '孫2-3',
            display_value: '800円',
            is_value_locked: false,
            operation: 'add',
            is_leaf: true
          )
          expect_tree_node(
            name: '要素4',
            display_value: '0',
            is_value_locked: false,
            operation: '',
            is_leaf: true
          )

          find('g > text', text: '孫2-3').ancestor('g.rd3t-leaf-node').click
          find_by_id('node-detail-4').find('.tool-menu').click
          click_link '要素を削除'
          find('#updateButton label', text: '更新').click
          find('.modal-action label', text: '更新する').click

          expect_tree_node(
            name: '孫2-1',
            display_value: '200円',
            is_value_locked: false,
            operation: 'add',
            is_leaf: true
          )
          expect_tree_node(
            name: '孫2-2',
            display_value: '1000円',
            is_value_locked: false,
            operation: 'add',
            is_leaf: true
          )
          expect_tree_node(
            name: '孫2-3',
            display_value: '800円',
            is_value_locked: false,
            operation: '',
            is_leaf: true
          )
          expect(page).not_to have_selector('g > text', text: '要素4')
        end
      end
    end
  end
end
