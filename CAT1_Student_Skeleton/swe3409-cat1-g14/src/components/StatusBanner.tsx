/**
 * M5 · MEMBER 5 · Banner: "Server OK" or "Offline"  (with src/health.ts)
 *
 * Owner (your GitHub username): @
 *
 * Build it like this:
 *   const [status, setStatus] = useState<'checking' | 'ok' | 'offline'>('checking');
 *   async function check() { setStatus('checking'); setStatus(await checkHealth(apiUrl)); }
 *   useEffect(() => { check(); }, []);
 *   Return a <View> whose background colour depends on status, with a <Text>:
 *     checking -> "Checking server..."     ok -> "Server OK"
 *     offline  -> "Offline: deliveries stay on this phone"
 *   and a <Button title="Check again" onPress={check} />.
 *   Show the status in words, not colour alone (some people cannot tell colours apart).
 *
 * Check on the phone: API running -> "Server OK". Stop the API, press
 * "Check again" -> the offline message.
 */
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { checkHealth } from "../health";

type Props = { apiUrl: string };

export default function StatusBanner({ apiUrl }: Props) {
  const [status, setStatus] = useState<"checking" | "ok" | "offline">(
    "checking",
  );
  async function check() {
    setStatus("checking");
    try {
      setStatus(await checkHealth(apiUrl));
    } catch (error) {
      setStatus("offline");
    }
  }
  useEffect(() => {
    check();
  }, []);

  return (
    <View
      style={{
        borderRadius: 10,
        margin: 10,
        backgroundColor:
          status === "checking"
            ? "rgb(194, 194, 14)"
            : status === "offline"
              ? "#df6666"
              : "green",
      }}
    >
      {status === "checking" ? (
        <Text style={{ padding: 10, fontWeight: 700 }}>Checking server...</Text>
      ) : status === "offline" ? (
        <View
          style={{
            margin: 10,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ padding: 10, fontWeight: 700 }}>
            Offline: deliveries stay on this phone
          </Text>
          <Button title="Check again" onPress={check} />
        </View>
      ) : (
        <Text>Server ok</Text>
      )}
    </View>
  );
}
