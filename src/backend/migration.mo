module {
  // Old types copied from .old/src/backend/dist/backend.most
  // These must match the previously deployed stable signature exactly.

  type OldTimestamp = Int;
  type OldProjectId = Text;

  type OldAppCategory = {
    #booking;
    #clubManager;
    #contentCms;
    #dashboard;
    #internalTool;
    #marketplace;
    #other;
    #social;
    #tracker;
  };

  type OldBuilderMode = { #feel; #guided; #standard };
  type OldDeploymentStatus = { #failed; #live; #notDeployed };
  type OldMaturity = { #building; #defining; #exploring; #idea; #live };
  type OldPriority = { #high; #low; #medium };

  type OldSpecSection = { content : Text; heading : Text };

  type OldProjectVersion = {
    changeSummary : Text;
    specSnapshot : Text;
    timestamp : OldTimestamp;
    version : Text;
  };

  type OldProjectMetadata = {
    attentionFlag : Bool;
    builderMode : OldBuilderMode;
    maturity : OldMaturity;
    priority : ?OldPriority;
    tags : [Text];
  };

  type OldProject = {
    answers : Text;
    category : OldAppCategory;
    createdAt : OldTimestamp;
    deploymentStatus : OldDeploymentStatus;
    icon : Text;
    iconColor : Text;
    id : OldProjectId;
    metadata : OldProjectMetadata;
    name : Text;
    specSections : [OldSpecSection];
    updatedAt : OldTimestamp;
    versionHistory : [OldProjectVersion];
  };

  type OldSortBy = { #createdAt; #name; #priority; #updatedAt };

  type OldOrganizeFilters = {
    deploymentStatus : ?{ #failed; #live; #notDeployed };
    maturity : ?{ #building; #defining; #exploring; #idea; #live };
    priority : ?{ #high; #low; #medium };
    tags : [Text];
  };

  type OldUIState = {
    activeMode : Text;
    activeProjectId : ?Text;
    organizeFilters : OldOrganizeFilters;
    organizeSortBy : OldSortBy;
    sidebarCollapsed : Bool;
  };

  // Map internal types (must match mo:core Map structure from the .most file)
  type OldData<K, V> = { var count : Nat; kvs : [var ?(K, V)] };
  type OldLeaf<K, V> = { data : OldData<K, V> };
  type OldInternal<K, V> = { children : [var ?OldNode<K, V>]; data : OldData<K, V> };
  type OldNode<K, V> = { #internal : OldInternal<K, V>; #leaf : OldLeaf<K, V> };
  type OldMap<K, V> = { var root : OldNode<K, V>; var size : Nat };

  // Old actor stable state — must match .most exactly
  type OldActor = {
    idState : { var nextId : Nat };
    onboardingHolder : { var complete : Bool };
    projects : OldMap<OldProjectId, OldProject>;
    uiHolder : { var current : ?OldUIState };
  };

  // New actor has no stable state — chat is stateless
  type NewActor = {};

  public func run(_old : OldActor) : NewActor {
    // Intentionally drop all old state — the app is now chat-only
    {};
  };
};
