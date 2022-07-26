import type { Config } from "@flowplayer/player";

export type RCConfigUI = {
  logoOnRight: boolean;
  noControls: boolean;
  noDescription: boolean;
  noDuration: boolean;
  noFullscreen: boolean;
  noHeader: boolean;
  noMute: boolean;
  noTitle: boolean;
  noVolumeControl: boolean;
  useDragHandle: boolean;
  usePlay2: boolean;
  usePlay3: boolean;
  useThinControlBar: boolean;
};

export type RCFlowplayerProps = { uiConfig?: Partial<RCConfigUI> } & Config;
