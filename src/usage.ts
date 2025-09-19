import type { PlayerWith } from "@flowplayer/player";

type SampleRate = 1.0 | 0.1 | 0.001;

const PACKAGE_NAME = "react-flowplayer";

type Behavior = "flowplayer-component-mounted";

type UsageEventDetail = {
  feature_name: typeof PACKAGE_NAME;
  behavior: Behavior;
  sample_rate: SampleRate;
};

type PlayerWithUsage = PlayerWith<{
  emit(event: "flowplayer:feature", detail: UsageEventDetail): void;
}>;

export function trackBehaviorUsage(
  player: PlayerWithUsage,
  behavior: Behavior,
  sample_rate: SampleRate = 1.0
) {
  player.emit("flowplayer:feature", {
    feature_name: PACKAGE_NAME,
    behavior,
    sample_rate,
  });
}
