import { out } from './config.js'
import type { AppConfig } from './config.js'

export function cmdStatus(config: AppConfig): void {
  const tokenDisplay = config.token ? '*** (present)' : 'NOT SET'

  out({
    host: config.host,
    project_id: config.projectId,
    token: tokenDisplay,
    token_present: Boolean(config.token),
  })
}
