import ChatTypes "../types/chat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

module {
  // System prompt tuned for app development assistance
  let SYSTEM_PROMPT : Text =
    "You are an expert app development assistant. Help users design, plan, and build web applications. Provide clear, actionable advice on architecture, UI/UX, technology choices, and implementation. When the user describes an app idea, break it down into features, pages, components, and data models. Be concise but thorough. Suggest modern best practices and relevant tools.";

  // Build the JSON request body for Pollinations.ai OpenAI-compatible endpoint
  func buildRequestBody(request : ChatTypes.ChatRequest) : Text {
    var body = "{\"model\":\"openai\",\"messages\":[";

    // System message first
    body := body # "{\"role\":\"system\",\"content\":" # escapeJson(SYSTEM_PROMPT) # "}";

    // User messages
    for (msg in request.messages.vals()) {
      body := body # ",{\"role\":" # escapeJson(msg.role) # ",\"content\":" # escapeJson(msg.content) # "}";
    };

    body := body # "],\"temperature\":0.7}";
    body;
  };

  // Minimal JSON string escaping
  func escapeJson(text : Text) : Text {
    var result = "\"";
    for (c in text.chars()) {
      let code = c.toNat32();
      if (code == 34) {
        result := result # "\\\"";
      } else if (code == 92) {
        result := result # "\\\\";
      } else if (code == 10) {
        result := result # "\\n";
      } else if (code == 13) {
        result := result # "\\r";
      } else if (code == 9) {
        result := result # "\\t";
      } else {
        result := result # c.toText();
      };
    };
    result # "\"";
  };

  // Extract content from a simple OpenAI-style response
  func extractContent(response : Text) : ?Text {
    // Look for "content":"..." pattern
    let pattern = "\"content\":";
    let idxOpt = findTextIndex(response, pattern);
    switch (idxOpt) {
      case null { return null };
      case (?idx) {
        let after = textSubstring(response, idx + pattern.size(), response.size() - idx - pattern.size());
        let trimmed = after.trimStart(#predicate (func(c : Char) : Bool { c == ' ' or c == '\t' or c == '\n' or c == '\r' or c == ':' }));
        let trimmed2 = trimmed.trimStart(#predicate (func(c : Char) : Bool { c == ' ' or c == '\t' or c == '\n' or c == '\r' }));

        if (trimmed2.size() == 0) { return null };

        // Check if starts with quote
        let firstChar = getCharAt(trimmed2, 0);
        if (firstChar == ?(Char.fromNat32(34))) {
          // Find closing quote (not escaped)
          var i = 1;
          var inEscape = false;
          while (i < trimmed2.size()) {
            let cOpt = getCharAt(trimmed2, i);
            switch (cOpt) {
              case null { return null };
              case (?c) {
                if (inEscape) {
                  inEscape := false;
                } else if (c == '\\') {
                  inEscape := true;
                } else if (c == Char.fromNat32(34)) {
                  let content = textSubstring(trimmed2, 1, i - 1);
                  return ?unescapeJson(content);
                };
              };
            };
            i += 1;
          };
          null;
        } else {
          null;
        };
      };
    };
  };

  // Helper: find the first index of a pattern in text (manual search since Text.indexOf is unavailable)
  func findTextIndex(text : Text, pattern : Text) : ?Nat {
    if (pattern.size() == 0) { return ?0 };
    if (pattern.size() > text.size()) { return null };
    var i = 0;
    let maxStart = text.size() - pattern.size();
    while (i <= maxStart) {
      var j = 0;
      var match = true;
      while (j < pattern.size()) {
        switch (getCharAt(text, i + j), getCharAt(pattern, j)) {
          case (?tc, ?pc) {
            if (tc != pc) {
              match := false;
              j := pattern.size(); // break inner loop
            };
          };
          case _ {
            match := false;
            j := pattern.size();
          };
        };
        j += 1;
      };
      if (match) { return ?i };
      i += 1;
    };
    null;
  };

  // Helper: get character at index from Text
  func getCharAt(text : Text, index : Nat) : ?Char {
    var i = 0;
    for (c in text.chars()) {
      if (i == index) { return ?c };
      i += 1;
    };
    null;
  };

  // Helper: extract substring from Text (manual, since Text.substring is unavailable)
  func textSubstring(text : Text, start : Nat, len : Nat) : Text {
    var result = "";
    var i = 0;
    for (c in text.chars()) {
      if (i >= start and i < start + len) {
        result := result # c.toText();
      };
      if (i >= start + len) { return result };
      i += 1;
    };
    result;
  };

  // Minimal JSON unescaping
  func unescapeJson(text : Text) : Text {
    var result = "";
    var i = 0;
    while (i < text.size()) {
      switch (getCharAt(text, i)) {
        case null { return result };
        case (?c) {
          if (c == '\\' and i + 1 < text.size()) {
            switch (getCharAt(text, i + 1)) {
              case null { result := result # c.toText(); i += 1 };
              case (?next) {
                if (next == Char.fromNat32(34)) { result := result # "\""; i += 2 }
                else if (next == '\\') { result := result # "\\"; i += 2 }
                else if (next == 'n') { result := result # "\n"; i += 2 }
                else if (next == 'r') { result := result # "\r"; i += 2 }
                else if (next == 't') { result := result # "\t"; i += 2 }
                else { result := result # c.toText(); i += 1 };
              };
            };
          } else {
            result := result # c.toText();
            i += 1;
          };
        };
      };
    };
    result;
  };

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  public func chat(request : ChatTypes.ChatRequest) : async ChatTypes.ChatResponse {
    let endpoint = "https://text.pollinations.ai/openai";
    let body = buildRequestBody(request);

    let ic = actor "aaaaa-aa" : actor {
      http_request : {
        url : Text;
        method : { #get; #post; #head };
        headers : [(Text, Text)];
        body : ?Blob;
      } -> async {
        status : Nat;
        headers : [(Text, Text)];
        body : Blob;
      };
    };

    try {
      let response = await ic.http_request({
        url = endpoint;
        method = #post;
        headers = [
          ("Content-Type", "application/json"),
          ("Accept", "application/json"),
        ];
        body = ?body.encodeUtf8();
      });

      if (response.status < 200 or response.status >= 300) {
        return {
          status = #error;
          content = null;
          errorMessage = ?("HTTP error: " # response.status.toText());
        };
      };

      let responseText = switch (response.body.decodeUtf8()) {
        case (?t) { t };
        case null {
          return {
            status = #error;
            content = null;
            errorMessage = ?"Failed to decode response body as UTF-8";
          };
        };
      };

      switch (extractContent(responseText)) {
        case (?content) {
          {
            status = #success;
            content = ?content;
            errorMessage = null;
          };
        };
        case null {
          {
            status = #error;
            content = null;
            errorMessage = ?"Failed to extract content from AI response";
          };
        };
      };
    } catch (e) {
      {
        status = #error;
        content = null;
        errorMessage = ?"HTTP request failed";
      };
    };
  };
};
