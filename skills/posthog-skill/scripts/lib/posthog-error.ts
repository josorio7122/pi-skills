export class PostHogError extends Error {
  readonly status: number
  readonly endpoint: string

  constructor(opts: { status: number; message: string; endpoint: string }) {
    super(opts.message)
    this.name = 'PostHogError'
    this.status = opts.status
    this.endpoint = opts.endpoint
  }
}
