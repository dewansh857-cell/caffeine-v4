import Common "common";

module {
  // ---------------------------------------------------------------------------
  // AI Generation types
  // ---------------------------------------------------------------------------

  /// A single page definition in the generated app config
  public type GeneratedPage = {
    name : Text;
    route : Text;
    description : Text;
    components : [Text];
  };

  /// A single component definition in the generated app config
  public type GeneratedComponent = {
    name : Text;
    type_ : Text; // e.g. "card", "form", "table", "chart"
    description : Text;
    props : [(Text, Text)]; // key-value pairs for prop names and types
  };

  /// A single data model entity in the generated app config
  public type GeneratedDataModel = {
    name : Text;
    fields : [(Text, Text)]; // field name and type
    description : Text;
  };

  /// Theme configuration for the generated app
  public type GeneratedTheme = {
    primaryColor : Text;
    secondaryColor : Text;
    fontFamily : Text;
    darkMode : Bool;
  };

  /// Full AI-generated app configuration
  public type GeneratedAppConfig = {
    appName : Text;
    description : Text;
    pages : [GeneratedPage];
    components : [GeneratedComponent];
    theme : GeneratedTheme;
    dataModel : [GeneratedDataModel];
    generatedAt : Common.Timestamp;
  };

  /// Request payload for AI generation
  public type AIGenerationRequest = {
    answers : Text; // JSON blob of questionnaire answers
    apiEndpoint : ?Text; // Optional override for the AI API endpoint
  };

  /// Response from AI generation
  public type AIGenerationResponse = {
    status : { #success; #error };
    config : ?GeneratedAppConfig;
    errorMessage : ?Text;
  };
};
