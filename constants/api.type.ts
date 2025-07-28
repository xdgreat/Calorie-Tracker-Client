type ApiRoutes = {
  GET: {
    "/recipes": { query: { limit?: number }; response: any };
    "/recipes/:id": { params: { id: string }; response: any };
  };
  POST: {
    "/recipes": { body: Omit<any, "id">; response: any };
  };
  DELETE: {
    "/recipes/:id": { params: { id: string }; response: void };
  };
};

type HttpMethod = keyof ApiRoutes;

export async function customFetchAPI<
  M extends HttpMethod,
  P extends keyof ApiRoutes[M]
>(
  method: M,
  path: P,
  options: {
    params?: ApiRoutes[M][P] extends { params: infer T } ? T : never;
    query?: ApiRoutes[M][P] extends { query: infer T } ? T : never;
    body?: ApiRoutes[M][P] extends { body: infer T } ? T : never;
  }
): Promise<ApiRoutes[M][P] extends { response: infer T } ? T : never> {
  let resolvedPath = path as string;
  if (options.params) {
    resolvedPath = Object.entries(options.params).reduce(
      (acc, [key, val]) => acc.replace(`:${key}`, String(val)),
      path as string
    );
  }

  const queryStr = options.query
    ? `?${new URLSearchParams(options.query)}`
    : "";

  const res = await fetch(`${resolvedPath}${queryStr}`, {
    method,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  return res.json();
}
