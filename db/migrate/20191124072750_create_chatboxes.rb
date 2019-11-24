class CreateChatboxes < ActiveRecord::Migration[5.2]
  def change
    create_table :chatboxes do |t|
      t.text :text

      t.timestamps
    end
  end
end
