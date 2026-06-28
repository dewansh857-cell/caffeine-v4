import Map "mo:core/Map";
import AITypes "../types/ai";
import Common "../types/common";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Bool "mo:core/Bool";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Option "mo:core/Option";
import Char "mo:core/Char";

module {
  // ---------------------------------------------------------------------------
  // Storage operations
  // ---------------------------------------------------------------------------

  public func saveConfig(
    configs : Map.Map<Common.ProjectId, AITypes.GeneratedAppConfig>,
    projectId : Common.ProjectId,
    config : AITypes.GeneratedAppConfig,
  ) : () {
    configs.add(projectId, config);
  };

  public func getConfig(
    configs : Map.Map<Common.ProjectId, AITypes.GeneratedAppConfig>,
    projectId : Common.ProjectId,
  ) : ?AITypes.GeneratedAppConfig {
    configs.get(projectId);
  };

  // ---------------------------------------------------------------------------
  // AI generation
  // ---------------------------------------------------------------------------

  public func generateApp(
    request : AITypes.AIGenerationRequest,
  ) : async AITypes.AIGenerationResponse {
    let prompt = buildPrompt(request.answers);
    let endpoint = switch (request.apiEndpoint) {
      case (?ep) { ep };
      case null { "https://text.pollinations.ai/openai" };
    };

    let jsonBody = "{\"model\":\"openai\",\"messages\":[{\"role\":\"user\",\"content\":" # escapeJsonString(prompt) # "}],\"temperature\":0.7}";

    let httpRequest : {
      url : Text;
      method : { #get; #post; #head };
      headers : [(Text, Text)];
      body : ?Blob;
    } = {
      url = endpoint;
      method = #post;
      headers = [
        ("Content-Type", "application/json"),
        ("Accept", "application/json"),
      ];
      body = ?jsonBody.encodeUtf8();
    };

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
      let response = await ic.http_request(httpRequest);
      if (response.status < 200 or response.status >= 300) {
        return {
          status = #error;
          config = null;
          errorMessage = ?("HTTP error: " # response.status.toText());
        };
      };

      let responseText = switch (response.body.decodeUtf8()) {
        case (?t) { t };
        case null {
          return {
            status = #error;
            config = null;
            errorMessage = ?"Failed to decode response body as UTF-8";
          };
        };
      };

      // Extract JSON content from the response
      let content = extractContentFromOpenAIResponse(responseText);
      switch (content) {
        case (?jsonContent) {
          switch (parseConfig(jsonContent)) {
            case (?config) {
              {
                status = #success;
                config = ?config;
                errorMessage = null;
              };
            };
            case null {
              {
                status = #error;
                config = null;
                errorMessage = ?"Failed to parse AI response into app config";
              };
            };
          };
        };
        case null {
          // Try parsing the whole response as config directly
          switch (parseConfig(responseText)) {
            case (?config) {
              {
                status = #success;
                config = ?config;
                errorMessage = null;
              };
            };
            case null {
              {
                status = #error;
                config = null;
                errorMessage = ?"Failed to extract content from AI response";
              };
            };
          };
        };
      };
    } catch (e) {
      {
        status = #error;
        config = null;
        errorMessage = ?"HTTP request failed";
      };
    };
  };

  // ---------------------------------------------------------------------------
  // Prompt building
  // ---------------------------------------------------------------------------

  public func buildPrompt(answers : Text) : Text {
    "Based on the following questionnaire answers, generate a complete app configuration as a JSON object. "
    # "The JSON must match this exact schema:\n\n"
    # "{\n"
    # "  \"appName\": \"string\",\n"
    # "  \"description\": \"string\",\n"
    # "  \"pages\": [\n"
    # "    {\n"
    # "      \"name\": \"string\",\n"
    # "      \"route\": \"string\",\n"
    # "      \"description\": \"string\",\n"
    # "      \"components\": [\"string\"]\n"
    # "    }\n"
    # "  ],\n"
    # "  \"components\": [\n"
    # "    {\n"
    # "      \"name\": \"string\",\n"
    # "      \"type\": \"string\",\n"
    # "      \"description\": \"string\",\n"
    # "      \"props\": [[\"string\", \"string\"]]\n"
    # "    }\n"
    # "  ],\n"
    # "  \"theme\": {\n"
    # "    \"primaryColor\": \"string\",\n"
    # "    \"secondaryColor\": \"string\",\n"
    # "    \"fontFamily\": \"string\",\n"
    # "    \"darkMode\": boolean\n"
    # "  },\n"
    # "  \"dataModel\": [\n"
    # "    {\n"
    # "      \"name\": \"string\",\n"
    # "      \"fields\": [[\"string\", \"string\"]],\n"
    # "      \"description\": \"string\"\n"
    # "    }\n"
    # "  ]\n"
    # "}\n\n"
    # "Questionnaire answers: " # answers # "\n\n"
    # "Return ONLY the JSON object, no markdown formatting, no explanations.";
  };

  // ---------------------------------------------------------------------------
  // Response parsing
  // ---------------------------------------------------------------------------

  func isSpace(c : Char) : Bool { c == ch(32) };

  public func parseConfig(json : Text) : ?AITypes.GeneratedAppConfig {
    // Try to find and parse the JSON object
    let trimmed = json.trimStart(#predicate isSpace);
    let jsonText = if (trimmed.startsWith(#text "```")) {
      // Extract from code block
      let lines = trimmed.split(#text "\n");
      var inBlock = false;
      var content = "";
      for (line in lines) {
        if (line.startsWith(#text "```json") or line.startsWith(#text "```")) {
          inBlock := not inBlock;
          if (not inBlock and content != "") {
            // End of block
          };
        } else if (inBlock) {
          content := content # line # "\n";
        } else if (not inBlock and content == "" and line != "") {
          // Before code block, skip
        };
      };
      if (content != "") { content } else { trimmed };
    } else {
      trimmed;
    };

    // Find the outermost JSON object
    let objectStart = findChar(jsonText, '{');
    let objectEnd = findMatchingBrace(jsonText, objectStart);

    if (objectStart == -1 or objectEnd == -1 or objectEnd <= objectStart) {
      return null;
    };

    let objText = substring(jsonText, objectStart, objectEnd + 1);
    parseGeneratedAppConfig(objText);
  };

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  func extractContentFromOpenAIResponse(response : Text) : ?Text {
    // Look for "content" field in the response
    let contentPattern = "\"content\":";
    let contentIdx = findString(response, contentPattern);
    if (contentIdx == -1) {
      return null;
    };

    let afterContent = substring(response, contentIdx + contentPattern.size(), response.size());
    let trimmed = afterContent.trimStart(#predicate (func (c : Char) : Bool { c == ch(32) }));

    if (trimmed.size() == 0) {
      return null;
    };

    // Find the string value
    let firstChar = charAt(trimmed, 0);
    if (firstChar == ?ch(34)) {
      // String value
      let endQuote = findNextQuote(trimmed, 1);
      if (endQuote == -1) {
        return null;
      };
      let strContent = substring(trimmed, 1, endQuote);
      ?unescapeJsonString(strContent);
    } else if (firstChar == ?ch(91)) {
      // Array value (for choices)
      let endBracket = findMatchingBracket(trimmed, '[', ']');
      if (endBracket == -1) {
        return null;
      };
      ?substring(trimmed, 0, endBracket + 1);
    } else {
      null;
    };
  };

  func parseGeneratedAppConfig(json : Text) : ?AITypes.GeneratedAppConfig {
    let appName = extractStringField(json, "appName");
    let description = extractStringField(json, "description");

    if (appName == null or description == null) {
      return null;
    };

    let pages = extractArrayField(json, "pages", parseGeneratedPage);
    let components = extractArrayField(json, "components", parseGeneratedComponent);
    let theme = extractObjectField(json, "theme", parseGeneratedTheme);
    let dataModel = extractArrayField(json, "dataModel", parseGeneratedDataModel);

    let now = Int.abs(Time.now()) / 1_000_000;

    ?{
      appName = appName.get("Untitled App");
      description = description.get("");
      pages = pages.get([]);
      components = components.get([]);
      theme = theme.get({
        primaryColor = "#3B82F6";
        secondaryColor = "#10B981";
        fontFamily = "Inter";
        darkMode = false;
      });
      dataModel = dataModel.get([]);
      generatedAt = now;
    };
  };

  func parseGeneratedPage(json : Text) : ?AITypes.GeneratedPage {
    let name = extractStringField(json, "name");
    let route = extractStringField(json, "route");
    let description = extractStringField(json, "description");
    let components = extractStringArrayField(json, "components");

    if (name == null or route == null) {
      return null;
    };

    ?{
      name = name.get("");
      route = route.get("");
      description = description.get("");
      components = components.get([]);
    };
  };

  func parseGeneratedComponent(json : Text) : ?AITypes.GeneratedComponent {
    let name = extractStringField(json, "name");
    let type_ = extractStringField(json, "type");
    let description = extractStringField(json, "description");
    let props = extractTupleArrayField(json, "props");

    if (name == null) {
      return null;
    };

    ?{
      name = name.get("");
      type_ = type_.get("custom");
      description = description.get("");
      props = props.get([]);
    };
  };

  func parseGeneratedDataModel(json : Text) : ?AITypes.GeneratedDataModel {
    let name = extractStringField(json, "name");
    let fields = extractTupleArrayField(json, "fields");
    let description = extractStringField(json, "description");

    if (name == null) {
      return null;
    };

    ?{
      name = name.get("");
      fields = fields.get([]);
      description = description.get("");
    };
  };

  func parseGeneratedTheme(json : Text) : ?AITypes.GeneratedTheme {
    let primaryColor = extractStringField(json, "primaryColor");
    let secondaryColor = extractStringField(json, "secondaryColor");
    let fontFamily = extractStringField(json, "fontFamily");
    let darkMode = extractBoolField(json, "darkMode");

    ?{
      primaryColor = primaryColor.get("#3B82F6");
      secondaryColor = secondaryColor.get("#10B981");
      fontFamily = fontFamily.get("Inter");
      darkMode = darkMode.get(false);
    };
  };

  // ---------------------------------------------------------------------------
  // JSON extraction helpers
  // ---------------------------------------------------------------------------

  func extractStringField(json : Text, fieldName : Text) : ?Text {
    let pattern = "\"" # fieldName # "\"";
    let idx = findString(json, pattern);
    if (idx == -1) {
      return null;
    };

    let afterField = substring(json, idx + pattern.size(), json.size());
    let trimmed = afterField.trimStart(#predicate isSpace);

    if (trimmed.size() > 0 and charAt(trimmed, 0) == ?ch(58)) {
      let afterColon = substring(trimmed, 1, trimmed.size()).trimStart(#predicate isSpace);
      if (afterColon.size() > 0 and charAt(afterColon, 0) == ?ch(34)) {
        let endQuote = findNextQuote(afterColon, 1);
        if (endQuote == -1) {
          return null;
        };
        let value = substring(afterColon, 1, endQuote);
        ?unescapeJsonString(value);
      } else {
        null;
      };
    } else {
      null;
    };
  };

  func extractBoolField(json : Text, fieldName : Text) : ?Bool {
    let pattern = "\"" # fieldName # "\"";
    let idx = findString(json, pattern);
    if (idx == -1) {
      return null;
    };

    let afterField = substring(json, idx + pattern.size(), json.size());
    let trimmed = afterField.trimStart(#predicate isSpace);

    if (trimmed.size() > 0 and charAt(trimmed, 0) == ?ch(58)) {
      let afterColon = substring(trimmed, 1, trimmed.size()).trimStart(#predicate isSpace);
      if (afterColon.size() >= 4 and substring(afterColon, 0, 4) == "true") {
        ?true;
      } else if (afterColon.size() >= 5 and substring(afterColon, 0, 5) == "false") {
        ?false;
      } else {
        null;
      };
    } else {
      null;
    };
  };

  func extractStringArrayField(json : Text, fieldName : Text) : ?[Text] {
    let pattern = "\"" # fieldName # "\"";
    let idx = findString(json, pattern);
    if (idx == -1) {
      return null;
    };

    let afterField = substring(json, idx + pattern.size(), json.size());
    let trimmed = afterField.trimStart(#predicate isSpace);

    if (trimmed.size() > 0 and charAt(trimmed, 0) == ?ch(58)) {
      let afterColon = substring(trimmed, 1, trimmed.size()).trimStart(#predicate isSpace);
      if (afterColon.size() > 0 and charAt(afterColon, 0) == ?ch(91)) {
        let endBracket = findMatchingBracket(afterColon, '[', ']');
        if (endBracket == -1) {
          return null;
        };
        let arrayContent = substring(afterColon, 1, endBracket);
        ?parseStringArray(arrayContent);
      } else {
        null;
      };
    } else {
      null;
    };
  };

  func extractTupleArrayField(json : Text, fieldName : Text) : ?[(Text, Text)] {
    let pattern = "\"" # fieldName # "\"";
    let idx = findString(json, pattern);
    if (idx == -1) {
      return null;
    };

    let afterField = substring(json, idx + pattern.size(), json.size());
    let trimmed = afterField.trimStart(#predicate isSpace);

    if (trimmed.size() > 0 and charAt(trimmed, 0) == ?ch(58)) {
      let afterColon = substring(trimmed, 1, trimmed.size()).trimStart(#predicate isSpace);
      if (afterColon.size() > 0 and charAt(afterColon, 0) == ?ch(91)) {
        let endBracket = findMatchingBracket(afterColon, '[', ']');
        if (endBracket == -1) {
          return null;
        };
        let arrayContent = substring(afterColon, 1, endBracket);
        ?parseTupleArray(arrayContent);
      } else {
        null;
      };
    } else {
      null;
    };
  };

  func extractArrayField<T>(
    json : Text,
    fieldName : Text,
    parser : (Text) -> ?T,
  ) : ?[T] {
    let pattern = "\"" # fieldName # "\"";
    let idx = findString(json, pattern);
    if (idx == -1) {
      return null;
    };

    let afterField = substring(json, idx + pattern.size(), json.size());
    let trimmed = afterField.trimStart(#predicate isSpace);

    if (trimmed.size() > 0 and charAt(trimmed, 0) == ?ch(58)) {
      let afterColon = substring(trimmed, 1, trimmed.size()).trimStart(#predicate isSpace);
      if (afterColon.size() > 0 and charAt(afterColon, 0) == ?ch(91)) {
        let endBracket = findMatchingBracket(afterColon, '[', ']');
        if (endBracket == -1) {
          return null;
        };
        let arrayContent = substring(afterColon, 1, endBracket);
        ?parseObjectArray(arrayContent, parser);
      } else {
        null;
      };
    } else {
      null;
    };
  };

  func extractObjectField<T>(
    json : Text,
    fieldName : Text,
    parser : (Text) -> ?T,
  ) : ?T {
    let pattern = "\"" # fieldName # "\"";
    let idx = findString(json, pattern);
    if (idx == -1) {
      return null;
    };

    let afterField = substring(json, idx + pattern.size(), json.size());
    let trimmed = afterField.trimStart(#predicate isSpace);

    if (trimmed.size() > 0 and charAt(trimmed, 0) == ?ch(58)) {
      let afterColon = substring(trimmed, 1, trimmed.size()).trimStart(#predicate isSpace);
      if (afterColon.size() > 0 and charAt(afterColon, 0) == ?ch(123)) {
        let endBrace = findMatchingBrace(afterColon, 0);
        if (endBrace == -1) {
          return null;
        };
        let objText = substring(afterColon, 0, endBrace + 1);
        parser(objText);
      } else {
        null;
      };
    } else {
      null;
    };
  };

  // ---------------------------------------------------------------------------
  // String parsing helpers
  // ---------------------------------------------------------------------------

  func parseStringArray(content : Text) : [Text] {
    var result : [Text] = [];
    var i = 0;
    while (i < content.size()) {
      // Skip whitespace and commas
      while (i < content.size()) {
        let c = charAt(content, i);
        if (c != ?ch(32) and c != ?ch(10) and c != ?ch(9) and c != ?ch(44)) {
          break;
        };
        i += 1;
      };

      if (i >= content.size()) {
        break;
      };

      if (charAt(content, i) == ?ch(34)) {
        let endQuote = findNextQuote(content, i + 1);
        if (endQuote != -1) {
          let value = substring(content, i + 1, endQuote);
          result := result.concat([unescapeJsonString(value)]);
          i := Int.abs(endQuote) + 1;
        } else {
          i += 1;
        };
      } else {
        i += 1;
      };
    };
    result;
  };

  func parseTupleArray(content : Text) : [(Text, Text)] {
    var result : [(Text, Text)] = [];
    var i = 0;
    while (i < content.size()) {
      // Skip whitespace and commas
      while (i < content.size()) {
        let c = charAt(content, i);
        if (c != ?ch(32) and c != ?ch(10) and c != ?ch(9) and c != ?ch(44)) {
          break;
        };
        i += 1;
      };

      if (i >= content.size()) {
        break;
      };

      if (charAt(content, i) == ?ch(91)) {
        let endBracket = findMatchingBracketFrom(content, ch(91), ch(93), i);
        if (endBracket != -1) {
          let tupleContent = substring(content, i + 1, endBracket);
          let parts = parseStringArray(tupleContent);
          if (parts.size() >= 2) {
            result := result.concat([(parts[0], parts[1])]);
          };
          i := Int.abs(endBracket) + 1;
        } else {
          i += 1;
        };
      } else {
        i += 1;
      };
    };
    result;
  };

  func parseObjectArray<T>(content : Text, parser : (Text) -> ?T) : [T] {
    var result : [T] = [];
    var i = 0;
    while (i < content.size()) {
      // Skip whitespace and commas
      while (i < content.size()) {
        let c = charAt(content, i);
        if (c != ?ch(32) and c != ?ch(10) and c != ?ch(9) and c != ?ch(44)) {
          break;
        };
        i += 1;
      };

      if (i >= content.size()) {
        break;
      };

      if (charAt(content, i) == ?ch(123)) {
        let endBrace = findMatchingBrace(content, i);
        if (endBrace != -1) {
          let objText = substring(content, i, endBrace + 1);
          switch (parser(objText)) {
            case (?item) {
              result := result.concat([item]);
            };
            case null {};
          };
          i := Int.abs(endBrace) + 1;
        } else {
          i += 1;
        };
      } else {
        i += 1;
      };
    };
    result;
  };

  // ---------------------------------------------------------------------------
  // charAt helper using Text.chars iterator
  // ---------------------------------------------------------------------------

  func charAt(text : Text, index : Int) : ?Char {
    if (index < 0) return null;
    var i = 0;
    for (c in text.chars()) {
      if (i == index) {
        return ?c;
      };
      i += 1;
    };
    null;
  };

  // ---------------------------------------------------------------------------
  // Char helper
  // ---------------------------------------------------------------------------

  func ch(code : Nat) : Char {
    Char.fromNat32(Nat32.fromNat(code));
  };

  // ---------------------------------------------------------------------------
  // Text utilities
  // ---------------------------------------------------------------------------

  func findString(text : Text, pattern : Text) : Int {
    if (pattern.size() == 0) {
      return 0;
    };
    if (pattern.size() > text.size()) {
      return -1;
    };

    var i : Nat = 0;
    let maxI : Nat = if (pattern.size() > text.size()) { 0 } else { text.size() - pattern.size() };
    while (i <= maxI) {
      var match = true;
      var j = 0;
      while (j < pattern.size()) {
        if (charAt(text, i + j) != charAt(pattern, j)) {
          match := false;
          break;
        };
        j += 1;
      };
      if (match) {
        return i;
      };
      i += 1;
    };
    -1;
  };

  func findChar(text : Text, char : Char) : Int {
    var i = 0;
    while (i < text.size()) {
      if (charAt(text, i) == ?char) {
        return i;
      };
      i += 1;
    };
    -1;
  };

  func findNextQuote(text : Text, start : Int) : Int {
    var i = start;
    while (i < text.size()) {
      let c = charAt(text, i);
      if (c == ?ch(34) and (i == 0 or charAt(text, i - 1) != ?ch(92))) {
        // Check if escaped
        var backslashes = 0;
        var j = i - 1;
        while (j >= start) {
          if (charAt(text, j) == ?ch(92)) {
            backslashes += 1;
            j -= 1;
          } else {
            break;
          };
        };
        if (backslashes % 2 == 0) {
          return i;
        };
      };
      i += 1;
    };
    -1;
  };

  func findMatchingBrace(text : Text, start : Int) : Int {
    var depth = 0;
    var inString = false;
    var i = start;
    while (i < text.size()) {
      let c = charAt(text, i);
      if (c == ?ch(34) and (i == 0 or charAt(text, i - 1) != ?ch(92))) {
        inString := not inString;
      } else if (not inString) {
        if (c == ?ch(123)) {
          depth += 1;
        } else if (c == ?ch(125)) {
          depth -= 1;
          if (depth == 0) {
            return i;
          };
        };
      };
      i += 1;
    };
    -1;
  };

  func findMatchingBracket(text : Text, open : Char, close : Char) : Int {
    findMatchingBracketFrom(text, open, close, 0);
  };

  func findMatchingBracketFrom(text : Text, open : Char, close : Char, start : Int) : Int {
    var depth = 0;
    var inString = false;
    var i = start;
    while (i < text.size()) {
      let c = charAt(text, i);
      if (c == ?ch(34) and (i == 0 or charAt(text, i - 1) != ?ch(92))) {
        inString := not inString;
      } else if (not inString) {
        if (c == ?open) {
          depth += 1;
        } else if (c == ?close) {
          depth -= 1;
          if (depth == 0) {
            return i;
          };
        };
      };
      i += 1;
    };
    -1;
  };

  func substring(text : Text, start : Int, end : Int) : Text {
    if (start < 0) { return "" };
    if (end > text.size()) { return "" };
    if (start >= end) { return "" };

    var result = "";
    var i = start;
    while (i < end) {
      switch (charAt(text, i)) {
        case (?c) {
          result := result # c.toText();
        };
        case null {};
      };
      i += 1;
    };
    result;
  };

  func escapeJsonString(text : Text) : Text {
    var result = "\"";
    var i = 0;
    while (i < text.size()) {
      switch (charAt(text, i)) {
        case (?c) {
          let code = Nat32.toNat(c.toNat32());
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
        case null {};
      };
      i += 1;
    };
    result # "\"";
  };

  func unescapeJsonString(text : Text) : Text {
    var result = "";
    var i = 0;
    while (i < text.size()) {
      switch (charAt(text, i)) {
        case (?c) {
          let code = Nat32.toNat(c.toNat32());
          if (code == 92 and i + 1 < text.size()) {
            switch (charAt(text, i + 1)) {
              case (?next) {
                let nextCode = Nat32.toNat(next.toNat32());
                if (nextCode == 34) {
                  result := result # "\"";
                  i += 2;
                } else if (nextCode == 92) {
                  result := result # "\\";
                  i += 2;
                } else if (nextCode == 110) {
                  result := result # "\n";
                  i += 2;
                } else if (nextCode == 114) {
                  result := result # "\r";
                  i += 2;
                } else if (nextCode == 116) {
                  result := result # "\t";
                  i += 2;
                } else {
                  result := result # c.toText();
                  i += 1;
                };
              };
              case null {
                result := result # c.toText();
                i += 1;
              };
            };
          } else {
            result := result # c.toText();
            i += 1;
          };
        };
        case null {
          i += 1;
        };
      };
    };
    result;
  };
};
