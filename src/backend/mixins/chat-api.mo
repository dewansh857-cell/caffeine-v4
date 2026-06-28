import ChatTypes "../types/chat";
import ChatLib "../lib/chat";

/// Exposes the public chat API.
mixin () {

  public func chat(request : ChatTypes.ChatRequest) : async ChatTypes.ChatResponse {
    await ChatLib.chat(request);
  };
};
