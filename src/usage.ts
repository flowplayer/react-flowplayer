import type { PlayerWith, Player } from "@flowplayer/player";
import flowplayer from "@flowplayer/player";

type SampleRate = 1.0 | 0.1 | 0.001;

const PACKAGE_NAME = "react-flowplayer";
type Behavior = "flowplayer-component-mounted";

type UsageEventDetail = {
  feature_name: typeof PACKAGE_NAME;
  behavior: Behavior;
  sample_rate: SampleRate;
};

type PlayerWithUsage = PlayerWith<{
  // internal API
  emit(event: "flowplayer:feature", detail: UsageEventDetail): void;
  opts: Player["opts"] & {
    metadata?: {
      media_id: string;
      stream_target_id: string;
    };
  };
}>;

export function trackBehaviorUsage(
  player: PlayerWithUsage,
  behavior: Behavior,
  sample_rate: SampleRate = 1.0
) {
  let reportedOnce = false;
  // analytics backend only handles events with media_id, so we need to ensure that it is set
  player.on(flowplayer.events.SOURCE, () => {
    const hasMediaIdLike =
      typeof player.opts.metadata?.media_id === "string" ||
      typeof player.opts.metadata?.stream_target_id === "string";

    if (!reportedOnce && hasMediaIdLike) {
      player.emit("flowplayer:feature", {
        feature_name: PACKAGE_NAME,
        behavior,
        sample_rate,
      });
      reportedOnce = true;
    }
  });
}
