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
    is_value_locked: false
  },
  {
    id: 9,
    name: '広告流入',
    value: 4,
    value_format: '万',
    unit: '人',
    is_value_locked: false
  },
  {
    id: 10,
    name: 'メルマガ流入',
    value: 1,
    value_format: '万',
    unit: '人',
    is_value_locked: false
  }
]

layer_for_great_grandchildren1 = {
  operation: 'たし算',
  fraction: nil,
  nodes: great_grandchildren1
}

grandchildren1 = [
  {
    id: 4,
    name: '訪問者数',
    value: 10,
    value_format: '万',
    unit: '人',
    is_value_locked: false,
    next_layer: layer_for_great_grandchildren1
  },
  {
    id: 5,
    name: '購入率',
    value: 5,
    value_format: '%',
    unit: '',
    is_value_locked: false
  }
]

layer_for_grandchildren1 = {
  operation: 'かけ算',
  fraction: nil,
  nodes: grandchildren1
}

grandchildren2 = [
  {
    id: 6,
    name: '平均商品単価',
    value: 1200,
    value_format: 'なし',
    unit: '円',
    is_value_locked: false
  },
  {
    id: 7,
    name: '平均購入数',
    value: 1.6,
    value_format: 'なし',
    unit: '個',
    is_value_locked: false
  }
]

layer_for_grandchildren2 = {
  operation: 'かけ算',
  fraction: -80,
  nodes: grandchildren2
}

children = [
  {
    id: 2,
    name: '購入者数',
    value: 5000,
    value_format: 'なし',
    unit: '人',
    is_value_locked: false,
    next_layer: layer_for_grandchildren1
  },
  {
    id: 3,
    name: '顧客単価',
    value: 2000,
    value_format: 'なし',
    unit: '円',
    is_value_locked: false,
    next_layer: layer_for_grandchildren2
  }
]

layer_for_children = {
  operation: 'かけ算',
  fraction: nil,
  nodes: children
}

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
      json.operation layer_for_children[:operation]
      json.fraction layer_for_children[:fraction]
      json.children do
        json.array! layer_for_children[:nodes] do |child|
          json.id child[:id]
          json.name child[:name]
          json.value child[:value]
          json.value_format child[:value_format]
          json.unit child[:unit]
          json.is_value_locked child[:is_value_locked]
          json.next_layer do
            json.operation child[:next_layer][:operation]
            json.fraction child[:next_layer][:fraction]
            json.children do
              json.array! child[:next_layer][:nodes] do |grandchild|
                json.id grandchild[:id]
                json.name grandchild[:name]
                json.value grandchild[:value]
                json.value_format grandchild[:value_format]
                json.unit grandchild[:unit]
                json.is_value_locked grandchild[:is_value_locked]
                if grandchild[:next_layer]
                  json.next_layer do
                    json.operation grandchild[:next_layer][:operation]
                    json.fraction grandchild[:next_layer][:fraction]
                    json.children do
                      json.array! grandchild[:next_layer][:nodes] do |great_grandchild|
                        json.id great_grandchild[:id]
                        json.name great_grandchild[:name]
                        json.value great_grandchild[:value]
                        json.value_format great_grandchild[:value_format]
                        json.unit great_grandchild[:unit]
                        json.is_value_locked great_grandchild[:is_value_locked]
                      end
                    end
                  end
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
