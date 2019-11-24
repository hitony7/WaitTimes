class ChatChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_from 'chats'
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    chats = Chat.find(data["id"])
    chats.update!(text: data["text"])
    ActionCable.server.broadcast('chats', data)
  end
end
