export interface PostHogErrorParams {
  readonly status: number
  readonly message: string
  readonly endpoint: string
}

export class PostHogError extends Error {
  readonly status: number
  readonly endpoint: string

  constructor(opts: PostHogErrorParams) {
    super(opts.message)
    this.name = 'PostHogError'
    this.status = opts.status
    this.endpoint = opts.endpoint
  }
}
