declare namespace Express {
  interface Request {
    cookies: {
      refresh_token?: string;
      [key: string]: unknown;
    };
  }
}
