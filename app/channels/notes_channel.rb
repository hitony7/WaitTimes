# frozen_string_literal: true

class NotesChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_from 'notes'
    stream_for current_user
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(data)
    # note = Note.find(data['id'])
    # note.update!(text: data['text'])
    ActionCable.server.broadcast('notes', data)
  end
end
