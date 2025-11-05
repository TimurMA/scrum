import { Ref, ref } from "vue";
import {
  RSocketClient,
  JsonSerializer,
  IdentitySerializer,
  MESSAGE_RSOCKET_COMPOSITE_METADATA,
  BufferEncoders,
  encodeAndAddCustomMetadata,
  encodeAndAddWellKnownMetadata,
  MESSAGE_RSOCKET_ROUTING,
} from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client";

function bearerToken(token: string): Buffer {
  const buffer = Buffer.alloc(1 + token.length);
  buffer.writeUInt8(1 | 0x80, 0);
  buffer.write(token, 1, "utf-8");
  return buffer;
}

export default async function useRSocket(
  subscribeUrl: string,
  callback: (data: any) => void
) {
  const isConnected = ref(false);
  let socket: any = null;
  let subscription: any = null;

  const client = new RSocketClient({
    serializers: {
      data: JsonSerializer,
      metadata: IdentitySerializer,
    },
    setup: {
      keepAlive: 60000,
      lifetime: 180000,
      dataMimeType: "application/json",
      metadataMimeType: MESSAGE_RSOCKET_COMPOSITE_METADATA.string,
    },
    transport: new RSocketWebSocketClient(
      {
        url: "ws://localhost:8080/api",
      },
      BufferEncoders
    ),
  });

  function closeConnection() {
    if (subscription) {
      subscription.cancel();
    }
    if (socket) {
      socket.close();
    }
    isConnected.value = false;
  }

  try {
    isConnected.value = true;

    (await client.connect())
      .requestStream({
        metadata: encodeAndAddCustomMetadata(
          encodeAndAddWellKnownMetadata(
            Buffer.alloc(0),
            MESSAGE_RSOCKET_ROUTING,
            Buffer.from(String.fromCharCode(subscribeUrl.length) + subscribeUrl)
          ),
          "message/x.rsocket.authentication.bearer.v0",
          bearerToken(localStorage.getItem("auth-token") || "")
        ),
      })
      .subscribe({
        onError: (error) => {
          console.error("RSocket error:", error);
          isConnected.value = false;
        },
        onNext: (payload) => {
          console.log("Received payload:", payload);
          callback(payload.data);
        },
        onSubscribe: (sub) => {
          console.log("Subscribed to:", subscribeUrl);
          sub.request(2147483647);
        },
      });
  } catch (error) {
    console.error("Connection failed:", error);
    isConnected.value = false;
    throw error;
  }

  return { isConnected, closeConnection };
}
