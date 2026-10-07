// src/api.ts
//
// All network calls from the app go through this file.
//
// Two styles of functions live here on purpose:
//   - getRisk / sendDelivery: the shape the lecturer's tests use.
//   - sendMilkDeliveryAssessment / sendChatMessage: the shape the existing
//     screens (MilkDeliveryScreen, ChatScreen) already call.
//
// The second pair is implemented so there is only one place that knows how to
// talk to the network.

import { API_URL } from './config.ts';

/* ────────────────────────────────────────────────────────────────────────────
 * Test-shaped functions (M4)
 * ──────────────────────────────────────────────────────────────────────────── */

/** Default timeout for a request, in milliseconds. */
const DEFAULT_TIMEOUT_MS = 4000;

/**
 * Ask the Python API for a rejection risk.
 *
 * GET /risk?temp_c=<tempC>&hours=<hours>
 * Returns { risk, label } when the server answers, or null when it does not.
 *
 * The function never throws. Offline, bad server, timeout → null.
 * That is on purpose: the phone must keep working when the network is down.
 */
export async function getRisk(
  base: string,
  tempC: number,
  hours: number,
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<{ risk: number; label: string } | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = `${base}/risk?temp_c=${encodeURIComponent(tempC)}&hours=${encodeURIComponent(hours)}`;
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;

    const data = await res.json();
    if (typeof data?.risk !== 'number' || typeof data?.label !== 'string') {
      return null;
    }
    return { risk: data.risk, label: data.label };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Send a delivery to the Python API.
 *
 * POST /deliveries  body: { farmer_id, litres, temp_c, hours }
 * Returns true when the server accepted (200), false otherwise.
 *
 * The keys are snake_case on the wire because the FastAPI model expects them.
 */
export async function sendDelivery(
  base: string,
  delivery: { farmerId: string; litres: number; tempC: number; hours: number },
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${base}/deliveries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        farmer_id: delivery.farmerId,
        litres: delivery.litres,
        temp_c: delivery.tempC,
        hours: delivery.hours,
      }),
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/* ────────────────────────────────────────────────────────────────────────────
 * Screen-shaped functions (what the existing screens call)
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Used by MilkDeliveryScreen.
 *
 * Sends the delivery to the API and returns a result object that the screen
 * already knows how to display.
 *
 * When the API is unreachable, this returns a result with
 * `risk_probability: null` and a clear message. It does NOT invent a risk.
 * A collector must never see a made-up safety number.
 */
export async function sendMilkDeliveryAssessment(data: {
  farmer_id: string;
  litres: number;
  temperature: number;
  hours_since_milking: number;
}): Promise<{
  farmer_id: string;
  litres: number;
  risk_probability: number | null;
  label: 'Low' | 'Medium' | 'High' | 'Not checked';
  recommendation: string;
}> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    return await res.json();
  } catch {
    // Offline: keep the delivery on the phone. Do not invent a risk.
    return {
      farmer_id: data.farmer_id,
      litres: data.litres,
      risk_probability: null,
      label: 'Not checked',
      recommendation:
        'Saved on this phone. The API was not reachable, so the risk could not be checked. Send it again when the network is back.',
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Used by ChatScreen.
 *
 * Sends a message to the API. If the API is unreachable, returns a short
 * offline notice instead of a fake answer.
 */
export async function sendChatMessage(message: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error('Chat backend unresponsive');

    const data = await res.json();
    return data.reply;
  } catch {
    return 'Offline: the AI assistant is not reachable right now. Check that the laptop is running the API and the phone is on the same Wi-Fi.';
  } finally {
    clearTimeout(timer);
  }
}
