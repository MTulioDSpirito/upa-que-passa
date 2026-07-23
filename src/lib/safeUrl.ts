import { isIP } from "net";
import { promises as dns } from "dns";

const BLOCKED_HOSTNAMES = new Set(["localhost"]);

function ipv4ToLong(ip: string): number {
  return ip.split(".").reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

function isPrivateIpv4(ip: string): boolean {
  const long = ipv4ToLong(ip);
  const inRange = (base: string, bits: number) => {
    const baseLong = ipv4ToLong(base);
    const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
    return (long & mask) === (baseLong & mask);
  };
  return (
    inRange("0.0.0.0", 8) || // this network
    inRange("10.0.0.0", 8) ||
    inRange("100.64.0.0", 10) || // CGNAT
    inRange("127.0.0.0", 8) || // loopback
    inRange("169.254.0.0", 16) || // link-local
    inRange("172.16.0.0", 12) ||
    inRange("192.0.0.0", 24) || // IETF protocol assignments
    inRange("192.168.0.0", 16) ||
    inRange("198.18.0.0", 15) || // benchmark
    inRange("224.0.0.0", 4) || // multicast
    inRange("240.0.0.0", 4) // reserved
  );
}

// Expande um endereço IPv6 (incluindo formas abreviadas com "::" e IPv4 embutido) em 8 hextetos.
function expandIpv6(rawIp: string): number[] | null {
  const clean = rawIp.replace(/^\[|\]$/g, "").split("%")[0];

  const toHextets = (part: string): number[] => {
    if (!part) return [];
    const segments = part.split(":");
    const result: number[] = [];
    for (const seg of segments) {
      if (!seg) continue;
      if (seg.includes(".")) {
        const octets = seg.split(".").map(Number);
        if (octets.length !== 4 || octets.some((o) => Number.isNaN(o) || o < 0 || o > 255)) return [];
        result.push((octets[0] << 8) + octets[1], (octets[2] << 8) + octets[3]);
      } else {
        result.push(parseInt(seg, 16));
      }
    }
    return result;
  };

  if (clean.includes("::")) {
    const [headStr, tailStr] = clean.split("::");
    const head = toHextets(headStr);
    const tail = toHextets(tailStr);
    const missing = 8 - head.length - tail.length;
    if (missing < 0) return null;
    return [...head, ...Array(missing).fill(0), ...tail];
  }

  const hextets = toHextets(clean);
  return hextets.length === 8 ? hextets : null;
}

function isPrivateIpv6(ip: string): boolean {
  const h = expandIpv6(ip);
  if (!h) return true; // malformado -> nega por segurança

  const [h0, , , , , h5, h6, h7] = h;

  if (h.every((x) => x === 0)) return true; // ::
  if (h0 === 0 && h[1] === 0 && h[2] === 0 && h[3] === 0 && h[4] === 0 && h5 === 0 && h6 === 0 && h7 === 1) return true; // ::1
  if ((h0 & 0xfe00) === 0xfc00) return true; // fc00::/7 (unique local)
  if ((h0 & 0xffc0) === 0xfe80) return true; // fe80::/10 (link-local)

  // ::ffff:0:0/96 (IPv4-mapped) e 64:ff9b::/96 (NAT64) — decodifica o IPv4 embutido
  const isMapped = h0 === 0 && h[1] === 0 && h[2] === 0 && h[3] === 0 && h[4] === 0 && h5 === 0xffff;
  const isNat64 = h0 === 0x0064 && h[1] === 0xff9b && h[2] === 0 && h[3] === 0 && h[4] === 0 && h5 === 0;
  if (isMapped || isNat64) {
    const embeddedIpv4 = `${(h6 >> 8) & 0xff}.${h6 & 0xff}.${(h7 >> 8) & 0xff}.${h7 & 0xff}`;
    return isPrivateIpv4(embeddedIpv4);
  }

  return false;
}

/**
 * Verifica se uma URL é segura para o servidor buscar (proteção contra SSRF).
 * Bloqueia IPs privados/reservados tanto no host literal quanto no endereço
 * resolvido via DNS (fecha o bypass de DNS rebinding: um domínio público que
 * resolve para um IP interno no momento da requisição).
 */
export async function isSafeImageUrl(raw: string): Promise<boolean> {
  if (raw.startsWith("/")) return true; // asset local do próprio site

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;

  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (BLOCKED_HOSTNAMES.has(hostname)) return false;

  const ipVersion = isIP(hostname);
  if (ipVersion === 4) return !isPrivateIpv4(hostname);
  if (ipVersion === 6) return !isPrivateIpv6(hostname);

  try {
    const records = await dns.lookup(hostname, { all: true });
    if (records.length === 0) return false;
    return records.every((r) => (r.family === 4 ? !isPrivateIpv4(r.address) : !isPrivateIpv6(r.address)));
  } catch {
    return false; // falha ao resolver -> nega por segurança
  }
}
