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

grandchildren1 = [
  {
    id: 4,
    name: '訪問者数',
    value: 10,
    value_format: '万',
    unit: '人',
    is_value_locked: false,
    child_layer: {
      operation: 'たし算',
      fraction: nil
    },
    children: great_grandchildren1
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

children = [
  {
    id: 2,
    name: '購入者数',
    value: 5000,
    value_format: 'なし',
    unit: '人',
    is_value_locked: false,
    child_layer: {
      operation: 'かけ算',
      fraction: nil
    },
    children: grandchildren1
  },
  {
    id: 3,
    name: '顧客単価',
    value: 2000,
    value_format: 'なし',
    unit: '円',
    is_value_locked: false,
    child_layer: {
      operation: 'かけ算',
      fraction: -80
    },
    children: grandchildren2
  }
]

layer = {
  operation: 'かけ算',
  fraction: nil
}

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
    json.child_layer layer
    json.children children
  end
end
