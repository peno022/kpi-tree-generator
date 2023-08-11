# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_08_05_105355) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "layers", force: :cascade do |t|
    t.integer "operation"
    t.float "fraction"
    t.bigint "parent_node_id"
    t.bigint "tree_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["parent_node_id"], name: "index_layers_on_parent_node_id"
    t.index ["tree_id"], name: "index_layers_on_tree_id"
  end

  create_table "nodes", force: :cascade do |t|
    t.string "name"
    t.float "value"
    t.integer "value_format"
    t.string "unit"
    t.boolean "is_value_locked", default: false
    t.bigint "tree_id", null: false
    t.bigint "parent_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["parent_id"], name: "index_nodes_on_parent_id"
    t.index ["tree_id"], name: "index_nodes_on_tree_id"
  end

  create_table "trees", force: :cascade do |t|
    t.string "name"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_trees_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "uid"
    t.string "name"
    t.string "email"
    t.string "image"
    t.string "provider", default: "google_oauth2", null: false
    t.index ["uid", "provider"], name: "index_users_on_uid_and_provider", unique: true
  end

  add_foreign_key "layers", "nodes", column: "parent_node_id"
  add_foreign_key "layers", "trees"
  add_foreign_key "nodes", "nodes", column: "parent_id"
  add_foreign_key "nodes", "trees"
  add_foreign_key "trees", "users"
end
