import Map "mo:core/Map";
import AITypes "../types/ai";
import Common "../types/common";
import AILib "../lib/ai";

/// Exposes the public API for AI-generated app configurations.
mixin (
  configs : Map.Map<Common.ProjectId, AITypes.GeneratedAppConfig>,
) {

  public func generateApp(request : AITypes.AIGenerationRequest) : async AITypes.AIGenerationResponse {
    await AILib.generateApp(request);
  };

  public func saveGeneratedConfig(
    projectId : Common.ProjectId,
    config : AITypes.GeneratedAppConfig,
  ) : async () {
    AILib.saveConfig(configs, projectId, config);
  };

  public query func getGeneratedConfig(projectId : Common.ProjectId) : async ?AITypes.GeneratedAppConfig {
    AILib.getConfig(configs, projectId);
  };
};
