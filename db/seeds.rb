# frozen_string_literal: true

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

user_with_trees = User.create
user_with_one_tree = User.create
User.create # user without trees

### tree1
tree1 = user_with_trees.trees.create(name: '売上構成ツリー')

root = tree1.nodes.create(name: '売上金額', value: 1000, value_format: '万', unit: '円', is_value_locked: true)
child1 = root.children.create(name: '購入者数', value: 5000, value_format: 'なし', unit: '人', tree: tree1)
child2 = root.children.create(name: '顧客単価', value: 2000, value_format: 'なし', unit: '円', tree: tree1)
grandchild11 = child1.children.create(name: '訪問者数', value: 10, value_format: '万', unit: '人', tree: tree1)
grandchild12 = child1.children.create(name: '購入率', value: 5, value_format: '%', tree: tree1)
grandchild21 = child2.children.create(name: '平均商品単価', value: 1200, value_format: 'なし', unit: '円', tree: tree1)
grandchild22 = child2.children.create(name: '平均購入数', value: 1.6, value_format: 'なし', unit: '個', tree: tree1)
great_grandchild111 = grandchild11.children.create(name: '検索流入', value: 5, value_format: '万', unit: '人', tree: tree1)
great_grandchild112 = grandchild11.children.create(name: '広告流入', value: 4, value_format: '万', unit: '人', tree: tree1)
great_grandchild113 = grandchild11.children.create(name: 'メルマガ流入', value: 1, value_format: '万', unit: '人', tree: tree1)

Layer.create(nodes: [root])
Layer.create(nodes: [child1, child2], operation: 'かけ算')
Layer.create(nodes: [grandchild11, grandchild12], operation: 'かけ算')
Layer.create(nodes: [grandchild21, grandchild22], operation: 'かけ算', fraction: -80)
Layer.create(nodes: [great_grandchild111, great_grandchild112, great_grandchild113], operation: 'たし算')

### tree2
tree2 = user_with_trees.trees.create(name: '無題のツリー')

defalut_root = tree2.nodes.create(name: '売上金額', value: 500, value_format: '万', unit: '円', is_value_locked: true)
default_child1 = defalut_root.children.create(name: '購入者数', value: 10_000, value_format: 'なし', unit: '人', tree: tree2)
default_child2 = defalut_root.children.create(name: '顧客単価', value: 500, value_format: 'なし', unit: '円', tree: tree2)
Layer.create(nodes: [defalut_root])
Layer.create(nodes: [default_child1, default_child2], operation: 'かけ算')

### tree3
tree3 = user_with_trees.trees.create(name: 'ルートノードだけのツリー')

lonely_root = tree3.nodes.create(name: 'ルート', value: 0, value_format: 'なし')
Layer.create(nodes: [lonely_root])

### tree4
tree4 = user_with_one_tree.trees.create(name: 'ユーザー2のツリー')

root_tree4 = tree4.nodes.create(name: '採用目標', value: 100, value_format: 'なし', unit: '人')
child1_tree4 = root_tree4.children.create(name: '新卒', value: 30, value_format: 'なし', unit: '人', tree: tree4)
child2_tree4 = root_tree4.children.create(name: '中途', value: 70, value_format: 'なし', unit: '人', tree: tree4)
Layer.create(nodes: [root_tree4])
Layer.create(nodes: [child1_tree4, child2_tree4], operation: 'たし算')
