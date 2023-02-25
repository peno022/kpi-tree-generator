# frozen_string_literal: true

# TODO: 実装
# Reactの実装を進めるためにダミーで作成。seedsのtree1のデータを固定で返す。

great_grandchildren1 = [
  {
    id: 8,
    name: '検索流入',
    value: 5,
    value_format: '万',
    unit: '人',
    tree_id: 1
  },
  {
    id: 9,
    name: '広告流入',
    value: 4,
    value_format: '万',
    unit: '人',
    tree_id: 1
  },
  {
    id: 10,
    name: 'メルマガ流入',
    value: 1,
    value_format: '万',
    unit: '人',
    tree_id: 1
  }
]

grandchildren1 = [
  {
    id: 4,
    name: '訪問者数',
    value: 10,
    value_format: '万',
    unit: '人',
    tree_id: 1,
    children: great_grandchildren1
  },
  {
    id: 5,
    name: '購入率',
    value: 5,
    value_format: '%',
    unit: '',
    tree_id: 1
  }
]
grandchildren2 = [
  {
    id: 6,
    name: '平均商品単価',
    value: 1200,
    value_format: 'なし',
    unit: '円',
    tree_id: 1
  },
  {
    id: 7,
    name: '平均購入数',
    value: 1.6,
    value_format: 'なし',
    unit: '個',
    tree_id: 1
  }
]

children = [
  {
    id: 2,
    name: '購入者数',
    value: 5000,
    value_format: 'なし',
    unit: '人',
    tree_id: 1,
    children: grandchildren1
  },
  {
    id: 3,
    name: '顧客単価',
    value: 2000,
    value_format: 'なし',
    unit: '円',
    tree_id: 1,
    children: grandchildren2
  }
]

# rubocop:disable Metrics/BlockLength

json.tree do
  json.id 1
  json.name '売上構成ツリー'
  json.root do
    json.id 1
    json.name '売上金額'
    json.value 1000
    json.value_format '万'
    json.unit '円'
    json.is_value_locked true
    json.next_layer do
      json.operation 'かけ算'
      json.children do
        json.array! children do |child|
          json.id child[:id]
          json.name child[:name]
          json.value child[:value]
          json.value_format child[:value_format]
          json.unit child[:unit]
          json.tree_id child[:tree_id]
          json.children do
            json.array! child[:children] do |grandchild|
              json.id grandchild[:id]
              json.name grandchild[:name]
              json.value grandchild[:value]
              json.value_format grandchild[:value_format]
              json.unit grandchild[:unit]
              json.tree_id grandchild[:tree_id]
              json.children do
                json.array! grandchild[:children] do |great_grandchild|
                  json.id great_grandchild[:id]
                  json.name great_grandchild[:name]
                  json.value great_grandchild[:value]
                  json.value_format great_grandchild[:value_format]
                  json.unit great_grandchild[:unit]
                  json.tree_id great_grandchild[:tree_id]
                end
              end
            end
          end
        end
      end
    end
  end
end

# rubocop:enable Metrics/BlockLength
