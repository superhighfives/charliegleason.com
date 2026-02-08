import { Effect } from "effect";
import { DurableObjectError, UnavailableError } from "./errors";

/**
 * Proxy a WebSocket request to a Durable Object
 */
export const proxyWebSocket = (
  request: Request,
  namespace: DurableObjectNamespace | undefined,
  objectName: string,
  instanceName: string,
): Effect.Effect<Response, DurableObjectError | UnavailableError> =>
  Effect.gen(function* () {
    if (!namespace) {
      yield* Effect.logWarning(`${objectName} namespace not available`);
      return yield* Effect.fail(new UnavailableError({ resource: objectName }));
    }

    yield* Effect.logDebug(`Connecting to ${objectName}:${instanceName}`);

    const id = namespace.idFromName(instanceName);
    const stub = namespace.get(id);

    return yield* Effect.tryPromise({
      try: () => stub.fetch(request),
      catch: (error) =>
        new DurableObjectError({
          objectName,
          message: `Failed to proxy request`,
          cause: error,
        }),
    });
  }).pipe(Effect.withLogSpan(`DO:${objectName}`));
