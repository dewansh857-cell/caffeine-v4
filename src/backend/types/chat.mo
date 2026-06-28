import Debug "mo:core/Debug";

module {
  public type ChatMessage = {
    role : Text; // "user" | "assistant" | "system"
    content : Text;
  };

  public type ChatRequest = {
    messages : [ChatMessage];
  };

  public type ChatResponse = {
    status : { #success; #error };
    content : ?Text;
    errorMessage : ?Text;
  };
};
