# frozen_string_literal: true

module ExpectHelper
  def expect_node_detail(index:, name:, value:, unit:, value_format:, is_value_locked:)
    expect_selector(index, 'name', name)
    expect_selector(index, 'value', value)
    expect_selector(index, 'unit', unit)
    expect(page).to have_select("node-#{index}-valueFormat", selected: value_format.to_s)
    expect_value_locked(index, is_value_locked)
  end

  def expect_tree_node(name:, display_value:, is_value_locked:, is_leaf:, operation: nil)
    node_svg = if is_leaf
                 find('g > text', text: name).ancestor('g.rd3t-leaf-node')
               else
                 find('g > text', text: name).ancestor('g.rd3t-node')
               end
    expect(node_svg).to have_text(display_value)
    if is_value_locked
      expect(node_svg).to have_css('svg.fa-lock')
    else
      expect(node_svg).not_to have_css('svg.fa-lock')
    end
    expect_operation_display(node_svg:, operation:) if operation.present?
  end

  private

  def expect_selector(index, attribute, value)
    expect(page).to have_selector("#node-detail-#{index} input[name='#{attribute}'][value='#{value}']")
  end

  def expect_value_locked(index, is_value_locked)
    if is_value_locked
      expect(page).to have_selector("#node-detail-#{index} input[name='isValueLocked'][type='checkbox'](:checked)")
    else
      expect(page).to have_selector("#node-detail-#{index} input[name='isValueLocked'][type='checkbox']:not(:checked)")
    end
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
end
