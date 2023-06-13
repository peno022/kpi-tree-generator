# frozen_string_literal: true

require 'rails_helper'

RSpec.describe '選択した階層のプロパティを編集・更新', js: true do
  before do
    # データの作成
    tree = create(:tree)
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
    root_node_svg_after = find('g > text', text: 'ルート').ancestor('g.rd3t-node')
    expect_node_display(
      node_svg: root_node_svg_after,
      name: 'ルート',
      display_value: '1000万円',
      is_value_locked: true,
      operation: ''
    )

    child_node1_svg_after = find('g > text', text: '子1').ancestor('g.rd3t-leaf-node')
    expect_node_display(
      node_svg: child_node1_svg_after,
      name: '子1',
      display_value: '5000人',
      is_value_locked: false,
      operation: 'multiply'
    )

    child_node2_svg_after = find('g > text', text: '子2').ancestor('g.rd3t-leaf-node')
    expect_node_display(
      node_svg: child_node2_svg_after,
      name: '子2',
      display_value: '2000円',
      is_value_locked: false,
      operation: ''
    )

    # 要素未選択状態に戻り、ツールエリアが閉じていることを確認
    expect(page).not_to have_css('rect[style="fill: moccasin;"]')
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
    root_node_svg_after = find('g > text', text: 'ルート').ancestor('g.rd3t-node')
    expect_node_display(
      node_svg: root_node_svg_after,
      name: 'ルート',
      display_value: '1000万円',
      is_value_locked: true,
      operation: ''
    )
    child_node1_svg_after = find('g > text', text: '変更後のノード名1').ancestor('g.rd3t-leaf-node')
    expect_node_display(
      node_svg: child_node1_svg_after,
      name: '変更後のノード名1',
      display_value: '2千人（変更後）',
      is_value_locked: true,
      operation: 'multiply'
    )

    child_node2_svg_after = find('g > text', text: '変更後のノード名2').ancestor('g.rd3t-leaf-node')
    expect_node_display(
      node_svg: child_node2_svg_after,
      name: '変更後のノード名2',
      display_value: '4000円（変更後）',
      is_value_locked: true,
      operation: ''
    )
  end

  it('要素間の関係を変更して更新すると、更新後の値でツリーが表示される') do
    # 値を編集
    click_button('たし算')

    # 更新を実行
    find('#updateButton label', text: '更新').click
    find('.modal-action label', text: '更新する').click

    # 更新後のツリー表示が想定どおりであることを確認
    root_node_svg_after = find('g > text', text: 'ルート').ancestor('g.rd3t-node')
    expect_node_display(
      node_svg: root_node_svg_after,
      name: 'ルート',
      display_value: '1000万円',
      is_value_locked: true,
      operation: ''
    )

    child_node1_svg_after = find('g > text', text: '子1').ancestor('g.rd3t-leaf-node')
    expect_node_display(
      node_svg: child_node1_svg_after,
      name: '子1',
      display_value: '5000人',
      is_value_locked: false,
      operation: 'add'
    )

    child_node2_svg_after = find('g > text', text: '子2').ancestor('g.rd3t-leaf-node')
    expect_node_display(
      node_svg: child_node2_svg_after,
      name: '子2',
      display_value: '2000円',
      is_value_locked: false,
      operation: ''
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
    root_node_svg_after = find('g > text', text: 'ルート').ancestor('g.rd3t-node')
    expect_node_display(
      node_svg: root_node_svg_after,
      name: 'ルート',
      display_value: '1000万円',
      is_value_locked: true,
      operation: ''
    )
    child_node1_svg_after = find('g > text', text: '子1\'').ancestor('g.rd3t-leaf-node')
    expect_node_display(
      node_svg: child_node1_svg_after,
      name: '子1\'',
      display_value: '2千人（変更後）',
      is_value_locked: true,
      operation: 'add'
    )

    child_node2_svg_after = find('g > text', text: '子2\'').ancestor('g.rd3t-leaf-node')
    expect_node_display(
      node_svg: child_node2_svg_after,
      name: '子2\'',
      display_value: '4000円（変更後）',
      is_value_locked: true,
      operation: ''
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
    root_node_svg_after = find('g > text', text: 'ルート').ancestor('g.rd3t-node')
    expect_node_display(
      node_svg: root_node_svg_after,
      name: 'ルート\'',
      display_value: '500千円\'',
      is_value_locked: false,
      operation: ''
    )
    child_node1_svg_after = find('g > text', text: '子1').ancestor('g.rd3t-leaf-node')
    expect_node_display(
      node_svg: child_node1_svg_after,
      name: '子1',
      display_value: '5000人',
      is_value_locked: false,
      operation: 'multiply'
    )
    child_node2_svg_after = find('g > text', text: '子2').ancestor('g.rd3t-leaf-node')
    expect_node_display(
      node_svg: child_node2_svg_after,
      name: '子2',
      display_value: '2000円',
      is_value_locked: false,
      operation: ''
    )
  end

  it('更新操作を繰り返し（3回続けて）行うことができる') do
    # 編集と更新（1回目）
    find_by_id('node-detail-1').find('input[name="name"]').set('子1\'')
    find_by_id('node-detail-1').find('input[name="value"]').set(4)
    find_by_id('node-detail-1').find('select[name="valueFormat"]').select('千')
    find('#updateButton label', text: '更新').click
    find('.modal-action label', text: '更新する').click

    child_node1_first = find('g > text', text: '子1\'').ancestor('g.rd3t-leaf-node')
    expect_node_display(
      node_svg: child_node1_first,
      name: '子1\'',
      display_value: '4千人',
      is_value_locked: false,
      operation: 'multiply'
    )

    # 編集と更新（2回目）
    find('g > text', text: '子1\'').ancestor('g.rd3t-leaf-node').click
    find_by_id('node-detail-1').find('input[name="name"]').set('子1\'\'')
    find_by_id('node-detail-1').find('input[name="value"]').set(1.5)
    find_by_id('node-detail-1').find('select[name="valueFormat"]').select('万')
    find('#updateButton label', text: '更新').click
    find('.modal-action label', text: '更新する').click

    child_node1_second = find('g > text', text: '子1\'\'').ancestor('g.rd3t-leaf-node')
    expect_node_display(
      node_svg: child_node1_second,
      name: '子1\'\'',
      display_value: '1.5万人',
      is_value_locked: false,
      operation: 'multiply'
    )

    # 編集と更新（3回目）
    find('g > text', text: '子1\'\'').ancestor('g.rd3t-leaf-node').click
    find_by_id('node-detail-1').find('input[name="name"]').set('子1\'\'\'')
    find_by_id('node-detail-1').find('input[name="value"]').set(2500.1)
    find_by_id('node-detail-1').find('select[name="valueFormat"]').select('なし')
    find('#updateButton label', text: '更新').click
    find('.modal-action label', text: '更新する').click

    child_node1_third = find('g > text', text: '子1\'\'\'').ancestor('g.rd3t-leaf-node')
    expect_node_display(
      node_svg: child_node1_third,
      name: '子1\'\'\'',
      display_value: '2500.1人',
      is_value_locked: false,
      operation: 'multiply'
    )
  end

  it('更新するボタンを押すと、モーダルが開く、キャンセルボタンを押すとモーダルが閉じる') do
    expect(page).not_to have_css('.modal-box')
    find('#updateButton label', text: '更新').click
    expect(page).to have_css('.modal-box')
    find('label[for="updateLayerModal"]', text: 'キャンセル').click
    expect(page).not_to have_css('.modal-box')
  end
end

RSpec.describe('選択した階層の更新を、祖先ノードにも反映', js: true) do
  it('孫ノードを選択して更新すると、その祖先ノードの値も更新される、数値を自動更新しないにチェックが入っているノードの値は更新されない') do
    # データの作成
    tree = create(:tree)
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
    root_node_svg_after = find('g > text', text: 'ルート').ancestor('g.rd3t-node')
    expect_node_display(
      node_svg: root_node_svg_after,
      name: 'ルート',
      display_value: '1000万円', # isValueLocked: true なので、値は変わらない
      is_value_locked: true,
      operation: ''
    )
    child_node1_svg_after = find('g > text', text: '子1').ancestor('g.rd3t-node')
    expect_node_display(
      node_svg: child_node1_svg_after,
      name: '子1',
      display_value: '14500人', # 1万 + 2500 + 2000 に更新される
      is_value_locked: false,
      operation: 'multiply'
    )
  end
end

RSpec.describe('ルートノードのみのツリー', js: true) do
  it('ルートノードを選択し、値を更新できる') do
    # ルートのみのツリーを作成
    tree = create(:tree)
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
    root_node_svg_after = find('g > text', text: 'ルート').ancestor('g.rd3t-leaf-node')
    expect_node_display(
      node_svg: root_node_svg_after,
      name: 'ルート\'',
      display_value: '500千円\'',
      is_value_locked: false,
      operation: ''
    )
  end
end

def expect_node_display(node_svg:, name:, display_value:, is_value_locked:, operation: nil)
  expect(node_svg).to have_text(name).and have_text(display_value)
  if is_value_locked == true
    expect(node_svg).to have_css('svg.fa-lock')
  else
    expect(node_svg).not_to have_css('svg.fa-lock')
  end
  expect_operation_display(node_svg:, operation:) if operation.present?
end

def expect_operation_display(node_svg:, operation:)
  case operation
  when 'multiply'
    expect(node_svg).to have_text('×').and have_no_text('＋')
  when 'add'
    expect(node_svg).to have_text('＋').and have_no_text('×')
  else
    expect(node_svg).to have_no_text('×').and have_no_text('＋')
  end
end
