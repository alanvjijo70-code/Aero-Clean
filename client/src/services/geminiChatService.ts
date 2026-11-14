import { GoogleGenAI } from '@google/genai';

/**
 * ============================================================================
 * PRODUCTION SECURITY & ARCHITECTURE NOTE:
 * ============================================================================
 * In production environments, client-side API keys can be extracted from network
 * requests or client bundles. While this client service directly utilizes the
 * official `@google/genai` SDK with `VITE_GEMINI_API_KEY` for development,
 * hackathon prototyping, and demonstrations, before deploying to production:
 *
 * 1. Move the `@google/genai` call to a secure backend proxy or serverless endpoint
 *    (e.g., an Express route like `POST /api/v1/ai/chat` or an edge function).
 * 2. Store `GEMINI_API_KEY` strictly in server-side environment variables (.env).
 * 3. Enforce user authentication, rate limiting, and prompt sanitization on the server.
 * ============================================================================
 */

// Configurable System Instruction for the AeroClean AI Assistant
export const AEROCLEAN_SYSTEM_INSTRUCTION = `
You are the official AeroClean AI Platform Assistant, an advanced autonomous robotics and facade engineering specialist.
AeroClean AI is a cutting-edge aerospace robotics technology platform revolutionizing exterior skyscraper window cleaning.

Your core mission & knowledge:
1. Core Value Proposition:
   - Eliminates dangerous human exterior window washing at extreme elevations (cradle/gondola suspensions).
   - Delivers 3x faster turnaround times compared to conventional manual techniques.
   - Lowers high-rise facade maintenance operational expenses by up to 50-60%.
   - 100% human-free exterior operations, eradicating high-altitude worker safety liability.

2. Four-Stage Hybrid Cleaning Protocol:
   - Stage 1: Autonomous Surface Scan & AI Dirt Detection. 4K dual optical lenses and multispectral computer vision detect dust, traffic exhaust soot, and hard-water calcification.
   - Stage 2: Ground-Fed Deionized Fluid Delivery. Pressurized deionized fluid (mineral-free water + eco surfactant) travels up a continuous umbilical tether line at 4.5 bar pressure.
   - Stage 3: Active Microfiber Scrubbing. Counter-oscillating microfiber scrub rollers operate under calibrated 12N contact force to remove stubborn adhered contaminants without scratching glass coatings.
   - Stage 4: Hydrophobic Silicone Squeegee & AI Verification. Precision medical-grade silicone blade wipes away residual liquid into suction extraction channels, followed by a secondary multispectral camera pass auditing 99.8% streak-free cleanliness.

3. Platform Hardware & Drone Avionics:
   - Proximity Sensors: Dual ultrasonic transceivers & LiDAR maintaining a strict 15cm buffered standoff margin from glass.
   - Propeller Safety: Octagonal dual-rail carbon perimeter cages protecting all 4 twin-blade carbon rotors from mullions and architectural overhangs.
   - High-Torque Propulsion: 4 counter-rotating brushless DC motors with adaptive RPM compensation counteracting wind gusts up to 45 km/h.
   - Eco-Hybrid Solar Harvester: Top photovoltaic canopy providing auxiliary trickle power to onboard avionics.
   - Ground Supply Tether: Umbilical fluid hose and optional high-voltage power line extending to ground or rooftop pump stations.

4. Communication Guidelines:
   - Voice: High-tech, authoritative, professional, concise, aerospace-grade, and safety-oriented.
   - Formatting: Use structured Markdown with bold headers, concise bullet points, and inline code formatting where relevant.
   - When users greet you (e.g. "hello", "hi"), give a warm, courteous greeting explaining how you can help with the AeroClean AI platform.
   - When users ask about pricing or scheduling a demo, suggest visiting the Cost Calculator or submitting a Demonstration Request on the website.
`.trim();

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * Retrieves the active Gemini API key from environment variables or localStorage.
 */
export function getActiveApiKey(): string | null {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim() !== '' && !envKey.includes('your_gemini_api_key') && !envKey.includes('YOUR_')) {
    return envKey.trim();
  }
  const customKey = localStorage.getItem('gemini_api_key');
  if (customKey && customKey.trim() !== '') {
    return customKey.trim();
  }
  return null;
}

/**
 * Saves or clears a custom Gemini API key in localStorage.
 */
export function setActiveApiKey(key: string | null): void {
  if (key && key.trim() !== '') {
    localStorage.setItem('gemini_api_key', key.trim());
  } else {
    localStorage.removeItem('gemini_api_key');
  }
}

/**
 * Checks whether a live Gemini API key is configured.
 */
export function isLiveGeminiActive(): boolean {
  return getActiveApiKey() !== null;
}

/**
 * Sends a message to Google Gemini 2.5 Flash maintaining active session history.
 * If no API key is provided, seamlessly falls back to the high-fidelity AeroClean AI response engine.
 */
export async function sendChatMessage(
  userPrompt: string,
  history: ChatMessage[] = []
): Promise<string> {
  const apiKey = getActiveApiKey();

  // If a live key is available, run directly through Google Gemini 2.5 Flash
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });

      // Format previous session turns into Gemini contents structure
      const contents = [
        ...history.map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        })),
        {
          role: 'user',
          parts: [{ text: userPrompt }]
        }
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction: AEROCLEAN_SYSTEM_INSTRUCTION,
          temperature: 0.7,
        }
      });

      const replyText = response.text;
      if (replyText && replyText.trim() !== '') {
        return replyText;
      }
    } catch (err: any) {
      console.warn('[Gemini Service] Live call encountered an issue, transitioning to intelligent fallback:', err);
      // If the key is invalid or rate limited, fallback gracefully rather than breaking
    }
  }

  // High-fidelity intelligent conversational response engine
  return generateIntelligentResponse(userPrompt, history);
}

/**
 * Conversational natural response generator for AeroClean AI.
 * Responds cleanly, accurately, and naturally to greetings and questions.
 */
function generateIntelligentResponse(prompt: string, history: ChatMessage[]): string {
  const cleanPrompt = prompt.trim();
  const lower = cleanPrompt.toLowerCase();

  // 1. Warm Greeting & Conversational Openers
  const isGreeting = /^(hello|hi|hey|greetings|good morning|good afternoon|good evening|howdy|sup|hola)\b/i.test(lower);
  if (isGreeting || lower === 'hello' || lower === 'hi') {
    return `Hello! Welcome to **AeroClean AI**.

I am your autonomous robotics and facade engineering assistant. How can I help you today?

You can explore:
- **The 4-Stage Hybrid Cleaning Protocol** (autonomous scan, fluid delivery, microfiber scrub, squeegee extraction)
- **Flight Safety & Wind Standoff** (15cm LiDAR buffer, safety cages, 45 km/h gust resistance)
- **Financial ROI & Turnaround Speed** (3x faster completion, up to 50–60% cost reduction)
- **Autonomous Drone Specifications** (carbon monocoque chassis, solar canopy, ground supply tether)

Feel free to ask any question or request a demo!`;
  }

  // 2. How it works / Cleaning stages / Protocol
  if (
    lower.includes('clean') ||
    lower.includes('work') ||
    lower.includes('how') ||
    lower.includes('protocol') ||
    lower.includes('stage') ||
    lower.includes('process')
  ) {
    return `### AeroClean AI's 4-Stage Hybrid Cleaning Protocol

Our autonomous drone executes a synchronized four-phase cleaning sequence:

1. **Autonomous Surface Scan & AI Dirt Detection**
   - 4K dual stereo lenses and multispectral IR sensors scan each glass pane at 60 FPS.
   - Detects organic fallout, airborne traffic exhaust, and calcified water deposits to calibrate cleaning intensity.

2. **Ground-Fed Deionized Fluid Delivery**
   - Pressurized, mineral-free deionized cleaning solution is pumped at **4.5 bar** via an ultra-light umbilical tether.
   - Dissolves particulate bonds with zero mineral spots or environmental runoff.

3. **Active Microfiber Scrubbing Pass**
   - Counter-oscillating microfiber scrub rollers operate under regulated **12N constant contact force**.
   - Removes stubborn adhered grime without scratching architectural glass coatings or tints.

4. **Hydrophobic Silicone Squeegee & AI Verification**
   - Precision beveled silicone blade channels excess fluid into micro-suction extraction vents for a streak-free finish.
   - The verification camera audits surface clarity across all quadrants, logging **99.8% verified optical cleanliness** in a digital flight audit.`;
  }

  // 3. Costs / ROI / Savings / Pricing
  if (
    lower.includes('cost') ||
    lower.includes('price') ||
    lower.includes('save') ||
    lower.includes('saving') ||
    lower.includes('roi') ||
    lower.includes('expense') ||
    lower.includes('quote')
  ) {
    return `### Financial & Operational Impact

Implementing **AeroClean AI** provides substantial advantages over traditional manual window washing:

- **3x Faster Turnaround**: Drastically cuts project duration compared to manual scaffolding, bosun chairs, or building cradles.
- **Up to 50–60% Cost Reduction**: Eliminates crane rentals, street closure permits, complex rigging, and extreme-height hazard pay.
- **Zero Fall Liability**: Completely eliminates worker high-altitude exposure, substantially reducing building insurance liability.
- **Interactive Calculator**: Use the **Cost & Time Calculator** on our homepage to simulate exact cost savings based on your building's height and glass area!`;
  }

  // 4. Safety / High Winds / Heights / Collision Prevention
  if (
    lower.includes('wind') ||
    lower.includes('safe') ||
    lower.includes('safety') ||
    lower.includes('crash') ||
    lower.includes('fall') ||
    lower.includes('standoff') ||
    lower.includes('sensor') ||
    lower.includes('height')
  ) {
    return `### Aerospace Safety & Flight Stability Systems

AeroClean AI is engineered specifically for extreme vertical environments:

- **15cm Calibrated Standoff Buffer**: 100 Hz ultrasonic transceivers and forward LiDAR constantly ping facade glazing to maintain an exact, safe standoff margin with ±2mm precision.
- **Circular Propeller Safety Guards**: Octagonal dual-rail carbon perimeter cages encase all 4 twin-blade rotors, preventing blade contact with glass, mullions, or architectural overhangs.
- **High-Wind Resistance**: High-torque brushless DC motors with adaptive RPM dynamic compensation actively counteract updrafts and high-altitude gusts up to **45 km/h**.
- **Continuous Umbilical Tether**: Integrated fluid delivery hose with a high-tensile safety arrest core securing the drone during flight.`;
  }

  // 5. Hardware / Drone Specs / Components
  if (
    lower.includes('drone') ||
    lower.includes('spec') ||
    lower.includes('hardware') ||
    lower.includes('battery') ||
    lower.includes('solar') ||
    lower.includes('propeller') ||
    lower.includes('chassis')
  ) {
    return `### AeroClean AI Drone Specifications

- **Chassis**: High-modulus carbon fiber and titanium monocoque fuselage (540 × 320 × 220 mm), IP66 sealed against moisture and dust.
- **Propulsion**: 4 high-torque brushless motors with 16-inch carbon composite twin blades (max 6,800 RPM).
- **Sensors**: Dual ultrasonic transceivers, forward-facing LiDAR rangers, and a 4K multispectral neural turret.
- **Solar Harvester**: Top-mounted monocrystalline photovoltaic array with knurled gold dial grounding cap for auxiliary avionics power.
- **Fluid Manifold**: 4.5 bar atomization spray manifold with transparent polyurethane coiled supply loops.
- **Underbody Assembly**: Oscillating 300 RPM microfiber cleaning roller with spring-loaded suspension and silicone squeegee.`;
  }

  // 6. Demo / Contact / Booking
  if (
    lower.includes('demo') ||
    lower.includes('contact') ||
    lower.includes('schedule') ||
    lower.includes('book') ||
    lower.includes('call')
  ) {
    return `### Request an On-Site Flight Demonstration

Interested in seeing AeroClean AI in action at your property?

- **Schedule a Demo**: Scroll to the **Demonstration Request** form on our homepage, or visit our **[Contact Page](/contact)**.
- **Site Evaluation**: Our robotics engineering flight team performs site scans, analyzes building geometry, and provides a customized architectural feasibility report for commercial portfolios.`;
  }

  // 7. General Inquiry
  return `### AeroClean AI Autonomous Drone Platform

AeroClean AI replaces dangerous, slow manual exterior window cleaning with intelligent autonomous drone robotics.

**Key Highlights:**
- **100% Human-Free Objective**: No workers suspended over high-rise drops.
- **Four-Stage Hybrid Wash Protocol**: Combines chemical softening, microfiber scrubbing, silicone squeegee extraction, and AI verification.
- **Aerospace Reliability**: Dual proximity sensors enforcing a 15cm safety buffer with 45 km/h wind gust compensation.
- **Faster & Cheaper**: 3x faster turnaround times and up to 50–60% operational savings.

Would you like more details on our **cleaning protocol**, **safety systems**, or **cost estimates**?`;
}
