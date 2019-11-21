# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_11_21_224815) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "emergency_room_visits", force: :cascade do |t|
    t.string "visit_description"
    t.integer "given_wait_time_minutes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "users_id"
    t.bigint "emergency_rooms_id"
    t.boolean "is_active", default: true
    t.bigint "patients_id"
    t.index ["emergency_rooms_id"], name: "index_emergency_room_visits_on_emergency_rooms_id"
    t.index ["patients_id"], name: "index_emergency_room_visits_on_patients_id"
    t.index ["users_id"], name: "index_emergency_room_visits_on_users_id"
  end

  create_table "emergency_rooms", force: :cascade do |t|
    t.string "hospital_name"
    t.string "address"
  end

  create_table "patients", force: :cascade do |t|
    t.integer "ahc_number"
    t.string "address"
    t.integer "age"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "users_id"
    t.string "name"
    t.string "allergies"
    t.string "gender"
    t.string "caregiver_relationship"
    t.index ["users_id"], name: "index_patients_on_users_id"
  end

  create_table "triage_question_answers", force: :cascade do |t|
    t.string "answer_text"
    t.bigint "triage_questions_id"
    t.bigint "emergency_room_visits_id"
    t.index ["emergency_room_visits_id"], name: "index_triage_question_answers_on_emergency_room_visits_id"
    t.index ["triage_questions_id"], name: "index_triage_question_answers_on_triage_questions_id"
  end

  create_table "triage_questions", force: :cascade do |t|
    t.string "question_text"
  end

  create_table "users", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "phone"
    t.string "password_digest"
    t.string "role"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "emergency_room_visits", "emergency_rooms", column: "emergency_rooms_id"
  add_foreign_key "emergency_room_visits", "patients", column: "patients_id"
  add_foreign_key "emergency_room_visits", "users", column: "users_id"
  add_foreign_key "patients", "users", column: "users_id"
  add_foreign_key "triage_question_answers", "emergency_room_visits", column: "emergency_room_visits_id"
  add_foreign_key "triage_question_answers", "triage_questions", column: "triage_questions_id"
end
