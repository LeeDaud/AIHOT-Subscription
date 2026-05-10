export interface ApiClientOptions {
  baseUrl: string;
  userAgent: string;
  timeout?: number;
  maxRetries?: number;
}

export class AiHotApiClient {
  private baseUrl: string;
  private userAgent: string;
  private timeout: number;
  private maxRetries: number;

  constructor(opts: ApiClientOptions) {
    this.baseUrl = opts.baseUrl.replace(/\/+$/, '');
    this.userAgent = opts.userAgent;
    this.timeout = opts.timeout || 15000;
    this.maxRetries = opts.maxRetries || 3;
  }

  async request<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(path, this.baseUrl);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        url.searchParams.set(k, v);
      }
    }

    let lastErr: Error | null = null;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeout);

        const res = await fetch(url.toString(), {
          headers: { 'User-Agent': this.userAgent },
          signal: controller.signal,
        });
        clearTimeout(timer);

        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
        }

        return (await res.json()) as T;
      } catch (err: any) {
        lastErr = err;
        if (attempt < this.maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          console.warn(`[API] Retry ${attempt + 1}/${this.maxRetries} after ${delay}ms: ${err.message}`);
          await new Promise(r => setTimeout(r, delay));
        }
      }
    }
    throw lastErr!;
  }
}
