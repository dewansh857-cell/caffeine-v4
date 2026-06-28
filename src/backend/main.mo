import Migration "migration";
import ChatMixin "mixins/chat-api";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";

(with migration = Migration.run)
actor {
  include ChatMixin();
  include MixinObjectStorage();
};
