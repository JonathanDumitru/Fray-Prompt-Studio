import type { BlockType, BlockConfig } from "@/types/blocks"
import { getBlockConfig as getBlockConfigFromLib } from "@/lib/block-configs"

export function getBlockConfig(type: BlockType): BlockConfig {
  return getBlockConfigFromLib(type)
}
