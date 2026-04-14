// ─── BUILD METADATA ───────────────────────────────────────────────────────────
// TOOL            : ThreatPrep — AI Exam Prep for Proofpoint Threat Protection Administrator
// VERSION         : v4.7
// BUILD           : 2026-04-14T00:00:00+05:30 (IST)
// CHANGE          : v4.8: Supabase Auth Gate removed (local use — no auth required)
// CERT            : Proofpoint Certified Threat Protection Administrator (TPAD01)
// VENDOR          : Proofpoint
// EXAM DETAILS    : ~60 Q · 90 min · $250 · 70% passing · 1yr validity · Certiverse platform
// DOMAINS (7)     : Mail Infrastructure, Policy & Filtering, Quarantine & Notifications,
//                   Visibility & Ops, Email Authentication, User & Protection, Advanced Threats
//                   (grouped from original 14 domains for leaner domain-selection UX)
// AI ENGINE       : Primary: gemini-2.5-flash-lite (Gemini, user key) | Standby: claude-sonnet-4-20250514 (Built-in, no key)
// ARCHITECTURE    : Simple Generate → Parse → Sanitize → QBase
// FEATURES        : Multi-theme, Practice + Exam modes, Leitner spaced repetition,
//                   STUDY v4.2: Expanded blueprint (TPAD01 aligned, 7 domains · 14+ topics), AI deep-dives
//                   SeenTracker, Parking Lot, AI Cache, Admin Panel, Curriculum Audit
//                   v4.3: AutoHeal engine · Fix It buttons (Health + Audit) · startup silent heal
//                   v4.4: Certiverse validator (P1–P10) · Retry engine (0→1→2) · Quarantine · Adaptive prompt
//                         Secondary promote: Gemini throttle → auto-fallback to Claude (no error thrown)
//                   v4.5: AI deep-dive error handling fix (force flag, __err namespace, visible retry banner)
//                         Study search bar (full-text across blueprint + AI content, jump-to-topic)
//                   v4.6: ExamScreen full-height fill on Android (flex column + 100svh, options flex:1)
// SOURCE          : help.proofpoint.com · proofpoint.com/cybersecurityacademy · pfpt-us-ca-threat-protection-administrator-course.pdf
// ─────────────────────────────────────────────────────────────────────────────

import React, {
  useState, useEffect, useCallback, useRef, useMemo, Component,
} from "react";

// ─── CRASH VISIBILITY ────────────────────────────────────────────────────────
if (typeof window !== "undefined") {
  const _showErr = (msg) => {
    const el = document.getElementById("tpad01-crash") || (() => {
      const d = document.createElement("div");
      d.id = "tpad01-crash";
      d.style.cssText = "position:fixed;inset:0;z-index:99999;background:#1a0000;color:#ff8080;font:13px/1.6 monospace;padding:20px;overflow:auto;white-space:pre-wrap;";
      document.body.appendChild(d); return d;
    })();
    el.textContent = (el.textContent ? el.textContent + "\n" : "") + "🔴 " + msg;
  };
  window.onerror = (msg, src, line, col, err) => { _showErr(`${msg}\n  at ${src}:${line}:${col}\n  ${err?.stack || ""}`); return false; };
  window.onunhandledrejection = (e) => _showErr(`Unhandled promise: ${e.reason?.stack || e.reason}`);
}

// ─── ERROR BOUNDARY ──────────────────────────────────────────────────────────
class AppErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error("[ThreatPrep] Render error:", error, info); }
  render() {
    if (this.state.error) {
      const e = this.state.error;
      return (
        <div style={{ position:"fixed",inset:0,background:"#1a0000",color:"#ff8080",font:"13px/1.6 monospace",padding:20,overflow:"auto",whiteSpace:"pre-wrap",zIndex:99999 }}>
          {"🔴 App crashed:\n\n"}{e?.message || String(e)}{"\n\n"}{e?.stack || ""}
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── EXPANDED STUDY BLUEPRINT v4 ──────────────────────────────────────────────
// Full exam-ready content: basics → advanced, no shortcuts, end-to-end coverage
// 14 Domains · 28 Topics · 6+ subsections per topic · Worked examples · Process flows
// Source: Proofpoint Threat Protection Administrator Course PDF (proofpoint.com/cybersecurityacademy)
// Verified against: help.proofpoint.com official product documentation
const STUDY_BLUEPRINT = [
  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 1 — Mail Infrastructure (17%) — Product Overview + Mail Flow
  // ═══════════════════════════════════════════════════════════════════════════
  {
    domainId: "d1", weight: 17,
    name: "Mail Infrastructure",
    topics: [
      {
        id: "d1t1", title: "Proofpoint Threat Protection Suite — Architecture",
        subsections: [
          {
            heading: "Core Concept",
            body: "The Proofpoint Threat Protection Suite is a human-centric email security platform that defends organizations against advanced email threats. It is not a single product — it is an integrated set of tools that work together to provide layered defense.\n\nCORE PRODUCTS IN SCOPE FOR TPAD01:\n• Email Protection Server (Protection Server / EPS): The core MTA and policy enforcement engine. Available as cloud (PoD — Proofpoint on Demand) or on-premises appliance.\n• Targeted Attack Protection (TAP): Advanced threat intelligence. Detects malware, impostor threats, and malicious URLs using sandboxing and machine learning.\n• Threat Response Auto-Pull (TRAP): Automated post-delivery remediation. Pulls malicious messages from inboxes even after delivery.\n• Closed-Loop Email Analysis & Response (CLEAR): Integrates with user-reported phishing to auto-remediate confirmed threats.\n\nKEY PRINCIPLE: Proofpoint's approach is 'people-centric.' Threats target people, not just infrastructure. The platform ties threat intelligence to specific Very Attacked People (VAPs)."
          },
          {
            heading: "How the Tools Integrate",
            body: "INTEGRATION FLOW:\n1. Email arrives → Protection Server evaluates via policies, rules, spam/virus engines\n2. URLs rewritten by TAP → clicked URLs analyzed in sandbox\n3. If threat confirmed post-delivery → TRAP auto-pulls from inboxes\n4. Users report suspicious email → CLEAR auto-analyzes and triggers TRAP if confirmed\n\nDATA FLOW:\n• Protection Server logs → Smart Search (message tracing)\n• TAP Dashboard → threat intelligence, VAP data, campaign analysis\n• Threat Response (TRAP/CLEAR) → orchestrates remediation across mail servers\n\nDEPLOYMENT MODES:\n• PoD (Proofpoint on Demand): Cloud-hosted Protection Server. Multi-tenant SaaS.\n• On-Premises: Customer-managed hardware or VM appliance.\n• Hybrid: PoD for inbound/outbound with on-prem servers for internal relay."
          },
          {
            heading: "Key Facts & Exam Traps",
            body: "• TRAP and CLEAR are distinct: TRAP auto-pulls; CLEAR is the abuse mailbox loop that feeds TRAP\n• TAP requires URL rewriting to be effective — without rewrite, sandbox cannot intercept clicks\n• PoD API: RESTful API to query Protection Server data (Smart Search, logs, quarantine)\n• VAP = Very Attacked Person — TAP identifies users most targeted by advanced threats\n• The Protection Server is the gateway — all other tools depend on mail flowing through it\n• Exam uses terms 'Protection Server', 'Email Protection Server', and 'EPS' interchangeably"
          },
        ],
      },
      {
        id: "d1t2", title: "Mail Flow — Routes, SMTP & DNS Setup",
        subsections: [
          {
            heading: "Core Concept",
            body: "The Protection Server manages all inbound and outbound email flow through a concept of ROUTES. A route defines the direction, origin, and destination of mail — and routes determine which policies and rules apply.\n\nROUTE TYPES:\n• Inbound: Mail arriving FROM the internet TO your organization\n• Outbound: Mail leaving FROM your organization TO the internet\n• Internal: Mail between internal hosts (not evaluated by default on cloud)\n• Relay: Mail passing THROUGH the Protection Server to another server\n\nPOLICY ROUTES:\nPolicy routes are named mail paths used to apply different rule sets. Example:\n- Route 'Inbound' → applies inbound spam and virus policies\n- Route 'Outbound' → applies DLP and outbound content policies\n- Custom route for a specific IP range → applies partner-specific TLS rules\n\nEXAM SCENARIO: 'You need to apply stricter spam policies only to email from external partners.' → Create a dedicated policy route scoped to the partner IP range and attach the stricter spam policy to that route."
          },
          {
            heading: "SMTP Protocol & TLS",
            body: "THE SMTP SESSION (Protection Server):\n1. EHLO/HELO: Sender identifies itself\n2. MAIL FROM: Envelope sender (Return-Path)\n3. RCPT TO: Recipient\n4. DATA: Message content\n5. QUIT\n\nThe Protection Server evaluates connection-level rules (IP reputation, rate control) at EHLO/MAIL FROM stage — before the message body is even accepted. This is important for spam blocking efficiency.\n\nTLS CONFIGURATION:\n• Opportunistic TLS: Attempt TLS, fall back to plain if not supported\n• Required TLS: Force TLS — reject if partner doesn't support it\n• Configure per domain: Administration > Delivery Settings > TLS\n\nEXAM TRAP: TLS applies to the transport connection, NOT to the message encryption. TLS encrypts the connection; S/MIME encrypts the message content."
          },
          {
            heading: "DNS & Domain Setup — Certificates",
            body: "DNS RECORDS REQUIRED:\n• MX Record: Points inbound mail to the Protection Server (or PoD cluster)\n• SPF Record: Authorizes Protection Server IPs to send on behalf of the domain\n• DKIM Keys: Published in DNS for signing verification\n• DMARC Record: Instructs receivers how to handle SPF/DKIM failures\n\nDOMAIN SETUP IN PROTECTION SERVER:\nPath: Administration > Domain Management\n• Add your organization's domains\n• Set primary domain vs alias domains\n• Configure per-domain delivery settings (smart host, MX routing)\n\nCERTIFICATE GENERATION:\n• Protection Server can generate TLS certificates for SMTP connections\n• Path: Administration > SSL/TLS > Generate Certificate\n• Used for: Securing inbound/outbound SMTP connections, admin UI HTTPS\n\nEXAM TRAP: MX record must point to the Protection Server BEFORE any mail is processed. If MX still points to the old mail server, Proofpoint never sees the traffic."
          },
          {
            heading: "Key Facts & Exam Traps",
            body: "• Policy routes determine which rules/policies apply to which mail streams\n• TLS required vs opportunistic: Required = reject if no TLS; Opportunistic = attempt but don't require\n• MX record must point to Protection Server for inbound filtering to work\n• Mail relay: Protection Server forwards filtered mail to internal mail server (smart host)\n• Smart host: The internal mail server IP/hostname the Protection Server delivers clean mail to\n• Route direction matters: A rule on the Inbound route does NOT apply to Outbound traffic"
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 2 — Policy & Filtering (17%) — Message Processing + Email Firewall
  // ═══════════════════════════════════════════════════════════════════════════
  {
    domainId: "d2", weight: 17,
    name: "Policy & Filtering",
    topics: [
      {
        id: "d2t1", title: "Policies, Rules & SMTP Profiles",
        subsections: [
          {
            heading: "Core Concept",
            body: "Message processing is the heart of the Protection Server. Every message that flows through the system is evaluated against a hierarchy of policies and rules.\n\nHIERARCHY (top to bottom):\n1. Connection-level checks (IP reputation, rate control) — at SMTP session\n2. Policy routes — determines which policy applies\n3. Policies — containers that hold rules; one active policy per route\n4. Rules — conditions + actions evaluated in priority order\n5. Modules — spam engine, virus engine, URL defense, etc.\n\nPOLICY:\n• A named container that groups rules for a specific mail flow direction\n• One policy is 'active' per route at any given time\n• Policies are ordered — the first matching policy wins\n\nRULES:\n• Each rule has: Conditions (when does it apply?) + Actions (what happens?)\n• Rules evaluated top-to-bottom within a policy\n• First matching rule executes and stops evaluation (unless 'continue' is set)\n\nEXAM SCENARIO: 'Mail from the finance team should bypass spam scanning.' → Create a rule in the Inbound policy with condition: Sender IP in [Finance mail server range] → Action: Allow (bypass spam module)."
          },
          {
            heading: "SMTP Profiles & Message Filtering",
            body: "SMTP PROFILES:\nAn SMTP profile defines how the Protection Server connects to an external mail server for delivery. It specifies:\n• Host/IP to deliver to\n• Port (default 25)\n• TLS requirements\n• Authentication credentials (if needed)\n\nUsed for: Configuring smart host delivery, partner relay delivery, cloud app mail relay.\n\nMESSAGE FILTERING ORDER (Inbound):\n1. IP Blocking / Allow lists\n2. Sender Authentication (SPF, DKIM, DMARC)\n3. Rate Control\n4. Recipient Verification\n5. Spam Detection\n6. Virus Protection\n7. Content Filtering (Email Firewall rules)\n8. URL Defense (TAP rewriting)\n9. Delivery\n\nEXAM TRAP: The order of filtering matters. If a message is blocked at IP level (step 1), it never reaches spam evaluation (step 5). This is intentional — early rejection is cheaper computationally."
          },
          {
            heading: "Key Facts & Exam Traps",
            body: "• First matching rule wins — rule order is critical\n• Policies are route-specific: Inbound policy ≠ Outbound policy\n• 'Continue' action: Rare — allows rule evaluation to continue past a match\n• SMTP profile = delivery profile for sending mail to a specific server\n• Module bypass: A rule can bypass specific modules (e.g., bypass spam for trusted sender)\n• Message size limits: Configurable per policy route\n• Envelope vs header: Rules can match on envelope (MAIL FROM, RCPT TO) or message headers"
          },
        ],
      },
      {
        id: "d2t2", title: "Email Firewall — Rules, Rate Control & Recipient Verification",
        subsections: [
          {
            heading: "Core Concept",
            body: "The Email Firewall is the content-based rule engine within the Protection Server. It allows administrators to create granular rules based on message attributes to enforce organizational policy.\n\nFIREWALL RULE COMPONENTS:\n• Conditions: What the rule matches on (sender, recipient, subject, attachment type, header, body keyword, etc.)\n• Actions / Dispositions: What happens when the rule matches\n  - Allow: Deliver normally\n  - Block: Reject with NDR\n  - Quarantine: Hold in quarantine folder\n  - Redirect: Send to alternate address\n  - Tag: Add header or subject tag\n  - Encrypt: Force encryption\n  - Notify: Send notification to admin\n\nDICTIONARIES:\n• Named lists of words, phrases, patterns (regex) used in rule conditions\n• Create: Administration > Email Firewall > Dictionaries\n• Use case: Block emails containing competitor names, offensive words, or sensitive data patterns"
          },
          {
            heading: "SMTP Rate Control & Outbound Throttle",
            body: "SMTP RATE CONTROL:\n• Limits the number of messages the Protection Server accepts from a single IP per time window\n• Purpose: Prevent spam floods from compromised senders, protect against mail bombs\n• Config: Administration > Email Firewall > SMTP Rate Control\n• Settings: Message count limit, time window (per minute/hour), action when exceeded (block or defer)\n\nOUTBOUND THROTTLE:\n• Limits how many messages per hour the Protection Server sends OUT per sender or domain\n• Purpose: Prevent outbound spam/abuse (e.g., compromised internal account mass-mailing)\n• Config: Administration > Email Firewall > Outbound Throttle\n• Send Mail Thresholds: Alert when a sender exceeds a configurable threshold\n\nBOUNCE MANAGEMENT:\n• 'Backscatter': NDR (bounce) messages sent to forged senders who never sent mail\n• Enable Bounce Management: Adds a tag to outbound messages. Inbound bounces verified against tag. Invalid bounces = backscatter → blocked\n• Config: Administration > Email Firewall > Bounce Management\n\nRECIPIENT VERIFICATION:\n• Validates that RCPT TO addresses exist before accepting the message\n• Methods: LDAP lookup, SMTP callout to internal mail server\n• Purpose: Reject mail to non-existent users at the SMTP layer (saves processing, reduces backscatter)"
          },
          {
            heading: "Key Facts & Exam Traps",
            body: "• Rate control acts at connection level — before message content is evaluated\n• Outbound throttle ≠ inbound rate control: throttle limits SENDING; rate control limits RECEIVING\n• Bounce management requires tagging outbound mail first to work correctly\n• Dictionaries support: literal strings, wildcards, regex patterns\n• Recipient Verification: LDAP lookup is preferred (faster); SMTP callout adds latency\n• Rule disposition priority: Block > Quarantine > Allow — if multiple rules match, most restrictive wins unless 'first match' mode\n• Backscatter: NDRs to forged senders; bounce management eliminates this"
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 3 — Quarantine & Notifications (11%) — Quarantine + User Notifications
  // ═══════════════════════════════════════════════════════════════════════════
  {
    domainId: "d3", weight: 11,
    name: "Quarantine & Notifications",
    topics: [
      {
        id: "d3t1", title: "Quarantine Folders, Settings & Message Management",
        subsections: [
          {
            heading: "Core Concept",
            body: "The Quarantine holds messages that match rules with a 'Quarantine' disposition. It is a holding area — messages are not delivered until an admin or user releases them, or they expire.\n\nQUARANTINE FOLDERS:\n• Folders are named buckets that organize quarantined messages by type\n• Default folders: Spam, Virus, Content (firewall), Impostor\n• Custom folders: Admin can create additional folders (e.g., 'Finance-Review', 'Executive-Phish')\n• Each folder has its own: Retention period, Digest settings, Release permissions\n\nCREATE / DELETE FOLDERS:\nPath: Quarantine > Folder Management > New Folder\nSettings per folder:\n• Name and description\n• Retention period (days before auto-delete)\n• Who can release: Admin only, End user, or specific role\n• Digest: Send users a notification email listing their quarantined messages"
          },
          {
            heading: "Searching & Releasing Quarantined Messages",
            body: "SEARCHING QUARANTINE:\nPath: Quarantine > Search Messages\nSearch filters:\n• Sender, Recipient, Subject, Date range, Folder, Spam score\n• Attachment name, message ID\n\nACTIONS ON QUARANTINED MESSAGES:\n• Release: Deliver to original recipient\n• Release and Allow: Deliver + add sender to Safe Sender list\n• Release and Block: Deliver (one-time exception) + add to Block list\n• Delete: Remove from quarantine permanently\n• Redirect: Deliver to alternate address\n• View: Preview message without releasing\n\nQUARANTINE PRECEDENCE ORDER:\n• When a message matches multiple quarantine rules, which folder wins?\n• Precedence is configurable — higher precedence folder takes the message\n• Example: A spam message that also matches a content rule → goes to whichever folder has higher precedence (typically Virus > Spam > Content)"
          },
          {
            heading: "Key Facts & Exam Traps",
            body: "• Quarantine folders are NOT global inboxes — each is a separate named container\n• Retention period: After expiry, messages auto-deleted (cannot be recovered)\n• Digest = quarantine summary email sent to users. Frequency configurable (daily, hourly, etc.)\n• Release vs Release and Allow: Only 'Release and Allow' adds sender to safe list\n• Precedence: Higher-numbered precedence = lower priority. Lower number = higher priority (checked first)\n• End user quarantine access: Via Quarantine Digest link or End User Digest portal — NOT the admin UI\n• Virus-quarantined messages: Cannot be released by end users — admin only (safety policy)"
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 4 — Visibility & Ops (13%) — Smart Search & Logging + Alerts & Reporting
  // ═══════════════════════════════════════════════════════════════════════════
  {
    domainId: "d4", weight: 13,
    name: "Visibility & Ops",
    topics: [
      {
        id: "d4t1", title: "Smart Search, Log Types & PoD API",
        subsections: [
          {
            heading: "Smart Search",
            body: "Smart Search is the primary message tracing tool in the Protection Server. It provides a unified view of every message the system processed, including its disposition and the rules that matched.\n\nPath: Quarantine > Smart Search (or Administration > Smart Search on PoD)\n\nSEARCH FILTERS:\n• Sender (envelope or header), Recipient, Subject, Date/time range\n• Message ID, GUID\n• Disposition (delivered, blocked, quarantined, etc.)\n• Rule that matched\n• Smart Search scope: Include/exclude attachments, headers\n\nMESSAGE DETAIL VIEW:\nFor each result, you can see:\n• Full processing log (which modules evaluated the message)\n• Which rules matched and why\n• Spam score breakdown\n• DKIM/SPF/DMARC results\n• URL rewrite status (TAP)\n\nEXAM SCENARIO: 'A user reports a legitimate email was blocked. How do you investigate?' → Smart Search by sender/recipient/date → view processing log → identify which rule blocked it → adjust rule or whitelist sender."
          },
          {
            heading: "Log Types & Audit Logs",
            body: "PROTECTION SERVER LOG TYPES:\n• Mail Log (sendmail/postfix log): Raw SMTP session records. Shows connection IP, EHLO, MAIL FROM, RCPT TO, delivery status.\n• Processing Log: Per-message evaluation log. Shows module results (spam score, virus scan, rules matched).\n• System Log (syslog): Infrastructure events — service start/stop, config changes, errors.\n• Audit Log: Admin action log. Who changed what, when. Non-repudiation.\n\nAUDIT LOG:\n• Tracks all admin UI actions: Policy changes, rule edits, user management, config changes\n• Cannot be disabled (compliance requirement)\n• Search and filter: By admin, action type, date\n• Export: CSV download\n\nSYSLOG EXPORT:\n• Protection Server can forward logs to an external SIEM via syslog (UDP/TCP)\n• Configure: Administration > System > Syslog\n• Common SIEM integrations: Splunk, QRadar, Microsoft Sentinel\n\nPoD API:\n• RESTful API for programmatic access to Protection Server data\n• Use cases: Automated message tracing, quarantine management, log extraction\n• Authentication: API key (generated in admin UI)\n• Base URL: https://[pod-host]/api/v1/"
          },
          {
            heading: "Key Facts & Exam Traps",
            body: "• Smart Search = message trace tool. Use it to answer 'where did this email go?'\n• Audit log = who changed what. Use it to answer 'who modified this rule?'\n• Mail log = raw SMTP. Use it for low-level connectivity issues (was connection even established?)\n• Syslog is for external forwarding — not a built-in viewer\n• PoD API requires API key — generate in admin UI under your account settings\n• Log retention: Varies by PoD tier — typically 30 days online, exportable for longer retention\n• EXAM TRAP: Smart Search searches processed messages. If mail was rejected at connection level (before DATA), it may not appear in Smart Search — check mail/connection logs instead."
          },
        ],
      },
      {
        id: "d4t2", title: "Alerts & Reporting — Alert Profiles, Rules & System Reports",
        subsections: [
          {
            heading: "Alert Profiles & Rules",
            body: "Alerts notify administrators when specific conditions occur in the Protection Server.\n\nALERT PROFILES:\n• A profile defines WHO gets notified and HOW (email address, notification format)\n• Create: Administration > Alerts > Alert Profiles > New Profile\n• Multiple profiles: E.g., 'Security Team' profile for threat alerts, 'Operations' profile for system alerts\n\nALERT RULES:\n• Rules define WHAT triggers an alert\n• Conditions: Spam volume spike, virus detected, quarantine folder nearing capacity, service errors, TLS failures\n• Each rule links to an Alert Profile\n• Threshold-based: 'Alert when spam volume exceeds X messages per hour'\n• Rule priority: Like firewall rules — evaluated top to bottom\n\nCOMMON ALERT TYPES:\n• High spam volume: Volume spike may indicate campaign targeting the org\n• Virus detected: Immediate notification for AV hits\n• Disk usage: Quarantine/log storage nearing limit\n• Service failure: Mail relay or module failure\n• TLS failure: Partner TLS negotiation errors"
          },
          {
            heading: "System Reports",
            body: "BUILT-IN REPORTS:\n• Message Volume: Inbound/outbound message counts over time\n• Spam Summary: Spam volume, detection rates, top blocked senders\n• Virus Summary: Virus detections by type\n• Quarantine Activity: Messages quarantined, released, expired\n• Top Senders / Recipients: Volume by address\n• Policy Activity: Which rules fired most frequently\n\nREPORT PATH:\nAdministration > Reports > [Report Type]\n\nSCHEDULING REPORTS:\n• Reports can be scheduled: Daily, weekly, monthly\n• Delivered to admin email or downloaded via UI\n\nEXAM SCENARIO: 'The CISO wants a weekly summary of blocked threats.' → Administration > Reports > Create Scheduled Report > Spam/Virus Summary > Weekly > Email to CISO."
          },
          {
            heading: "Key Facts & Exam Traps",
            body: "• Alert Profile = notification destination (who/how). Alert Rule = trigger condition (what/when)\n• An alert rule must reference an alert profile to be active\n• Reports are retrospective — they show historical data, not real-time\n• For real-time monitoring: Use Smart Search or syslog-forwarded SIEM dashboards\n• Quarantine digest ≠ alert. Digest = user notification of their quarantined mail. Alert = admin notification of system events\n• Thresholds are customizable — default values may not match your organization's baseline"
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 5 — Email Authentication (9%) — SPF, DKIM, DMARC
  // ═══════════════════════════════════════════════════════════════════════════
  {
    domainId: "d5", weight: 9,
    name: "Email Authentication",
    topics: [
      {
        id: "d5t1", title: "SPF, DKIM & DMARC — Configuration & Exam Scenarios",
        subsections: [
          {
            heading: "SPF (Sender Policy Framework)",
            body: "SPF validates that the sending IP is authorized to send mail for the domain in the MAIL FROM (envelope sender).\n\nHOW IT WORKS:\n1. Sender publishes SPF record in DNS: v=spf1 ip4:203.0.113.10 include:proofpoint.com ~all\n2. Receiving server checks if sender IP matches SPF record\n3. Results: Pass, Fail, SoftFail (~all), Neutral (?all), None\n\nPROTECTION SERVER SPF CONFIGURATION:\nPath: Email Authentication > SPF > Policies and Rules\n• Create SPF policy: What action to take for each SPF result\n• Actions per result: Allow, Quarantine, Block, Tag\n• Recommended: Block on SPF Fail; Quarantine on SoftFail\n\nEXAM TRAP: SPF checks the ENVELOPE FROM (MAIL FROM), not the header 'From:' address. An attacker can forge the 'From:' header while passing SPF. This is why DMARC is needed — it aligns SPF/DKIM with the visible 'From:' header."
          },
          {
            heading: "DKIM (DomainKeys Identified Mail)",
            body: "DKIM adds a cryptographic signature to messages, allowing receivers to verify the message has not been tampered with in transit.\n\nHOW IT WORKS:\n1. Sending domain generates a key pair (public + private)\n2. Private key stored on Protection Server; public key published in DNS\n3. Protection Server signs each outbound message with private key (adds DKIM-Signature header)\n4. Receiving server retrieves public key from DNS and verifies signature\n\nPROTECTION SERVER DKIM CONFIGURATION:\nPath: Email Authentication > DKIM > Signing Profiles + Verification\n• Create Signing Profile: Select domain, selector, key size (2048-bit recommended)\n• Generate key pair: Protection Server generates; you publish public key to DNS\n• Verification: Configure actions for DKIM Pass / Fail / None results\n\nKEY CONCEPTS:\n• Selector: Subdomain label for the DNS key record (e.g., selector1._domainkey.contoso.com)\n• Key rotation: Best practice — rotate keys periodically; update DNS and Protection Server\n• Body hash: DKIM verifies message body integrity — if body is modified in transit, DKIM fails\n\nEXAM TRAP: DKIM signs the message BODY and selected headers. Adding or modifying headers after signing can break DKIM. Some mail systems modify Subject or add footers — can cause DKIM failures."
          },
          {
            heading: "DMARC (Domain-based Message Authentication, Reporting & Conformance)",
            body: "DMARC ties SPF and DKIM together and specifies what to do with mail that fails both. It requires ALIGNMENT — the domain in the visible 'From:' header must align with the SPF/DKIM validated domain.\n\nDMARC RECORD SYNTAX EXAMPLE:\nv=DMARC1; p=quarantine; rua=mailto:dmarc-reports@contoso.com; pct=100\n\nPOLICY VALUES (p=):\n• none: Monitor mode — take no action, just report\n• quarantine: Send failing messages to spam/quarantine\n• reject: Reject failing messages at the SMTP level\n\nALIGNMENT MODES:\n• Relaxed (default): The organizational domain must match (e.g., mail.contoso.com passes for contoso.com)\n• Strict: Exact domain match required\n\nPROTECTION SERVER DMARC CONFIGURATION:\nPath: Email Authentication > DMARC > Policies\n• Create DMARC verification policy: honor the sender's p= policy, or override with your own action\n• Override: Organization may choose to quarantine instead of reject even if sender's p=reject (common for forensics)\n\nDMARC REPORTING:\n• rua=: Aggregate reports (XML) — daily summary of authentication results\n• ruf=: Forensic reports — per-message failure details (privacy-sensitive, not universally supported)\n\nEXAM SCENARIO: 'Phishing emails are impersonating your CEO's domain and passing SPF.' → Enable DMARC with p=reject on the CEO's domain. DMARC alignment check will catch impostor emails that pass SPF but use a different 'From:' domain."
          },
          {
            heading: "Creating Email Authentication Keys",
            body: "PATH: Email Authentication > DKIM > Key Management > Generate New Key\n\nSTEPS:\n1. Select domain\n2. Enter selector name (e.g., 'proofpoint2026')\n3. Select key length: 1024 or 2048 bits (2048 recommended)\n4. Generate — Protection Server creates private/public key pair\n5. Copy the DNS TXT record value displayed\n6. Publish the DNS TXT record on your domain's DNS: selector._domainkey.yourdomain.com\n7. Test: Use 'Verify DNS' button to confirm DNS propagation\n8. Activate the signing profile to begin signing outbound mail\n\nKEY ROTATION PROCEDURE:\n1. Generate new key pair with new selector name\n2. Publish new selector in DNS\n3. Wait for TTL to propagate\n4. Update signing profile to use new selector\n5. Monitor for failures\n6. After 30 days: Remove old DNS selector record"
          },
          {
            heading: "Key Facts & Exam Traps",
            body: "• SPF → Envelope FROM (MAIL FROM). DKIM → Message headers + body. DMARC → Visible 'From:' alignment\n• DMARC p=none: No enforcement — monitoring only\n• DMARC p=reject: Strongest — rejects non-aligned messages at SMTP layer\n• SPF failure alone doesn't mean block — many orgs use SoftFail (~all) for gradual rollout\n• DKIM selector: The lookup key for DNS. Format: selector._domainkey.domain.com\n• Key size: 2048-bit DKIM keys recommended; 1024 is legacy and increasingly weak\n• Forwarded email: SPF often breaks on forward (forwarding server IP not in SPF). DKIM may survive if forwarding doesn't modify body. DMARC can fail if both fail."
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 6 — User & Protection (21%) — User Mgmt + Spam Detection + Virus Protection
  // ═══════════════════════════════════════════════════════════════════════════
  {
    domainId: "d6", weight: 21,
    name: "User & Protection",
    topics: [
      {
        id: "d6t1", title: "AD Sync, User Profiles, Groups & LDAP/SSO",
        subsections: [
          {
            heading: "Active Directory Sync",
            body: "The Protection Server syncs user and group data from Active Directory (or Azure AD) to manage recipients, apply per-user policies, and enable end-user features.\n\nSYNC METHODS:\n• LDAP Sync: Protection Server queries on-prem AD via LDAP/LDAPS\n• Azure AD / Entra ID Sync: For cloud environments\n\nLDAP SYNC CONFIGURATION:\nPath: Administration > User Management > LDAP Sync\n• Server: LDAP server hostname/IP\n• Port: 389 (LDAP) or 636 (LDAPS/secure)\n• Bind credentials: Service account DN and password\n• Base DN: Where to start the LDAP search (e.g., dc=contoso,dc=com)\n• Attributes to sync: mail, displayName, memberOf (for group membership)\n• Sync schedule: Auto-sync interval (e.g., every 4 hours)\n\nWHY SYNC MATTERS:\n• Recipient Verification: Valid users pulled from LDAP → invalid recipients rejected at SMTP level\n• End-user quarantine access: User accounts needed for digest and portal login\n• Per-user policies: Assign different spam thresholds or rules to specific user groups"
          },
          {
            heading: "User Profiles, Groups & SSO",
            body: "USER PROFILES:\n• Each synced or manually added user has a profile in the Protection Server\n• Profile contains: Email address(es), display name, group memberships, per-user settings\n• Override settings: Per-user spam thresholds, quarantine digest opt-out\n\nGROUPS:\n• Groups (synced from AD or created manually) allow bulk policy application\n• Example: Create group 'Executives' → assign tighter phishing policies to that group\n• Sub-groups: Groups can nest for hierarchical policy assignment\n\nSSO CONFIGURATION:\nPath: Administration > User Management > SSO\n• Protocols supported: SAML 2.0 (Azure AD / Okta), LDAP-based authentication\n• SSO for: Admin console login, end-user quarantine portal\n• Azure AD SSO: Configure app registration in Azure AD; provide SSO metadata URL to Protection Server\n\nROLES & ACCESS CONTROL:\n• Admin roles: System Admin, Domain Admin, Quarantine Admin, Read-only\n• Cloud UI vs On-Prem UI: Different access paths — PoD uses cloud portal, on-prem uses local admin console\n• Path: Administration > User Management > Admin Roles"
          },
          {
            heading: "Key Facts & Exam Traps",
            body: "• LDAP port 389 = unencrypted; 636 = LDAPS (encrypted) — always prefer 636 in production\n• Bind DN must have read access to user and group attributes in AD\n• SSO for admin console: Admins log in with corporate identity — no separate Proofpoint password\n• Groups synced from AD are read-only in Protection Server — cannot manually add members to AD-synced groups\n• Manually created groups: Can add members manually; useful for users not in AD (e.g., external partners)\n• Sub-groups: Useful for nested policy (e.g., 'Finance' inside 'Privileged Users' group)\n• Azure/SSO EXAM TRAP: SSO setup requires the SAML metadata from Azure AD — specifically the Entity ID and SSO URL"
          },
        ],
      },
      {
        id: "d6t2", title: "Spam Detection — Policies, Rules, Safe/Block Lists",
        subsections: [
          {
            heading: "Core Concept",
            body: "The Spam Detection module uses Proofpoint's MLX (Machine Learning) and Dynamic Reputation (DRE) engine to score messages on a 0–100 spam probability scale. Administrators create policies that define actions for different score ranges.\n\nSPAM SCORE:\n• 0–30: Low probability spam (typically allow)\n• 31–70: Medium probability (tag or quarantine)\n• 71–100: High probability spam (block or quarantine)\n• Thresholds are configurable per policy\n\nCREATE SPAM POLICY:\nPath: Email Protection > Spam Detection > Policies > New Policy\n• Name the policy\n• Set thresholds: Define score ranges for Allow, Tag, Quarantine, Block\n• Assign to route: Policy applies to Inbound, Outbound, or specific policy route\n• Enable/disable sub-modules: Bulk mail detection, phishing detection\n\nCREATE SPAM RULES:\nRules within a spam policy allow exceptions:\n• Bypass spam for: Trusted senders, specific recipient groups\n• Force spam action: Always quarantine mail from known spam sources\n• Example rule: IF sender_domain = 'newsletter.vendorname.com' THEN allow (bypass spam detection)"
          },
          {
            heading: "Safe Lists, Block Lists & Custom Rules",
            body: "SAFE SENDER LIST (Allowlist):\n• Senders or domains exempt from spam scoring\n• Messages from safe senders bypass the spam module entirely\n• Sources: Admin-defined global list, end-user per-user list (if permitted), LDAP-synced corporate contacts\n• Path: Email Protection > Spam Detection > Safe Senders\n\nBLOCK LIST (Blocklist):\n• Senders or domains always blocked or quarantined regardless of spam score\n• Used for known-bad senders\n• Path: Email Protection > Spam Detection > Blocked Senders\n\nCUSTOM SPAM RULES:\n• Beyond the scoring engine, you can create rules based on specific email attributes\n• Condition examples:\n  - Subject line contains 'CLICK HERE NOW'\n  - Message body matches a dictionary (e.g., Phishing Dictionary)\n  - Attachment filename matches pattern (*.exe)\n• Actions: Quarantine, Block, Tag subject, Add header\n\nTUNING SPAM DETECTION:\n• False positives (legit mail blocked): Lower threshold, add sender to safe list\n• False negatives (spam getting through): Raise threshold, add sender to block list, create custom rule\n• Bulk mail: Many marketing emails score as 'bulk' not 'spam' — separate threshold configurable"
          },
          {
            heading: "Key Facts & Exam Traps",
            body: "• MLX + DRE: Proofpoint's proprietary spam scoring engines. MLX = machine learning; DRE = dynamic reputation\n• Score 0-100: Higher = more likely spam. Thresholds configurable.\n• Global safe list overrides per-user safe list in priority\n• Admin block list: Takes precedence over safe lists — if sender is on admin block list, they are blocked even if on a user's safe list\n• Bulk mail: Legitimate marketing/newsletters often score as bulk (not spam). Bulk-specific threshold available.\n• EXAM TRAP: 'End users can add safe senders' — only true if admin has enabled end-user safe sender management\n• Custom rules evaluated BEFORE the MLX engine score — a rule match can bypass scoring entirely"
          },
        ],
      },
      {
        id: "d6t3", title: "Virus Protection — Module Policies, Rules & Processing",
        subsections: [
          {
            heading: "Core Concept",
            body: "The Virus Protection module scans all messages and attachments for malware using multiple antivirus engines integrated into the Protection Server.\n\nAV ENGINE APPROACH:\n• Proofpoint uses multiple AV engines simultaneously (defense in depth)\n• Engines updated frequently (multiple times per day) with new signatures\n• Scan scope: Attachments, compressed archives (ZIP, RAR, etc.), embedded OLE objects in Office files, PDF attachments\n\nVIRUS PROTECTION POLICIES:\nPath: Email Protection > Virus Protection > Policies > New Policy\n• Policy applies per route: Inbound, Outbound, or specific policy route\n• Per-route configuration allows: Strict inbound scanning, relaxed internal relay scanning\n• Policy settings:\n  - Enable/disable specific AV engines\n  - Action on virus: Block, Quarantine, Strip attachment, Notify\n  - Action on suspect (heuristic hit): Same options as virus, but typically softer action\n\nVIRUS PROTECTION RULES:\n• Rules allow exemptions or overrides within a virus policy\n• Example: Bypass virus scanning for encrypted ZIP files from a trusted partner (if password-protected ZIPs cause false positives)"
          },
          {
            heading: "Processing Restrictions & Key Behaviors",
            body: "RESTRICTING PROCESSING TO SPECIFIC ROUTES:\n• Virus protection can be enabled/disabled per policy route\n• Use case: Internal mail relay route — disable virus scanning to reduce latency for machine-generated internal reports\n• Config: In virus policy, restrict to specific routes using route scope setting\n\nENCRYPTED ATTACHMENTS:\n• Encrypted archives (password-protected ZIPs) CANNOT be scanned for viruses\n• Default action: Treat as suspect / quarantine (configurable)\n• Admin decision: Risk acceptance — allow encrypted attachments from trusted senders via rule exception\n\nLARGE ATTACHMENT HANDLING:\n• Very large files may be too large to fully scan within time limits\n• Max scan size configurable — files exceeding limit can be flagged or allowed depending on policy\n\nNOTIFICATIONS:\n• Virus detected: Notify sender (NDR), notify recipient, notify admin\n• Notification templates: Customizable HTML email templates\n• Path: Email Protection > Virus Protection > Notifications"
          },
          {
            heading: "Key Facts & Exam Traps",
            body: "• Multiple AV engines: Proofpoint runs several simultaneously — if any detect a virus, the message is flagged\n• Encrypted ZIPs: Cannot be scanned — must decide: block all, quarantine, or allow with risk\n• Strip attachment action: Delivers message but removes the infected attachment — useful for productivity\n• Virus quarantine = admin-only release: End users CANNOT release virus-quarantined messages (by design — safety)\n• Outbound virus scanning: Critical — a compromised internal account could send malware outbound\n• Heuristic detection: Behavior-based (not signature). More false positives but catches zero-days. Typically 'Suspect' classification, softer action.\n• Policy route restriction: Virus scanning can be scoped to only specific routes for performance optimization"
          },
        ],
      },
      {
        id: "d3t2", title: "User Notifications — Email Warning Tags & Quarantine Digest",
        subsections: [
          {
            heading: "Email Warning Tags",
            body: "Email Warning Tags are visual banners prepended to message bodies (HTML) that warn recipients about potential threats, even when the message is delivered.\n\nPURPOSE: Inform users of risk without blocking legitimate mail. The tag increases user awareness and reduces the chance they act on a suspicious message.\n\nWARNING TAG TYPES (common):\n• External Sender Tag: 'This message was sent from outside your organization'\n• Impostor Alert Tag: 'This message appears to impersonate an executive or colleague'\n• Phishing Warning Tag: 'This message failed email authentication checks'\n• Spam Tag: 'This message may be spam'\n\nCONFIGURATION:\nPath: Email Protection > User Notifications > Email Warning Tags\n• Create tag: Name, message text, style (color, icon)\n• Assign tag to a rule: Firewall rule action = 'Tag message with [Warning Tag Name]'\n• Tag precedence: If multiple rules match and each has a tag, precedence order determines which tag is applied\n\nROUTE RESTRICTION:\n• Tags can be restricted to specific routes (e.g., only apply external sender tag on Inbound route)"
          },
          {
            heading: "Quarantine Digest",
            body: "The Quarantine Digest is a notification email sent to users listing messages in their quarantine. It allows end users to review and act on their quarantined messages without accessing the admin console.\n\nCONFIGURATION:\nPath: Quarantine > Digest Settings (or per-folder settings)\n• Frequency: Hourly, every 4 hours, daily, weekly\n• Format: HTML email with list of quarantined messages\n• Per-folder: Each quarantine folder can have its own digest schedule\n• Include: Sender, subject, date, spam score\n\nUSER ACTIONS FROM DIGEST:\n• Release: Deliver the message from quarantine\n• Block Sender: Add to personal block list\n• Not Spam: Mark as not spam + release (feeds the spam learning engine)\n• View: Preview message before releasing\n\nADMIN CONTROLS ON DIGEST:\n• Disable digest for specific users\n• Force digest delivery at specific times\n• Restrict which quarantine folders users can see in their digest (e.g., hide Virus folder from user digest — admin-only)"
          },
          {
            heading: "Key Facts & Exam Traps",
            body: "• Warning tags modify the message body (HTML prepend) — they do NOT change message headers or envelope\n• Tag precedence: Lower number = higher priority (same as rule precedence)\n• Tags are applied by firewall rules — a tag is a RULE ACTION, not a standalone setting\n• Quarantine digest ≠ system alert. Digest = user-facing. Alert = admin-facing.\n• End users can release from SPAM folder but NOT from VIRUS folder (admin-only)\n• 'Not Spam' action: Teaches the spam engine — this feedback improves future detection\n• Digest opt-out: Users can unsubscribe from digest — admin can disable opt-out if compliance requires\n• Route restriction on tags: External sender tag should ONLY apply to Inbound — applying to Outbound would tag your own sent mail"
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DOMAIN 7 — Advanced Threats (17%) — TAP + Threat Response & CLEAR
  // ═══════════════════════════════════════════════════════════════════════════
  {
    domainId: "d7", weight: 17,
    name: "Advanced Threats",
    topics: [
      {
        id: "d7t1", title: "TAP — URL Rewrite, Message Defense, TAP Dashboard & API",
        subsections: [
          {
            heading: "URL Rewrite & Sandboxing",
            body: "TAP (Targeted Attack Protection) defends against advanced threats: malicious URLs, attachments with malware, and impostor emails.\n\nURL REWRITE (URL Defense):\n• All URLs in inbound messages are rewritten to point through Proofpoint's URL defense proxy\n• When a user clicks the rewritten URL:\n  1. Proofpoint proxy intercepts the click\n  2. URL is analyzed against threat intelligence\n  3. If malicious: User sees a warning/block page\n  4. If safe: User is transparently redirected to original URL\n• This happens in real-time at click time — catching threats even if the URL was clean at delivery\n\nURL REWRITE SETTINGS:\nPath: Targeted Attack Protection > URL Defense > Settings\n• Rewrite mode: Rewrite all URLs vs rewrite only suspicious URLs\n• Click tracking: Log all URL clicks for analysis\n• Allowed URL list: URLs excluded from rewriting (e.g., internal URLs)\n\nATTACHMENT DEFENSE (Sandboxing):\n• Attachments detonated in a sandboxed environment to detect malware\n• File types: EXE, ZIP, Office documents, PDFs, scripts\n• If malware behavior detected → message quarantined or attachment stripped"
          },
          {
            heading: "Message Defense & TAP Dashboard",
            body: "MESSAGE DEFENSE:\n• TAP's impostor/phishing detection capability\n• Analyzes: Display name, lookalike domains, header anomalies, content patterns\n• Very Attacked People (VAP): TAP identifies users most targeted by advanced threats\n• Impostor alerts: Messages that appear to be from executives or colleagues but are fraudulent\n\nTAP DASHBOARD:\nPath: TAP Dashboard (separate portal — threatinsight.proofpoint.com or linked from Protection Server)\n\nDASHBOARD KEY SECTIONS:\n• Threat Feed: Real-time threats detected across your organization\n• Campaign Analysis: Threat campaigns targeting your users\n• VAP Report: Which users are most attacked (frequency + severity)\n• Top Clickers: Users who click the most malicious URLs (training priority)\n• Custom Blocklist: Admin-created blocklist of URLs or IP ranges\n• User Privileges: Manage who has dashboard access\n\nCUSTOM BLOCKLISTS IN TAP:\n• Block specific URLs, domains, or IP addresses across all mail\n• Supplement Proofpoint threat intelligence with org-specific threat intel\n\nTAP DASHBOARD APIs:\n• Multiple API endpoints: Threat feed, VAP data, campaign data, clicks/messages\n• Use cases: SIEM integration, automated threat hunting, executive reporting\n• API key generation: TAP Dashboard > Settings > Connected Applications > New API Key"
          },
          {
            heading: "Key Facts & Exam Traps",
            body: "• URL rewrite = click-time protection. Even if URL was clean at delivery, rewrite catches it when URL goes malicious later.\n• TAP Dashboard is a SEPARATE portal from the Protection Server admin console\n• VAP = Very Attacked People. High VAPs should receive additional security controls (e.g., stricter policies, priority security awareness training)\n• 'Top Clickers': Users who click many potentially malicious URLs — high training priority\n• API key = per-application credential for TAP Dashboard data access. Not the same as Protection Server API key.\n• Attachment defense = sandboxing. Files run in isolated VM environment.\n• EXAM TRAP: 'TAP detects threats in real-time at delivery.' NOT entirely true — URL defense is click-time; attachment sandboxing may add delivery delay (async or hold-and-scan mode)\n• Custom blocklist in TAP: Additions apply globally to all mail — use carefully"
          },
        ],
      },
      {
        id: "d7t2", title: "Threat Response & CLEAR — TRAP, Automation & Remediation",
        subsections: [
          {
            heading: "Core Concept — TRAP vs CLEAR",
            body: "THREAT RESPONSE AUTO-PULL (TRAP):\n• Automatically removes malicious messages from user inboxes AFTER delivery\n• Works retroactively — if a message was delivered before the threat was known, TRAP can reach into mailboxes and remove it\n• Triggers: TAP threat signal, admin-initiated pull, CLEAR-triggered pull\n\nCLOSED-LOOP EMAIL ANALYSIS & RESPONSE (CLEAR):\n• Integrates with abuse mailboxes (where users report phishing)\n• When a user forwards a suspicious email to the abuse mailbox:\n  1. CLEAR extracts and analyzes the original message\n  2. Compares against TAP threat intelligence\n  3. If confirmed malicious: Triggers TRAP to pull the message from ALL inboxes it was delivered to\n  4. Closes the loop: User gets a response confirming the threat was handled\n\nINTEGRATION ARCHITECTURE:\n• CLEAR → sits on top of the abuse mailbox\n• TRAP → connects to mail servers (Microsoft 365, Google Workspace, on-prem Exchange)\n• TAP → provides the threat verdict\n• Protection Server → filters future instances of the same threat"
          },
          {
            heading: "Deployment & Configuration",
            body: "CLOUD vs ON-PREM THREAT RESPONSE:\n• Cloud (TRAP): Proofpoint-hosted. Integrates with M365/Google via API.\n• On-Premises: Self-hosted Threat Response server. Integrates with on-prem Exchange via EWS or PowerShell.\n\nINITIAL DEPLOYMENT TASKS:\n1. Connect mail server: Provide credentials/API access for M365 or Exchange\n2. Configure mail sources: Define which mail servers Threat Response manages\n3. Enable automation workflows: Define trigger conditions and automated actions\n4. Set up CLEAR: Configure abuse mailbox monitoring\n5. Test: Send test phishing report → verify CLEAR processes and TRAP removes\n\nMAIL SERVER CONNECTION:\n• Microsoft 365: Uses Microsoft Graph API or EWS. Requires app registration in Azure AD.\n• Google Workspace: Uses Gmail API. Requires OAuth service account.\n• On-prem Exchange: Uses Exchange Web Services (EWS) with service account credentials.\n\nAUTOMATION WORKFLOWS:\n• Trigger: Threat verdict received from TAP, or abuse report confirmed\n• Actions: Pull message from all mailboxes, notify security team, log to SIEM, add sender to block list\n• Conditions: Only auto-pull if threat confidence > threshold; leave low-confidence to analyst review\n\nCUSTOMIZABLE LISTS:\n• Allowlists: Messages from these senders/domains will NOT be auto-pulled\n• Blocklists: Force-pull messages from these senders\n• Analyst exceptions: Messages flagged for manual review before auto-action"
          },
          {
            heading: "Import Sources & CLEAR Workflow",
            body: "IMPORT SOURCES:\n• Threat Response can import threat data from external sources beyond TAP\n• Supported: STIX/TAXII feeds, custom CSV indicator imports, API-pushed IOCs\n• Use case: Import threat intel from ISAC, SOC platform, or third-party TI provider → Threat Response acts on those IOCs\n\nCLEAR ABUSE MAILBOX WORKFLOW:\n1. User receives suspicious email → forwards to abuse@company.com\n2. CLEAR monitors the abuse mailbox\n3. CLEAR extracts the reported message (EML extraction from forwarded mail)\n4. Analyzes: Compares to TAP, checks URLs, attachment hashes\n5. Verdict: Malicious / Suspicious / Clean\n6. If malicious → CLEAR triggers TRAP:\n   a. TRAP queries mail server for all deliveries of this message\n   b. TRAP removes message from every affected inbox\n   c. CLEAR sends response to the user who reported: 'Thank you. This was confirmed as phishing and has been removed.'\n7. Admin dashboard: All reports and outcomes logged for review\n\nPOST-INCIDENT ANALYSIS:\n• Threat Response logs: Full audit of what was pulled, when, from whose mailbox\n• Useful for: Incident reports, compliance evidence, SOC triage"
          },
          {
            heading: "Key Facts & Exam Traps",
            body: "• TRAP = auto-pull engine. CLEAR = abuse mailbox loop that feeds TRAP.\n• TRAP requires API access to the mail server (Graph API for M365, EWS for Exchange)\n• CLEAR closes the loop: Users know their reports were acted on — increases reporting behavior\n• Cloud TRAP = no on-prem server needed. On-prem TRAP = self-managed.\n• Import Sources: Extend TRAP beyond TAP by importing external threat intel\n• Automation workflows: Define when to auto-pull vs escalate to analyst. Prevents over-automation.\n• EXAM TRAP: TRAP does NOT prevent delivery of the original message. It REMOVES it after delivery. Prevention happens at the Protection Server / TAP level.\n• M365 integration: Requires Azure AD app registration with Mail.ReadWrite and Mail.Send permissions\n• CLEAR EML extraction: CLEAR must extract the ORIGINAL forwarded-as-attachment email, not the forwarding wrapper"
          },
        ],
      },
    ],
  },
];
// ─────────────────────────────────────────────────────────────────────────────

// ─── THEME SYSTEM ─────────────────────────────────────────────────────────────
const THEMES = {
  "command-palette": {
    name: "Command Palette",
    bg: "#0A0A0A", surface: "#121212", elevated: "#18181B",
    border: "#27272A", borderHover: "#3F3F46",
    textPri: "#FAFAFA", textSec: "#A1A1AA",
    accent: "#6366F1", accentHover: "#4F46E5",
    accentBg: "rgba(99,102,241,0.08)", accentBd: "rgba(99,102,241,0.25)",
    btnPrimary: "background:#6366F1;color:#fff;border-color:#6366F1",
    radius: "6px", radiusSm: "4px",
  },
  "arctic-white": {
    name: "Arctic White",
    bg: "#FFFFFF", surface: "#F9FAFB", elevated: "#F3F4F6",
    border: "#E5E7EB", borderHover: "#D1D5DB",
    textPri: "#111827", textSec: "#6B7280",
    accent: "#2563EB", accentHover: "#1D4ED8",
    accentBg: "rgba(37,99,235,0.06)", accentBd: "rgba(37,99,235,0.20)",
    btnPrimary: "background:#2563EB;color:#fff;border-color:#2563EB",
    radius: "8px", radiusSm: "5px",
  },
  "midnight-green": {
    name: "Midnight Green",
    bg: "#0D1117", surface: "#161B22", elevated: "#21262D",
    border: "#30363D", borderHover: "#484F58",
    textPri: "#E6EDF3", textSec: "#8B949E",
    accent: "#3FB950", accentHover: "#2EA043",
    accentBg: "rgba(63,185,80,0.08)", accentBd: "rgba(63,185,80,0.25)",
    btnPrimary: "background:#238636;color:#fff;border-color:#238636",
    radius: "6px", radiusSm: "4px",
  },
  "sunset-amber": {
    name: "Sunset Amber",
    bg: "#1C1308", surface: "#241A0A", elevated: "#2E2210",
    border: "#3D2E15", borderHover: "#5A4520",
    textPri: "#FEF3C7", textSec: "#D97706",
    accent: "#F59E0B", accentHover: "#D97706",
    accentBg: "rgba(245,158,11,0.10)", accentBd: "rgba(245,158,11,0.30)",
    btnPrimary: "background:#F59E0B;color:#1C1308;border-color:#F59E0B",
    radius: "6px", radiusSm: "4px",
  },
  "neon-tokyo": {
    name: "Neon Tokyo",
    bg: "#0F0F1A", surface: "#14142A", elevated: "#1E1E3A",
    border: "#2A2A50", borderHover: "#3D3D6B",
    textPri: "#E2E2FF", textSec: "#9090CC",
    accent: "#FF2D78", accentHover: "#E01A60",
    accentBg: "rgba(255,45,120,0.08)", accentBd: "rgba(255,45,120,0.25)",
    btnPrimary: "background:#FF2D78;color:#fff;border-color:#FF2D78",
    radius: "6px", radiusSm: "4px",
  },
  "cloud-slate": {
    name: "Cloud Slate",
    bg: "#0F172A", surface: "#1E293B", elevated: "#334155",
    border: "#475569", borderHover: "#64748B",
    textPri: "#F1F5F9", textSec: "#94A3B8",
    accent: "#38BDF8", accentHover: "#0EA5E9",
    accentBg: "rgba(56,189,248,0.08)", accentBd: "rgba(56,189,248,0.25)",
    btnPrimary: "background:#0EA5E9;color:#fff;border-color:#0EA5E9",
    radius: "6px", radiusSm: "4px",
  },
};

const DEFAULT_THEME = "command-palette";

function getTheme() {
  try { return THEMES[localStorage.getItem("tpad01_theme")] ? localStorage.getItem("tpad01_theme") : DEFAULT_THEME; } catch { return DEFAULT_THEME; }
}

function applyTheme(id) {
  const t = THEMES[id] || THEMES[DEFAULT_THEME];
  const r = document.documentElement.style;
  r.setProperty("--bg", t.bg); r.setProperty("--surface", t.surface); r.setProperty("--elevated", t.elevated);
  r.setProperty("--border", t.border); r.setProperty("--border2", t.borderHover);
  r.setProperty("--text-pri", t.textPri); r.setProperty("--text-sec", t.textSec);
  r.setProperty("--accent", t.accent); r.setProperty("--accent-h", t.accentHover);
  r.setProperty("--accent-bg", t.accentBg); r.setProperty("--accent-bd", t.accentBd);
  r.setProperty("--r", t.radius); r.setProperty("--r-sm", t.radiusSm); r.setProperty("--r-xs", "3px");
  try { localStorage.setItem("tpad01_theme", id); } catch {}
}

function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState(getTheme);
  const switchTheme = (id) => { setCurrentId(id); applyTheme(id); setOpen(false); };
  useEffect(() => { applyTheme(currentId); }, []);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{ width:28, height:28, borderRadius:"var(--r-sm)", display:"flex", alignItems:"center", justifyContent:"center",
          background:"transparent", border:"1px solid var(--border)", color:"var(--text-sec)", cursor:"pointer", fontSize:13 }}
        title="Switch theme"
      >⬡</button>
      {open && (
        <div style={{ position:"fixed", inset:0, zIndex:500, background:"rgba(0,0,0,0.5)", backdropFilter:"blur(6px)",
          display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={() => setOpen(false)}>
          <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--r) var(--r) 0 0",
            width:"100%", maxWidth:480, padding:"16px 16px 32px", boxShadow:"0 -8px 40px rgba(0,0,0,0.4)" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--text-sec)", fontFamily:"var(--font-mono)" }}>Theme</div>
              <button onClick={() => setOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-sec)", fontSize:16 }}>✕</button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              {Object.entries(THEMES).map(([id, t]) => {
                const active = id === currentId;
                return (
                  <button key={id} onClick={() => switchTheme(id)} style={{
                    background: active ? "var(--accent-bg)" : "var(--elevated)",
                    border:`1px solid ${active ? "var(--accent-bd)" : "var(--border)"}`,
                    borderRadius:"var(--r-sm)", padding:"10px 12px", cursor:"pointer", textAlign:"left",
                    display:"flex", alignItems:"center", gap:8,
                    borderLeft: active ? `3px solid var(--accent)` : `1px solid var(--border)`,
                  }}>
                    <div style={{ width:12, height:12, borderRadius:"50%", background:t.accent, flexShrink:0 }}/>
                    <div style={{ fontSize:11, fontWeight:600, color: active ? "var(--text-pri)" : "var(--text-sec)", fontFamily:"var(--font-mono)" }}>{t.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── ZOOM CONTROL ─────────────────────────────────────────────────────────────
function ZoomControl() {
  const ZOOM_KEY = "tpad01_zoom";
  const ZOOM_MIN = 80, ZOOM_MAX = 140, ZOOM_DEFAULT = 100, ZOOM_STEP = 5;
  const [zoom, setZoom] = useState(() => { try { return parseInt(localStorage.getItem(ZOOM_KEY)) || ZOOM_DEFAULT; } catch { return ZOOM_DEFAULT; } });
  const [open, setOpen] = useState(false);

  const applyZoom = (val) => {
    document.body.style.zoom = `${val}%`;
    try { localStorage.setItem(ZOOM_KEY, val); } catch {}
    setZoom(val);
  };

  useEffect(() => { applyZoom(zoom); }, []);

  const change = (delta) => { const v = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom + delta)); applyZoom(v); };

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        title={`Zoom: ${zoom}%`}
        style={{ width:28, height:28, borderRadius:"var(--r-sm)", display:"flex", alignItems:"center", justifyContent:"center",
          background: zoom !== ZOOM_DEFAULT ? "var(--accent-bg)" : "transparent",
          border: `1px solid ${zoom !== ZOOM_DEFAULT ? "var(--accent-bd)" : "var(--border)"}`,
          color: zoom !== ZOOM_DEFAULT ? "var(--accent)" : "var(--text-sec)", cursor:"pointer", fontSize:11, fontWeight:700, fontFamily:"var(--font-mono)" }}
      >{zoom !== ZOOM_DEFAULT ? `${zoom}%` : "🔍"}</button>

      {open && (
        <div style={{ position:"fixed", inset:0, zIndex:500, background:"rgba(0,0,0,0.5)", backdropFilter:"blur(6px)",
          display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={() => setOpen(false)}>
          <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--r) var(--r) 0 0",
            width:"100%", maxWidth:480, padding:"16px 16px 32px", boxShadow:"0 -8px 40px rgba(0,0,0,0.4)" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--text-sec)", fontFamily:"var(--font-mono)" }}>Text Size</div>
              <button onClick={() => setOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-sec)", fontSize:16 }}>✕</button>
            </div>

            {/* Slider row */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <button onClick={() => change(-ZOOM_STEP)}
                style={{ width:34, height:34, borderRadius:"var(--r-sm)", border:"1px solid var(--border)", background:"var(--elevated)",
                  color:"var(--text-pri)", fontSize:18, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                A
              </button>
              <input type="range" min={ZOOM_MIN} max={ZOOM_MAX} step={ZOOM_STEP} value={zoom}
                onChange={e => applyZoom(parseInt(e.target.value))}
                style={{ flex:1, accentColor:"var(--accent)", cursor:"pointer", height:4 }} />
              <button onClick={() => change(+ZOOM_STEP)}
                style={{ width:34, height:34, borderRadius:"var(--r-sm)", border:"1px solid var(--border)", background:"var(--elevated)",
                  color:"var(--text-pri)", fontSize:22, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                A
              </button>
            </div>

            {/* Preset chips */}
            <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:14 }}>
              {[80, 90, 100, 110, 120, 130, 140].map(v => (
                <button key={v} onClick={() => applyZoom(v)}
                  style={{ padding:"5px 10px", borderRadius:"var(--r-sm)", fontSize:11, fontWeight:700, fontFamily:"var(--font-mono)",
                    border: `1px solid ${zoom === v ? "var(--accent-bd)" : "var(--border)"}`,
                    background: zoom === v ? "var(--accent-bg)" : "var(--elevated)",
                    color: zoom === v ? "var(--accent)" : "var(--text-sec)", cursor:"pointer" }}>
                  {v}%
                </button>
              ))}
            </div>

            {/* Current value + reset */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ fontSize:13, fontWeight:800, fontFamily:"var(--font-mono)", color:"var(--text-pri)" }}>{zoom}%</div>
              {zoom !== ZOOM_DEFAULT && (
                <button onClick={() => applyZoom(ZOOM_DEFAULT)}
                  style={{ padding:"4px 12px", borderRadius:"var(--r-sm)", border:"1px solid var(--border)", background:"var(--elevated)",
                    color:"var(--text-sec)", fontSize:10, fontFamily:"var(--font-mono)", cursor:"pointer", fontWeight:600 }}>
                  ↺ Reset
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
const CERT_CONFIG = {
  id: "TPAD01",
  name: "Threat Protection Administrator",
  vendor: "Proofpoint",
  passingScore: 70,
  examQuestions: 60,
  examDuration: 90,
  cost: { us: 250, in: 20800 },
  currency: { us: "USD", in: "INR" },
  aboutExam: `The Proofpoint TPAD01 exam validates your ability to administer and manage Proofpoint's Threat Protection platform in real-world environments. It covers day-to-day operational skills including configuring the Email Protection Server, managing mail flow and policy routes, email authentication (SPF/DKIM/DMARC), spam and virus protection, quarantine management, Targeted Attack Protection (TAP), and Threat Response Auto-Pull (TRAP/CLEAR). Exams are delivered on the Certiverse platform. Target audience: Security administrators, messaging administrators, and IT professionals managing Proofpoint environments.`,
  domains: [
    { id: "d1", name: "Mail Infrastructure",       weight: 17, examQCount: 10 },
    { id: "d2", name: "Policy & Filtering",        weight: 17, examQCount: 10 },
    { id: "d3", name: "Quarantine & Notifications",weight: 11, examQCount:  7 },
    { id: "d4", name: "Visibility & Ops",          weight: 13, examQCount:  8 },
    { id: "d5", name: "Email Authentication",      weight:  9, examQCount:  5 },
    { id: "d6", name: "User & Protection",         weight: 21, examQCount: 12 },
    { id: "d7", name: "Advanced Threats",          weight: 17, examQCount: 10 },
  ],
  questionTypes: ["mcq", "multi"],
  examQuestionTypes: { mcq: 0.85, multi: 0.15 },
};

// ─── STORAGE KEY ─────────────────────────────────────────────────────────────
const CERT_ID = CERT_CONFIG.id;
const SK = {
  qbase:        `tpad01_${CERT_ID}_qbase`,
  aiCache:      `tpad01_${CERT_ID}_aicache`,
  parkingLot:   `tpad01_${CERT_ID}_parkinglot`,
  leitner:      `tpad01_${CERT_ID}_leitner`,
  events:       `tpad01_${CERT_ID}_events`,
  sessionCount: `tpad01_${CERT_ID}_sessions`,
  apiKeys:      `tpad01_${CERT_ID}_apikeys`,
  rateConfig:   `tpad01_${CERT_ID}_rateconfig`,
  seenMap:      `tpad01_${CERT_ID}_seenmap`,
};

// ─── API KEY CONFIG ───────────────────────────────────────────────────────────
const KEY_A_DEFAULT = "";
const KEY_B_DEFAULT = "__BUILTIN_CLAUDE__"; // Sentinel: Key B is built-in Claude, no user key needed
const KEY_A_MODEL   = "gemini-2.5-flash-lite";                   // Gemini 2.5 Flash Lite (stable GA — July 2025)
const KEY_B_MODEL   = "claude-sonnet-4-20250514";         // Built-in Claude Sonnet via Artifact API
const GEMINI_ENDPOINT = (model, key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
const THROTTLE_COOLDOWN_MS = 65_000;
const KEY_THROTTLE = new Map();

function keyPrefix16(k) { return (k || "").slice(0, 16); }
function isKeyThrottled(k) {
  const state = KEY_THROTTLE.get(keyPrefix16(k));
  if (!state) return false;
  if (Date.now() - state.throttledAt >= state.cooldownMs) { KEY_THROTTLE.delete(keyPrefix16(k)); return false; }
  return true;
}
function throttleKey(k, ms = THROTTLE_COOLDOWN_MS) {
  KEY_THROTTLE.set(keyPrefix16(k), { throttledAt: Date.now(), cooldownMs: ms });
}
function getThrottleRemainingMs(k) {
  const state = KEY_THROTTLE.get(keyPrefix16(k));
  if (!state) return 0;
  return Math.max(0, state.cooldownMs - (Date.now() - state.throttledAt));
}

function getActiveKeys() {
  try {
    const saved = localStorage.getItem(SK.apiKeys);
    if (saved) {
      const p = JSON.parse(saved);
      return { keyA: (p.keyA||"").trim()||KEY_A_DEFAULT, keyB: (p.keyB||"").trim()||KEY_B_DEFAULT, primaryKey: p.primaryKey||"a" };
    }
  } catch {}
  return { keyA: KEY_A_DEFAULT, keyB: KEY_B_DEFAULT, primaryKey: "a" };
}

function getActiveRateConfig() {
  try {
    const saved = localStorage.getItem(SK.rateConfig);
    if (saved) {
      const p = JSON.parse(saved);
      const rpm = parseInt(p.rpm), tpm = parseInt(p.tpm);
      if (rpm > 0 && tpm > 0) return { rpm, tpm, batchSize: parseInt(p.batchSize)||calcBatchSize(rpm,tpm), intervalMs: parseInt(p.intervalMs)||Math.floor(60000/rpm) };
    }
  } catch {}
  const rpm = 10, tpm = 250000;
  return { rpm, tpm, batchSize: calcBatchSize(rpm,tpm), intervalMs: Math.floor(60000/rpm) };
}

// ─── STORE ────────────────────────────────────────────────────────────────────
const Store = {
  get(key, fallback = []) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
  set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) { console.warn("[ThreatPrep] Storage write failed:", e.message); } },
  log(event) {
    const events = this.get(SK.events, []);
    events.push({ ts: Date.now(), ...event });
    if (events.length > 500) events.splice(0, events.length - 500);
    this.set(SK.events, events);
  },
};


// ─── LEITNER ─────────────────────────────────────────────────────────────────
const Leitner = {
  INTERVALS: [0,1,3,7,14,30],
  getBox(qId) { return (Store.get(SK.leitner,{})[qId])||{box:0,lastSession:0,attempts:0}; },
  promote(qId) {
    const state = Store.get(SK.leitner,{}), cur = state[qId]||{box:0,lastSession:0,attempts:0};
    state[qId] = {box:Math.min(cur.box+1,5),lastSession:Store.get(SK.sessionCount,0),attempts:cur.attempts+1};
    Store.set(SK.leitner, state);
  },
  demote(qId) {
    const state = Store.get(SK.leitner,{}), cur = state[qId]||{box:0,lastSession:0,attempts:0};
    state[qId] = {box:Math.max(cur.box-1,0),lastSession:Store.get(SK.sessionCount,0),attempts:cur.attempts+1};
    Store.set(SK.leitner, state);
  },
  isDue(qId) { const {box,lastSession} = this.getBox(qId); return (Store.get(SK.sessionCount,0)-lastSession)>=this.INTERVALS[box]; },
};

// ─── SEEN TRACKER ────────────────────────────────────────────────────────────
const SeenTracker = {
  getMap() { return Store.get(SK.seenMap,{}); },
  getCount(qId) { return this.getMap()[qId]||0; },
  recordSession(qIds) {
    const map = this.getMap();
    qIds.forEach(id => { map[id] = (map[id]||0)+1; });
    Store.set(SK.seenMap, map);
    const sc = Store.get(SK.sessionCount,0);
    const qbase = Store.get(SK.qbase,[]);
    Store.set(SK.qbase, qbase.map(q => qIds.includes(q.id) ? {...q, seenCount:map[q.id], lastSeenSession:sc} : q));
  },
  getTag(seenCount, inParkingLot) {
    if (inParkingLot) return { label:"PARKED",  color:"#fb923c", bg:"rgba(251,146,60,0.12)", bd:"rgba(251,146,60,0.35)" };
    if (seenCount===0) return { label:"NEW",     color:"#34d399", bg:"rgba(52,211,153,0.10)", bd:"rgba(52,211,153,0.30)" };
    if (seenCount===1) return { label:"SEEN 1×", color:"#60a5fa", bg:"rgba(96,165,250,0.10)", bd:"rgba(96,165,250,0.30)" };
    if (seenCount===2) return { label:"SEEN 2×", color:"#a78bfa", bg:"rgba(167,139,250,0.10)",bd:"rgba(167,139,250,0.30)" };
    return                    { label:"ELIGIBLE",color:"#f87171", bg:"rgba(248,113,113,0.10)",bd:"rgba(248,113,113,0.30)" };
  },
};

// ─── LOGIC A ─────────────────────────────────────────────────────────────────
const LogicA = {
  isEligibleForPractice(q) {
    const sc = q.seenCount||0;
    if (sc >= 3) return false;
    if (sc === 0) return true;
    const cur = Store.get(SK.sessionCount,0)||0, last = q.lastSeenSession||0;
    return (cur - last) >= sc;
  },
  mutateOptions(q) {
    if (!q||!Array.isArray(q.options)||q.options.length<2) return q;
    const sc = q.seenCount||0; if (sc===0) return q;
    const shift = sc % q.options.length;
    return {...q, options:[...q.options.slice(shift),...q.options.slice(0,shift)]};
  },
};

// ─── INIT STORAGE ────────────────────────────────────────────────────────────
function initStorage() {
  let qbase = Store.get(SK.qbase,[]);
  const seenIds = new Set();
  qbase = qbase.filter(q => { if (seenIds.has(q.id)) return false; seenIds.add(q.id); return true; });
  qbase = qbase.filter(q => q && q.id && q.stem && Array.isArray(q.options) && q.options.length >= 2);
  qbase = qbase.filter(q => !q.score || q.score >= 4);
  const seenMap = Store.get(SK.seenMap,{});
  qbase = qbase.map(q => ({...q, seenCount: seenMap[q.id]||q.seenCount||0}));
  const eligible = qbase.filter(q => (q.seenCount||0) >= 3);
  if (eligible.length > 0) {
    const parkingLot = Store.get(SK.parkingLot,[]), parkingIds = new Set(parkingLot.map(p=>p.id));
    const aiCache = Store.get(SK.aiCache,[]), qbaseIds = new Set(qbase.map(q=>q.id));
    const replacements = aiCache.filter(q => !qbaseIds.has(q.id) && !parkingIds.has(q.id) && q.passes);
    let repIdx = 0;
    const toRemove = new Set();
    eligible.forEach(eq => {
      if (!parkingIds.has(eq.id)) { parkingLot.push({...eq, parkedAt:Date.now(), seenCount:eq.seenCount, variants:[]}); parkingIds.add(eq.id); }
      toRemove.add(eq.id);
      if (repIdx < replacements.length) { const rep={...replacements[repIdx],seenCount:0}; qbase.push(rep); qbaseIds.add(rep.id); repIdx++; }
    });
    qbase = qbase.filter(q => !toRemove.has(q.id));
    Store.set(SK.parkingLot, parkingLot);
  }
  Store.set(SK.qbase, qbase.slice(-600));
}

// ─── AUTO-HEAL ENGINE v4.3 ───────────────────────────────────────────────────
// Centralised self-repair logic. Called silently on startup OR manually from
// any Admin UI. Each method returns { removed|fixed|promoted, msg }
const AutoHeal = {
  RATE_DEFAULTS: { rpm:10, tpm:250000, batchSize:5, intervalMs:6000 },

  healDuplicates() {
    const q = Store.get(SK.qbase, []);
    const seen = new Set(); let removed = 0;
    const clean = q.filter(x => { if (seen.has(x.id)) { removed++; return false; } seen.add(x.id); return true; });
    if (removed > 0) Store.set(SK.qbase, clean);
    return { removed, msg: removed > 0 ? `✓ Removed ${removed} duplicate question(s)` : null };
  },

  healCorrupt() {
    const q = Store.get(SK.qbase, []);
    const clean = q.filter(x => x.stem && x.stem.trim().length > 10 && Array.isArray(x.options) && x.options.length >= 2 && Array.isArray(x.correct) && x.correct.length > 0);
    const removed = q.length - clean.length;
    if (removed > 0) Store.set(SK.qbase, clean);
    return { removed, msg: removed > 0 ? `✓ Removed ${removed} corrupt question(s)` : null };
  },

  healOrphans() {
    const q = Store.get(SK.qbase, []);
    const valid = new Set(CERT_CONFIG.domains.map(d => d.id));
    const fallback = CERT_CONFIG.domains[0].id;
    let fixed = 0;
    const clean = q.map(x => { if (!valid.has(x.domainId)) { fixed++; return { ...x, domainId: fallback }; } return x; });
    if (fixed > 0) Store.set(SK.qbase, clean);
    return { fixed, msg: fixed > 0 ? `✓ Reassigned ${fixed} orphan question(s) → ${fallback}` : null };
  },

  healLowScore(threshold = 3) {
    const q = Store.get(SK.qbase, []);
    const clean = q.filter(x => typeof x.score !== "number" || x.score >= threshold);
    const removed = q.length - clean.length;
    if (removed > 0) Store.set(SK.qbase, clean);
    return { removed, msg: removed > 0 ? `✓ Removed ${removed} junk-score question(s) (score < ${threshold})` : null };
  },

  healRateConfig() {
    try {
      const saved = localStorage.getItem(SK.rateConfig);
      if (saved) {
        const p = JSON.parse(saved);
        if (!(parseInt(p.rpm) > 0 && parseInt(p.tpm) > 0 && parseInt(p.batchSize) > 0 && parseInt(p.intervalMs) > 0)) {
          Store.set(SK.rateConfig, this.RATE_DEFAULTS);
          return { fixed: true, msg: "✓ Reset corrupt rate config to defaults" };
        }
      }
    } catch {
      Store.set(SK.rateConfig, this.RATE_DEFAULTS);
      return { fixed: true, msg: "✓ Reset unparseable rate config to defaults" };
    }
    return { fixed: false, msg: null };
  },

  healEventLog() {
    const events = Store.get(SK.events, []);
    const errCount = events.filter(e => e.type === "ERROR").length;
    if (errCount === 0) return { fixed: false, msg: null };
    Store.set(SK.events, events.filter(e => e.type !== "ERROR"));
    return { fixed: true, msg: `✓ Cleared ${errCount} error event(s) from log` };
  },

  promoteCache() {
    const cache = QBase.getAiCache();
    const passing = cache.filter(q => q.passes);
    if (passing.length === 0) return { promoted: 0, msg: null };
    QBase.add(passing);
    Store.set(SK.aiCache, cache.filter(q => !q.passes));
    return { promoted: passing.length, msg: `✓ Promoted ${passing.length} cache question(s) → qBase` };
  },

  // Run all heals — returns { anyFixed, log[], totalFixed }
  healAll(opts = {}) {
    const log = [];
    let totalFixed = 0;
    const d = this.healDuplicates(); if (d.msg) { log.push(d.msg); totalFixed += d.removed||0; }
    const c = this.healCorrupt();    if (c.msg) { log.push(c.msg); totalFixed += c.removed||0; }
    const o = this.healOrphans();    if (o.msg) { log.push(o.msg); totalFixed += o.fixed||0; }
    const l = this.healLowScore();   if (l.msg) { log.push(l.msg); totalFixed += l.removed||0; }
    const r = this.healRateConfig(); if (r.msg) { log.push(r.msg); totalFixed += 1; }
    if (!opts.skipPromote) { const p = this.promoteCache(); if (p.msg) { log.push(p.msg); totalFixed += p.promoted||0; } }
    if (log.length === 0) log.push("✅ Nothing to heal — qBase is clean.");
    else log.push(`── Total: ${totalFixed} item(s) healed`);
    return { anyFixed: log.length > 1 || !log[0].startsWith("✅"), log, totalFixed };
  },

  // Silent read-only scan — returns issue count (for startup badge)
  quickScan() {
    const q = Store.get(SK.qbase, []);
    const ids = q.map(x => x.id);
    const dupes = ids.length - new Set(ids).size;
    const corrupt = q.filter(x => !x.stem || !Array.isArray(x.options) || x.options.length < 2 || !Array.isArray(x.correct) || x.correct.length === 0).length;
    const valid = new Set(CERT_CONFIG.domains.map(d => d.id));
    const orphans = q.filter(x => !valid.has(x.domainId)).length;
    const lowScore = q.filter(x => typeof x.score === "number" && x.score < 3).length;
    return dupes + corrupt + orphans + lowScore;
  },
};

// ─── RATE CONFIG ──────────────────────────────────────────────────────────────
const estimateTokens = (text) => Math.ceil((text||"").length/4);
function calcBatchSize(rpm, tpm) { return Math.max(1, Math.min(Math.floor(rpm), Math.floor(tpm/1800), 4)); }

// ─── JSON EXTRACTION ─────────────────────────────────────────────────────────
function extractJSON(raw) {
  try { return JSON.parse(raw); } catch {}
  let cleaned = raw.replace(/```json\s*/gi,"").replace(/```\s*/g,"").trim();
  try { return JSON.parse(cleaned); } catch {}
  const arrMatch = cleaned.match(/(\[[\s\S]*\])/); if (arrMatch) { try { return JSON.parse(arrMatch[1]); } catch {} }
  const lastObj = cleaned.lastIndexOf("},"); if (lastObj>0) { try { return JSON.parse(cleaned.slice(0,lastObj+1).replace(/^\s*\[?\s*/,"[") + "\n]"); } catch {} }
  const objMatch = cleaned.match(/(\{[\s\S]*\})/); if (objMatch) { try { return [JSON.parse(objMatch[1])]; } catch {} }
  throw Object.assign(new Error("JSON_PARSE_FAILED"), { rawSnippet: raw.slice(0,400) });
}

// ─── SANITISE QUESTION ───────────────────────────────────────────────────────
function sanitiseQuestion(rawQ, idx) {
  if (!rawQ||typeof rawQ!=="object") return null;
  try {
    const q = {...rawQ};
    const baseId = (typeof q.id==="string"&&q.id.trim()) ? q.id.trim() : "q";
    q.id = `${baseId}_${Date.now()}_${idx}_${Math.random().toString(36).slice(2,7)}`;
    q.type = ["mcq","multi"].includes(q.type) ? q.type : "mcq";
    q.domainId = CERT_CONFIG.domains.map(d=>d.id).includes(q.domainId) ? q.domainId : CERT_CONFIG.domains[idx%CERT_CONFIG.domains.length].id;
    q.stem = (typeof q.stem==="string") ? q.stem.trim() : "";
    q.explanation = (typeof q.explanation==="string") ? q.explanation.trim() : "";
    if (!Array.isArray(q.options)) q.options = [];
    q.options = q.options.map((o,oi)=>({id:(typeof o?.id==="string"&&o.id)?o.id:String.fromCharCode(97+oi),text:(typeof o?.text==="string")?o.text.trim():""})).filter(o=>o.text.length>0);
    if (!Array.isArray(q.correct)) q.correct = [];
    const optIds = new Set(q.options.map(o=>o.id));
    q.correct = q.correct.filter(c=>optIds.has(c));
    if (q.correct.length===0&&q.options.length>0) q.correct=[q.options[0].id];
    q.bloomLevel = (typeof q.bloomLevel==="number") ? q.bloomLevel : 3;
    q.topic = (typeof q.topic==="string") ? q.topic : "";
    return q;
  } catch { return null; }
}

// ─── CERTIVERSE / PROOFPOINT QUESTION VALIDATOR ──────────────────────────────
// Validates AI-generated questions against Proofpoint Certiverse exam standards.
// Returns { pass: bool, score: 0-10, violations: string[], warnings: string[] }
//
// Certiverse / Proofpoint exam engine rules enforced:
//  P1  — Stem must be scenario-based (≥40 words) presenting a real admin situation
//  P2  — Stem must end with a clear action question (What/Which/How/You need to…)
//  P3  — Exactly 4 options (A–D) for MCQ; multi-select clearly states "Select ALL that apply"
//  P4  — One unambiguous correct answer for MCQ; 2-3 for multi-select
//  P5  — No option begins with "All of the above" / "None of the above"
//  P6  — Options are parallel in length/structure — no outlier giveaway
//  P7  — Correct answer is not always option A (positional bias check within a batch)
//  P8  — No invented Proofpoint product names (real documented products only)
//  P9  — Explanation references the correct answer AND addresses each distractor
//  P10 — Bloom level must be ≥3 (Apply) — no pure recall (Bloom 1-2)

const PEARSONVUE_RULES = {
  P1: "Stem must be scenario-based (≥40 words with a real enterprise situation)",
  P2: "Stem must end with an actionable question (What should you do?/Which action…/How should you configure…)",
  P3: "MCQ requires exactly 4 options; multi-select must state 'Select ALL that apply'",
  P4: "MCQ must have exactly 1 correct answer; multi-select 2–3",
  P5: "Options must not use 'All of the above' or 'None of the above'",
  P6: "Options must be parallel — no extreme length outlier giving away correct answer",
  P7: "Correct answer positional bias — avoid always landing on option A",
  P8: "No invented Proofpoint product names (must use real documented Proofpoint features)",
  P9: "Explanation must reference correct answer AND address at least 2 distractors",
  P10: "Bloom level must be ≥3 (Apply/Analyze/Evaluate) — no pure recall questions",
};

// Known-bad invented terms that AI sometimes hallucinates for Proofpoint
const HALLUCINATED_TERMS = [
  "proofpoint advanced threat shield", "proofpoint guardian engine", "proofpoint zero-day vault",
  "tap premium", "threat response pro", "proofpoint endpoint guardian",
  "email defense engine", "proofpoint cortex", "proofpoint neural filter",
  "advanced quarantine manager", "proofpoint deep inspect",
];

function validateCertiverse(q) {
  const violations = [];
  const warnings = [];

  // P1 — Scenario-based stem
  const stemWords = (q.stem || "").split(/\s+/).filter(Boolean).length;
  if (stemWords < 40) violations.push(`P1: Stem too short (${stemWords} words, need ≥40) — add enterprise scenario context`);

  // P2 — Actionable question at end of stem
  const stemTrimmed = (q.stem || "").trim();
  const actionKeywords = /\b(what|which|how|you need to|select|choose|identify|configure|recommend)\b/i;
  const endsWithQuestion = stemTrimmed.endsWith("?");
  if (!actionKeywords.test(stemTrimmed) && !endsWithQuestion) {
    violations.push("P2: Stem lacks a clear actionable question — add 'What should you do?' or similar");
  }

  // P3 — Option count
  const opts = Array.isArray(q.options) ? q.options : [];
  if (q.type === "mcq" && opts.length !== 4) {
    violations.push(`P3: MCQ must have exactly 4 options (found ${opts.length})`);
  }
  if (q.type === "multi") {
    if (opts.length < 4 || opts.length > 6) warnings.push(`P3: Multi-select option count unusual (${opts.length})`);
    if (!/select all that apply/i.test(q.stem || "")) {
      violations.push("P3: Multi-select stem must include 'Select ALL that apply'");
    }
  }

  // P4 — Correct answer count
  const correct = Array.isArray(q.correct) ? q.correct : [];
  if (q.type === "mcq" && correct.length !== 1) {
    violations.push(`P4: MCQ must have exactly 1 correct answer (found ${correct.length})`);
  }
  if (q.type === "multi" && (correct.length < 2 || correct.length > 3)) {
    violations.push(`P4: Multi-select must have 2–3 correct answers (found ${correct.length})`);
  }

  // P5 — No "all/none of the above"
  for (const o of opts) {
    const t = (o.text || "").toLowerCase();
    if (/all of the above|none of the above/.test(t)) {
      violations.push(`P5: Option '${o.id}' uses forbidden pattern (All/None of the above)`);
    }
  }

  // P6 — Option length outlier check (correct option shouldn't be >2× avg length)
  if (opts.length >= 3) {
    const lengths = opts.map(o => (o.text || "").length);
    const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    for (const o of opts) {
      const len = (o.text || "").length;
      if (len > avg * 2.5 && len > 80) {
        warnings.push(`P6: Option '${o.id}' is unusually long (${len} chars vs avg ${Math.round(avg)}) — may reveal correct answer`);
      }
    }
  }

  // P7 — Positional bias (soft warning, tracked across batch by caller)
  if (correct[0] === "a") {
    warnings.push("P7: Correct answer is option A — check for positional bias across batch");
  }

  // P8 — Hallucinated terms
  const fullText = `${q.stem} ${opts.map(o => o.text).join(" ")} ${q.explanation || ""}`.toLowerCase();
  for (const bad of HALLUCINATED_TERMS) {
    if (fullText.includes(bad)) {
      violations.push(`P8: Invented/non-existent Proofpoint product name detected: "${bad}"`);
    }
  }

  // P9 — Explanation quality
  const exp = (q.explanation || "").toLowerCase();
  const correctOptText = (opts.find(o => o.id === correct[0])?.text || "").toLowerCase().slice(0, 30);
  const distractorRefs = opts.filter(o => !correct.includes(o.id)).filter(o => exp.includes(o.id + " ") || exp.includes("option " + o.id)).length;
  if (exp.length < 80) violations.push("P9: Explanation too brief — must explain correct answer AND address distractors");
  else if (distractorRefs < 1) warnings.push("P9: Explanation doesn't explicitly address distractors (Option B/C/D fails because…)");

  // P10 — Bloom level
  const bloom = q.bloomLevel || 0;
  if (bloom < 3) violations.push(`P10: Bloom level ${bloom} is recall-only (need ≥3 Apply/Analyze)`);

  const score = Math.max(0, 10 - violations.length * 2 - Math.floor(warnings.length * 0.5));
  const pass = violations.length === 0 && score >= 6;

  return { pass, score: Math.min(10, score), violations, warnings };
}

// Analyse a batch of validation results → return failure patterns for prompt adaptation
function analyseFailurePatterns(validationResults) {
  const allViolations = validationResults.flatMap(r => r.violations);
  const counts = {};
  allViolations.forEach(v => {
    const code = v.slice(0, 2); // "P1", "P2", etc.
    counts[code] = (counts[code] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([code, n]) => ({ code, n, rule: PEARSONVUE_RULES[code] || code }));
}

// Build the reinforcement addendum for the prompt based on observed failure patterns
function buildRetryReinforcement(failurePatterns, attempt) {
  if (!failurePatterns || failurePatterns.length === 0) return "";
  const top = failurePatterns.slice(0, 4);
  const lines = top.map(f => `• [${f.code}] VIOLATION (×${f.n}): ${f.rule}`);
  return `

CRITICAL CORRECTION — ATTEMPT ${attempt} — FIX THESE VIOLATIONS BEFORE RESPONDING:
The previous response failed Certiverse / Proofpoint exam engine validation. Violations found:
${lines.join("\n")}

You MUST fix all violations above. The output will be re-validated automatically.`;
}

// ─── GEMINI API ───────────────────────────────────────────────────────────────
async function geminiGenerateRaw(prompt, model, apiKey) {
  const url = GEMINI_ENDPOINT(model, apiKey);
  const response = await fetch(url, {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ contents:[{parts:[{text:prompt}]}], generationConfig:{maxOutputTokens:8192,temperature:0.7} }),
  });
  if (!response.ok) {
    let msg=""; try { const e=await response.json(); msg=e?.error?.message||""; } catch {}
    if (response.status===429) throttleKey(apiKey);
    throw Object.assign(new Error(`Gemini HTTP ${response.status}${msg?": "+msg:""}`), {phase:"http",status:response.status});
  }
  const data = await response.json();
  const rawText = (data.candidates||[]).flatMap(c=>(c.content?.parts||[]).map(p=>p.text||"")).join("").trim();
  if (!rawText) throw Object.assign(new Error("Gemini empty response"), {phase:"empty_response"});
  return rawText;
}

// ─── CLAUDE BUILT-IN API (Artifact — no user key required) ───────────────────
// Model fallback order: try configured model first, auto-retry with known-good alias on 404
const CLAUDE_MODEL_FALLBACKS = [KEY_B_MODEL, "claude-sonnet-4-6", "claude-3-5-sonnet-20241022"];

async function claudeGenerateRaw(prompt) {
  let lastError;
  for (const model of CLAUDE_MODEL_FALLBACKS) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          max_tokens: 8192,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (response.status === 404) {
        // Model not found in proxy — try next fallback
        lastError = Object.assign(new Error(`Claude model not found: ${model}`), { phase: "http", status: 404 });
        continue;
      }
      if (!response.ok) {
        let msg = ""; try { const e = await response.json(); msg = e?.error?.message || ""; } catch {}
        throw Object.assign(new Error(`Claude HTTP ${response.status}${msg ? ": " + msg : ""}`), { phase: "http", status: response.status });
      }
      const data = await response.json();
      const rawText = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
      if (!rawText) throw Object.assign(new Error("Claude empty response"), { phase: "empty_response" });
      return rawText;
    } catch(e) {
      if (e.status === 404) { lastError = e; continue; } // try next model
      throw e; // non-404 errors are real failures
    }
  }
  throw lastError || Object.assign(new Error("Claude: all model fallbacks exhausted"), { phase: "no_model" });
}

async function aiGenerate(prompt) {
  const keys = getActiveKeys();
  const isPrimA = keys.primaryKey !== "b";
  if (!isPrimA) {
    // Key B selected → Built-in Claude Sonnet (no user key needed)
    return claudeGenerateRaw(prompt);
  }
  const primaryKey = keys.keyA;
  if (!primaryKey) {
    // No Gemini key configured → fall back to built-in Claude
    return claudeGenerateRaw(prompt);
  }
  // ── SECONDARY PROMOTE ──────────────────────────────────────────────────────
  // If Gemini key is throttled (429 / rate-limited), silently promote to
  // Claude built-in instead of throwing — zero interruption to the user.
  if (isKeyThrottled(primaryKey)) {
    console.warn("[ThreatPrep] Gemini key throttled — promoting to Claude built-in (secondary).");
    return claudeGenerateRaw(prompt);
  }
  // Primary path: Gemini
  try {
    return await geminiGenerateRaw(prompt, KEY_A_MODEL, primaryKey);
  } catch (e) {
    // On 429 / throttle from Gemini → throttle the key and promote to Claude
    if (e.status === 429) {
      throttleKey(primaryKey);
      console.warn("[ThreatPrep] Gemini 429 — promoting to Claude built-in (secondary).");
      return claudeGenerateRaw(prompt);
    }
    throw e; // all other errors propagate normally
  }
}

// ─── GENERATE QUESTIONS (v4.4 — Certiverse validated, retry + quarantine) ────
//
// Flow per batch:
//   Attempt 0  → base prompt → validate all Qs with validateCertiverse()
//   Retry 1    → prompt + failure reinforcement → re-validate
//   Retry 2    → prompt + stronger reinforcement → re-validate
//   Quarantine → questions that still fail after retry 2 are stored separately
//
// Adaptive: failure patterns from each run feed back into next prompt so retries
// trend towards zero over time as the prompt self-corrects.
//
// Returns { results, quarantined, validationLog, callDurationMs, promptTokens, responseTokens }
//   results     — questions that PASSED validation (ready to add to qBase/cache)
//   quarantined — questions that failed after all retries (for admin review)
//   validationLog — per-question validation detail for fetch log display

const MAX_RETRIES = 2; // Attempt 0 + Retry 1 + Retry 2

function buildBasePrompt({ domainList, count, typeInstruction }) {
  return `You are a senior Proofpoint certification exam author writing psychometrically valid questions for the ${CERT_CONFIG.name} (TPAD01) exam.
This content will be delivered on the Certiverse exam platform — all questions MUST strictly comply with professional item-writing standards.

Generate ${count} exam questions covering these domains:
${domainList}

CERTIVERSE / PROOFPOINT ITEM-WRITING STANDARDS (non-negotiable):
1. SCENARIO STEM: Every stem must be ≥40 words describing a real enterprise email security situation. Include org name, role, and specific Proofpoint product context (e.g., "Acme Corp's messaging administrator is configuring the Proofpoint Protection Server…").
2. ACTIONABLE QUESTION: Stem must end with a clear question — "What should you do?", "Which action meets the requirement?", "How should you configure this?", etc.
3. FOUR OPTIONS (A–D): Exactly 4 options per MCQ. Never use "All of the above" or "None of the above".
4. SINGLE CORRECT ANSWER (MCQ): Exactly one unambiguously correct option. The other three must be plausible but clearly wrong based on scenario facts.
5. MULTI-SELECT: If type is "multi", stem MUST say "Select ALL that apply." and have exactly 2–3 correct answers.
6. PARALLEL OPTIONS: All 4 options must be similar in length and grammatical structure. The correct answer must NOT be the longest option.
7. BLOOM L3-L4 ONLY: Questions must require Apply or Analyze cognitive level. No pure recall ("What is spam?").
8. REAL PROOFPOINT TERMINOLOGY: Use ONLY real, documented Proofpoint features. Correct product names: "Protection Server", "TAP Dashboard", "Threat Response Auto-Pull (TRAP)", "CLEAR", "Smart Search", "Email Warning Tags", "PoD (Proofpoint on Demand)". Do NOT invent product names.
9. EXPLANATION QUALITY: "Correct because [specific technical reason]. Option B fails because [reason]. Option C fails because [reason]. Option D fails because [reason]." — min 100 words.
10. CORRECT ANSWER DISTRIBUTION: Do NOT place the correct answer in option A more than once across the batch. Distribute across A, B, C, D.

${typeInstruction}

CRITICAL OUTPUT: Return ONLY a raw JSON array. No markdown. No backticks. Start with [ end with ].

Structure:
[{
  "id": "unique_string",
  "domainId": "${CERT_CONFIG.domains.map(d=>d.id).join("|")}",
  "type": "mcq|multi",
  "stem": "Full scenario-based question stem (≥40 words, ends with action question)",
  "options": [{"id":"a","text":"..."},{"id":"b","text":"..."},{"id":"c","text":"..."},{"id":"d","text":"..."}],
  "correct": ["b"],
  "explanation": "Correct because [specific reason]. Option a fails because [reason]. Option c fails because [reason]. Option d fails because [reason].",
  "bloomLevel": 3,
  "topic": "brief topic tag"
}]`;
}

async function generateQuestions({ domainIds, count, questionTypes }) {
  const callStart = Date.now();
  const domains = CERT_CONFIG.domains.filter(d => domainIds.includes(d.id));
  const domainList = domains.map(d => `- ${d.name} (${d.weight}%)`).join("\n");
  const typeInstruction = questionTypes.includes("multi")
    ? `TYPE MIX: ~80% MCQ (single correct answer, "correct" array has exactly 1 element) and ~20% multi-select (2–3 correct answers, "Select ALL that apply" in stem, "correct" array has 2–3 elements).`
    : `TYPE: All MCQ — single correct answer only. "correct" array must always have exactly 1 element.`;

  let passedQuestions = [];
  let quarantinedQuestions = [];
  const validationLog = [];
  let totalPromptTokens = 0, totalResponseTokens = 0;
  let lastFailurePatterns = null;
  let attemptsNeeded = 0;

  // Track correct-answer positional bias across the batch
  let positionACount = 0;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    // Build prompt — base on attempt 0, add reinforcement on retries
    const basePrompt = buildBasePrompt({ domainList, count, typeInstruction });
    const reinforcement = attempt > 0
      ? buildRetryReinforcement(lastFailurePatterns, attempt)
      : "";
    const prompt = basePrompt + reinforcement;

    let rawText;
    try {
      rawText = await aiGenerate(prompt);
    } catch(e) {
      throw Object.assign(new Error(`AI generate failed on attempt ${attempt}: ${e.message}`), { phase: e.phase || "ai_generate" });
    }
    totalPromptTokens += estimateTokens(prompt);
    totalResponseTokens += estimateTokens(rawText);
    attemptsNeeded = attempt + 1;

    let raw;
    try { raw = extractJSON(rawText); } catch(e) {
      // On final attempt — give up on this batch
      if (attempt === MAX_RETRIES) {
        throw Object.assign(new Error(`JSON parse failed after ${MAX_RETRIES + 1} attempts: ${e.rawSnippet || rawText.slice(0, 200)}`), { phase: "json_parse" });
      }
      // Log and retry
      validationLog.push({ attempt, status: "json_fail", msg: `JSON parse error — retrying (attempt ${attempt + 1}/${MAX_RETRIES + 1})` });
      lastFailurePatterns = [{ code: "JSON", n: 1, rule: "Response was not valid JSON — must return ONLY a raw JSON array" }];
      continue;
    }
    if (!Array.isArray(raw)) raw = raw && typeof raw === "object" ? [raw] : [];

    const sanitised = raw.map((q, i) => sanitiseQuestion(q, i)).filter(Boolean);

    // Run Certiverse / Proofpoint validation on each question
    const thisPassedQs = [];
    const thisFailedQs = [];
    const thisViolations = [];

    for (const q of sanitised) {
      // Adjust positional bias check dynamically
      const validation = validateCertiverse(q);

      // P7 — batch-level positional bias check
      if (q.correct[0] === "a") positionACount++;
      const positionBias = passedQuestions.length + thisPassedQs.length > 0 &&
        positionACount / (passedQuestions.length + thisPassedQs.length + 1) > 0.5;
      if (positionBias && q.correct[0] === "a") {
        validation.warnings.push("P7: >50% correct answers in batch are option A — positional bias detected");
      }

      validationLog.push({
        attempt,
        qId: q.id,
        type: q.type,
        domainId: q.domainId,
        pass: validation.pass,
        score: validation.score,
        violations: validation.violations,
        warnings: validation.warnings,
      });

      if (validation.pass) {
        thisPassedQs.push({ ...q, passes: true, pvScore: validation.score, generatedAt: Date.now() });
      } else {
        thisFailedQs.push({ ...q, pvViolations: validation.violations, pvScore: validation.score, generatedAt: Date.now() });
        thisViolations.push(validation);
      }
    }

    passedQuestions = [...passedQuestions, ...thisPassedQs];

    if (thisFailedQs.length === 0) {
      // All questions passed — done
      break;
    }

    if (attempt < MAX_RETRIES) {
      // Analyse failures to craft the retry prompt
      lastFailurePatterns = analyseFailurePatterns(thisViolations);
      validationLog.push({
        attempt,
        status: "retry",
        msg: `${thisFailedQs.length} Qs failed validation → Retry ${attempt + 1}/${MAX_RETRIES}. Top violations: ${lastFailurePatterns.slice(0, 3).map(f => f.code).join(", ")}`,
      });
    } else {
      // Final attempt — quarantine remaining failures
      quarantinedQuestions = [...quarantinedQuestions, ...thisFailedQs];
      validationLog.push({
        attempt,
        status: "quarantine",
        msg: `${thisFailedQs.length} Qs quarantined after ${MAX_RETRIES + 1} attempts. Violations: ${thisViolations.flatMap(v => v.violations).slice(0, 5).join(" | ")}`,
      });
    }
  }

  const callDurationMs = Date.now() - callStart;

  // Store quarantined questions for admin review
  if (quarantinedQuestions.length > 0) {
    try {
      const existing = JSON.parse(localStorage.getItem("tpad01_pv_quarantine") || "[]");
      const merged = [...existing, ...quarantinedQuestions].slice(-200);
      localStorage.setItem("tpad01_pv_quarantine", JSON.stringify(merged));
    } catch {}
  }

  return {
    results: passedQuestions,
    quarantined: quarantinedQuestions,
    validationLog,
    attemptsNeeded,
    callDurationMs,
    promptTokens: totalPromptTokens,
    responseTokens: totalResponseTokens,
  };
}

// ─── DIFFICULTY ───────────────────────────────────────────────────────────────
const DIFFICULTY_DIST = {easy:0.25, medium:0.50, hard:0.25};
function getQDifficulty(q) { const bl=q.bloomLevel||3; if (bl<=3) return "easy"; if (bl<=4) return "medium"; return "hard"; }
function getDifficultyInfo(bloomLevel) {
  const bl = bloomLevel||3;
  if (bl<=3) return {tag:"EASY",color:"var(--success)",bg:"var(--success-bg)",bd:"var(--success-bd)"};
  if (bl<=4) return {tag:"MED",color:"var(--warning)",bg:"var(--warning-bg)",bd:"var(--warning-bd)"};
  return {tag:"HARD",color:"var(--error)",bg:"var(--error-bg)",bd:"var(--error-bd)"};
}
function applyDifficultyDist(pool, count) {
  if (pool.length <= count) return pool;
  const byDiff = {easy:[],medium:[],hard:[]};
  pool.forEach(q => byDiff[getQDifficulty(q)].push(q));
  const result = [];
  for (const [level,ratio] of Object.entries(DIFFICULTY_DIST)) {
    const need = Math.round(count*ratio), avail = [...byDiff[level]].sort(()=>Math.random()-0.5);
    result.push(...avail.slice(0,need));
  }
  if (result.length < count) {
    const resIds = new Set(result.map(q=>q.id));
    result.push(...pool.filter(q=>!resIds.has(q.id)).sort(()=>Math.random()-0.5).slice(0,count-result.length));
  }
  return result.slice(0,count).sort(()=>Math.random()-0.5);
}

// ─── QBASE ────────────────────────────────────────────────────────────────────
const QBase = {
  getAll() { return Store.get(SK.qbase,[]); },
  add(questions) {
    const existing = this.getAll(), existingIds = new Set(existing.map(q=>q.id));
    const fresh = questions.filter(q=>!existingIds.has(q.id));
    Store.set(SK.qbase, [...existing,...fresh].slice(-600));
    Store.log({type:"QBASE_ADD",count:fresh.length});
    return fresh.length;
  },
  getParkingLot() { return Store.get(SK.parkingLot,[]); },
  moveToParkingLot(qId) {
    const q = this.getAll().find(x=>x.id===qId); if (!q) return;
    const pl = this.getParkingLot();
    if (!pl.find(x=>x.id===qId)) { pl.push({...q,parkedAt:Date.now(),variants:[]}); Store.set(SK.parkingLot,pl); }
  },
  getAiCache() { return Store.get(SK.aiCache,[]); },
  addToAiCache(questions) {
    const cache = this.getAiCache(), existingIds = new Set(cache.map(q=>q.id));
    const fresh = questions.filter(q=>!existingIds.has(q.id));
    Store.set(SK.aiCache, [...cache,...fresh].slice(-2000));
  },
  selectForSession({ domainIds, count, sessionType, questionType }) {
    const qbase = this.getAll();
    if (sessionType === "exam") {
      const selected = [];
      for (const domain of CERT_CONFIG.domains) {
        const dQs = qbase.filter(q=>q.domainId===domain.id);
        const need = Math.round(count*(domain.weight/100));
        const mcqNeed = Math.round(need*CERT_CONFIG.examQuestionTypes.mcq);
        const multiNeed = need - mcqNeed;
        const picked = [...dQs.filter(q=>q.type==="mcq").sort(()=>Math.random()-0.5).slice(0,mcqNeed), ...dQs.filter(q=>q.type==="multi").sort(()=>Math.random()-0.5).slice(0,multiNeed)];
        if (picked.length < need) { const pickedIds=new Set(picked.map(q=>q.id)); picked.push(...dQs.filter(q=>!pickedIds.has(q.id)).sort(()=>Math.random()-0.5).slice(0,need-picked.length)); }
        selected.push(...picked);
      }
      return applyDifficultyDist(selected.sort(()=>Math.random()-0.5).slice(0,count),count);
    }
    const available = qbase.filter(q => domainIds.includes(q.domainId) && (questionType==="both"||q.type===questionType));
    const pl = this.getParkingLot(), plIds = new Set(pl.map(p=>p.id));
    const duePL = pl.filter(q=>Leitner.isDue(q.id)&&domainIds.includes(q.domainId)&&(questionType==="both"||q.type===questionType)).map(q => {
      const variants = q.variants||[];
      if (variants.length>0) { const ni=((q._variantIdx!==undefined?q._variantIdx:-1)+1)%variants.length; const upd=pl.map(p=>p.id===q.id?{...p,_variantIdx:ni}:p); Store.set(SK.parkingLot,upd); return {...variants[ni],_fromParking:true,_originalId:q.id}; }
      return {...q,_fromParking:true};
    });
    const practicePool = available.filter(q=>!plIds.has(q.id)&&(q.seenCount||0)<3&&LogicA.isEligibleForPractice(q)).map(q=>LogicA.mutateOptions(q));
    return applyDifficultyDist([...duePL,...practicePool.sort(()=>Math.random()-0.5)],count);
  },
};

// ─── SESSION SCORE ────────────────────────────────────────────────────────────
function calcSessionScore(answers, questions) {
  if (!questions||questions.length===0) return {correct:0,total:0,pct:0,breakdown:{}};
  let correct = 0; const breakdown = {};
  for (const q of questions) {
    const ua = answers[q.id]||[];
    const isCorrect = Array.isArray(q.correct) ? q.correct.length===ua.length&&q.correct.every(c=>ua.includes(c)) : ua.includes(q.correct);
    if (isCorrect) correct++;
    const domain = CERT_CONFIG.domains.find(d=>d.id===q.domainId);
    const dName = domain?.name||"Unknown";
    if (!breakdown[dName]) breakdown[dName] = {correct:0,total:0};
    breakdown[dName].total++;
    if (isCorrect) breakdown[dName].correct++;
  }
  return {correct,total:questions.length,pct:Math.round((correct/questions.length)*100),breakdown};
}

// ─── HTML REPORT ──────────────────────────────────────────────────────────────
function generateHTMLReport({questions,answers,sessionType,score}) {
  const {correct,total,pct} = score;
  const passed = pct >= CERT_CONFIG.passingScore;
  const qRows = questions.map((q,i) => {
    const ua = answers[q.id]||[];
    const isCorrect = q.correct.length===ua.length&&q.correct.every(c=>ua.includes(c));
    const domain = CERT_CONFIG.domains.find(d=>d.id===q.domainId)?.name||q.domainId;
    return `<div style="margin-bottom:20px;padding:16px;border:1px solid ${isCorrect?"#22c55e":"#ef4444"};border-radius:8px">
      <div style="font-size:11px;color:#888;margin-bottom:6px">Q${i+1} · ${domain}</div>
      <div style="font-size:13px;font-weight:600;margin-bottom:10px">${q.stem}</div>
      ${q.options.map(o=>{const right=q.correct.includes(o.id),chosen=ua.includes(o.id);return `<div style="padding:6px 10px;margin-bottom:4px;border-radius:4px;background:${right?"#dcfce7":chosen?"#fee2e2":"#f9fafb"};color:${right?"#16a34a":chosen?"#dc2626":"#374151"};font-size:12px">${o.id.toUpperCase()}. ${o.text}${right?" ✓":chosen?" ✗":""}</div>`;}).join("")}
      <div style="margin-top:10px;padding:10px;background:#f3f4f6;border-radius:4px;font-size:12px;color:#374151"><strong>Explanation:</strong> ${q.explanation}</div>
    </div>`;
  }).join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${CERT_CONFIG.id} Report</title></head><body style="font-family:sans-serif;max-width:800px;margin:0 auto;padding:20px">
    <h1 style="color:${passed?"#16a34a":"#dc2626"}">${CERT_CONFIG.id} — ${passed?"PASS":"FAIL"} (${pct}%)</h1>
    <p>${correct} / ${total} correct · Pass: ${CERT_CONFIG.passingScore}%</p>
    ${qRows}
  </body></html>`;
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;border:0;font:inherit;vertical-align:baseline}
  button,input,select,textarea{outline:none;font-family:inherit}
  :root{
    --bg:#0A0A0A;--surface:#121212;--elevated:#18181B;
    --border:#27272A;--border2:#3F3F46;
    --text-pri:#FAFAFA;--text-sec:#A1A1AA;
    --accent:#6366F1;--accent-h:#4F46E5;
    --accent-bg:rgba(99,102,241,0.08);--accent-bd:rgba(99,102,241,0.25);
    --success:#34D399;--success-bg:rgba(52,211,153,0.07);--success-bd:rgba(52,211,153,0.22);
    --error:#F87171;--error-bg:rgba(248,113,113,0.07);--error-bd:rgba(248,113,113,0.22);
    --warning:#FBBF24;--warning-bg:rgba(251,191,36,0.07);--warning-bd:rgba(251,191,36,0.22);
    --font-body:'Geist',system-ui,sans-serif;--font-mono:'Geist Mono','JetBrains Mono',monospace;
    --r:6px;--r-sm:4px;--r-xs:3px;
  }
  html{scroll-behavior:smooth}
  body{background:var(--bg);color:var(--text-pri);font-family:var(--font-body);font-size:13px;line-height:1.5;min-height:100vh;-webkit-font-smoothing:antialiased;text-align:left}
  .app{max-width:520px;margin:0 auto;padding:0 14px;min-height:100vh;text-align:left}
  .header{display:flex;align-items:center;justify-content:space-between;height:44px;margin:0 -14px;padding:0 14px;background:var(--bg);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:40}
  .logo-lockup{display:flex;align-items:center;gap:8px}
  .logo-text{font-size:13px;font-weight:600;color:var(--text-pri);letter-spacing:-0.02em;line-height:1}
  .logo-sub{font-family:var(--font-mono);font-size:9px;color:var(--text-sec);letter-spacing:0.04em;margin-top:2px}
  .cert-badge{border:1px solid var(--border);border-radius:var(--r-xs);padding:2px 7px;font-size:9px;font-weight:500;color:var(--text-sec);font-family:var(--font-mono);letter-spacing:0.06em}
  .header-right{display:flex;align-items:center;gap:6px}
  .cert-banner{border:1px solid var(--accent-bd);border-radius:var(--r);background:var(--accent-bg);padding:12px 14px;display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px}
  .cert-banner-id{font-family:var(--font-mono);font-size:9px;font-weight:700;color:var(--accent);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:3px}
  .cert-banner-name{font-size:13px;font-weight:600;color:var(--text-pri);line-height:1.3}
  .cert-banner-meta{font-size:10px;color:var(--text-sec);font-family:var(--font-mono);margin-top:4px}
  .card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:14px 16px;margin-bottom:12px}
  .section-label{font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-sec);font-family:var(--font-mono);margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;gap:8px}
  .type-tabs{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:0}
  .type-tab{display:flex;flex-direction:column;padding:11px 14px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--elevated);cursor:pointer;text-align:left;font-size:12px;font-weight:600;color:var(--text-sec);transition:all 0.12s;gap:2px}
  .type-tab.active{border-color:var(--accent-bd);background:var(--accent-bg);color:var(--text-pri)}
  .tab-sub{font-size:9px;font-weight:400;color:var(--text-sec);font-family:var(--font-mono)}
  .domain-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
  .domain-pill{border:1px solid var(--border);border-radius:var(--r-sm);padding:9px 11px;cursor:pointer;transition:all 0.12s}
  .domain-pill.active{border-color:var(--accent-bd);background:var(--accent-bg)}
  .d-name{font-size:11px;color:var(--text-sec);line-height:1.35;margin-bottom:3px}
  .domain-pill.active .d-name{color:var(--text-pri)}
  .d-weight{font-size:9px;font-family:var(--font-mono);color:var(--text-sec)}
  .count-chips{display:flex;gap:6px;flex-wrap:wrap}
  .count-chip{padding:6px 14px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--elevated);color:var(--text-sec);cursor:pointer;font-size:12px;font-weight:600;transition:all 0.12s}
  .count-chip.active{border-color:var(--accent-bd);background:var(--accent-bg);color:var(--accent)}
  .start-footer{position:fixed;bottom:0;left:0;right:0;background:linear-gradient(to top,var(--bg) 70%,transparent);padding:12px 0 20px}
  .start-footer-inner{max-width:520px;margin:0 auto;padding:0 14px}
  .btn{display:inline-flex;align-items:center;justify-content:center;padding:0 16px;height:38px;border-radius:var(--r-sm);font-size:12px;font-weight:600;cursor:pointer;border:1px solid transparent;transition:all 0.12s;gap:6px}
  .btn-full{width:100%}
  .btn-lg{height:46px;font-size:13px}
  .btn-sm{height:28px;font-size:11px;padding:0 10px}
  .btn-primary{background:var(--accent);color:#fff;border-color:var(--accent)}
  .btn-primary:hover{background:var(--accent-h);border-color:var(--accent-h)}
  .btn-primary:disabled{opacity:0.4;cursor:not-allowed}
  .btn-ghost{background:transparent;border-color:var(--border);color:var(--text-sec)}
  .btn-ghost:hover{border-color:var(--border2);color:var(--text-pri)}
  .btn-success{background:var(--success-bg);border-color:var(--success-bd);color:var(--success)}
  .btn-danger{background:var(--error-bg);border-color:var(--error-bd);color:var(--error)}
  .question-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:16px;margin-bottom:12px;text-align:left;flex:1;display:flex;flex-direction:column}
  .q-meta{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:12px;text-align:left}
  .q-domain-tag{font-size:9px;padding:2px 8px;border-radius:3px;background:var(--elevated);border:1px solid var(--border);color:var(--text-sec);font-family:var(--font-mono)}
  .q-type-badge{font-size:9px;padding:2px 7px;border-radius:3px;font-weight:700;background:var(--accent-bg);border:1px solid var(--accent-bd);color:var(--accent);font-family:var(--font-mono)}
  .q-diff-badge{font-size:9px;padding:2px 8px;border-radius:3px;font-weight:700;font-family:var(--font-mono)}
  .q-stem{font-size:14px;font-weight:500;color:var(--text-pri);line-height:1.75;margin-bottom:16px;text-align:left}
  .q-multi-hint{font-size:10px;color:var(--accent);font-family:var(--font-mono);margin-bottom:12px;padding:6px 10px;background:var(--accent-bg);border:1px solid var(--accent-bd);border-radius:var(--r-xs);text-align:left}
  .options{display:flex;flex-direction:column;gap:6px;margin-bottom:14px;text-align:left;flex:1}
  .option{display:flex;align-items:flex-start;gap:10px;padding:11px 14px;border:1px solid var(--border);border-radius:var(--r-sm);cursor:pointer;transition:all 0.1s;text-align:left}
  .option:hover:not(.disabled){border-color:var(--border2);background:var(--elevated)}
  .option.selected{border-color:var(--accent-bd);background:var(--accent-bg)}
  .option.correct{border-color:var(--success-bd);background:var(--success-bg)}
  .option.missed{border-color:var(--success-bd);background:var(--success-bg);opacity:0.7}
  .option.incorrect{border-color:var(--error-bd);background:var(--error-bg)}
  .option.disabled{cursor:not-allowed}
  .opt-key{font-family:var(--font-mono);font-weight:800;font-size:12px;color:var(--text-sec);flex-shrink:0;min-width:20px;padding-top:1px}
  .opt-text{flex:1;font-size:13px;color:var(--text-sec);line-height:1.6}
  .option.selected .opt-text,.option.correct .opt-text,.option.incorrect .opt-text{color:var(--text-pri)}
  .explanation{background:var(--elevated);border:1px solid var(--border);border-radius:var(--r-sm);padding:12px 14px;font-size:12px;color:var(--text-sec);line-height:1.75;margin-top:12px}
  .show-answer-panel{border-top:1px solid var(--border);padding-top:12px;margin-top:12px}
  .show-answer-toggle{width:100%;background:none;border:1px solid var(--border);border-radius:var(--r-sm);padding:8px 12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-size:11px;font-weight:600;color:var(--text-sec);font-family:var(--font-mono)}
  .show-answer-body{margin-top:8px;padding:12px;background:var(--elevated);border-radius:var(--r-sm)}
  .progress-track{height:2px;background:var(--border);border-radius:1px;overflow:hidden;margin-bottom:14px}
  .progress-fill{height:100%;background:var(--accent);border-radius:1px;transition:width 0.3s}
  .nav-dot{width:20px;height:20px;border-radius:var(--r-xs);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;font-family:var(--font-mono);border:1px solid var(--border);background:var(--elevated);color:var(--text-sec);cursor:pointer;transition:all 0.1s}
  .nav-dot.active{border-color:var(--accent);background:var(--accent);color:#fff}
  .nav-dot.answered{border-color:var(--border2);background:var(--border);color:var(--text-pri)}
  .score-ring{width:80px;height:80px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;border:3px solid transparent}
  .score-ring.pass{border-color:var(--success);background:var(--success-bg)}
  .score-ring.fail{border-color:var(--error);background:var(--error-bg)}
  .score-pct{font-size:18px;font-weight:800;font-family:var(--font-mono);line-height:1}
  .score-sub{font-size:9px;font-weight:700;font-family:var(--font-mono);letter-spacing:0.08em;margin-top:2px}
  .score-ring.pass .score-pct,.score-ring.pass .score-sub{color:var(--success)}
  .score-ring.fail .score-pct,.score-ring.fail .score-sub{color:var(--error)}
  .breakdown-row{display:flex;align-items:center;gap:8px;margin-bottom:6px}
  .breakdown-name{font-size:11px;color:var(--text-sec);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .breakdown-bar{width:60px;height:3px;background:var(--border);border-radius:2px;overflow:hidden;flex-shrink:0}
  .breakdown-fill{height:100%;border-radius:2px;transition:width 0.3s}
  .breakdown-stat{font-size:10px;font-family:var(--font-mono);font-weight:600;flex-shrink:0;min-width:28px;text-align:right}
  .toast{position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:var(--elevated);border:1px solid var(--border);border-radius:var(--r);padding:8px 16px;font-size:12px;font-weight:600;font-family:var(--font-mono);z-index:200;pointer-events:none;animation:fadeInUp 0.2s ease}
  @keyframes fadeInUp{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
  .modal-overlay{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:16px}
  .modal{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);width:100%;max-width:460px;max-height:90vh;overflow-y:auto;padding:18px 16px}
  .modal-title{font-size:15px;font-weight:700;color:var(--text-pri)}
  .modal-sub{font-size:11px;color:var(--text-sec);margin-top:2px}
  .modal-close{width:28px;height:28px;border-radius:5px;display:flex;align-items:center;justify-content:center;background:var(--elevated);border:1px solid var(--border);color:var(--text-sec);cursor:pointer;font-size:14px;font-weight:700}
  .admin-overlay{position:fixed;inset:0;z-index:200;background:var(--bg);overflow-y:auto;display:flex;flex-direction:column}
  .admin-header{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid var(--border);background:var(--bg);position:sticky;top:0;z-index:10}
  .admin-title{font-size:14px;font-weight:700;color:var(--text-pri)}
  .admin-sub{font-size:10px;color:var(--text-sec);font-family:var(--font-mono)}
  .admin-body{padding:14px;flex:1;max-width:520px;width:100%;margin:0 auto}
  .admin-section{margin-bottom:14px}
  .pill{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:20px;font-size:10px;font-weight:600;font-family:var(--font-mono)}
  @keyframes fetchDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.6)}}
  input[type=text],input[type=password]{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-sm);padding:8px 10px;font-size:12px;color:var(--text-pri);width:100%;font-family:var(--font-mono)}
  input[type=text]:focus,input[type=password]:focus{border-color:var(--accent-bd)}
`;

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function ErrorBanner({ msg, cause, onDismiss }) {
  return (
    <div style={{ background:"var(--error-bg)", border:"1px solid var(--error-bd)", borderRadius:"var(--r-sm)", padding:"10px 14px", marginBottom:12, display:"flex", alignItems:"flex-start", gap:10 }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:12, fontWeight:600, color:"var(--error)", marginBottom:2 }}>{msg}</div>
        {cause && <div style={{ fontSize:10, color:"var(--error)", fontFamily:"var(--font-mono)", opacity:0.7 }}>{cause}</div>}
      </div>
      <button onClick={onDismiss} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--error)", fontSize:14, flexShrink:0 }}>✕</button>
    </div>
  );
}

function ExamInfoModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <div><div className="modal-title">About the Exam</div><div className="modal-sub">{CERT_CONFIG.id} · {CERT_CONFIG.vendor}</div></div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div style={{ background:"var(--elevated)", border:"1px solid var(--accent-bd)", borderRadius:"var(--r-sm)", padding:"12px 14px", marginBottom:14 }}>
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--accent)", fontFamily:"var(--font-mono)", marginBottom:4 }}>{CERT_CONFIG.id}</div>
          <div style={{ fontSize:13, fontWeight:600, color:"var(--text-pri)" }}>{CERT_CONFIG.name}</div>
          <div style={{ fontSize:10, color:"var(--text-sec)", marginTop:4 }}>{CERT_CONFIG.vendor}</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:14 }}>
          {[["Questions",`${CERT_CONFIG.examQuestions}`],["Duration",`${CERT_CONFIG.examDuration} min`],["Passing Score",`${CERT_CONFIG.passingScore}%`],["MCQ / Multi",`${Math.round(CERT_CONFIG.examQuestionTypes.mcq*100)}% / ${Math.round(CERT_CONFIG.examQuestionTypes.multi*100)}%`]].map(([lbl,val]) => (
            <div key={lbl} style={{ background:"var(--elevated)", border:"1px solid var(--border)", borderRadius:"var(--r-sm)", padding:"9px 11px" }}>
              <div style={{ fontSize:8, fontWeight:700, color:"var(--text-sec)", fontFamily:"var(--font-mono)", textTransform:"uppercase", letterSpacing:"0.09em", marginBottom:3 }}>{lbl}</div>
              <div style={{ fontSize:13, fontWeight:700, color:"var(--text-pri)", fontFamily:"var(--font-mono)" }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", color:"var(--text-sec)", fontFamily:"var(--font-mono)", marginBottom:7 }}>Exam Cost</div>
          <div style={{ display:"flex", gap:7 }}>
            <div style={{ flex:1, padding:"10px 12px", background:"var(--elevated)", border:"1px solid var(--border)", borderRadius:"var(--r-sm)", textAlign:"center" }}>
              <div style={{ fontSize:9, fontWeight:600, color:"var(--text-sec)", fontFamily:"var(--font-mono)", textTransform:"uppercase", marginBottom:3 }}>United States</div>
              <div style={{ fontSize:18, fontWeight:800, color:"var(--text-pri)", fontFamily:"var(--font-mono)" }}>${CERT_CONFIG.cost.us}</div>
            </div>
            <div style={{ flex:1, padding:"10px 12px", background:"var(--elevated)", border:"1px solid var(--border)", borderRadius:"var(--r-sm)", textAlign:"center" }}>
              <div style={{ fontSize:9, fontWeight:600, color:"var(--text-sec)", fontFamily:"var(--font-mono)", textTransform:"uppercase", marginBottom:3 }}>India</div>
              <div style={{ fontSize:18, fontWeight:800, color:"var(--text-pri)", fontFamily:"var(--font-mono)" }}>₹{CERT_CONFIG.cost.in.toLocaleString("en-IN")}</div>
            </div>
          </div>
        </div>
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", color:"var(--text-sec)", fontFamily:"var(--font-mono)", marginBottom:7 }}>Overview</div>
          <div style={{ fontSize:12, color:"var(--text-sec)", lineHeight:1.75 }}>{CERT_CONFIG.aboutExam}</div>
        </div>
        <div>
          <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", color:"var(--text-sec)", fontFamily:"var(--font-mono)", marginBottom:7 }}>Exam Domains</div>
          {CERT_CONFIG.domains.map(d => (
            <div key={d.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 10px", background:"var(--elevated)", border:"1px solid var(--border)", borderRadius:"var(--r-sm)", marginBottom:4 }}>
              <div style={{ fontSize:11, color:"var(--text-sec)" }}>{d.name}</div>
              <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                <span style={{ fontSize:9, fontFamily:"var(--font-mono)", fontWeight:700, color:"var(--accent)" }}>{d.weight}%</span>
                <span style={{ fontSize:9, fontFamily:"var(--font-mono)", color:"var(--text-sec)" }}>{d.examQCount}Q</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProgressTracker() {
  const events = Store.get(SK.events,[]), sessionCount = Store.get(SK.sessionCount,0), qbase = QBase.getAll();
  const answerEvents = events.filter(e=>e.type==="ANSWER");
  const totalAnswered = answerEvents.length, totalCorrect = answerEvents.filter(e=>e.correct).length;
  const accuracy = totalAnswered>0 ? Math.round((totalCorrect/totalAnswered)*100) : null;
  const byDomain = {};
  answerEvents.forEach(e => { if (!e.domainId) return; if (!byDomain[e.domainId]) byDomain[e.domainId]={correct:0,total:0}; byDomain[e.domainId].total++; if (e.correct) byDomain[e.domainId].correct++; });
  const seenAtLeastOnce = qbase.filter(q=>(q.seenCount||0)>=1).length;
  const coveragePct = qbase.length>0 ? Math.round((seenAtLeastOnce/qbase.length)*100) : 0;
  const [open, setOpen] = useState(false);
  if (totalAnswered===0) return null;
  return (
    <div style={{ border:"1px solid var(--border)", borderRadius:"var(--r-sm)", overflow:"hidden", marginBottom:12 }}>
      <button onClick={()=>setOpen(v=>!v)} style={{ width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:"var(--surface)",border:"none",cursor:"pointer",textAlign:"left" }}>
        <span style={{ fontSize:11,fontWeight:700,color:"var(--text-pri)" }}>📊 Your Progress</span>
        <span style={{ fontSize:9,color:"var(--text-sec)",fontFamily:"var(--font-mono)" }}>{sessionCount} session{sessionCount!==1?"s":""} · {accuracy!==null?`${accuracy}% accuracy`:"—"} {open?"▾":"▸"}</span>
      </button>
      {open && (
        <div style={{ padding:"12px 14px",background:"var(--bg)",borderTop:"1px solid var(--border)" }}>
          <div style={{ display:"flex",gap:6,marginBottom:12 }}>
            {[[sessionCount,"Sessions"],[totalAnswered,"Answered"],[accuracy!==null?`${accuracy}%`:"—","Accuracy",accuracy>=75?"var(--success)":accuracy>=50?"var(--warning)":"var(--error)"],[`${coveragePct}%`,"Coverage"]].map(([v,l,c],i)=>(
              <div key={i} style={{ flex:1,textAlign:"center",padding:"9px 6px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)" }}>
                <div style={{ fontSize:16,fontWeight:800,fontFamily:"var(--font-mono)",color:c||"var(--text-pri)" }}>{v}</div>
                <div style={{ fontSize:8,color:"var(--text-sec)",textTransform:"uppercase",letterSpacing:"0.07em",marginTop:2,fontFamily:"var(--font-mono)" }}>{l}</div>
              </div>
            ))}
          </div>
          {Object.keys(byDomain).length>0 && CERT_CONFIG.domains.filter(d=>byDomain[d.id]).map(d => {
            const {correct:c,total:t}=byDomain[d.id], pct=Math.round((c/t)*100), col=pct>=75?"var(--success)":pct>=50?"var(--warning)":"var(--error)";
            return (
              <div key={d.id} style={{ display:"flex",alignItems:"center",gap:8,marginBottom:5 }}>
                <div style={{ fontSize:10,color:"var(--text-sec)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{d.name}</div>
                <div style={{ width:60,height:3,background:"var(--border)",borderRadius:2,overflow:"hidden",flexShrink:0 }}><div style={{ height:"100%",width:`${pct}%`,background:col,borderRadius:2 }}/></div>
                <div style={{ fontSize:10,fontFamily:"var(--font-mono)",fontWeight:700,color:col,flexShrink:0,minWidth:28,textAlign:"right" }}>{pct}%</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StartScreen({ onStart, qCount, onStudy }) {
  const [showExamInfo, setShowExamInfo] = useState(false);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [sessionType, setSessionType] = useState("study");
  const [count, setCount] = useState(10);
  const [questionType, setQuestionType] = useState("both");
  const allDomainIds = CERT_CONFIG.domains.map(d=>d.id);
  const effectiveDomains = selectedDomains.length===0 ? allDomainIds : selectedDomains;
  const toggleDomain = (id) => setSelectedDomains(p=>p.includes(id)?p.filter(d=>d!==id):[...p,id]);
  const allQs = QBase.getAll();
  const available = allQs.filter(q=>effectiveDomains.includes(q.domainId)&&(questionType==="both"||q.type===questionType)).length;
  const canStart = available >= 1;
  return (
    <div style={{ paddingTop:20, paddingBottom:100 }}>
      <div className="cert-banner">
        <div style={{ minWidth:0 }}>
          <div className="cert-banner-id">{CERT_CONFIG.id}</div>
          <div className="cert-banner-name">{CERT_CONFIG.name}</div>
          <div className="cert-banner-meta">{CERT_CONFIG.vendor} · Pass: {CERT_CONFIG.passingScore}% · {CERT_CONFIG.examQuestions}Q · {CERT_CONFIG.examDuration}min</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={()=>setShowExamInfo(true)} style={{ flexShrink:0 }}>About Exam</button>
      </div>
      <div style={{ marginBottom:18 }}>
        <div className="section-label">Session Type</div>
        <div className="type-tabs">
          {[["study","📚 Practice","Instant feedback + show answer"],["exam","🎓 Exam",`${CERT_CONFIG.examQuestions}Q · ${CERT_CONFIG.examDuration}min · timed`]].map(([v,label,sub])=>(
            <button key={v} className={`type-tab${sessionType===v?" active":""}`} onClick={()=>{setSessionType(v);if(v==="exam")setCount(CERT_CONFIG.examQuestions);}}>
              {label}<span className="tab-sub">{sub}</span>
            </button>
          ))}
        </div>
      </div>
      {sessionType==="study" && (
        <div style={{ marginBottom:18 }}>
          <div className="section-label">
            <span>Domains</span>
            <span style={{ fontWeight:400,textTransform:"none",letterSpacing:0,fontSize:10,color:"var(--text-sec)" }}>{selectedDomains.length===0?"All (default)":`${selectedDomains.length}/${CERT_CONFIG.domains.length} selected`}</span>
          </div>
          <div className="domain-grid">
            {CERT_CONFIG.domains.map(d => {
              const dCount = allQs.filter(q=>q.domainId===d.id).length;
              return (
                <div key={d.id} className={`domain-pill${selectedDomains.includes(d.id)?" active":""}`} onClick={()=>toggleDomain(d.id)}>
                  <div className="d-name">{d.name}</div>
                  <div className="d-weight">{d.weight}% · {dCount}Q</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {sessionType==="study" && (
        <div style={{ marginBottom:14 }}>
          <div className="section-label">Questions per Session</div>
          <div className="count-chips">
            {[5,10,20,50].map(n=>(
              <button key={n} className={`count-chip${count===n?" active":""}`} onClick={()=>setCount(n)}>{n}</button>
            ))}
          </div>
        </div>
      )}
      {sessionType==="study" && (
        <div style={{ marginBottom:18 }}>
          <div className="section-label">Question Type</div>
          <div className="count-chips">
            {[["both","All Types"],["mcq","Single Answer"],["multi","Multi-Select"]].map(([v,l])=>(
              <button key={v} className={`count-chip${questionType===v?" active":""}`} onClick={()=>setQuestionType(v)}>{l}</button>
            ))}
          </div>
        </div>
      )}
      {sessionType==="exam" && (
        <div style={{ marginBottom:18, padding:"14px 16px", background:"var(--surface)", border:"1px solid var(--accent-bd)", borderRadius:"var(--r-sm)" }}>
          <div style={{ fontSize:12, fontWeight:700, color:"var(--accent)", marginBottom:8 }}>🎓 Exam Simulation</div>
          <div style={{ fontSize:11, color:"var(--text-sec)", lineHeight:1.8 }}>
            <div>· <strong style={{ color:"var(--text-pri)" }}>{CERT_CONFIG.examQuestions} questions</strong> weighted per domain</div>
            <div>· <strong style={{ color:"var(--text-pri)" }}>{CERT_CONFIG.examDuration} minutes</strong> — auto-submits when time runs out</div>
            <div>· <strong style={{ color:"var(--text-pri)" }}>{Math.round(CERT_CONFIG.examQuestionTypes.mcq*100)}% MCQ / {Math.round(CERT_CONFIG.examQuestionTypes.multi*100)}% Multi-select</strong></div>
            <div>· No instant feedback — results at the end</div>
          </div>
        </div>
      )}
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",marginBottom:16 }}>
        <div>
          <span style={{ fontSize:13, fontWeight:600, color:"var(--text-pri)" }}>{available}</span>
          <span style={{ fontSize:11, color:"var(--text-sec)", marginLeft:6 }}>available{sessionType==="study"?` · ${Math.min(count,available)} will be used`:""}</span>
        </div>
        {!canStart && <div style={{ fontSize:10, color:"var(--warning)", fontFamily:"var(--font-mono)" }}>⚠ Admin → Fetch AI Questions</div>}
      </div>
      <ProgressTracker />
      <button onClick={onStudy} className="btn btn-ghost btn-full" style={{ marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, height: 40 }}>
        <span style={{ fontSize: 13 }}>📖</span>
        <span>Study Material</span>
        <span style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-sec)", marginLeft: 2 }}>{STUDY_BLUEPRINT.reduce((a,d)=>a+d.topics.length,0)} topics · {STUDY_BLUEPRINT.length} domains</span>
      </button>
      <div className="start-footer">
        <div className="start-footer-inner">
          <button className="btn btn-primary btn-full btn-lg" disabled={!canStart}
            onClick={()=>onStart({selectedDomains:effectiveDomains,sessionType,count:sessionType==="exam"?CERT_CONFIG.examQuestions:Math.min(count,available),questionType})}>
            {canStart?`Start ${sessionType==="exam"?"Exam":"Practice"} · ${sessionType==="exam"?CERT_CONFIG.examQuestions:Math.min(count,available)} Questions`:"⚠ Add questions via Admin → Fetch"}
          </button>
        </div>
      </div>
      {showExamInfo && <ExamInfoModal onClose={()=>setShowExamInfo(false)} />}
    </div>
  );
}

function ExamTimer({ durationMinutes, onTimeUp }) {
  const totalSecs = durationMinutes*60;
  const [secsLeft, setSecsLeft] = useState(totalSecs);
  const onTimeUpRef = useRef(onTimeUp);
  useEffect(()=>{onTimeUpRef.current=onTimeUp;},[onTimeUp]);
  useEffect(()=>{
    const t = setInterval(()=>{setSecsLeft(s=>{if(s<=1){clearInterval(t);onTimeUpRef.current();return 0;}return s-1;});},1000);
    return ()=>clearInterval(t);
  },[]);
  const mins=Math.floor(secsLeft/60), secs=secsLeft%60, pct=secsLeft/totalSecs;
  const urgent=secsLeft<=300, critical=secsLeft<=60;
  return (
    <div style={{ display:"flex",alignItems:"center",gap:7,padding:"4px 10px",background:critical?"rgba(248,113,113,0.12)":urgent?"rgba(251,191,36,0.10)":"var(--surface)",border:`1px solid ${critical?"var(--error-bd)":urgent?"var(--warning-bd)":"var(--border)"}`,borderRadius:"var(--r-sm)",flexShrink:0 }}>
      <span style={{ fontSize:12 }}>{critical?"🔴":urgent?"⚠️":"⏱"}</span>
      <span style={{ fontFamily:"var(--font-mono)",fontWeight:700,fontSize:13,color:critical?"var(--error)":urgent?"var(--warning)":"var(--text-pri)",minWidth:42,textAlign:"center" }}>{String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}</span>
      <div style={{ width:44,height:3,background:"var(--border)",borderRadius:2,overflow:"hidden" }}><div style={{ height:"100%",width:`${pct*100}%`,background:critical?"var(--error)":urgent?"var(--warning)":"var(--accent)",borderRadius:2,transition:"width 1s linear" }}/></div>
    </div>
  );
}

function ExamScreen({ questions, sessionType, onFinish }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [showAnswer, setShowAnswer] = useState({});
  const [toast, setToast] = useState(null);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const answersRef = useRef(answers);
  useEffect(()=>{answersRef.current=answers;},[answers]);
  const isExam=sessionType==="exam", isStudy=!isExam;
  const q = questions[idx], isMulti=q?.type==="multi", userAnswer=answers[q?.id]||[], isSubmitted=!!submitted[q?.id], isAnswerShown=!!showAnswer[q?.id];
  const diffInfo = getDifficultyInfo(q?.bloomLevel);
  const seenInfo = SeenTracker.getTag(q?.seenCount||0, q?._fromParking||false);
  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null),1800); };
  const finishWithAnswers = useCallback((ans)=>{ const attempted=questions.filter(q=>ans[q.id]&&ans[q.id].length>0); onFinish(ans,attempted); },[questions,onFinish]);
  const handleTimeUp = useCallback(()=>finishWithAnswers(answersRef.current),[finishWithAnswers]);
  const selectOption = (optId) => {
    if (isSubmitted) return;
    if (isMulti) setAnswers(a=>({...a,[q.id]:userAnswer.includes(optId)?userAnswer.filter(x=>x!==optId):[...userAnswer,optId]}));
    else setAnswers(a=>({...a,[q.id]:[optId]}));
  };
  const handleSubmit = () => {
    if (isSubmitted||userAnswer.length===0) return;
    const correct = Array.isArray(q.correct) ? q.correct.length===userAnswer.length&&q.correct.every(c=>userAnswer.includes(c)) : userAnswer.includes(q.correct);
    setSubmitted(s=>({...s,[q.id]:true}));
    Store.log({type:"ANSWER",qId:q.id,domainId:q.domainId,correct,ts:Date.now()});
    if (isStudy) { if(correct){Leitner.promote(q.id);showToast("✓ Correct!");}else{Leitner.demote(q.id);showToast("✗ Incorrect");} }
  };
  const next = () => { if(idx<questions.length-1)setIdx(i=>i+1); else finishWithAnswers(answers); };
  const getOptClass = (optId) => {
    const sel=userAnswer.includes(optId);
    if (!isSubmitted) return `option${sel?" selected":""}`;
    if (isStudy) { const isCorrect=q.correct.includes(optId); if(isCorrect&&sel)return"option correct disabled"; if(isCorrect&&!sel)return"option missed disabled"; if(!isCorrect&&sel)return"option incorrect disabled"; return"option disabled"; }
    return `option${sel?" selected":""} disabled`;
  };
  const answeredCount = Object.keys(answers).filter(id=>answers[id]?.length>0).length;
  const isCorrectAnswer = isSubmitted&&Array.isArray(q.correct)&&q.correct.length===userAnswer.length&&q.correct.every(c=>userAnswer.includes(c));
  return (
    <div style={{ paddingTop:14, paddingBottom:20, display:"flex", flexDirection:"column", minHeight:"calc(100svh - 44px)" }}>
      <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:10 }}>
        <div style={{ fontSize:10,fontWeight:700,color:"var(--text-sec)",fontFamily:"var(--font-mono)",flexShrink:0 }}>{idx+1}<span style={{ color:"var(--text-sec)",opacity:0.6 }}> / {questions.length}</span></div>
        {isExam && <ExamTimer durationMinutes={CERT_CONFIG.examDuration} onTimeUp={handleTimeUp}/>}
        <div style={{ display:"flex",gap:3,flexWrap:"nowrap",overflowX:"auto",justifyContent:"flex-end",flex:1,maxWidth:"calc(100% - 160px)" }}>
          {questions.map((qq,i)=>(
            <div key={qq.id} className={`nav-dot${i===idx?" active":answers[qq.id]?.length?" answered":""}`} onClick={()=>setIdx(i)} style={{ flexShrink:0 }}>{i+1}</div>
          ))}
        </div>
        <button onClick={()=>setConfirmEnd(true)} style={{ flexShrink:0,padding:"4px 10px",borderRadius:"var(--r-sm)",border:"1px solid var(--border)",background:"transparent",color:"var(--text-sec)",cursor:"pointer",fontSize:10,fontWeight:600,fontFamily:"var(--font-mono)" }}>End</button>
      </div>
      <div className="progress-track"><div className="progress-fill" style={{ width:`${(answeredCount/questions.length)*100}%` }}/></div>
      <div className="question-card">
        <div className="q-meta">
          <span className="q-domain-tag">{CERT_CONFIG.domains.find(d=>d.id===q.domainId)?.name||q.domainId}</span>
          <span style={{ fontSize:9,fontFamily:"var(--font-mono)",fontWeight:700,color:seenInfo.color,background:seenInfo.bg,border:`1px solid ${seenInfo.bd}`,borderRadius:"var(--r-xs)",padding:"2px 6px" }}>{seenInfo.label}</span>
          {q.score!==undefined&&<span style={{ fontSize:9,fontFamily:"var(--font-mono)",fontWeight:600,color:"var(--text-sec)",background:"var(--elevated)",border:"1px solid var(--border)",borderRadius:"var(--r-xs)",padding:"2px 6px" }}>Q{q.score}/10</span>}
          <div style={{ marginLeft:"auto",display:"flex",alignItems:"center",gap:5 }}>
            {isMulti&&<span className="q-type-badge">Multi-select</span>}
            <span className="q-diff-badge" style={{ background:diffInfo.bg,borderColor:diffInfo.bd,color:diffInfo.color,border:`1px solid ${diffInfo.bd}` }}>{diffInfo.tag}</span>
          </div>
        </div>
        <div className="q-stem">{q.stem}</div>
        {isMulti&&!isSubmitted&&<div className="q-multi-hint">Select all that apply · {q.correct.length} correct answer{q.correct.length>1?"s":""}</div>}
        <div className="options">
          {q.options.map(opt=>(
            <div key={opt.id} className={getOptClass(opt.id)} onClick={()=>selectOption(opt.id)}>
              <div className="opt-key">{opt.id.toUpperCase()}</div>
              <div className="opt-text">{opt.text}</div>
              {isSubmitted&&isStudy&&q.correct.includes(opt.id)&&<span style={{ marginLeft:"auto",color:"var(--success)",fontSize:14,flexShrink:0 }}>✓</span>}
              {isSubmitted&&isStudy&&!q.correct.includes(opt.id)&&userAnswer.includes(opt.id)&&<span style={{ marginLeft:"auto",color:"var(--error)",fontSize:14,flexShrink:0 }}>✗</span>}
            </div>
          ))}
        </div>
        {isSubmitted&&isStudy&&<div className="explanation"><strong>Explanation: </strong>{q.explanation}</div>}
        {isStudy&&!isSubmitted&&(
          <div className="show-answer-panel">
            <button className="show-answer-toggle" onClick={()=>setShowAnswer(s=>({...s,[q.id]:!s[q.id]}))}>
              <span>{isAnswerShown?"▾ Hide Answer":"▸ Show Answer"}</span>
              <span style={{ fontSize:9,opacity:0.7 }}>{q.topic||"correct answer + explanation"}</span>
            </button>
            {isAnswerShown&&(
              <div className="show-answer-body">
                {q.topic&&<div style={{ fontSize:9,fontWeight:700,textTransform:"uppercase",color:"var(--text-sec)",fontFamily:"var(--font-mono)",marginBottom:7 }}>Topic: {q.topic}</div>}
                <div style={{ marginBottom:9 }}>
                  <div style={{ fontSize:9,fontWeight:700,textTransform:"uppercase",color:"var(--success)",fontFamily:"var(--font-mono)",marginBottom:4 }}>Correct Answer{q.correct.length>1?"s":""}</div>
                  {q.correct.map(id=>{const opt=q.options.find(o=>o.id===id);return<div key={id} style={{ fontSize:12,fontWeight:600,color:"var(--success)",lineHeight:1.65 }}>{id.toUpperCase()}. {opt?.text||id}</div>;})}
                </div>
                <div style={{ fontSize:9,fontWeight:700,textTransform:"uppercase",color:"var(--text-sec)",fontFamily:"var(--font-mono)",marginBottom:4 }}>Explanation</div>
                <div style={{ fontSize:11,color:"var(--text-sec)",lineHeight:1.75 }}>{q.explanation}</div>
              </div>
            )}
          </div>
        )}
        <div style={{ display:"flex",gap:8,marginTop:14 }}>
          <button className={`btn ${isSubmitted?(isCorrectAnswer?"btn-success":"btn-danger"):"btn-primary"} btn-full`} style={{ height:38,fontSize:12 }}
            disabled={userAnswer.length===0||isSubmitted} onClick={handleSubmit}>
            {isSubmitted?(isStudy?(isCorrectAnswer?"✓ Correct":"✗ Incorrect"):"✓ Locked In"):"Submit Answer"}
          </button>
        </div>
      </div>
      <div style={{ display:"flex",gap:8,marginTop:12 }}>
        {isStudy&&isSubmitted&&idx<questions.length-1&&<button className="btn btn-primary" style={{ flex:1 }} onClick={next}>Next →</button>}
        {isStudy&&isSubmitted&&idx===questions.length-1&&<button className="btn btn-primary" style={{ flex:1 }} onClick={()=>finishWithAnswers(answers)}>View Results</button>}
        {isExam&&<button className="btn btn-primary" style={{ flex:1 }} onClick={next}>{idx===questions.length-1?"Finish Exam":"Next →"}</button>}
      </div>
      {toast&&<div role="alert" className="toast">{toast}</div>}
      {confirmEnd&&(
        <div style={{ position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,0.65)",backdropFilter:"blur(5px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
          <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r)",padding:"24px 20px",maxWidth:300,width:"100%" }}>
            <div style={{ fontSize:15,fontWeight:700,color:"var(--text-pri)",marginBottom:6 }}>End session?</div>
            <div style={{ fontSize:12,color:"var(--text-sec)",marginBottom:20,lineHeight:1.6 }}>{answeredCount} of {questions.length} answered.</div>
            <div style={{ display:"flex",gap:8 }}>
              <button className="btn btn-ghost" style={{ flex:1 }} onClick={()=>setConfirmEnd(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex:2 }} onClick={()=>{setConfirmEnd(false);finishWithAnswers(answers);}}>Yes, End</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewQAScreen({ questions, answers, sessionType, score, onClose }) {
  const [idx, setIdx] = useState(0);
  const q = questions[idx], ua=answers[q?.id]||[];
  const isCorrect = q&&q.correct.length===ua.length&&q.correct.every(c=>ua.includes(c));
  const domain = CERT_CONFIG.domains.find(d=>d.id===q?.domainId)?.name||q?.domainId;
  const diffInfo = getDifficultyInfo(q?.bloomLevel);
  const {correct,total,pct} = score;
  const passed = pct >= CERT_CONFIG.passingScore;
  const isFirst=idx===0, isLast=idx===questions.length-1;
  const downloadReport = () => {
    const html = generateHTMLReport({questions,answers,sessionType,score});
    const blob = new Blob([html],{type:"text/html"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download=`${CERT_CONFIG.id}_report_${new Date().toISOString().slice(0,10)}.html`; a.click(); URL.revokeObjectURL(url);
  };
  return (
    <div style={{ position:"fixed",inset:0,zIndex:300,background:"var(--bg)",display:"flex",flexDirection:"column",overflow:"hidden" }}>
      <div style={{ flexShrink:0,display:"flex",alignItems:"center",gap:10,padding:"0 14px",height:50,borderBottom:"1px solid var(--border)",background:"var(--bg)" }}>
        <button onClick={onClose} style={{ width:32,height:32,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"1px solid var(--border)",color:"var(--text-sec)",cursor:"pointer",fontSize:15,fontWeight:700,flexShrink:0 }}>✕</button>
        <div style={{ flex:1,minWidth:0 }}>
          <div style={{ fontSize:13,fontWeight:700,color:"var(--text-pri)" }}>Review Q&amp;A</div>
          <div style={{ fontSize:9,fontFamily:"var(--font-mono)",color:"var(--text-sec)" }}>{CERT_CONFIG.id} · {correct}/{total} · {pct}% · <span style={{ color:passed?"var(--success)":"var(--error)",fontWeight:700 }}>{passed?"PASS":"FAIL"}</span></div>
        </div>
        <button onClick={downloadReport} className="btn btn-ghost btn-sm" style={{ flexShrink:0 }}>⬇ Report</button>
      </div>
      <div style={{ flexShrink:0,display:"flex",alignItems:"center",gap:9,padding:"8px 14px",borderBottom:"1px solid var(--border)",background:"var(--surface)" }}>
        <div style={{ flex:1,height:3,background:"var(--border)",borderRadius:2,overflow:"hidden" }}><div style={{ height:"100%",width:`${((idx+1)/questions.length)*100}%`,background:"var(--accent)",borderRadius:2,transition:"width 0.25s" }}/></div>
        <span style={{ fontSize:10,fontFamily:"var(--font-mono)",color:"var(--text-sec)",flexShrink:0,minWidth:40,textAlign:"right" }}>{idx+1} / {questions.length}</span>
      </div>
      <div style={{ flex:1,overflowY:"auto",padding:"20px 16px 28px",maxWidth:560,margin:"0 auto",width:"100%" }}>
        <div style={{ display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:14 }}>
          <span style={{ fontSize:11,fontWeight:700,fontFamily:"var(--font-mono)",color:"var(--text-sec)" }}>Q{idx+1}</span>
          <span style={{ fontSize:9,padding:"2px 9px",borderRadius:4,background:"var(--elevated)",border:"1px solid var(--border)",color:"var(--text-sec)",fontFamily:"var(--font-mono)" }}>{domain}</span>
          <span className="q-diff-badge" style={{ background:diffInfo.bg,borderColor:diffInfo.bd,color:diffInfo.color,border:`1px solid ${diffInfo.bd}` }}>{diffInfo.tag}</span>
          <span style={{ fontSize:9,padding:"3px 9px",borderRadius:4,fontWeight:700,background:isCorrect?"var(--success-bg)":"var(--error-bg)",border:`1px solid ${isCorrect?"var(--success-bd)":"var(--error-bd)"}`,color:isCorrect?"var(--success)":"var(--error)" }}>{isCorrect?"✓ Correct":"✗ Incorrect"}</span>
          {q?.type==="multi"&&<span style={{ fontSize:9,padding:"2px 7px",borderRadius:3,background:"var(--accent-bg)",border:"1px solid var(--accent-bd)",color:"var(--accent)",fontFamily:"var(--font-mono)" }}>Multi-select</span>}
        </div>
        <div style={{ fontSize:15,fontWeight:600,color:"var(--text-pri)",lineHeight:1.8,marginBottom:22 }}>{q?.stem}</div>
        <div style={{ display:"flex",flexDirection:"column",gap:7,marginBottom:20 }}>
          {(q?.options||[]).map(opt=>{
            const isRight=q.correct.includes(opt.id), isChosen=ua.includes(opt.id);
            let bg="var(--elevated)",border="var(--border)",col="var(--text-sec)",marker=null;
            if (isRight){bg="var(--success-bg)";border="var(--success-bd)";col="var(--text-pri)";marker=<span style={{ color:"var(--success)",fontWeight:800,flexShrink:0,fontSize:16,marginLeft:6 }}>✓</span>;}
            else if (isChosen){bg="var(--error-bg)";border="var(--error-bd)";col="var(--text-pri)";marker=<span style={{ color:"var(--error)",fontWeight:800,flexShrink:0,fontSize:16,marginLeft:6 }}>✗</span>;}
            return (
              <div key={opt.id} style={{ display:"flex",alignItems:"flex-start",gap:10,padding:"11px 14px",background:bg,border:`1.5px solid ${border}`,borderRadius:"var(--r-sm)" }}>
                <span style={{ fontFamily:"var(--font-mono)",fontWeight:800,fontSize:12,color:isRight?"var(--success)":isChosen?"var(--error)":"var(--text-sec)",flexShrink:0,minWidth:22,paddingTop:1 }}>{opt.id.toUpperCase()}.</span>
                <span style={{ flex:1,fontSize:13,color:col,lineHeight:1.65 }}>{opt.text}</span>
                {marker}
              </div>
            );
          })}
        </div>
        {!isCorrect&&(
          <div style={{ display:"flex",flexDirection:"column",gap:7,marginBottom:18 }}>
            <div style={{ padding:"11px 14px",background:"var(--error-bg)",border:"1px solid var(--error-bd)",borderRadius:"var(--r-sm)" }}>
              <div style={{ fontSize:9,fontWeight:700,textTransform:"uppercase",color:"var(--error)",fontFamily:"var(--font-mono)",marginBottom:5 }}>Your Answer</div>
              <div style={{ fontSize:12,color:"var(--error)",lineHeight:1.6,fontWeight:500 }}>{ua.length?ua.map(id=>{const o=q.options.find(x=>x.id===id);return o?`${id.toUpperCase()}. ${o.text}`:id.toUpperCase();}).join(" · "):"(none)"}</div>
            </div>
            <div style={{ padding:"11px 14px",background:"var(--success-bg)",border:"1px solid var(--success-bd)",borderRadius:"var(--r-sm)" }}>
              <div style={{ fontSize:9,fontWeight:700,textTransform:"uppercase",color:"var(--success)",fontFamily:"var(--font-mono)",marginBottom:5 }}>Correct Answer</div>
              <div style={{ fontSize:12,color:"var(--success)",lineHeight:1.6,fontWeight:500 }}>{q.correct.map(id=>{const o=q.options.find(x=>x.id===id);return o?`${id.toUpperCase()}. ${o.text}`:id.toUpperCase();}).join(" · ")}</div>
            </div>
          </div>
        )}
        <div style={{ padding:"14px 16px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)" }}>
          <div style={{ fontSize:9,fontWeight:700,textTransform:"uppercase",color:"var(--text-sec)",fontFamily:"var(--font-mono)",marginBottom:7 }}>Explanation</div>
          <div style={{ fontSize:13,color:"var(--text-pri)",lineHeight:1.85 }}>{q?.explanation}</div>
        </div>
      </div>
      <div style={{ flexShrink:0,display:"flex",gap:8,padding:"10px 14px 24px",borderTop:"1px solid var(--border)",background:"var(--bg)",alignItems:"center" }}>
        {!isFirst?<button className="btn btn-ghost" style={{ flex:1,height:42 }} onClick={()=>setIdx(i=>i-1)}>← Prev</button>:<div style={{ flex:1 }}/>}
        <div style={{ display:"flex",gap:3,alignItems:"center",overflowX:"auto",flex:2,justifyContent:"center",padding:"0 4px" }}>
          {questions.map((qq,i)=>{
            const ua2=answers[qq.id]||[];
            const ok=qq.correct.length===ua2.length&&qq.correct.every(c=>ua2.includes(c));
            return (<button key={qq.id} onClick={()=>setIdx(i)} title={`Q${i+1} — ${ok?"Correct":"Incorrect"}`}
              style={{ width:i===idx?18:14,height:i===idx?18:14,borderRadius:3,flexShrink:0,border:`1.5px solid ${i===idx?"var(--accent)":ok?"var(--success-bd)":"var(--error-bd)"}`,background:i===idx?"var(--accent)":ok?"var(--success-bg)":"var(--error-bg)",cursor:"pointer",fontSize:0,transition:"all 0.15s" }}/>);
          })}
        </div>
        {!isLast?<button className="btn btn-primary" style={{ flex:1,height:42 }} onClick={()=>setIdx(i=>i+1)}>Next →</button>:<button className="btn btn-success" style={{ flex:1,height:42 }} onClick={onClose}>✓ Done</button>}
      </div>
    </div>
  );
}

function ResultScreen({ questions, answers, sessionType, onRestart, onHome }) {
  const score = calcSessionScore(answers, questions);
  const {correct,total,pct,breakdown} = score;
  const passed = pct >= CERT_CONFIG.passingScore;
  const [showReviewQA, setShowReviewQA] = useState(false);
  const gapDomains = Object.entries(breakdown).map(([name,{correct:c,total:t}])=>({name,pct:Math.round((c/t)*100)})).filter(d=>d.pct<CERT_CONFIG.passingScore).sort((a,b)=>a.pct-b.pct);
  return (
    <div style={{ paddingTop:20,paddingBottom:100 }}>
      <div className="card">
        <div style={{ display:"flex",gap:16,alignItems:"center",flexWrap:"wrap" }}>
          <div className={`score-ring ${passed?"pass":"fail"}`}>
            <div className="score-pct">{pct}%</div>
            <div className="score-sub">{passed?"PASS":"FAIL"}</div>
          </div>
          <div style={{ flex:1,minWidth:160 }}>
            <div style={{ fontSize:16,fontWeight:700,color:passed?"var(--success)":"var(--error)",marginBottom:4 }}>{passed?"Well done!":"Keep practicing"}</div>
            <div style={{ fontSize:12,color:"var(--text-sec)",marginBottom:5 }}>{correct} / {total} correct · Pass: {CERT_CONFIG.passingScore}%</div>
            {!passed&&<div style={{ fontSize:10,fontFamily:"var(--font-mono)",color:"var(--warning)" }}>Need {CERT_CONFIG.passingScore-pct}% more to pass</div>}
            {passed&&sessionType==="exam"&&<div style={{ fontSize:10,fontFamily:"var(--font-mono)",color:"var(--success)" }}>✓ Would pass the real exam</div>}
          </div>
        </div>
      </div>
      <div className="card">
        <div className="section-label">Domain Breakdown</div>
        {Object.entries(breakdown).map(([name,{correct:c,total:t}])=>{
          const pct2=c/t, col=pct2>=0.75?"var(--success)":pct2>=0.5?"var(--warning)":"var(--error)";
          return (<div className="breakdown-row" key={name}>
            <div className="breakdown-name">{name}</div>
            <div className="breakdown-bar"><div className="breakdown-fill" style={{ width:`${pct2*100}%`,background:col }}/></div>
            <div className="breakdown-stat" style={{ color:col }}>{c}/{t}</div>
          </div>);
        })}
      </div>
      {gapDomains.length>0&&(
        <div className="card">
          <div className="section-label">Gap Areas — Below {CERT_CONFIG.passingScore}%</div>
          {gapDomains.map(d=>(
            <div key={d.name} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 11px",background:"var(--elevated)",border:"1px solid var(--error-bd)",borderRadius:"var(--r-sm)",marginBottom:5 }}>
              <div style={{ width:6,height:6,borderRadius:"50%",background:"var(--error)",flexShrink:0 }}/>
              <div style={{ flex:1,fontSize:11,color:"var(--text-sec)" }}>{d.name}</div>
              <div style={{ fontSize:11,fontFamily:"var(--font-mono)",fontWeight:700,color:"var(--error)" }}>{d.pct}%</div>
            </div>
          ))}
        </div>
      )}
      <div style={{ display:"flex",gap:8,marginBottom:8 }}>
        <button className="btn btn-ghost" style={{ flex:1 }} onClick={onHome}>← Home</button>
        <button className="btn btn-primary" style={{ flex:2 }} onClick={onRestart}>↺ New Session</button>
      </div>
      <button className="btn btn-ghost btn-full" style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:6 }} onClick={()=>setShowReviewQA(true)}>📖 Review Q&amp;A</button>
      {showReviewQA&&<ReviewQAScreen questions={questions} answers={answers} sessionType={sessionType} score={score} onClose={()=>setShowReviewQA(false)} />}
    </div>
  );
}

// ─── AUDIT PAGE ───────────────────────────────────────────────────────────────
function AuditPage({ onBack }) {
  const [qbase, setQbase] = useState(() => QBase.getAll());
  const [cache, setCache] = useState(() => QBase.getAiCache());
  const [fixLog, setFixLog] = useState(null);
  const [fixing, setFixing] = useState(false);

  const reload = () => { setQbase(QBase.getAll()); setCache(QBase.getAiCache()); };

  const runFixAll = () => {
    setFixing(true);
    setFixLog(null);
    setTimeout(() => {
      const allQs = QBase.getAll();
      const log = [];
      let fixed = [...allQs];

      // 1. Remove duplicates (keep first occurrence)
      const seenIds = new Set();
      const beforeDupe = fixed.length;
      fixed = fixed.filter(q => { if (seenIds.has(q.id)) return false; seenIds.add(q.id); return true; });
      const dupRemoved = beforeDupe - fixed.length;
      if (dupRemoved > 0) log.push(`✓ Removed ${dupRemoved} duplicate question(s)`);

      // 2. Remove corrupt questions (no stem, <2 options, no correct)
      const beforeCorrupt = fixed.length;
      fixed = fixed.filter(q => q.stem && q.stem.trim().length > 10 && Array.isArray(q.options) && q.options.length >= 2 && Array.isArray(q.correct) && q.correct.length > 0);
      const corruptRemoved = beforeCorrupt - fixed.length;
      if (corruptRemoved > 0) log.push(`✓ Removed ${corruptRemoved} corrupt question(s) (missing stem/options/correct)`);

      // 3. Fix domain orphans — reassign to nearest valid domain
      const validDomainIds = new Set(CERT_CONFIG.domains.map(d => d.id));
      let orphansFixed = 0;
      fixed = fixed.map(q => {
        if (!validDomainIds.has(q.domainId)) {
          const newDomain = CERT_CONFIG.domains[0].id;
          orphansFixed++;
          return { ...q, domainId: newDomain };
        }
        return q;
      });
      if (orphansFixed > 0) log.push(`✓ Reassigned ${orphansFixed} orphan question(s) to ${CERT_CONFIG.domains[0].id}`);

      // 4. Remove questions with extremely low scores (< 3) — junk tier
      const beforeLowScore = fixed.length;
      fixed = fixed.filter(q => typeof q.score !== "number" || q.score >= 3);
      const lowScoreRemoved = beforeLowScore - fixed.length;
      if (lowScoreRemoved > 0) log.push(`✓ Removed ${lowScoreRemoved} junk-score question(s) (score < 3)`);

      // 5. Promote passing questions from AI Cache to qBase
      const cacheQs = QBase.getAiCache();
      const passing = cacheQs.filter(q => q.passes);
      if (passing.length > 0) {
        QBase.add(passing);
        Store.set(SK.aiCache, cacheQs.filter(q => !q.passes));
        log.push(`✓ Promoted ${passing.length} passing question(s) from AI Cache → qBase`);
      }

      // 6. Save cleaned qBase
      Store.set(SK.qbase, fixed);

      if (log.length === 0) log.push("✅ No issues found — qBase is clean.");
      log.push(`── qBase: ${fixed.length}Q total after cleanup`);

      setFixLog(log);
      setFixing(false);
      reload();
    }, 400);
  };

  const allQsForAudit = [...qbase, ...cache];
  const cert = CERT_CONFIG;

  // ── Domain checks ──
  const domainChecks = cert.domains.map(d => {
    const qs = qbase.filter(q => q.domainId === d.id);
    const expected = d.examQCount;
    const actual = qs.length;
    const ratio = actual / Math.max(expected * 3, 1); // expect ~3x exam count
    const target = expected * 3;
    const ok = actual >= target;
    const warn = !ok && actual >= target * 0.5;
    return { d, actual, target, expected, ok, warn, qs };
  });

  // ── Topic distribution per domain ──
  const topicsByDomain = cert.domains.map(d => {
    const qs = qbase.filter(q => q.domainId === d.id);
    const topics = {};
    qs.forEach(q => { const t = q.topic || "untagged"; topics[t] = (topics[t]||0)+1; });
    return { d, topics };
  });

  // ── Exam simulation checks ──
  const examQTarget = cert.examQuestions; // 60
  const examDuration = cert.examDuration; // 120 min
  const totalQ = qbase.length;
  const examSimOk = totalQ >= examQTarget;

  // ── Question type distribution ──
  const mcqCount = qbase.filter(q=>q.type==="mcq").length;
  const multiCount = qbase.filter(q=>q.type==="multi").length;
  const mcqPct = totalQ > 0 ? Math.round((mcqCount/totalQ)*100) : 0;
  const multiPct = totalQ > 0 ? Math.round((multiCount/totalQ)*100) : 0;
  const mcqTargetPct = Math.round(cert.examQuestionTypes.mcq * 100);
  const multiTargetPct = Math.round(cert.examQuestionTypes.multi * 100);
  const typeOk = Math.abs(mcqPct - mcqTargetPct) <= 15;

  // ── Difficulty distribution ──
  const diffCounts = { easy:0, medium:0, hard:0 };
  qbase.forEach(q => { const d = getQDifficulty(q); diffCounts[d]++; });
  const diffPcts = { easy: totalQ>0?Math.round(diffCounts.easy/totalQ*100):0, medium: totalQ>0?Math.round(diffCounts.medium/totalQ*100):0, hard: totalQ>0?Math.round(diffCounts.hard/totalQ*100):0 };
  const diffTargets = { easy:25, medium:50, hard:25 };
  const diffOk = Object.keys(diffTargets).every(k => Math.abs(diffPcts[k]-diffTargets[k])<=15);

  // ── Overall pass/fail ──
  const checks = [examSimOk, typeOk, diffOk];
  const allPass = checks.every(Boolean);
  const passCount = checks.filter(Boolean).length;

  const StatusDot = ({ok, warn}) => (
    <span style={{ display:"inline-block",width:7,height:7,borderRadius:"50%",background:ok?"var(--success)":warn?"var(--warning)":"var(--error)",flexShrink:0,marginRight:5 }}/>
  );
  // Row optionally accepts onFix + fixLabel to show a 🔧 Fix button
  const Row = ({label, val, ok, warn, note, onFix, fixLabel}) => (
    <div style={{ display:"flex",alignItems:"flex-start",gap:8,padding:"6px 0",borderBottom:"1px solid var(--border)" }}>
      <StatusDot ok={ok} warn={warn}/>
      <div style={{ flex:1,minWidth:0 }}>
        <div style={{ fontSize:11,color:"var(--text-pri)",fontWeight:600 }}>{label}</div>
        {note&&<div style={{ fontSize:9,color:"var(--text-sec)",fontFamily:"var(--font-mono)",marginTop:1 }}>{note}</div>}
      </div>
      {onFix&&!ok?(
        <button onClick={onFix} style={{ flexShrink:0,padding:"2px 8px",borderRadius:"var(--r-sm)",border:"1px solid var(--warning-bd)",background:"var(--warning-bg)",color:"var(--warning)",fontSize:9,fontFamily:"var(--font-mono)",cursor:"pointer",fontWeight:700,alignSelf:"center",marginLeft:4 }}>
          🔧 {fixLabel||"Fix"}
        </button>
      ):(
        <div style={{ fontSize:11,fontFamily:"var(--font-mono)",color:ok?"var(--success)":warn?"var(--warning)":"var(--error)",flexShrink:0,fontWeight:700 }}>{val}</div>
      )}
      {onFix&&!ok&&<div style={{ fontSize:11,fontFamily:"var(--font-mono)",color:warn?"var(--warning)":"var(--error)",flexShrink:0,fontWeight:700 }}>{val}</div>}
    </div>
  );

  return (
    <div className="admin-overlay">
      <div className="admin-header">
        <button onClick={onBack} style={{ width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"1px solid var(--border)",color:"var(--text-sec)",cursor:"pointer",fontSize:13,fontWeight:700 }}>←</button>
        <span style={{ fontSize:16 }}>🔍</span>
        <div style={{ flex:1,minWidth:0 }}><div className="admin-title">Curriculum Audit</div><div className="admin-sub">{cert.id} · {cert.vendor}</div></div>
        <div style={{ display:"flex",gap:6,alignItems:"center" }}>
          <button
            onClick={runFixAll} disabled={fixing}
            style={{ padding:"4px 10px",borderRadius:"var(--r-sm)",border:"1px solid var(--success-bd)",background:"var(--success-bg)",color:"var(--success)",fontSize:10,fontFamily:"var(--font-mono)",cursor:"pointer",fontWeight:700,flexShrink:0 }}
          >
            {fixing?"⟳ Fixing…":"🔧 Fix It All"}
          </button>
          <div style={{ padding:"3px 9px",borderRadius:4,background:allPass?"var(--success-bg)":"var(--error-bg)",border:`1px solid ${allPass?"var(--success-bd)":"var(--error-bd)"}`,fontSize:10,fontWeight:800,fontFamily:"var(--font-mono)",color:allPass?"var(--success)":"var(--error)" }}>
            {passCount}/{checks.length} PASS
          </div>
        </div>
      </div>
      <div className="admin-body">

        {/* Fix It All Log */}
        {fixLog && (
          <div style={{ marginBottom:14,padding:"10px 13px",borderRadius:"var(--r-sm)",background:"var(--success-bg)",border:"1px solid var(--success-bd)" }}>
            <div style={{ fontSize:10,fontWeight:700,color:"var(--success)",fontFamily:"var(--font-mono)",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em" }}>🔧 Fix It All — Results</div>
            {fixLog.map((line,i)=>(
              <div key={i} style={{ fontSize:10,color:line.startsWith("✅")?"var(--success)":line.startsWith("──")?"var(--text-sec)":"var(--text-pri)",fontFamily:"var(--font-mono)",lineHeight:1.7 }}>{line}</div>
            ))}
          </div>
        )}

        {/* Summary banner */}
        <div style={{ padding:"10px 13px",borderRadius:"var(--r-sm)",background:allPass?"var(--success-bg)":"var(--error-bg)",border:`1px solid ${allPass?"var(--success-bd)":"var(--error-bd)"}`,marginBottom:14,fontSize:11,color:allPass?"var(--success)":"var(--error)",lineHeight:1.6 }}>
          {allPass?"✅ qBase meets all certificate requirements.":"⚠ Some checks failed — see details below."}
          <div style={{ fontSize:9,color:"var(--text-sec)",marginTop:3,fontFamily:"var(--font-mono)" }}>
            {cert.name} · {totalQ}Q in bank · {examQTarget}Q exam · {examDuration}min
          </div>
        </div>

        {/* Cert Metadata */}
        <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--text-sec)",fontFamily:"var(--font-mono)",marginBottom:7 }}>Cert Spec</div>
        <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",padding:"10px 12px",marginBottom:14 }}>
          {[["Exam ID", cert.id],["Vendor", cert.vendor],["Total Q", `${examQTarget} questions`],["Duration", `${examDuration} min`],["Passing", `${cert.passingScore}%`],["Type Mix", `${mcqTargetPct}% MCQ / ${multiTargetPct}% Multi`],["Domains", cert.domains.length]].map(([l,v])=>(
            <div key={l} style={{ display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid var(--border)",fontSize:10 }}>
              <span style={{ color:"var(--text-sec)" }}>{l}</span>
              <span style={{ fontFamily:"var(--font-mono)",color:"var(--text-pri)",fontWeight:600 }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Domain Coverage */}
        <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--text-sec)",fontFamily:"var(--font-mono)",marginBottom:7 }}>Domain Coverage</div>
        <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",padding:"8px 12px",marginBottom:14 }}>
          {domainChecks.map(({ d, actual, target, ok, warn }) => {
            const fillPct = Math.min(100, Math.round(actual/target*100));
            const needMore = target - actual;
            return (
              <div key={d.id} style={{ marginBottom:8 }}>
                <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:3 }}>
                  <span style={{ display:"inline-block",width:7,height:7,borderRadius:"50%",background:ok?"var(--success)":warn?"var(--warning)":"var(--error)",flexShrink:0 }}/>
                  <span style={{ fontSize:10,color:"var(--text-pri)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{d.name}</span>
                  <span style={{ fontSize:9,fontFamily:"var(--font-mono)",color:ok?"var(--success)":warn?"var(--warning)":"var(--error)",fontWeight:700 }}>{actual}/{target}Q</span>
                  {!ok&&(
                    <button
                      onClick={()=>{ const q=Store.get(SK.qbase,[]); const orphans=q.filter(x=>x.domainId===d.id); if(orphans.length<actual){/* promote from cache */} AutoHeal.healOrphans(); reload(); }}
                      title={`Domain has issues — run Auto-Heal or fetch ${needMore} more questions for this domain`}
                      style={{ flexShrink:0,padding:"2px 7px",borderRadius:"var(--r-sm)",border:"1px solid var(--warning-bd)",background:"var(--warning-bg)",color:"var(--warning)",fontSize:8,fontFamily:"var(--font-mono)",cursor:"pointer",fontWeight:700 }}>
                      🔧 Fix
                    </button>
                  )}
                </div>
                <div style={{ height:3,background:"var(--border)",borderRadius:2,overflow:"hidden" }}>
                  <div style={{ height:"100%",width:`${fillPct}%`,background:ok?"var(--success)":warn?"var(--warning)":"var(--error)",borderRadius:2,transition:"width 0.4s" }}/>
                </div>
                <div style={{ fontSize:8,color:"var(--text-sec)",fontFamily:"var(--font-mono)",marginTop:2 }}>{d.weight}% exam weight · {d.examQCount}Q in exam · target {target}Q in bank{!ok?` · need ${needMore} more`:""}</div>
              </div>
            );
          })}
        </div>

        {/* Topics per domain */}
        <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--text-sec)",fontFamily:"var(--font-mono)",marginBottom:7 }}>Topics in Domains</div>
        <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",padding:"8px 12px",marginBottom:14 }}>
          {topicsByDomain.map(({ d, topics }) => {
            const entries = Object.entries(topics).sort((a,b)=>b[1]-a[1]);
            if (entries.length === 0) return (
              <div key={d.id} style={{ marginBottom:8 }}>
                <div style={{ fontSize:10,fontWeight:600,color:"var(--text-sec)",marginBottom:3 }}>{d.name}</div>
                <div style={{ fontSize:9,color:"var(--error)",fontFamily:"var(--font-mono)" }}>No questions yet</div>
              </div>
            );
            return (
              <div key={d.id} style={{ marginBottom:10 }}>
                <div style={{ fontSize:10,fontWeight:700,color:"var(--text-pri)",marginBottom:4 }}>{d.name} <span style={{ color:"var(--accent)",fontFamily:"var(--font-mono)" }}>({entries.length} topics)</span></div>
                {entries.slice(0,6).map(([topic,cnt])=>(
                  <div key={topic} style={{ display:"flex",justifyContent:"space-between",fontSize:9,padding:"2px 0",borderBottom:"1px solid var(--border)" }}>
                    <span style={{ color:"var(--text-sec)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"75%" }}>{topic}</span>
                    <span style={{ fontFamily:"var(--font-mono)",color:"var(--text-pri)",fontWeight:600,flexShrink:0 }}>{cnt}Q</span>
                  </div>
                ))}
                {entries.length>6&&<div style={{ fontSize:8,color:"var(--text-sec)",marginTop:2 }}>…+{entries.length-6} more topics</div>}
              </div>
            );
          })}
        </div>

        {/* Bank Status */}
        <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--text-sec)",fontFamily:"var(--font-mono)",marginBottom:7 }}>Bank Status</div>
        <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",padding:"8px 12px",marginBottom:14 }}>
          <Row label="Total in qBase" val={`${totalQ}Q`} ok={totalQ>=examQTarget} warn={totalQ>=examQTarget*0.5} note={`Minimum recommended: ${examQTarget}Q`} />
          <Row label="AI Cache" val={`${cache.length}Q`} ok={cache.length>=0} note="Questions waiting in cache"
            onFix={cache.length>0?()=>{ AutoHeal.promoteCache(); reload(); }:null} fixLabel="Promote→qBase" />
          <Row label="In Parking Lot" val={`${QBase.getParkingLot().length}Q`} ok note="Seen 3× — retired to parking" />
        </div>

        {/* Exam simulation */}
        <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--text-sec)",fontFamily:"var(--font-mono)",marginBottom:7 }}>Exam Simulation Checks</div>
        <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",padding:"8px 12px",marginBottom:14 }}>
          <Row label="Exam Q Count Match" val={`${examQTarget}Q`} ok note={`Configured: ${examQTarget} questions`} />
          <Row label="Exam Duration" val={`${examDuration}min`} ok note="Configured in CERT_CONFIG" />
          <Row label="Enough Qs for Exam" val={examSimOk?`${totalQ}Q ✓`:`${totalQ}/${examQTarget}Q`} ok={examSimOk} warn={totalQ>=examQTarget*0.5} note="Need at least 1× exam count" />
        </div>

        {/* Question Type Distribution */}
        <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--text-sec)",fontFamily:"var(--font-mono)",marginBottom:7 }}>Question Type Distribution</div>
        <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",padding:"8px 12px",marginBottom:14 }}>
          <Row label="MCQ (Single Answer)" val={`${mcqCount}Q · ${mcqPct}%`} ok={Math.abs(mcqPct-mcqTargetPct)<=15} warn={Math.abs(mcqPct-mcqTargetPct)<=25} note={`Target: ${mcqTargetPct}%`} />
          <Row label="Multi-Select" val={`${multiCount}Q · ${multiPct}%`} ok={Math.abs(multiPct-multiTargetPct)<=15} warn={Math.abs(multiPct-multiTargetPct)<=25} note={`Target: ${multiTargetPct}%`} />
          <Row label="Type Balance" val={typeOk?"GOOD":"OFF"} ok={typeOk} note="Acceptable deviation: ±15%" />
        </div>

        {/* Difficulty Distribution */}
        <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--text-sec)",fontFamily:"var(--font-mono)",marginBottom:7 }}>Difficulty Distribution (Bloom Level)</div>
        <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",padding:"8px 12px",marginBottom:14 }}>
          {[["Easy (Bloom ≤3)", "easy"], ["Medium (Bloom 4)", "medium"], ["Hard (Bloom 5+)", "hard"]].map(([label, key]) => {
            const pct = diffPcts[key], target = diffTargets[key], cnt = diffCounts[key];
            const ok = Math.abs(pct-target)<=15, warn2 = !ok && Math.abs(pct-target)<=25;
            return <Row key={key} label={label} val={`${cnt}Q · ${pct}%`} ok={ok} warn={warn2} note={`Target: ${target}%`} />;
          })}
          <Row label="Difficulty Balance" val={diffOk?"GOOD":"OFF"} ok={diffOk} note="Acceptable deviation: ±15% per tier" />
        </div>

      </div>
    </div>
  );
}

// ─── EVENT VIEWER PAGE ────────────────────────────────────────────────────────
function EventViewerPage({ onBack }) {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(100);
  const [expanded, setExpanded] = useState({});
  const allEvents = Store.get(SK.events, []).slice().reverse();

  const EVENT_TYPES = ["ALL","SESSION_START","SESSION_END","ANSWER","QBASE_ADD","VARIANTS_GENERATED","WARN","ERROR"];
  const typeColor = { SESSION_START:"#60a5fa",SESSION_END:"#818cf8",ANSWER:"#34d399",QBASE_ADD:"#38bdf8",VARIANTS_GENERATED:"#a78bfa",WARN:"#fbbf24",ERROR:"#f87171" };

  const filtered = allEvents.filter(e => {
    if (filter !== "ALL" && e.type !== filter) return false;
    if (search && !JSON.stringify(e).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).slice(0, limit);

  const counts = {};
  allEvents.forEach(e => { counts[e.type] = (counts[e.type]||0)+1; });

  const toggleExpand = (i) => setExpanded(prev => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="admin-overlay">
      <div className="admin-header">
        <button onClick={onBack} style={{ width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"1px solid var(--border)",color:"var(--text-sec)",cursor:"pointer",fontSize:13,fontWeight:700 }}>←</button>
        <span style={{ fontSize:16 }}>📋</span>
        <div style={{ flex:1,minWidth:0 }}><div className="admin-title">Event Viewer</div><div className="admin-sub">{allEvents.length} total events · {filtered.length} shown</div></div>
      </div>
      <div className="admin-body">
        {/* Search */}
        <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by type, qId, domainId, value…" style={{ marginBottom:8,width:"100%" }} />

        {/* Type filter chips */}
        <div style={{ display:"flex",gap:4,flexWrap:"wrap",marginBottom:10 }}>
          {EVENT_TYPES.map(t=>(
            <button key={t} onClick={()=>setFilter(t)} style={{ padding:"3px 8px",borderRadius:"var(--r-sm)",border:`1px solid ${filter===t?"var(--accent-bd)":"var(--border)"}`,background:filter===t?"var(--accent-bg)":"var(--elevated)",color:filter===t?"var(--accent)":typeColor[t]||"var(--text-sec)",fontSize:9,fontFamily:"var(--font-mono)",cursor:"pointer",fontWeight:filter===t?700:400 }}>
              {t}{t!=="ALL"&&counts[t]?` (${counts[t]})`:t==="ALL"?` (${allEvents.length})`:""}
            </button>
          ))}
        </div>

        {/* Events list */}
        <div style={{ overflowY:"auto",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",maxHeight:520 }}>
          {filtered.length===0&&<div style={{ textAlign:"left",padding:"24px 12px",color:"var(--text-sec)",fontSize:11,fontFamily:"var(--font-mono)" }}>No events match filter.</div>}
          {filtered.map((e,i)=>{
            const col = typeColor[e.type]||"var(--text-sec)";
            const dt = new Date(e.ts);
            const dateStr = dt.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
            const timeStr = dt.toLocaleTimeString("en-IN",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"});
            const msStr = String(dt.getMilliseconds()).padStart(3,"0");
            const extraFields = Object.entries(e).filter(([k])=>!["ts","type"].includes(k));
            const isExp = !!expanded[i];
            return (
              <div key={i} style={{ borderBottom:"1px solid var(--border)",padding:"8px 10px",background:i%2===0?"var(--bg)":"rgba(255,255,255,0.01)",cursor:"pointer" }} onClick={()=>toggleExpand(i)}>
                {/* Row header */}
                <div style={{ display:"flex",alignItems:"flex-start",gap:8,textAlign:"left" }}>
                  {/* Expand toggle */}
                  <span style={{ fontSize:9,color:"var(--text-sec)",flexShrink:0,paddingTop:1,fontFamily:"var(--font-mono)",width:10 }}>{isExp?"▾":"▸"}</span>
                  {/* Type badge */}
                  <span style={{ fontSize:9,fontFamily:"var(--font-mono)",fontWeight:700,color:col,flexShrink:0,minWidth:130,paddingTop:1 }}>{e.type}</span>
                  {/* Timestamp */}
                  <div style={{ fontSize:9,fontFamily:"var(--font-mono)",color:"var(--text-sec)",flexShrink:0,textAlign:"left",lineHeight:1.4,paddingTop:1 }}>
                    <span style={{ color:"var(--text-pri)",fontWeight:600 }}>{timeStr}</span>
                    <span style={{ opacity:0.5 }}>.{msStr}</span>
                    <span style={{ marginLeft:5,opacity:0.6 }}>{dateStr}</span>
                  </div>
                </div>
                {/* Inline summary — always visible */}
                {extraFields.length > 0 && (
                  <div style={{ marginTop:4,marginLeft:18,display:"flex",flexWrap:"wrap",gap:"3px 10px",textAlign:"left" }}>
                    {extraFields.slice(0,isExp?extraFields.length:3).map(([k,v])=>(
                      <div key={k} style={{ fontSize:9,fontFamily:"var(--font-mono)",color:"var(--text-sec)",textAlign:"left" }}>
                        <span style={{ color:"var(--text-sec)",opacity:0.6 }}>{k}:</span>
                        {" "}
                        <span style={{ color: k==="correct"?(v===true?"var(--success)":v===false?"var(--error)":"var(--text-pri)"):"var(--text-pri)", fontWeight:600, wordBreak:"break-all" }}>
                          {typeof v==="object"?JSON.stringify(v):String(v)}
                        </span>
                      </div>
                    ))}
                    {!isExp && extraFields.length > 3 && (
                      <span style={{ fontSize:9,fontFamily:"var(--font-mono)",color:"var(--text-sec)",opacity:0.5 }}>+{extraFields.length-3} more…</span>
                    )}
                  </div>
                )}
                {/* Expanded: full JSON view */}
                {isExp && (
                  <div style={{ marginTop:8,marginLeft:18,padding:"8px 10px",background:"var(--elevated)",borderRadius:"var(--r-sm)",border:"1px solid var(--border)" }}>
                    <div style={{ fontSize:8,fontFamily:"var(--font-mono)",color:"var(--text-sec)",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.08em" }}>Full Event · ts: {e.ts}</div>
                    {Object.entries(e).map(([k,v])=>(
                      <div key={k} style={{ display:"flex",gap:6,padding:"2px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",textAlign:"left" }}>
                        <span style={{ fontSize:9,fontFamily:"var(--font-mono)",color:"var(--text-sec)",flexShrink:0,minWidth:90,opacity:0.8 }}>{k}</span>
                        <span style={{ fontSize:9,fontFamily:"var(--font-mono)",color: k==="type"?col:k==="correct"?(v===true?"var(--success)":v===false?"var(--error)":"var(--text-pri)"):"var(--text-pri)",fontWeight:k==="type"?700:400,flex:1,wordBreak:"break-all",lineHeight:1.5 }}>
                          {typeof v==="object"?JSON.stringify(v,null,0):String(v)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length >= limit && (
          <button className="btn btn-ghost btn-full" style={{ marginTop:8 }} onClick={()=>setLimit(l=>l+100)}>
            Load {Math.min(100, allEvents.filter(e=>filter==="ALL"||e.type===filter).length - limit)} more
          </button>
        )}
      </div>
    </div>
  );
}

// ─── CLEAR POOL PAGE ──────────────────────────────────────────────────────────
function ClearPoolPage({ onBack }) {
  const [done, setDone] = useState([]);
  const [confirm, setConfirm] = useState(null); // id of action awaiting confirm

  const getSizes = () => ({
    qbase:      QBase.getAll().length,
    cache:      QBase.getAiCache().length,
    parking:    QBase.getParkingLot().length,
    leitner:    Object.keys(Store.get(SK.leitner,{})).length,
    seenMap:    Object.keys(Store.get(SK.seenMap,{})).length,
    events:     Store.get(SK.events,[]).length,
    sessions:   Store.get(SK.sessionCount,0),
    apiKeys:    !!localStorage.getItem(SK.apiKeys),
    rateConfig: !!localStorage.getItem(SK.rateConfig),
  });
  const [sizes, setSizes] = useState(getSizes);
  const refresh = () => setSizes(getSizes());

  const actions = [
    {
      id:"qbase", icon:"📚", label:"Clear qBase",
      desc:"Remove all questions from active bank. Keeps cache, parking lot, and progress.",
      color:"var(--error)", bg:"var(--error-bg)", bd:"var(--error-bd)",
      badge: `${sizes.qbase}Q`,
      run: () => { Store.set(SK.qbase,[]); },
    },
    {
      id:"cache", icon:"🗃", label:"Clear AI Cache",
      desc:"Flush all pending AI-generated questions waiting in cache.",
      color:"var(--warning)", bg:"var(--warning-bg)", bd:"var(--warning-bd)",
      badge: `${sizes.cache}Q`,
      run: () => { Store.set(SK.aiCache,[]); },
    },
    {
      id:"parking", icon:"🅿", label:"Clear Parking Lot",
      desc:"Remove all retired questions and their variants.",
      color:"var(--warning)", bg:"var(--warning-bg)", bd:"var(--warning-bd)",
      badge: `${sizes.parking}Q`,
      run: () => { Store.set(SK.parkingLot,[]); },
    },
    {
      id:"leitner", icon:"🗂", label:"Reset Leitner Boxes",
      desc:"Reset all spaced repetition box states. Questions will restart from Box 0.",
      color:"var(--accent)", bg:"var(--accent-bg)", bd:"var(--accent-bd)",
      badge: `${sizes.leitner} entries`,
      run: () => { Store.set(SK.leitner,{}); },
    },
    {
      id:"seenmap", icon:"👁", label:"Reset Seen Tracker",
      desc:"Clear all seen counts. Every question becomes NEW again.",
      color:"var(--accent)", bg:"var(--accent-bg)", bd:"var(--accent-bd)",
      badge: `${sizes.seenMap} tracked`,
      run: () => { Store.set(SK.seenMap,{}); Store.set(SK.qbase, QBase.getAll().map(q=>({...q,seenCount:0,lastSeenSession:0}))); },
    },
    {
      id:"events", icon:"📋", label:"Clear Event Log",
      desc:"Wipe all recorded events and session logs.",
      color:"var(--text-sec)", bg:"var(--elevated)", bd:"var(--border)",
      badge: `${sizes.events} events`,
      run: () => { Store.set(SK.events,[]); Store.set(SK.sessionCount,0); },
    },
    {
      id:"apikeys", icon:"🔑", label:"Clear API Keys",
      desc:"Remove all saved Gemini API keys from storage.",
      color:"var(--error)", bg:"var(--error-bg)", bd:"var(--error-bd)",
      badge: sizes.apiKeys ? "Saved" : "Empty",
      run: () => { localStorage.removeItem(SK.apiKeys); },
    },
    {
      id:"rateconfig", icon:"⚙", label:"Reset Rate Config",
      desc:"Restore default rate limits (RPM: 10, TPM: 250k).",
      color:"var(--text-sec)", bg:"var(--elevated)", bd:"var(--border)",
      badge: sizes.rateConfig ? "Custom" : "Default",
      run: () => { localStorage.removeItem(SK.rateConfig); },
    },
    {
      id:"factory", icon:"💥", label:"Factory Reset",
      desc:"WIPE EVERYTHING — all questions, progress, keys, config, events. Fresh start.",
      color:"var(--error)", bg:"var(--error-bg)", bd:"var(--error-bd)",
      badge: "DANGER",
      danger: true,
      run: () => {
        Object.values(SK).forEach(k => { try { localStorage.removeItem(k); } catch {} });
      },
    },
  ];

  const execute = (action) => {
    action.run();
    refresh();
    setDone(d => [...d, action.id]);
    setConfirm(null);
    setTimeout(() => setDone(d => d.filter(x => x !== action.id)), 2500);
  };

  return (
    <div className="admin-overlay">
      <div className="admin-header">
        <button onClick={onBack} style={{ width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"1px solid var(--border)",color:"var(--text-sec)",cursor:"pointer",fontSize:13,fontWeight:700 }}>←</button>
        <span style={{ fontSize:16 }}>🧹</span>
        <div style={{ flex:1,minWidth:0 }}>
          <div className="admin-title">Clear Pool</div>
          <div className="admin-sub">Selective clear · Factory reset</div>
        </div>
      </div>
      <div className="admin-body">
        <div style={{ padding:"9px 12px",background:"var(--warning-bg)",border:"1px solid var(--warning-bd)",borderRadius:"var(--r-sm)",marginBottom:14,fontSize:10,color:"var(--warning)",fontFamily:"var(--font-mono)",lineHeight:1.6 }}>
          ⚠ All clears are immediate and irreversible. Export your data first if needed.
        </div>

        {actions.map(action => {
          const isDone = done.includes(action.id);
          const isConfirming = confirm === action.id;
          return (
            <div key={action.id} style={{ marginBottom:8,padding:"11px 13px",background:isConfirming?action.bg:"var(--surface)",border:`1px solid ${isConfirming?action.bd:"var(--border)"}`,borderRadius:"var(--r-sm)",transition:"all 0.15s" }}>
              <div style={{ display:"flex",alignItems:"center",gap:9 }}>
                <div style={{ width:28,height:28,borderRadius:5,background:action.danger?"var(--error-bg)":"var(--elevated)",border:`1px solid ${action.danger?"var(--error-bd)":"var(--border)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0 }}>{action.icon}</div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:2 }}>
                    <span style={{ fontSize:12,fontWeight:700,color:action.danger?"var(--error)":"var(--text-pri)" }}>{action.label}</span>
                    <span style={{ fontSize:8,fontFamily:"var(--font-mono)",padding:"1px 6px",borderRadius:3,background:action.bg,border:`1px solid ${action.bd}`,color:action.color,fontWeight:700 }}>{action.badge}</span>
                    {isDone&&<span style={{ fontSize:9,color:"var(--success)",fontFamily:"var(--font-mono)",fontWeight:700 }}>✓ Done</span>}
                  </div>
                  <div style={{ fontSize:9,color:"var(--text-sec)",lineHeight:1.4 }}>{action.desc}</div>
                </div>
                {!isConfirming && !isDone && (
                  <button onClick={()=>setConfirm(action.id)} style={{ padding:"5px 11px",borderRadius:"var(--r-sm)",border:`1px solid ${action.danger?"var(--error-bd)":"var(--border)"}`,background:action.danger?"var(--error-bg)":"var(--elevated)",color:action.danger?"var(--error)":"var(--text-sec)",fontSize:10,fontFamily:"var(--font-mono)",cursor:"pointer",fontWeight:600,flexShrink:0 }}>
                    Clear
                  </button>
                )}
                {isDone && (
                  <div style={{ width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"var(--success)" }}>✓</div>
                )}
              </div>
              {isConfirming && (
                <div style={{ marginTop:10,paddingTop:10,borderTop:`1px solid ${action.bd}` }}>
                  <div style={{ fontSize:10,color:action.danger?"var(--error)":"var(--warning)",fontFamily:"var(--font-mono)",marginBottom:8,fontWeight:600 }}>
                    {action.danger ? "⚠ This will wipe ALL app data. Are you absolutely sure?" : `Confirm: ${action.label}?`}
                  </div>
                  <div style={{ display:"flex",gap:6 }}>
                    <button onClick={()=>execute(action)} style={{ flex:2,padding:"7px",borderRadius:"var(--r-sm)",border:`1px solid ${action.bd}`,background:action.bg,color:action.color,fontSize:11,fontFamily:"var(--font-mono)",cursor:"pointer",fontWeight:700 }}>
                      {action.danger?"⚠ Yes, wipe everything":"✓ Confirm Clear"}
                    </button>
                    <button onClick={()=>setConfirm(null)} style={{ flex:1,padding:"7px",borderRadius:"var(--r-sm)",border:"1px solid var(--border)",background:"var(--elevated)",color:"var(--text-sec)",fontSize:11,fontFamily:"var(--font-mono)",cursor:"pointer" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── HEALTH CHECK PAGE ────────────────────────────────────────────────────────
function HealthCheckPage({ onBack }) {
  const [running, setRunning]   = useState(false);
  const [results, setResults]   = useState(null);
  const [healing, setHealing]   = useState(false);
  const [healLog, setHealLog]   = useState(null);
  const [fixedSet, setFixedSet] = useState(new Set());

  const runChecks = useCallback(() => {
    setRunning(true); setResults(null);
    setTimeout(() => {
      const qbase = QBase.getAll(), cache = QBase.getAiCache(), parking = QBase.getParkingLot();
      const events = Store.get(SK.events,[]), keys = getActiveKeys(), rc = getActiveRateConfig();
      const totalQ = qbase.length, cert = CERT_CONFIG;
      let su = 0;
      try { for (let k in localStorage) { if (k.startsWith("tpad01_")) su += (localStorage.getItem(k)||"").length; } } catch {}
      const storageKB = Math.round(su/1024);
      const ids = qbase.map(q=>q.id), dupCount = ids.length - new Set(ids).size;
      const corrupt = qbase.filter(q=>!q.stem||!q.id||!Array.isArray(q.options)||q.options.length<2||!Array.isArray(q.correct)||q.correct.length===0);
      const noExpl = qbase.filter(q=>!q.explanation||q.explanation.trim().length<20);
      const validDoms = new Set(cert.domains.map(d=>d.id));
      const orphans = qbase.filter(q=>!validDoms.has(q.domainId));
      const unscored = qbase.filter(q=>typeof q.score!=="number");
      const lowScore = qbase.filter(q=>typeof q.score==="number"&&q.score<6);
      const keyOk = !!(keys.keyA||keys.keyB);
      const examReady = totalQ>=cert.examQuestions;
      const domainGaps = cert.domains.filter(d=>qbase.filter(q=>q.domainId===d.id).length<d.examQCount);
      const rateOk = rc.rpm>0&&rc.tpm>0&&rc.batchSize>0&&rc.intervalMs>0;
      const recentErr = events.filter(e=>e.type==="ERROR"&&(Date.now()-e.ts)<3600000);
      const mcqPct = totalQ>0?(qbase.filter(q=>q.type==="mcq").length/totalQ)*100:0;
      const typeOk = totalQ===0||Math.abs(mcqPct-80)<=20;

      const checks = [
        { id:"qcount",    icon:"📦", label:"Question Count",        ok:examReady,          val:`${totalQ}Q`,                         note:examReady?`≥${cert.examQuestions} required ✓`:`Need ${cert.examQuestions-totalQ} more`,            sev:examReady?"ok":"error",   fixFn:null,                             fixLabel:null },
        { id:"dupes",     icon:"🔁", label:"Duplicate IDs",          ok:dupCount===0,       val:dupCount===0?"None":dupCount,         note:dupCount===0?"No duplicates":"Duplicates detected — click Fix",                                    sev:dupCount===0?"ok":"error",fixFn:()=>AutoHeal.healDuplicates(),    fixLabel:"Fix Dupes" },
        { id:"corrupt",   icon:"💔", label:"Corrupt Questions",      ok:corrupt.length===0, val:corrupt.length===0?"None":corrupt.length, note:corrupt.length===0?"All valid":"Missing stem/options/correct — click Fix",                   sev:corrupt.length===0?"ok":"error",fixFn:()=>AutoHeal.healCorrupt(), fixLabel:"Fix Corrupt" },
        { id:"noexpl",    icon:"📝", label:"Missing Explanations",   ok:noExpl.length===0,  val:noExpl.length===0?"None":noExpl.length,  note:noExpl.length===0?"All have explanations":"Re-fetch affected Qs to regenerate",              sev:noExpl.length===0?"ok":"warn", fixFn:null,                         fixLabel:null },
        { id:"orphans",   icon:"🏚", label:"Domain Orphans",         ok:orphans.length===0, val:orphans.length===0?"None":orphans.length, note:orphans.length===0?"All domains valid":"Unknown domainId — click Fix to reassign",           sev:orphans.length===0?"ok":"warn",fixFn:()=>AutoHeal.healOrphans(), fixLabel:"Reassign" },
        { id:"lowscore",  icon:"📉", label:"Low Quality Score (<6)", ok:lowScore.length===0,val:lowScore.length===0?"None":lowScore.length,note:lowScore.length===0?"All above threshold":"Low-score Qs — click Fix to remove",             sev:lowScore.length===0?"ok":"warn",fixFn:()=>{const q=Store.get(SK.qbase,[]);Store.set(SK.qbase,q.filter(x=>typeof x.score!=="number"||x.score>=6));return{msg:`✓ Removed ${lowScore.length} low-score question(s)`};}, fixLabel:"Remove" },
        { id:"unscored",  icon:"❓", label:"Unscored Questions",     ok:unscored.length===0,val:unscored.length===0?"None":unscored.length,note:"Generated without scoring pass",                                                           sev:unscored.length===0?"ok":"info",fixFn:null,                        fixLabel:null },
        { id:"typebal",   icon:"⚖",  label:"MCQ/Multi Balance",      ok:typeOk||totalQ===0, val:totalQ===0?"No Q":mcqPct.toFixed(0)+"%MCQ",note:typeOk?"Within ±20% of 80% target":"Type ratio off — fetch more of missing type",          sev:typeOk||totalQ===0?"ok":"warn",fixFn:null,                         fixLabel:null },
        { id:"domgaps",   icon:"🗺", label:"Domain Coverage Gaps",   ok:domainGaps.length===0,val:domainGaps.length===0?"Full":domainGaps.length+" gaps",note:domainGaps.length===0?"All domains covered":"Fetch more Qs for weak domains", sev:domainGaps.length===0?"ok":"warn",fixFn:null,                      fixLabel:null },
        { id:"apikey",    icon:"🔑", label:"API Key Configured",     ok:keyOk,              val:keyOk?"Configured":"Missing",         note:keyOk?`Primary: Key ${keys.primaryKey.toUpperCase()}`:"No key — fetch will fail",               sev:keyOk?"ok":"error",       fixFn:null,                             fixLabel:null },
        { id:"rateconf",  icon:"⚡", label:"Rate Config Valid",      ok:rateOk,             val:rateOk?"OK":"Invalid",                note:rateOk?`${rc.rpm} RPM · ${rc.tpm.toLocaleString()} TPM`:"Corrupted — click Fix to reset",       sev:rateOk?"ok":"warn",       fixFn:()=>AutoHeal.healRateConfig(),    fixLabel:"Reset" },
        { id:"storage",   icon:"💾", label:"Storage Usage",          ok:storageKB<4000,     val:`${storageKB} KB`,                    note:storageKB<4000?`${storageKB}KB / ~5MB`:"Near limit — export & clear old data",                 sev:storageKB<4000?"ok":storageKB<4800?"warn":"error",fixFn:null,      fixLabel:null },
        { id:"errors",    icon:"🚨", label:"Recent Errors (1h)",     ok:recentErr.length===0,val:recentErr.length===0?"None":recentErr.length,note:recentErr.length===0?"No errors in last hour":"Check Event Viewer — click Fix to clear", sev:recentErr.length===0?"ok":"warn",fixFn:()=>AutoHeal.healEventLog(),fixLabel:"Clear" },
        { id:"parking",   icon:"🅿", label:"Parking Lot",            ok:true,               val:`${parking.length}Q`,                 note:"Retired questions (seen 3×) — normal",                                                         sev:"info",                   fixFn:null,                             fixLabel:null },
        { id:"cache",     icon:"🗃", label:"AI Cache",               ok:true,               val:`${cache.length}Q`,                   note:cache.length===0?"Empty — fetch to populate":"Ready to promote — click Fix",                    sev:cache.length===0?"info":"ok",fixFn:cache.length>0?()=>AutoHeal.promoteCache():null,fixLabel:"Promote→qBase" },
      ];
      const errors=checks.filter(c=>c.sev==="error"), warns=checks.filter(c=>c.sev==="warn"), ok=checks.filter(c=>c.sev==="ok");
      setResults({checks,errors,warns,ok,storageKB,totalQ}); setRunning(false);
    }, 600);
  }, []);

  useEffect(()=>{ runChecks(); },[]);

  const runHealAll = () => {
    setHealing(true); setHealLog(null);
    setTimeout(()=>{
      const {log} = AutoHeal.healAll();
      setHealLog(log); setFixedSet(new Set()); setHealing(false); runChecks();
    },400);
  };

  const runItemFix = (check) => {
    if (!check.fixFn) return;
    try {
      const res = check.fixFn();
      setHealLog(prev=>[...(prev||[]), res?.msg||`✓ Fixed: ${check.label}`]);
      setFixedSet(prev=>new Set([...prev,check.id]));
      setTimeout(runChecks,300);
    } catch(e) {
      setHealLog(prev=>[...(prev||[]),`✗ Fix failed (${check.label}): ${e.message}`]);
    }
  };

  const sCol={ok:"var(--success)",warn:"var(--warning)",error:"var(--error)",info:"var(--text-sec)"};
  const sBg ={ok:"var(--success-bg)",warn:"var(--warning-bg)",error:"var(--error-bg)",info:"var(--elevated)"};
  const sBd ={ok:"var(--success-bd)",warn:"var(--warning-bd)",error:"var(--error-bd)",info:"var(--border)"};
  const hasFixable = results && results.checks.some(c=>c.fixFn&&c.sev!=="ok"&&c.sev!=="info"&&!fixedSet.has(c.id));

  return (
    <div className="admin-overlay">
      <div className="admin-header">
        <button onClick={onBack} style={{width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"1px solid var(--border)",color:"var(--text-sec)",cursor:"pointer",fontSize:13,fontWeight:700}}>←</button>
        <span style={{fontSize:16}}>❤️</span>
        <div style={{flex:1,minWidth:0}}>
          <div className="admin-title">Health Check</div>
          <div className="admin-sub">{CERT_CONFIG.id} · System diagnostics</div>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          {hasFixable&&(
            <button onClick={runHealAll} disabled={healing||running}
              style={{padding:"4px 10px",borderRadius:"var(--r-sm)",border:"1px solid var(--success-bd)",background:"var(--success-bg)",color:"var(--success)",fontSize:10,fontFamily:"var(--font-mono)",cursor:"pointer",fontWeight:700,flexShrink:0}}>
              {healing?"⟳ Healing…":"🩹 Auto-Heal All"}
            </button>
          )}
          <button onClick={runChecks} disabled={running||healing}
            style={{padding:"4px 10px",borderRadius:"var(--r-sm)",border:"1px solid var(--border)",background:"var(--elevated)",color:"var(--text-sec)",fontSize:10,fontFamily:"var(--font-mono)",cursor:"pointer",fontWeight:600,flexShrink:0}}>
            {running?"⟳ Running…":"↺ Re-run"}
          </button>
        </div>
      </div>
      <div className="admin-body">
        {running&&(
          <div style={{textAlign:"center",padding:"60px 0",color:"var(--text-sec)",fontFamily:"var(--font-mono)",fontSize:11}}>
            <div style={{fontSize:24,marginBottom:12,animation:"fetchDot 1s ease-in-out infinite"}}>❤️</div>
            Running diagnostics…
          </div>
        )}
        {healLog&&(
          <div style={{marginBottom:14,padding:"10px 13px",borderRadius:"var(--r-sm)",background:"var(--success-bg)",border:"1px solid var(--success-bd)"}}>
            <div style={{fontSize:10,fontWeight:700,color:"var(--success)",fontFamily:"var(--font-mono)",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>🩹 Heal Results</div>
            {healLog.map((line,i)=>(
              <div key={i} style={{fontSize:10,color:line.startsWith("✅")||line.startsWith("✓")?"var(--success)":line.startsWith("──")?"var(--text-sec)":"var(--text-pri)",fontFamily:"var(--font-mono)",lineHeight:1.7}}>{line}</div>
            ))}
          </div>
        )}
        {results&&(
          <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:14}}>
              {[["Errors",results.errors.length,"var(--error)","var(--error-bg)","var(--error-bd)"],
                ["Warnings",results.warns.length,"var(--warning)","var(--warning-bg)","var(--warning-bd)"],
                ["Passed",results.ok.length,"var(--success)","var(--success-bg)","var(--success-bd)"]].map(([l,v,c,bg,bd])=>(
                <div key={l} style={{textAlign:"center",padding:"10px 6px",background:bg,border:`1px solid ${bd}`,borderRadius:"var(--r-sm)"}}>
                  <div style={{fontSize:20,fontWeight:800,fontFamily:"var(--font-mono)",color:c}}>{v}</div>
                  <div style={{fontSize:8,color:"var(--text-sec)",textTransform:"uppercase",letterSpacing:"0.06em",marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
            {results.errors.length===0&&results.warns.length===0?(
              <div style={{padding:"10px 13px",borderRadius:"var(--r-sm)",background:"var(--success-bg)",border:"1px solid var(--success-bd)",marginBottom:14,fontSize:11,color:"var(--success)",fontFamily:"var(--font-mono)"}}>
                ✅ All systems healthy — {results.totalQ}Q in bank.
              </div>
            ):results.errors.length>0?(
              <div style={{padding:"10px 13px",borderRadius:"var(--r-sm)",background:"var(--error-bg)",border:"1px solid var(--error-bd)",marginBottom:14,fontSize:11,color:"var(--error)",fontFamily:"var(--font-mono)"}}>
                🔴 {results.errors.length} critical issue{results.errors.length>1?"s":""} — use 🩹 Auto-Heal All or individual Fix buttons.
              </div>
            ):(
              <div style={{padding:"10px 13px",borderRadius:"var(--r-sm)",background:"var(--warning-bg)",border:"1px solid var(--warning-bd)",marginBottom:14,fontSize:11,color:"var(--warning)",fontFamily:"var(--font-mono)"}}>
                ⚠ {results.warns.length} warning{results.warns.length>1?"s":""} — review or fix recommended.
              </div>
            )}
            {results.checks.map(c=>{
              const isDone = fixedSet.has(c.id);
              const canFix = !!c.fixFn && c.sev!=="ok" && c.sev!=="info" && !isDone;
              return (
                <div key={c.id} style={{display:"flex",alignItems:"flex-start",gap:9,padding:"8px 10px",marginBottom:5,background:sBg[c.sev],border:`1px solid ${sBd[c.sev]}`,borderRadius:"var(--r-sm)"}}>
                  <div style={{fontSize:14,flexShrink:0,marginTop:1}}>{c.icon}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}>
                      <span style={{fontSize:11,fontWeight:700,color:sCol[c.sev]}}>{c.label}</span>
                      <span style={{fontSize:9,fontFamily:"var(--font-mono)",fontWeight:800,padding:"1px 6px",borderRadius:3,background:"rgba(0,0,0,0.15)",color:sCol[c.sev]}}>{String(c.val)}</span>
                      {isDone&&<span style={{fontSize:9,color:"var(--success)",fontFamily:"var(--font-mono)",fontWeight:700}}>✓ Fixed</span>}
                    </div>
                    <div style={{fontSize:9,color:"var(--text-sec)",fontFamily:"var(--font-mono)",lineHeight:1.5}}>{c.note}</div>
                  </div>
                  {canFix?(
                    <button onClick={()=>runItemFix(c)}
                      style={{flexShrink:0,padding:"3px 9px",borderRadius:"var(--r-sm)",border:`1px solid ${sBd[c.sev]}`,background:sBg[c.sev],color:sCol[c.sev],fontSize:9,fontFamily:"var(--font-mono)",cursor:"pointer",fontWeight:700,whiteSpace:"nowrap",alignSelf:"center"}}>
                      🔧 {c.fixLabel||"Fix"}
                    </button>
                  ):(
                    <div style={{fontSize:11,flexShrink:0,fontWeight:800,color:isDone?"var(--success)":sCol[c.sev],alignSelf:"center",minWidth:16,textAlign:"center"}}>
                      {isDone?"✓":c.sev==="ok"?"✓":c.sev==="error"?"✗":c.sev==="warn"?"⚠":"ℹ"}
                    </div>
                  )}
                </div>
              );
            })}
            <div style={{marginTop:10,padding:"8px 11px",background:"var(--elevated)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",fontSize:9,color:"var(--text-sec)",fontFamily:"var(--font-mono)",lineHeight:1.6}}>
              Last checked: {new Date().toLocaleTimeString()} · Storage: {results.storageKB}KB · {results.totalQ}Q in bank
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── AUTO-HEAL PAGE ───────────────────────────────────────────────────────────
function AutoHealPage({ onBack }) {
  const [healing, setHealing]   = useState(false);
  const [healLog, setHealLog]   = useState(null);
  const [issueCount, setIssueCount] = useState(null);
  const [lastRun, setLastRun]   = useState(null);

  useEffect(()=>{ setIssueCount(AutoHeal.quickScan()); },[]);

  const runHeal = (skipPromote=false) => {
    setHealing(true); setHealLog(null);
    setTimeout(()=>{
      const {log,totalFixed} = AutoHeal.healAll({skipPromote});
      setHealLog(log); setHealing(false);
      setLastRun({time:new Date().toLocaleTimeString(),totalFixed});
      setIssueCount(AutoHeal.quickScan());
    },500);
  };

  const actions = [
    { label:"Remove Duplicates",   icon:"🔁", desc:"Deduplicate qBase — keeps first occurrence", fn:()=>{ const r=AutoHeal.healDuplicates(); setHealLog([r.msg||"✅ No duplicates found"]); setIssueCount(AutoHeal.quickScan()); } },
    { label:"Remove Corrupt Qs",   icon:"💔", desc:"Strip questions missing stem / options / correct", fn:()=>{ const r=AutoHeal.healCorrupt(); setHealLog([r.msg||"✅ No corrupt questions"]); setIssueCount(AutoHeal.quickScan()); } },
    { label:"Fix Orphan Domains",  icon:"🏚", desc:"Reassign unknown domainIds to first valid domain", fn:()=>{ const r=AutoHeal.healOrphans(); setHealLog([r.msg||"✅ No orphans found"]); setIssueCount(AutoHeal.quickScan()); } },
    { label:"Remove Junk Scores",  icon:"📉", desc:"Remove questions with score < 3", fn:()=>{ const r=AutoHeal.healLowScore(); setHealLog([r.msg||"✅ No junk-score questions"]); setIssueCount(AutoHeal.quickScan()); } },
    { label:"Reset Rate Config",   icon:"⚡", desc:"Restore rate config to safe defaults if corrupt", fn:()=>{ const r=AutoHeal.healRateConfig(); setHealLog([r.msg||"✅ Rate config is valid"]); } },
    { label:"Clear Error Events",  icon:"🚨", desc:"Remove error events from the event log", fn:()=>{ const r=AutoHeal.healEventLog(); setHealLog([r.msg||"✅ No error events to clear"]); } },
    { label:"Promote AI Cache",    icon:"🗃", desc:"Move passing cache questions into qBase", fn:()=>{ const r=AutoHeal.promoteCache(); setHealLog([r.msg||"✅ Cache is empty or no passing questions"]); } },
  ];

  return (
    <div className="admin-overlay">
      <div className="admin-header">
        <button onClick={onBack} style={{width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"1px solid var(--border)",color:"var(--text-sec)",cursor:"pointer",fontSize:13,fontWeight:700}}>←</button>
        <span style={{fontSize:16}}>🩹</span>
        <div style={{flex:1,minWidth:0}}>
          <div className="admin-title">Auto-Heal</div>
          <div className="admin-sub">{CERT_CONFIG.id} · Self-repair engine</div>
        </div>
        {issueCount!==null&&(
          <div style={{padding:"3px 9px",borderRadius:4,background:issueCount===0?"var(--success-bg)":"var(--error-bg)",border:`1px solid ${issueCount===0?"var(--success-bd)":"var(--error-bd)"}`,fontSize:10,fontWeight:800,fontFamily:"var(--font-mono)",color:issueCount===0?"var(--success)":"var(--error)"}}>
            {issueCount===0?"✅ Clean":`${issueCount} issues`}
          </div>
        )}
      </div>
      <div className="admin-body">
        {/* Summary banner */}
        <div style={{padding:"12px 13px",borderRadius:"var(--r-sm)",background:"var(--surface)",border:"1px solid var(--border)",marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:700,color:"var(--text-pri)",marginBottom:4}}>🩹 Auto-Heal Engine</div>
          <div style={{fontSize:11,color:"var(--text-sec)",lineHeight:1.65}}>
            Scans and repairs qBase issues automatically — duplicates, corrupt questions, domain orphans, junk scores, config corruption, and more.
          </div>
          {lastRun&&<div style={{marginTop:6,fontSize:9,fontFamily:"var(--font-mono)",color:"var(--text-sec)"}}>Last run: {lastRun.time} · {lastRun.totalFixed} item(s) fixed</div>}
        </div>

        {/* Big Heal All button */}
        <button onClick={()=>runHeal(false)} disabled={healing}
          style={{width:"100%",padding:"13px",borderRadius:"var(--r-sm)",border:"1px solid var(--success-bd)",background:"var(--success-bg)",color:"var(--success)",fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:6,fontFamily:"var(--font-mono)"}}>
          {healing?"⟳ Healing…":"🩹 Heal Everything (Auto)"}
        </button>
        <button onClick={()=>runHeal(true)} disabled={healing}
          style={{width:"100%",padding:"9px",borderRadius:"var(--r-sm)",border:"1px solid var(--border)",background:"var(--elevated)",color:"var(--text-sec)",fontSize:11,fontWeight:600,cursor:"pointer",marginBottom:14,fontFamily:"var(--font-mono)"}}>
          Heal Only qBase (skip cache promote)
        </button>

        {/* Heal log */}
        {healLog&&(
          <div style={{marginBottom:14,padding:"10px 13px",borderRadius:"var(--r-sm)",background:"var(--success-bg)",border:"1px solid var(--success-bd)"}}>
            <div style={{fontSize:10,fontWeight:700,color:"var(--success)",fontFamily:"var(--font-mono)",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>Results</div>
            {healLog.map((line,i)=>(
              <div key={i} style={{fontSize:10,color:line.startsWith("✅")||line.startsWith("✓")?"var(--success)":line.startsWith("──")?"var(--text-sec)":"var(--text-pri)",fontFamily:"var(--font-mono)",lineHeight:1.7}}>{line}</div>
            ))}
          </div>
        )}

        {/* Individual actions */}
        <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--text-sec)",fontFamily:"var(--font-mono)",marginBottom:8}}>Individual Repairs</div>
        {actions.map(a=>(
          <div key={a.label} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",marginBottom:5}}>
            <span style={{fontSize:16,flexShrink:0}}>{a.icon}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:11,fontWeight:600,color:"var(--text-pri)"}}>{a.label}</div>
              <div style={{fontSize:9,color:"var(--text-sec)",fontFamily:"var(--font-mono)",marginTop:1}}>{a.desc}</div>
            </div>
            <button onClick={a.fn} disabled={healing}
              style={{flexShrink:0,padding:"4px 11px",borderRadius:"var(--r-sm)",border:"1px solid var(--border)",background:"var(--elevated)",color:"var(--text-sec)",fontSize:10,fontFamily:"var(--font-mono)",cursor:"pointer",fontWeight:600}}>
              🔧 Fix
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel({ onClose, onQbaseChange, fetchContext }) {
  const [subPage, setSubPage] = useState(null);
  const [allEvents, setAllEvents] = useState(()=>Store.get(SK.events,[]));
  const errorCount = allEvents.filter(e=>e.type==="ERROR").length;
  if (subPage==="fetch") return <FetchPage onBack={()=>setSubPage(null)} onQbaseChange={onQbaseChange} fetchContext={fetchContext} />;
  if (subPage==="qbase") return <QBasePage onBack={()=>setSubPage(null)} onQbaseChange={onQbaseChange} />;
  if (subPage==="apikeys") return <APIKeysPage onBack={()=>setSubPage(null)} />;
  if (subPage==="storage") return <StorageInspector onBack={()=>setSubPage(null)} />;
  if (subPage==="audit") return <AuditPage onBack={()=>setSubPage(null)} />;
  if (subPage==="events") return <EventViewerPage onBack={()=>setSubPage(null)} />;
  if (subPage==="clearpool") return <ClearPoolPage onBack={()=>{ setSubPage(null); onQbaseChange && onQbaseChange(); }} />;
  if (subPage==="health") return <HealthCheckPage onBack={()=>setSubPage(null)} />;
  if (subPage==="autoheal") return <AutoHealPage onBack={()=>{ setSubPage(null); onQbaseChange&&onQbaseChange(); }} />;
  const qbase = QBase.getAll();
  const healIssues = AutoHeal.quickScan();
  const healthIssues = (() => { let n=0; if(qbase.length<CERT_CONFIG.examQuestions)n++; if(qbase.filter(q=>q.passes).length/Math.max(qbase.length,1)<0.8)n++; return n; })();
  const tiles = [
    {id:"fetch",    icon:"⚡",  label:"Fetch AI Questions", desc:`Generate questions via Gemini · ${QBase.getAiCache().length} in cache`},
    {id:"qbase",    icon:"📚",  label:"Manage Q Bank",      desc:`${QBase.getAll().length} questions · parking lot: ${QBase.getParkingLot().length}`},
    {id:"audit",    icon:"🔍",  label:"Curriculum Audit",   desc:"Verify qBase against cert spec"},
    {id:"health",   icon:"❤️", label:"Health Check",       desc:healthIssues===0?"All systems healthy":`${healthIssues} issue${healthIssues>1?"s":""} detected`,warn:healthIssues>0},
    {id:"autoheal", icon:"🩹",  label:"Auto-Heal",          desc:healIssues===0?"qBase is clean":`${healIssues} issue${healIssues>1?"s":""} — tap to repair`,warn:healIssues>0},
    {id:"clearpool",icon:"🧹",  label:"Clear Pool",         desc:"Selective reset · Factory wipe · Corpus clear"},
    {id:"apikeys",  icon:"🔑",  label:"API Keys",           desc:"Gemini primary/standby key management"},
    {id:"storage",  icon:"🗄",  label:"Storage Inspector",  desc:"View qBase, cache, events"},
    {id:"events",   icon:"📋",  label:"Event Viewer",       desc:"Live event log with filters"},
  ];
  return (
    <div className="admin-overlay">
      <div className="admin-header">
        <button onClick={onClose} style={{ width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"1px solid var(--border)",color:"var(--text-sec)",cursor:"pointer",fontSize:13,fontWeight:700,flexShrink:0 }}>✕</button>
        <span style={{ fontSize:16,flexShrink:0 }}>⚙</span>
        <div style={{ minWidth:0,flex:1 }}>
          <div className="admin-title">Admin</div>
          <div className="admin-sub">{CERT_CONFIG.id} · {CERT_CONFIG.vendor}</div>
        </div>
      </div>
      <div className="admin-body">
        {tiles.map(t=>(
          <button key={t.id} onClick={()=>setSubPage(t.id)} style={{ width:"100%",background:"var(--surface)",border:`1px solid ${t.warn?"var(--warning-bd)":"var(--border)"}`,borderRadius:"var(--r-sm)",padding:"10px 12px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10,marginBottom:5,transition:"border-color 0.12s" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=t.warn?"var(--warning)":"var(--border2)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor=t.warn?"var(--warning-bd)":"var(--border)";}}>
            <div style={{ width:28,height:28,borderRadius:5,background:t.warn?"var(--warning-bg)":"var(--elevated)",border:`1px solid ${t.warn?"var(--warning-bd)":"var(--border)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0 }}>{t.icon}</div>
            <div style={{ minWidth:0,flex:1 }}>
              <div style={{ fontSize:12,fontWeight:600,color:t.warn?"var(--warning)":"var(--text-pri)" }}>{t.label}</div>
              <div style={{ fontSize:10,color:"var(--text-sec)",fontFamily:"var(--font-mono)",lineHeight:1.3,marginTop:1 }}>{t.desc}</div>
            </div>
            <div style={{ color:"var(--text-sec)",fontSize:12,flexShrink:0 }}>›</div>
          </button>
        ))}
        {errorCount>0&&(
          <div style={{ marginTop:8,padding:"10px 12px",background:"var(--error-bg)",border:"1px solid var(--error-bd)",borderRadius:"var(--r-sm)" }}>
            <div style={{ fontSize:12,fontWeight:600,color:"var(--error)",marginBottom:6 }}>⚠ {errorCount} Error{errorCount>1?"s":""} Recorded</div>
            {allEvents.filter(e=>e.type==="ERROR").slice(-3).reverse().map((e,i)=>(
              <div key={i} style={{ fontSize:10,fontFamily:"var(--font-mono)",color:"var(--error)",lineHeight:1.5 }}>[{new Date(e.ts).toLocaleTimeString()}] {e.msg||JSON.stringify(e).slice(0,60)}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FetchPage({ onBack, onQbaseChange, fetchContext }) {
  const { fetchRunning, fetchLog, fetchStats, fetchTarget, setFetchTarget, fetchDone, startFetch, stopFetch, fillQbase, setFillQbase } = fetchContext;
  const logRef = useRef(null);
  useEffect(()=>{ if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; },[fetchLog]);
  const colorMap = { ok:"#4ade80",warn:"#fbbf24",err:"#f87171",info:"#64748b",done:"#38bdf8",sep:"rgba(255,255,255,0.06)" };
  return (
    <div className="admin-overlay">
      <div className="admin-header">
        <button onClick={onBack} style={{ width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"1px solid var(--border)",color:"var(--text-sec)",cursor:"pointer",fontSize:13,fontWeight:700 }}>←</button>
        <span style={{ fontSize:16 }}>⚡</span>
        <div style={{ flex:1,minWidth:0 }}><div className="admin-title">Fetch AI Questions</div><div className="admin-sub">{CERT_CONFIG.id}</div></div>
      </div>
      <div className="admin-body">
        <div style={{ marginBottom:12 }}>
          <div className="section-label">Target Count</div>
          <div className="count-chips">
            {[12,20,30,50,100].map(n=>(
              <button key={n} className={`count-chip${fetchTarget===n?" active":""}`} onClick={()=>setFetchTarget(n)}>{n}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom:12 }}>
          <div className="section-label">Add to</div>
          <div className="count-chips">
            {[[false,"AI Cache only"],[true,"qBase directly"]].map(([v,l])=>(
              <button key={String(v)} className={`count-chip${fillQbase===v?" active":""}`} onClick={()=>setFillQbase(v)}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex",gap:8,marginBottom:12 }}>
          <button className="btn btn-primary" style={{ flex:2 }} disabled={fetchRunning} onClick={()=>startFetch(fetchTarget, fillQbase)}>
            {fetchRunning?"Fetching…":"▶ Start Fetch"}
          </button>
          {fetchRunning&&<button className="btn btn-ghost" style={{ flex:1 }} onClick={stopFetch}>⏹ Stop</button>}
        </div>
        {fetchStats&&(
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4,marginBottom:12 }}>
            {[["Rcvd",fetchStats.received||0,"var(--text-sec)"],["Added",fetchStats.added||0,"var(--success)"],["Calls",fetchStats.batches||0,"var(--accent)"]].map(([l,v,c])=>(
              <div key={l} style={{ textAlign:"center",padding:"7px 4px",background:"var(--elevated)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)" }}>
                <div style={{ fontSize:16,fontWeight:800,fontFamily:"var(--font-mono)",color:c }}>{v}</div>
                <div style={{ fontSize:9,color:"var(--text-sec)",textTransform:"uppercase",letterSpacing:"0.06em",marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
        )}
        <div ref={logRef} style={{ height:220,overflowY:"auto",padding:"8px 10px",background:"var(--bg)",fontFamily:"var(--font-mono)",fontSize:10,lineHeight:1.7,border:"1px solid var(--border)",borderRadius:"var(--r-sm)" }}>
          {fetchLog.length===0&&<div style={{ color:"var(--text-sec)",textAlign:"center",paddingTop:50 }}>Waiting…</div>}
          {fetchLog.map((entry,i)=>(
            <div key={i} style={{ color:colorMap[entry.type]||"var(--text-sec)" }}>
              <span style={{ color:"var(--border)",marginRight:5 }}>{entry.ts}</span>{entry.msg}
            </div>
          ))}
        </div>
        {fetchDone&&<div style={{ marginTop:8,padding:"8px 12px",background:"var(--success-bg)",border:"1px solid var(--success-bd)",borderRadius:"var(--r-sm)",fontSize:11,color:"var(--success)",fontFamily:"var(--font-mono)" }}>✅ Fetch complete — {fetchStats?.added||0} questions added</div>}
      </div>
    </div>
  );
}

function QBasePage({ onBack, onQbaseChange }) {
  const [qbase, setQbase] = useState(()=>QBase.getAll());
  const [cache, setCache] = useState(()=>QBase.getAiCache());
  const reload = () => { setQbase(QBase.getAll()); setCache(QBase.getAiCache()); onQbaseChange(); };
  const clearQbase = () => { if (!window.confirm("Clear all questions from qBase?")) return; Store.set(SK.qbase,[]); reload(); };
  const clearCache = () => { if (!window.confirm("Clear AI Cache?")) return; Store.set(SK.aiCache,[]); reload(); };
  const moveAllToQbase = () => { const c=QBase.getAiCache(); QBase.add(c.filter(q=>q.passes)); reload(); };

  const exportJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="admin-overlay">
      <div className="admin-header">
        <button onClick={onBack} style={{ width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"1px solid var(--border)",color:"var(--text-sec)",cursor:"pointer",fontSize:13,fontWeight:700 }}>←</button>
        <span style={{ fontSize:16 }}>📚</span>
        <div style={{ flex:1,minWidth:0 }}><div className="admin-title">Manage Q Bank</div><div className="admin-sub">{CERT_CONFIG.id}</div></div>
      </div>
      <div className="admin-body">
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14 }}>
          {[["qBase",qbase.length,"Active questions","var(--success)"],[" AI Cache",cache.length,"Pending questions","var(--accent)"]].map(([label,count,sub,color])=>(
            <div key={label} style={{ padding:"12px 14px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)" }}>
              <div style={{ fontSize:9,fontWeight:700,textTransform:"uppercase",color:"var(--text-sec)",fontFamily:"var(--font-mono)",marginBottom:4 }}>{label}</div>
              <div style={{ fontSize:22,fontWeight:800,color,fontFamily:"var(--font-mono)",lineHeight:1 }}>{count}</div>
              <div style={{ fontSize:10,color:"var(--text-sec)",marginTop:3 }}>{sub}</div>
            </div>
          ))}
        </div>
        <button className="btn btn-primary btn-full" style={{ marginBottom:6 }} onClick={moveAllToQbase}>⬆ Move Cache → qBase (passing only)</button>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:14 }}>
          <button className="btn btn-ghost" onClick={clearQbase}>🗑 Clear qBase</button>
          <button className="btn btn-ghost" onClick={clearCache}>🗑 Clear Cache</button>
        </div>
        {/* JSON Export */}
        <div style={{ marginBottom:14 }}>
          <div className="section-label">Export JSON</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:6 }}>
            <button className="btn btn-ghost" onClick={()=>exportJSON(qbase,`tpad01-qbase-${CERT_CONFIG.id}-${Date.now()}.json`)} disabled={qbase.length===0} style={{ fontSize:11,gap:4 }}>
              <span>⬇</span> qBase ({qbase.length}Q)
            </button>
            <button className="btn btn-ghost" onClick={()=>exportJSON(cache,`tpad01-cache-${CERT_CONFIG.id}-${Date.now()}.json`)} disabled={cache.length===0} style={{ fontSize:11,gap:4 }}>
              <span>⬇</span> Cache ({cache.length}Q)
            </button>
          </div>
          <button className="btn btn-ghost btn-full" onClick={()=>exportJSON({qbase,cache,parkingLot:QBase.getParkingLot(),events:Store.get(SK.events,[]),exportedAt:new Date().toISOString(),cert:CERT_CONFIG.id},`tpad01-full-export-${CERT_CONFIG.id}-${Date.now()}.json`)} style={{ marginTop:6,fontSize:11 }}>
            ⬇ Full Export (qBase + Cache + Events)
          </button>
        </div>
        <div style={{ marginBottom:10 }}>
          <div className="section-label">Domain Distribution</div>
          {CERT_CONFIG.domains.map(d=>{
            const dCount=qbase.filter(q=>q.domainId===d.id).length, cCount=cache.filter(q=>q.domainId===d.id).length;
            return (
              <div key={d.id} style={{ display:"flex",alignItems:"center",gap:8,marginBottom:5 }}>
                <div style={{ fontSize:10,color:"var(--text-sec)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{d.name}</div>
                <span style={{ fontSize:10,fontFamily:"var(--font-mono)",color:"var(--success)",flexShrink:0 }}>{dCount}Q</span>
                <span style={{ fontSize:10,fontFamily:"var(--font-mono)",color:"var(--accent)",flexShrink:0 }}>+{cCount}c</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function APIKeysPage({ onBack }) {
  const [keys, setKeys] = useState(()=>getActiveKeys());
  const [showA, setShowA] = useState(false), [showB, setShowB] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testResult, setTestResult] = useState({}); // {a: {status, msg}, b: {...}}
  const [testing, setTesting] = useState({});
  const [rateConfig, setRateConfig] = useState(()=>getActiveRateConfig());
  const [rateSaved, setRateSaved] = useState(false);

  const save = () => { Store.set(SK.apiKeys, keys); setSaved(true); setTimeout(()=>setSaved(false),2000); };

  const testKey = async (slot) => {
    const key = slot==="a" ? keys.keyA : keys.keyB;
    const model = slot==="a" ? KEY_A_MODEL : KEY_B_MODEL;
    if (!key) { setTestResult(r=>({...r,[slot]:{status:"error",msg:"No key entered"}})); return; }
    setTesting(t=>({...t,[slot]:true}));
    setTestResult(r=>({...r,[slot]:{status:"testing",msg:"Testing…"}}));
    try {
      const url = GEMINI_ENDPOINT(model, key);
      const resp = await fetch(url, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ contents:[{parts:[{text:"Reply with exactly: OK"}]}], generationConfig:{maxOutputTokens:5,temperature:0} }),
      });
      if (resp.ok) {
        const data = await resp.json();
        const text = ((data.candidates||[]).flatMap(c=>(c.content?.parts||[]).map(p=>p.text||""))).join("").trim();
        setTestResult(r=>({...r,[slot]:{status:"ok",msg:`✓ Connected · Model: ${model} · Response: "${text.slice(0,20)}"`}}));
      } else {
        const err = await resp.json().catch(()=>({}));
        setTestResult(r=>({...r,[slot]:{status:"error",msg:`✗ HTTP ${resp.status}: ${err?.error?.message||"Unknown error"}`}}));
      }
    } catch(e) {
      setTestResult(r=>({...r,[slot]:{status:"error",msg:`✗ ${e.message}`}}));
    }
    setTesting(t=>({...t,[slot]:false}));
  };

  const saveRate = () => {
    const toSave = { rpm: rateConfig.rpm, tpm: rateConfig.tpm, batchSize: rateConfig.batchSize, intervalMs: rateConfig.intervalMs };
    localStorage.setItem(SK.rateConfig, JSON.stringify(toSave));
    setRateSaved(true); setTimeout(()=>setRateSaved(false),2000);
  };

  const resetRate = () => {
    setRateConfig({ rpm: 10, tpm: 250000, batchSize: 5, intervalMs: 6000 });
  };

  // Each field is fully independent — no cross-field auto-computation on any change
  const rcField = (label, key, min, max, hint) => (
    <div key={key} style={{ marginBottom:12 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5 }}>
        <span style={{ fontSize:10,fontWeight:700,fontFamily:"var(--font-mono)",color:"var(--text-sec)",textTransform:"uppercase",letterSpacing:"0.06em" }}>{label}</span>
        <input
          type="number" min={min} max={max}
          value={rateConfig[key]}
          onChange={e=>{
            const raw = e.target.value;
            // Allow free typing — only clamp on blur, store raw int while typing
            const v = raw === "" ? min : parseInt(raw);
            if (!isNaN(v)) setRateConfig(prev => ({ ...prev, [key]: v }));
          }}
          onBlur={e=>{
            const v = parseInt(e.target.value);
            const clamped = isNaN(v) ? min : Math.max(min, Math.min(max, v));
            setRateConfig(prev => ({ ...prev, [key]: clamped }));
          }}
          style={{ width:100,textAlign:"right",padding:"5px 9px",fontSize:13,fontFamily:"var(--font-mono)",background:"var(--elevated)",border:"1px solid var(--accent-bd)",borderRadius:"var(--r-sm)",color:"var(--text-pri)",fontWeight:700 }}
        />
      </div>
      <div style={{ height:3,background:"var(--border)",borderRadius:2,overflow:"hidden" }}>
        <div style={{ height:"100%",width:`${Math.min(100,Math.round(Math.max(0,(rateConfig[key]-min))/(max-min)*100))}%`,background:"var(--accent)",borderRadius:2,transition:"width 0.15s" }}/>
      </div>
      <div style={{ display:"flex",justifyContent:"space-between",marginTop:3 }}>
        <span style={{ fontSize:8,color:"var(--text-sec)",fontFamily:"var(--font-mono)" }}>{min}</span>
        <span style={{ fontSize:8,color:"var(--text-sec)",fontFamily:"var(--font-mono)" }}>{hint}</span>
        <span style={{ fontSize:8,color:"var(--text-sec)",fontFamily:"var(--font-mono)" }}>{max}</span>
      </div>
    </div>
  );

  return (
    <div className="admin-overlay">
      <div className="admin-header">
        <button onClick={onBack} style={{ width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"1px solid var(--border)",color:"var(--text-sec)",cursor:"pointer",fontSize:13,fontWeight:700 }}>←</button>
        <span style={{ fontSize:16 }}>🔑</span>
        <div style={{ flex:1,minWidth:0 }}><div className="admin-title">API Keys</div><div className="admin-sub">Gemini Primary/Standby System</div></div>
      </div>
      <div className="admin-body">
        <div style={{ padding:"10px 12px",background:"var(--accent-bg)",border:"1px solid var(--accent-bd)",borderRadius:"var(--r-sm)",marginBottom:14,fontSize:11,color:"var(--text-sec)",lineHeight:1.6 }}>
          Primary key fires on every call. Key A uses your Gemini API key. Key B is the built-in Claude Sonnet — always available, no key required.
        </div>
        {/* Key A — Gemini (user key) */}
        {[["a","Key A",KEY_A_MODEL,showA,setShowA]].map(([slot,label,model,show,setShow])=>{
          const isPrimary = keys.primaryKey === slot;
          const tr = testResult[slot];
          return (
            <div key={slot} style={{ marginBottom:12,padding:"12px 14px",background:"var(--surface)",border:`1px solid ${isPrimary?"var(--accent-bd)":"var(--border)"}`,borderRadius:"var(--r-sm)" }}>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                <div style={{ fontSize:11,fontWeight:700,color:isPrimary?"var(--accent)":"var(--text-sec)" }}>{label}</div>
                <div style={{ fontSize:9,fontFamily:"var(--font-mono)",color:"var(--text-sec)",background:"var(--elevated)",border:"1px solid var(--border)",borderRadius:3,padding:"1px 6px" }}>{model}</div>
                {isPrimary&&<span style={{ fontSize:9,fontWeight:700,color:"var(--success)",fontFamily:"var(--font-mono)",background:"var(--success-bg)",border:"1px solid var(--success-bd)",borderRadius:3,padding:"1px 6px" }}>PRIMARY</span>}
                {!isPrimary&&<button onClick={()=>setKeys(k=>({...k,primaryKey:slot}))} style={{ fontSize:9,fontFamily:"var(--font-mono)",color:"var(--accent)",background:"none",border:"1px solid var(--accent-bd)",borderRadius:3,padding:"1px 8px",cursor:"pointer" }}>Make Primary</button>}
              </div>
              <div style={{ display:"flex",gap:6,marginBottom:8 }}>
                <input type={show?"text":"password"} value={keys.keyA} onChange={e=>setKeys(k=>({...k,keyA:e.target.value}))} placeholder="Gemini API key (aistudio.google.com)" style={{ flex:1 }} />
                <button onClick={()=>setShow(v=>!v)} style={{ width:36,height:34,borderRadius:"var(--r-sm)",border:"1px solid var(--border)",background:"var(--elevated)",color:"var(--text-sec)",cursor:"pointer",fontSize:14,flexShrink:0 }}>{show?"🙈":"👁"}</button>
              </div>
              <button onClick={()=>testKey(slot)} disabled={testing[slot]} style={{ width:"100%",padding:"6px",borderRadius:"var(--r-sm)",border:"1px solid var(--border)",background:"var(--elevated)",color:"var(--text-sec)",fontSize:10,fontFamily:"var(--font-mono)",cursor:"pointer",fontWeight:600 }}>
                {testing[slot]?"⟳ Testing…":"⚡ Test Key"}
              </button>
              {tr&&(
                <div style={{ marginTop:6,padding:"6px 10px",borderRadius:"var(--r-sm)",background:tr.status==="ok"?"var(--success-bg)":tr.status==="testing"?"var(--accent-bg)":"var(--error-bg)",border:`1px solid ${tr.status==="ok"?"var(--success-bd)":tr.status==="testing"?"var(--accent-bd)":"var(--error-bd)"}`,fontSize:9,fontFamily:"var(--font-mono)",color:tr.status==="ok"?"var(--success)":tr.status==="testing"?"var(--accent)":"var(--error)" }}>
                  {tr.msg}
                </div>
              )}
            </div>
          );
        })}
        {/* Key B — Claude Sonnet Built-in */}
        {(()=>{
          const slot = "b";
          const isPrimary = keys.primaryKey === slot;
          return (
            <div style={{ marginBottom:12,padding:"12px 14px",background:"var(--surface)",border:`1px solid ${isPrimary?"var(--accent-bd)":"var(--border)"}`,borderRadius:"var(--r-sm)" }}>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                <div style={{ fontSize:11,fontWeight:700,color:isPrimary?"var(--accent)":"var(--text-sec)" }}>Key B</div>
                <div style={{ fontSize:9,fontFamily:"var(--font-mono)",color:"var(--text-sec)",background:"var(--elevated)",border:"1px solid var(--border)",borderRadius:3,padding:"1px 6px" }}>{KEY_B_MODEL}</div>
                {isPrimary&&<span style={{ fontSize:9,fontWeight:700,color:"var(--success)",fontFamily:"var(--font-mono)",background:"var(--success-bg)",border:"1px solid var(--success-bd)",borderRadius:3,padding:"1px 6px" }}>PRIMARY</span>}
                {!isPrimary&&<button onClick={()=>setKeys(k=>({...k,primaryKey:slot}))} style={{ fontSize:9,fontFamily:"var(--font-mono)",color:"var(--accent)",background:"none",border:"1px solid var(--accent-bd)",borderRadius:3,padding:"1px 8px",cursor:"pointer" }}>Make Primary</button>}
              </div>
              <div style={{ padding:"10px 12px",background:"var(--success-bg)",border:"1px solid var(--success-bd)",borderRadius:"var(--r-sm)",fontSize:11,color:"var(--success)",lineHeight:1.6 }}>
                ✓ Built-in Claude Sonnet — No API key required. Always available via artifact.
              </div>
            </div>
          );
        })()}
        <button className="btn btn-primary btn-full" onClick={save}>{saved?"✓ Saved!":"Save Keys"}</button>
        <div style={{ marginTop:10,fontSize:10,color:"var(--text-sec)",fontFamily:"var(--font-mono)",lineHeight:1.6 }}>
          Get a free Gemini API key at <span style={{ color:"var(--accent)" }}>aistudio.google.com</span>
        </div>

        {/* Rate Config Meter */}
        <div style={{ marginTop:20,paddingTop:16,borderTop:"1px solid var(--border)" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
            <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",fontFamily:"var(--font-mono)",color:"var(--text-sec)" }}>Rate Config</div>
            <button onClick={resetRate} style={{ fontSize:9,fontFamily:"var(--font-mono)",color:"var(--text-sec)",background:"none",border:"1px solid var(--border)",borderRadius:3,padding:"2px 8px",cursor:"pointer" }}>↺ Defaults</button>
          </div>
          <div style={{ marginBottom:10,padding:"8px 10px",background:"var(--elevated)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",fontSize:9,color:"var(--text-sec)",fontFamily:"var(--font-mono)",lineHeight:1.7 }}>
            All fields are independent — edit any value freely. Changes only apply after Save.
          </div>
          <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",padding:"12px 14px" }}>
            {rcField("RPM — Requests per Minute", "rpm", 1, 120, "Free tier: 10–15")}
            {rcField("TPM — Tokens per Minute",   "tpm", 1000, 500000, "Free tier: 250,000")}
            {rcField("Batch Size (Q per call)",   "batchSize", 1, 20, "Q generated per API call")}
            {rcField("Batch Interval (ms)",       "intervalMs", 500, 120000, "Delay between calls")}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6,marginTop:12,padding:"10px",background:"var(--elevated)",borderRadius:"var(--r-sm)" }}>
              {[
                ["RPM",      `${rateConfig.rpm}`,                               "var(--accent)"],
                ["TPM",      `${(rateConfig.tpm/1000).toFixed(0)}K`,            "var(--text-sec)"],
                ["Batch",    `${rateConfig.batchSize}Q`,                        "var(--success)"],
                ["Interval", `${(rateConfig.intervalMs/1000).toFixed(1)}s`,     "var(--text-sec)"],
              ].map(([l,v,c])=>(
                <div key={l} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:13,fontWeight:800,fontFamily:"var(--font-mono)",color:c }}>{v}</div>
                  <div style={{ fontSize:8,color:"var(--text-sec)",textTransform:"uppercase",letterSpacing:"0.06em",marginTop:1 }}>{l}</div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary btn-full" onClick={saveRate} style={{ marginTop:10 }}>{rateSaved?"✓ Saved!":"Save Rate Config"}</button>
          </div>
        </div>

      </div>
    </div>
  );
}

function StorageInspector({ onBack }) {
  const [tab, setTab] = useState("qbase");
  const tabs = [["qbase","qBase"],["cache","Cache"],["events","Events"],["parking","Parking"]];
  const getContent = () => {
    if (tab==="qbase") return QBase.getAll();
    if (tab==="cache") return QBase.getAiCache();
    if (tab==="events") return Store.get(SK.events,[]).slice(-50).reverse();
    if (tab==="parking") return QBase.getParkingLot();
    return [];
  };
  const data = getContent();
  const typeColor = { SESSION_START:"#60a5fa",SESSION_END:"#818cf8",ANSWER:"#34d399",QBASE_ADD:"#38bdf8",VARIANTS_GENERATED:"#a78bfa",WARN:"#fbbf24",ERROR:"#f87171" };

  return (
    <div className="admin-overlay">
      <div className="admin-header">
        <button onClick={onBack} style={{ width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"1px solid var(--border)",color:"var(--text-sec)",cursor:"pointer",fontSize:13,fontWeight:700 }}>←</button>
        <span style={{ fontSize:16 }}>🗄</span>
        <div style={{ flex:1,minWidth:0 }}><div className="admin-title">Storage Inspector</div><div className="admin-sub">{data.length} entries</div></div>
      </div>
      <div className="admin-body">
        <div style={{ display:"flex",gap:4,marginBottom:12,flexWrap:"wrap" }}>
          {tabs.map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{ padding:"4px 10px",border:`1px solid ${tab===id?"var(--accent-bd)":"var(--border)"}`,borderRadius:"var(--r-sm)",background:tab===id?"var(--accent-bg)":"var(--elevated)",color:tab===id?"var(--accent)":"var(--text-sec)",fontSize:11,fontFamily:"var(--font-mono)",cursor:"pointer" }}>{label}</button>
          ))}
        </div>

        {tab === "events" ? (
          /* ── Structured events view ── */
          <div style={{ height:430,overflowY:"auto",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)" }}>
            {data.length === 0 && <div style={{ padding:"20px 12px",color:"var(--text-sec)",fontSize:11,fontFamily:"var(--font-mono)",textAlign:"left" }}>No events recorded.</div>}
            {data.map((e,i) => {
              const col = typeColor[e.type] || "var(--text-sec)";
              const dt = new Date(e.ts);
              const timeStr = dt.toLocaleTimeString("en-IN",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"});
              const dateStr = dt.toLocaleDateString("en-IN",{day:"2-digit",month:"short"});
              const extraFields = Object.entries(e).filter(([k])=>!["ts","type"].includes(k));
              return (
                <div key={i} style={{ padding:"7px 10px",borderBottom:"1px solid var(--border)",background:i%2===0?"var(--bg)":"rgba(255,255,255,0.01)",textAlign:"left" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom: extraFields.length>0?3:0 }}>
                    <span style={{ fontSize:9,fontFamily:"var(--font-mono)",fontWeight:700,color:col,flexShrink:0,minWidth:130 }}>{e.type}</span>
                    <span style={{ fontSize:8,fontFamily:"var(--font-mono)",color:"var(--text-sec)",flexShrink:0 }}>{dateStr} <span style={{ color:"var(--text-pri)",fontWeight:600 }}>{timeStr}</span></span>
                  </div>
                  {extraFields.map(([k,v])=>(
                    <div key={k} style={{ display:"flex",gap:6,paddingLeft:4,textAlign:"left" }}>
                      <span style={{ fontSize:9,fontFamily:"var(--font-mono)",color:"var(--text-sec)",flexShrink:0,minWidth:80,opacity:0.7 }}>{k}</span>
                      <span style={{ fontSize:9,fontFamily:"var(--font-mono)",color: k==="correct"?(v===true?"var(--success)":v===false?"var(--error)":"var(--text-pri)"):"var(--text-pri)",fontWeight:600,flex:1,wordBreak:"break-all",lineHeight:1.5 }}>
                        {typeof v==="object"?JSON.stringify(v):String(v)}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ) : (
          /* ── Raw JSON for other tabs ── */
          <div style={{ height:430,overflowY:"auto",fontFamily:"var(--font-mono)",fontSize:9,lineHeight:1.7,background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",padding:"8px 10px",whiteSpace:"pre-wrap",wordBreak:"break-all",color:"var(--text-sec)",textAlign:"left" }}>
            {JSON.stringify(data.slice(0,20), null, 2)}
            {data.length>20&&`\n\n... and ${data.length-20} more`}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PERSISTENT FETCH WINDOW ──────────────────────────────────────────────────
function PersistentFetchWindow({ fetchContext, onQbaseChange }) {
  const { fetchRunning, fetchLog, fetchStats, fetchDone, showFetchWindow, setShowFetchWindow, stopFetch } = fetchContext;
  const logRef = useRef(null);
  const [minimised, setMinimised] = useState(false);
  useEffect(()=>{ if(logRef.current&&!minimised) logRef.current.scrollTop=logRef.current.scrollHeight; },[fetchLog, minimised]);
  const colorMap = { ok:"#4ade80",warn:"#fbbf24",err:"#f87171",info:"#64748b",done:"#38bdf8",sep:"rgba(255,255,255,0.06)" };
  return (
    <div style={{ position:"fixed",bottom:20,right:20,zIndex:9000,width:minimised?240:380,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r)",overflow:"hidden",transition:"width 0.2s ease" }}>
      <div style={{ display:"flex",alignItems:"center",gap:7,padding:"8px 12px",borderBottom:"1px solid var(--border)",cursor:"pointer" }} onClick={()=>setMinimised(v=>!v)}>
        <div style={{ width:6,height:6,borderRadius:"50%",background:fetchRunning?"var(--accent)":"var(--success)",flexShrink:0,animation:fetchRunning?"fetchDot 1s ease-in-out infinite":"none" }}/>
        <span style={{ fontSize:10,fontWeight:700,color:"var(--text-pri)",fontFamily:"var(--font-mono)",flex:1 }}>{fetchRunning?`Fetching · ${fetchStats?.added||0}Q`:fetchDone?`Done · ${fetchStats?.added||0}Q`:"Fetch window"}</span>
        <div style={{ display:"flex",gap:5 }}>
          {fetchRunning&&<button onClick={e=>{e.stopPropagation();stopFetch();}} style={{ padding:"2px 7px",borderRadius:3,border:"1px solid var(--error-bd)",background:"var(--error-bg)",color:"var(--error)",fontSize:9,cursor:"pointer",fontWeight:700,fontFamily:"var(--font-mono)" }}>Stop</button>}
          <button onClick={e=>{e.stopPropagation();setMinimised(v=>!v);}} style={{ width:18,height:18,borderRadius:3,border:"1px solid var(--border)",background:"transparent",color:"var(--text-sec)",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>{minimised?"▲":"▼"}</button>
          <button onClick={e=>{e.stopPropagation();setShowFetchWindow(false);}} style={{ width:18,height:18,borderRadius:3,border:"1px solid var(--border)",background:"transparent",color:"var(--text-sec)",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
        </div>
      </div>
      {!minimised&&(
        <>
          <div ref={logRef} style={{ height:160,overflowY:"auto",padding:"8px 10px",background:"var(--bg)",fontFamily:"var(--font-mono)",fontSize:10,lineHeight:1.7,textAlign:"left" }}>
            {(fetchLog||[]).map((entry,i)=>(
              <div key={i} style={{ color:colorMap[entry.type]||"var(--text-sec)",display:"flex",gap:7,alignItems:"flex-start",textAlign:"left" }}>
                <span style={{ color:"var(--border)",flexShrink:0,fontSize:9 }}>{entry.ts}</span>
                <span style={{ flex:1,wordBreak:"break-word" }}>{entry.msg}</span>
              </div>
            ))}
          </div>
          <div style={{ padding:"7px 10px",borderTop:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <span style={{ fontSize:9,color:"var(--text-sec)",fontFamily:"var(--font-mono)" }}>{fetchRunning?"Running…":fetchDone?"Complete":"Ready"}</span>
            {!fetchRunning&&<button onClick={()=>setShowFetchWindow(false)} style={{ fontSize:10,color:"var(--text-sec)",background:"none",border:"none",cursor:"pointer",fontFamily:"var(--font-mono)" }}>Dismiss</button>}
          </div>
        </>
      )}
    </div>
  );
}

// ─── STUDY MATERIAL SCREEN ────────────────────────────────────────────────────
// ─── STUDY MATERIAL SCREEN ────────────────────────────────────────────────────
const SK_STUDY_DEEPDIVES = "tpad01_TPAD01_deepdives";

function StudyMaterialScreen({ onBack }) {
  const [activeDomain, setActiveDomain] = useState(STUDY_BLUEPRINT[0].domainId);
  const [openTopics, setOpenTopics] = useState({});
  const [openSubs, setOpenSubs] = useState({});
  const [studySearch, setStudySearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef(null);
  const [aiContent, setAiContent] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SK_STUDY_DEEPDIVES) || "{}"); } catch { return {}; }
  });
  const [aiLoading, setAiLoading] = useState({});
  const [batchGenerating, setBatchGenerating] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ done: 0, total: 0 });
  const batchStopRef = useRef(false);

  const domain = STUDY_BLUEPRINT.find(d => d.domainId === activeDomain);

  const saveDeepDive = (topicId, text) => {
    setAiContent(prev => {
      const updated = { ...prev, [topicId]: text };
      try { localStorage.setItem(SK_STUDY_DEEPDIVES, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const deleteDeepDive = (topicId) => {
    setAiContent(prev => {
      const updated = { ...prev };
      delete updated[topicId];
      delete updated[topicId + "__err"];
      try { localStorage.setItem(SK_STUDY_DEEPDIVES, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const clearAllDeepDives = () => {
    setAiContent({});
    try { localStorage.removeItem(SK_STUDY_DEEPDIVES); } catch {}
  };

  const toggleTopic = (tid) => setOpenTopics(p => ({ ...p, [tid]: !p[tid] }));
  const toggleSub = (key) => setOpenSubs(p => ({ ...p, [key]: !p[key] }));

  // Returns true if saved deep-dive content is an error placeholder (not real AI content)
  const isDeepDiveError = (text) => typeof text === "string" && text.startsWith("⚠ Error");

  const generateDeepDive = async (topic, force = false) => {
    const key = topic.id;
    // Guard: skip if already loading. Skip if content exists AND not forced AND not an error placeholder.
    if (aiLoading[key]) return;
    if (!force && aiContent[key] && !isDeepDiveError(aiContent[key])) return;
    // Clear any prior error / stale content before generating
    if (aiContent[key]) {
      setAiContent(prev => {
        const updated = { ...prev };
        delete updated[key];
        try { localStorage.setItem(SK_STUDY_DEEPDIVES, JSON.stringify(updated)); } catch {}
        return updated;
      });
    }
    setAiLoading(p => ({ ...p, [key]: true }));
    const domainName = STUDY_BLUEPRINT.find(d => d.topics.some(t => t.id === key))?.name || "";
    const prompt = `You are a Proofpoint email security expert and TPAD01 certification exam coach. Generate a comprehensive deep-dive study note for:

TOPIC: "${topic.title}"
DOMAIN: ${domainName}
CERTIFICATION: Proofpoint TPAD01 (Certified Threat Protection Administrator)
DATE CONTEXT: April 2026 — use current Proofpoint Protection Server admin console paths and terminology

Use EXACTLY these section headings (no others):

## Real-World Admin Scenario
A concrete 4-6 sentence enterprise scenario involving this topic. Be specific — name a company, describe a real business problem, give exact user counts or org details.

## Step-by-Step Configuration
Exact Proofpoint admin console navigation with full path › breadcrumb › for every step. Number each step. Use menu names exactly as they appear in the Protection Server UI or PoD cloud console.

## Common Admin Mistakes
5 bullet points. Each: mistake → why it happens → correct approach. Be specific and technical.

## Exam Tip
2-3 sentences covering the single most exam-critical distinction — the thing that trips most TPAD01 candidates.

## Quick Reference Card
8-10 bullet points: exact limits, key facts, feature availability, Protection Server console paths. Terse, high-density.

## Comparison Table or Process Flow
Either: a markdown-style comparison of 2-3 related options (use | separators for table format), or a numbered process flow showing the correct sequence for a key admin task in this topic.

Be precise. Use exact Proofpoint terminology. No generic platitudes. Cite actual feature names and Protection Server/TAP console paths. Reference help.proofpoint.com documentation where relevant.`;

    try {
      const text = await aiGenerate(prompt);
      if (!text || text.trim().length < 20) throw new Error("Empty or unusable response from AI engine.");
      saveDeepDive(key, text);
    } catch (e) {
      // Store error separately — never treat it as valid content
      setAiContent(prev => {
        const updated = { ...prev, [`${key}__err`]: e.message };
        try { localStorage.setItem(SK_STUDY_DEEPDIVES, JSON.stringify(updated)); } catch {}
        return updated;
      });
    } finally {
      setAiLoading(p => ({ ...p, [key]: false }));
    }
  };

  const allTopics = STUDY_BLUEPRINT.flatMap(d => d.topics);
  const hasValidDeepDive = (tid) => !!aiContent[tid] && !isDeepDiveError(aiContent[tid]);
  const getDeepDiveError = (tid) => aiContent[tid + '__err'] || null;
  const ungenerated = allTopics.filter(t => !hasValidDeepDive(t.id));

  const batchGenerate = async () => {
    if (batchGenerating) return;
    const targets = allTopics.filter(t => !hasValidDeepDive(t.id));
    if (targets.length === 0) return;
    batchStopRef.current = false;
    setBatchGenerating(true);
    setBatchProgress({ done: 0, total: targets.length });
    for (let i = 0; i < targets.length; i++) {
      if (batchStopRef.current) break;
      const topic = targets[i];
      setBatchProgress({ done: i, total: targets.length });
      setAiLoading(p => ({ ...p, [topic.id]: true }));
      const domainName = STUDY_BLUEPRINT.find(d => d.topics.some(t => t.id === topic.id))?.name || "";
      const prompt = `You are a Proofpoint email security expert and TPAD01 certification exam coach. Generate a comprehensive deep-dive study note for:

TOPIC: "${topic.title}"
DOMAIN: ${domainName}
CERTIFICATION: Proofpoint TPAD01 (Certified Threat Protection Administrator)
DATE CONTEXT: April 2026 — use current Proofpoint Protection Server paths and terminology

Use EXACTLY these section headings:

## Real-World Admin Scenario
A concrete 4-6 sentence enterprise scenario. Be specific.

## Step-by-Step Configuration
Exact › breadcrumb › paths in Proofpoint Protection Server admin console. Numbered steps.

## Common Admin Mistakes
5 bullet points: mistake → why → correct approach.

## Exam Tip
2-3 sentences on the most exam-critical TPAD01 distinction.

## Quick Reference Card
8-10 bullet points: limits, facts, Proofpoint product tiers, Protection Server console paths.

## Comparison Table or Process Flow
Markdown table OR numbered process flow.`;

      try {
        const text = await aiGenerate(prompt);
        saveDeepDive(topic.id, text || "No content returned.");
      } catch (e) {
        saveDeepDive(topic.id, `⚠ Error: ${e.message}`);
      } finally {
        setAiLoading(p => ({ ...p, [topic.id]: false }));
      }
      // Brief pause between calls
      if (i < targets.length - 1 && !batchStopRef.current) {
        await new Promise(r => setTimeout(r, 1500));
      }
    }
    setBatchProgress(p => ({ ...p, done: targets.length }));
    setBatchGenerating(false);
  };

  const stopBatch = () => { batchStopRef.current = true; setBatchGenerating(false); };

  const totalTopics = allTopics.length;
  const generatedCount = allTopics.filter(t => hasValidDeepDive(t.id)).length;

  const renderAiContent = (text) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, i) => {
      if (line.startsWith("## ")) return (
        <div key={i} style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-mono)", marginTop: 16, marginBottom: 6, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
          {line.replace("## ", "▸ ")}
        </div>
      );
      if (line.startsWith("### ")) return (
        <div key={i} style={{ fontSize: 11, fontWeight: 700, color: "var(--text-pri)", marginTop: 10, marginBottom: 4 }}>
          {line.replace("### ", "")}
        </div>
      );
      if (line.startsWith("• ") || line.startsWith("- ") || line.startsWith("* ")) return (
        <div key={i} style={{ fontSize: 12, color: "var(--text-sec)", lineHeight: 1.75, paddingLeft: 10, display: "flex", gap: 7, marginBottom: 2 }}>
          <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: 1 }}>·</span>
          <span>{line.slice(2)}</span>
        </div>
      );
      if (/^\d+\./.test(line)) return (
        <div key={i} style={{ fontSize: 12, color: "var(--text-sec)", lineHeight: 1.75, paddingLeft: 10, marginBottom: 2 }}>{line}</div>
      );
      if (line.startsWith("|")) return (
        <div key={i} style={{ fontSize: 10, color: "var(--text-sec)", fontFamily: "var(--font-mono)", lineHeight: 1.6, marginBottom: 1, whiteSpace: "pre-wrap", borderBottom: line.startsWith("|---") ? "1px solid var(--border)" : "none", background: line.startsWith("|---") ? "transparent" : "transparent", padding: "1px 0" }}>
          {line}
        </div>
      );
      if (line.trim() === "") return <div key={i} style={{ height: 5 }} />;
      return <div key={i} style={{ fontSize: 12, color: "var(--text-sec)", lineHeight: 1.8, marginBottom: 2 }}>{line}</div>;
    });
  };

  // ── renderBody: formats blueprint subsection text into structured UI ──────────
  const renderBody = (text) => {
    if (!text) return null;
    const lines = text.split("\n");
    const elements = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      // Empty line → small spacer
      if (trimmed === "") { elements.push(<div key={i} style={{ height: 6 }} />); i++; continue; }

      // ALL-CAPS label line (e.g. "SUSPEND:", "KEY EXAM DISTINCTION:", "SCENARIO:", "SOLUTION:")
      if (/^[A-Z][A-Z\s\-\(\)\/&]+:$/.test(trimmed) || /^[A-Z][A-Z\s\-\(\)\/&]+:$/.test(trimmed.replace(/\s*\(.*\)/, ""))) {
        elements.push(
          <div key={i} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", color: "var(--accent)", fontFamily: "var(--font-mono)", marginTop: 12, marginBottom: 4, textTransform: "uppercase" }}>
            {trimmed.replace(/:$/, "")}
          </div>
        );
        i++; continue;
      }

      // Numbered item: "1. text", "2. text" etc
      const numMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
      if (numMatch) {
        elements.push(
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 5, paddingLeft: 4 }}>
            <span style={{ minWidth: 18, height: 18, borderRadius: 4, background: "var(--accent-bg)", border: "1px solid var(--accent-bd)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-mono)", flexShrink: 0, marginTop: 2 }}>{numMatch[1]}</span>
            <span style={{ fontSize: 12, color: "var(--text-sec)", lineHeight: 1.75 }}>{numMatch[2]}</span>
          </div>
        );
        i++; continue;
      }

      // Bullet: "• text" or "· text" or "- text" or "* text"
      if (/^[•·\-\*]\s/.test(trimmed)) {
        const content = trimmed.slice(2).trim();
        // Bold key → value pattern: "key: value"
        const kvMatch = content.match(/^(.+?):\s(.+)/);
        elements.push(
          <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start", marginBottom: 4, paddingLeft: 4 }}>
            <span style={{ color: "var(--accent)", flexShrink: 0, fontSize: 13, lineHeight: 1, marginTop: 3 }}>·</span>
            <span style={{ fontSize: 12, color: "var(--text-sec)", lineHeight: 1.75 }}>
              {kvMatch
                ? <><span style={{ fontWeight: 700, color: "var(--text-pri)" }}>{kvMatch[1]}:</span> {kvMatch[2]}</>
                : content}
            </span>
          </div>
        );
        i++; continue;
      }

      // Indented bullet: "   • text" (indent level 1+)
      if (/^\s{2,}[•·\-\*]\s/.test(line)) {
        const content = line.trim().slice(2).trim();
        elements.push(
          <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start", marginBottom: 3, paddingLeft: 20 }}>
            <span style={{ color: "var(--text-sec)", flexShrink: 0, fontSize: 10, marginTop: 4 }}>○</span>
            <span style={{ fontSize: 11, color: "var(--text-sec)", lineHeight: 1.7 }}>{content}</span>
          </div>
        );
        i++; continue;
      }

      // Table row (pipe-separated)
      if (trimmed.startsWith("|")) {
        const isSeparator = /^\|[\s\-\|]+\|$/.test(trimmed);
        if (isSeparator) { i++; continue; } // skip separator row
        const cells = trimmed.split("|").filter(Boolean).map(c => c.trim());
        const isHeader = elements.length > 0 && isSeparator; // will handle via peek
        // peek next line for separator
        const nextTrimmed = (lines[i + 1] || "").trim();
        const isHeaderRow = /^\|[\s\-\|]+\|$/.test(nextTrimmed);
        elements.push(
          <div key={i} style={{ display: "flex", gap: 1, marginBottom: 1 }}>
            {cells.map((cell, ci) => (
              <div key={ci} style={{ flex: 1, fontSize: 10, color: isHeaderRow ? "var(--text-pri)" : "var(--text-sec)", fontFamily: "var(--font-mono)", fontWeight: isHeaderRow ? 700 : 400, padding: "3px 6px", background: isHeaderRow ? "var(--elevated)" : (ci % 2 === 0 ? "var(--surface)" : "transparent"), borderRadius: 3, lineHeight: 1.5 }}>
                {cell}
              </div>
            ))}
          </div>
        );
        i++; continue;
      }

      // Bold standalone label followed by content on next line
      // e.g. "Path: Admin console › ..."  or "Effect: ..."
      const inlineKV = trimmed.match(/^([A-Z][A-Za-z\s\/\-&]+):\s+(.+)/);
      if (inlineKV && inlineKV[1].split(" ").length <= 4) {
        elements.push(
          <div key={i} style={{ fontSize: 12, color: "var(--text-sec)", lineHeight: 1.75, marginBottom: 4, paddingLeft: 4 }}>
            <span style={{ fontWeight: 700, color: "var(--text-pri)" }}>{inlineKV[1]}:</span> {inlineKV[2]}
          </div>
        );
        i++; continue;
      }

      // Plain paragraph line
      elements.push(
        <div key={i} style={{ fontSize: 12, color: "var(--text-sec)", lineHeight: 1.8, marginBottom: 3 }}>{trimmed}</div>
      );
      i++;
    }
    return elements;
  };

  // ── SEARCH LOGIC ────────────────────────────────────────────────────────────
  const searchQuery = studySearch.trim().toLowerCase();

  // Build search index: for each topic, collect all searchable text
  const searchIndex = useMemo(() => {
    return STUDY_BLUEPRINT.flatMap(d =>
      d.topics.map(t => ({
        domainId: d.domainId,
        domainName: d.name,
        topicId: t.id,
        topicTitle: t.title,
        subsectionTexts: t.subsections.map(s => `${s.heading} ${s.body}`).join(" "),
        aiText: aiContent[t.id] || "",
      }))
    );
  }, [aiContent]);

  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    return searchIndex
      .filter(item =>
        item.topicTitle.toLowerCase().includes(searchQuery) ||
        item.domainName.toLowerCase().includes(searchQuery) ||
        item.subsectionTexts.toLowerCase().includes(searchQuery) ||
        item.aiText.toLowerCase().includes(searchQuery)
      )
      .map(item => {
        // Find best matching snippet
        const fields = [
          { label: "Topic", text: item.topicTitle },
          { label: "Domain", text: item.domainName },
          { label: "Blueprint", text: item.subsectionTexts },
          { label: "AI Deep-Dive", text: item.aiText },
        ];
        let snippet = "", snippetLabel = "";
        for (const f of fields) {
          const idx = f.text.toLowerCase().indexOf(searchQuery);
          if (idx !== -1) {
            const start = Math.max(0, idx - 40);
            const end = Math.min(f.text.length, idx + searchQuery.length + 80);
            snippet = (start > 0 ? "…" : "") + f.text.slice(start, end) + (end < f.text.length ? "…" : "");
            snippetLabel = f.label;
            break;
          }
        }
        return { ...item, snippet, snippetLabel };
      });
  }, [searchQuery, searchIndex]);

  // When user clicks a search result: switch domain, open topic
  const jumpToTopic = (domainId, topicId) => {
    setActiveDomain(domainId);
    setOpenTopics(p => ({ ...p, [topicId]: true }));
    setStudySearch("");
    // Scroll to topic after render
    setTimeout(() => {
      const el = document.getElementById(`study-topic-${topicId}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  const headingColors = {
    "Core Concept": "var(--accent)",
    "Key Facts & Exam Traps": "#f87171",
    "Key Facts & Exam Numbers": "#4ade80",
    "Key Facts": "#4ade80",
    "Worked Scenario": "#fb923c",
    "How the Tools Integrate": "#60a5fa",
    "Inbound & Outbound Routes — Mail Relays & Policy Routes": "#38bdf8",
    "SMTP Protocol & TLS": "#60a5fa",
    "DNS & Domain Setup — Certificates": "#a78bfa",
    "Policies, Rules & SMTP Profiles": "#38bdf8",
    "SMTP Profiles & Message Filtering": "#fb923c",
    "Firewall Rules, Rate Control & Recipient Verification": "#f87171",
    "SMTP Rate Control & Outbound Throttle": "#4ade80",
    "Quarantine Folders, Settings & Message Management": "#60a5fa",
    "Searching & Releasing Quarantined Messages": "#a78bfa",
    "Smart Search": "#38bdf8",
    "Log Types & Audit Logs": "#60a5fa",
    "Alert Profiles & Rules": "#fb923c",
    "System Reports": "#4ade80",
    "SPF (Sender Policy Framework)": "#f87171",
    "DKIM (DomainKeys Identified Mail)": "#a78bfa",
    "DMARC (Domain-based Message Authentication, Reporting & Conformance)": "#38bdf8",
    "Creating Email Authentication Keys": "#60a5fa",
    "Active Directory Sync": "#fb923c",
    "User Profiles, Groups & SSO": "#4ade80",
    "Safe Lists, Block Lists & Custom Rules": "#a78bfa",
    "Processing Restrictions & Key Behaviors": "#38bdf8",
    "Email Warning Tags": "#60a5fa",
    "Quarantine Digest": "#f87171",
    "URL Rewrite & Sandboxing": "#4ade80",
    "Message Defense & TAP Dashboard": "#a78bfa",
    "Core Concept — TRAP vs CLEAR": "#f87171",
    "Deployment & Configuration": "#38bdf8",
    "Import Sources & CLEAR Workflow": "#60a5fa",
  };

  return (
    <div style={{ paddingTop: 16, paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <button onClick={onBack} style={{ width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "1px solid var(--border)", color: "var(--text-sec)", cursor: "pointer", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-pri)" }}>Study Material</div>
          <div style={{ fontSize: 9, color: "var(--text-sec)", fontFamily: "var(--font-mono)" }}>TPAD01 · Full Blueprint · {totalTopics} topics · v4.5 · April 2026</div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "var(--surface)", border: `1px solid ${searchFocused ? "var(--accent-bd)" : "var(--border)"}`, borderRadius: "var(--r-sm)", transition: "border-color 0.15s" }}>
          <span style={{ fontSize: 12, color: "var(--text-sec)", flexShrink: 0 }}>🔍</span>
          <input
            ref={searchRef}
            type="text"
            value={studySearch}
            onChange={e => setStudySearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
            placeholder="Search topics, concepts, configs, AI deep-dives…"
            style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 12, color: "var(--text-pri)", fontFamily: "var(--font-body)", caretColor: "var(--accent)" }}
          />
          {studySearch && (
            <button onClick={() => setStudySearch("")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-sec)", fontSize: 13, padding: "0 2px", flexShrink: 0, lineHeight: 1 }}>✕</button>
          )}
        </div>
        {/* Search Results Dropdown */}
        {searchQuery.length >= 2 && (
          <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100, background: "var(--surface)", border: "1px solid var(--accent-bd)", borderRadius: "var(--r-sm)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", maxHeight: 300, overflowY: "auto" }}>
            {searchResults.length === 0 ? (
              <div style={{ padding: "14px 14px", fontSize: 11, color: "var(--text-sec)", fontFamily: "var(--font-mono)", textAlign: "center" }}>No results for {studySearch}</div>
            ) : (
              <>
                <div style={{ padding: "6px 12px 4px", fontSize: 9, fontWeight: 700, color: "var(--text-sec)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid var(--border)" }}>
                  {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
                </div>
                {searchResults.map((r, i) => (
                  <button key={i} onClick={() => jumpToTopic(r.domainId, r.topicId)}
                    style={{ width: "100%", display: "block", padding: "9px 13px", background: "none", border: "none", borderBottom: "1px solid var(--border)", cursor: "pointer", textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      <span style={{ fontSize: 8, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--accent)", background: "var(--accent-bg)", border: "1px solid var(--accent-bd)", borderRadius: 3, padding: "1px 5px", flexShrink: 0 }}>{r.domainId.toUpperCase()}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-pri)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.topicTitle}</span>
                    </div>
                    {r.snippet && (
                      <div style={{ fontSize: 10, color: "var(--text-sec)", lineHeight: 1.55, fontFamily: "var(--font-mono)", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: 8, marginRight: 4 }}>{r.snippetLabel}</span>
                        {r.snippet}
                      </div>
                    )}
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* AI Generation Progress Bar */}
      <div style={{ marginBottom: 14, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", padding: "10px 13px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-pri)" }}>AI Deep-Dives</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: generatedCount === totalTopics ? "var(--success)" : "var(--text-sec)" }}>
              {generatedCount}/{totalTopics} generated
            </span>
            {generatedCount > 0 && <button onClick={clearAllDeepDives} style={{ fontSize: 8, color: "var(--error)", background: "none", border: "1px solid var(--error-bd)", borderRadius: 3, padding: "1px 6px", cursor: "pointer", fontFamily: "var(--font-mono)" }}>Clear All</button>}
          </div>
        </div>
        <div style={{ height: 3, background: "var(--border)", borderRadius: 2, overflow: "hidden", marginBottom: 8 }}>
          <div style={{ height: "100%", width: `${(generatedCount / totalTopics) * 100}%`, background: generatedCount === totalTopics ? "var(--success)" : "var(--accent)", borderRadius: 2, transition: "width 0.4s" }} />
        </div>
        {batchGenerating ? (
          <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
            <div style={{ flex: 1, fontSize: 10, color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block", marginRight: 5, animation: "fetchDot 1s ease-in-out infinite" }} />
              Generating… {batchProgress.done}/{batchProgress.total}
            </div>
            <button onClick={stopBatch} style={{ padding: "4px 10px", borderRadius: "var(--r-sm)", border: "1px solid var(--error-bd)", background: "var(--error-bg)", color: "var(--error)", fontSize: 9, fontFamily: "var(--font-mono)", cursor: "pointer", fontWeight: 700 }}>Stop</button>
          </div>
        ) : ungenerated.length > 0 ? (
          <button onClick={batchGenerate} style={{ width: "100%", padding: "6px", borderRadius: "var(--r-sm)", border: "1px solid var(--accent-bd)", background: "var(--accent-bg)", color: "var(--accent)", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-mono)" }}>
            ⚡ Generate All {ungenerated.length} Missing Deep-Dives (Saved Locally)
          </button>
        ) : (
          <div style={{ fontSize: 9, color: "var(--success)", fontFamily: "var(--font-mono)", textAlign: "center" }}>✓ All deep-dives generated and saved</div>
        )}
      </div>

      {/* Domain Tabs — horizontal scroll */}
      <div style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 8, marginBottom: 14, scrollbarWidth: "none" }}>
        {STUDY_BLUEPRINT.map(d => {
          const active = d.domainId === activeDomain;
          const domainGenerated = d.topics.filter(t => hasValidDeepDive(t.id)).length;
          return (
            <button key={d.domainId} onClick={() => { setActiveDomain(d.domainId); setOpenTopics({}); }}
              style={{ flexShrink: 0, padding: "5px 11px", borderRadius: "var(--r-sm)", border: `1px solid ${active ? "var(--accent-bd)" : "var(--border)"}`, background: active ? "var(--accent-bg)" : "var(--elevated)", color: active ? "var(--accent)" : "var(--text-sec)", fontSize: 9, fontWeight: active ? 700 : 500, fontFamily: "var(--font-mono)", cursor: "pointer", whiteSpace: "nowrap" }}>
              {d.domainId.toUpperCase()} {d.weight}%
              {domainGenerated > 0 && <span style={{ marginLeft: 5, fontSize: 8, color: active ? "var(--accent)" : "var(--success)" }}>{domainGenerated}/{d.topics.length}✓</span>}
            </button>
          );
        })}
      </div>

      {/* Domain header */}
      {domain && (
        <>
          <div style={{ padding: "10px 14px", background: "var(--surface)", border: "1px solid var(--accent-bd)", borderRadius: "var(--r-sm)", marginBottom: 14 }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: 2 }}>{domain.domainId.toUpperCase()} · {domain.weight}% of exam</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-pri)" }}>{domain.name}</div>
            <div style={{ fontSize: 9, color: "var(--text-sec)", marginTop: 3, fontFamily: "var(--font-mono)" }}>{domain.topics.length} topics · {domain.topics.reduce((a, t) => a + t.subsections.length, 0)} subsections · {domain.topics.filter(t => hasValidDeepDive(t.id)).length}/{domain.topics.length} AI expanded</div>
          </div>

          {/* Topics */}
          {domain.topics.map((topic, ti) => {
            const isOpen = !!openTopics[topic.id];
            const hasAi = hasValidDeepDive(topic.id);
            const aiErr = getDeepDiveError(topic.id);
            const isLoading = !!aiLoading[topic.id];
            return (
              <div key={topic.id} id={`study-topic-${topic.id}`} style={{ marginBottom: 8, border: `1px solid ${aiErr ? "var(--error-bd)" : "var(--border)"}`, borderRadius: "var(--r-sm)", overflow: "hidden" }}>
                {/* Topic header */}
                <button onClick={() => toggleTopic(topic.id)}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", background: isOpen ? "var(--elevated)" : "var(--surface)", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, background: "var(--accent-bg)", border: "1px solid var(--accent-bd)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>{ti + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-pri)", lineHeight: 1.4 }}>{topic.title}</div>
                    <div style={{ fontSize: 9, color: "var(--text-sec)", fontFamily: "var(--font-mono)", marginTop: 1 }}>
                      {topic.subsections.length} sections
                      {hasAi && !isLoading && <span style={{ color: "var(--success)", marginLeft: 6 }}>· ✓ AI deep-dive saved</span>}
                      {aiErr && !isLoading && <span style={{ color: "var(--error)", marginLeft: 6 }}>· ✗ AI error — click to retry</span>}
                      {isLoading && <span style={{ color: "var(--accent)", marginLeft: 6 }}>· generating…</span>}
                    </div>
                  </div>
                  <span style={{ fontSize: 10, color: "var(--text-sec)", flexShrink: 0 }}>{isOpen ? "▾" : "▸"}</span>
                </button>

                {/* Topic body */}
                {isOpen && (
                  <div style={{ borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
                    {/* Subsections */}
                    {topic.subsections.map((sub, si) => {
                      const subKey = `${topic.id}_${si}`;
                      const subOpen = !!openSubs[subKey];
                      const col = headingColors[sub.heading] || "var(--text-sec)";
                      return (
                        <div key={si} style={{ borderBottom: "1px solid var(--border)" }}>
                          <button onClick={() => toggleSub(subKey)}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px 9px 18px", background: subOpen ? "rgba(99,102,241,0.04)" : "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: col, flexShrink: 0 }} />
                            <span style={{ flex: 1, fontSize: 11, fontWeight: 600, color: col }}>{sub.heading}</span>
                            <span style={{ fontSize: 9, color: "var(--text-sec)" }}>{subOpen ? "▾" : "▸"}</span>
                          </button>
                          {subOpen && (
                            <div style={{ padding: "10px 14px 14px 14px", textAlign: "left" }}>
                              {renderBody(sub.body)}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* AI Deep Dive section */}
                    <div style={{ padding: "10px 14px", borderTop: "1px solid var(--border)", background: "var(--surface)" }}>
                      {/* Error state — visible retry banner */}
                      {aiErr && !isLoading && (
                        <div style={{ marginBottom: 8, padding: "9px 12px", background: "var(--error-bg)", border: "1px solid var(--error-bd)", borderRadius: "var(--r-sm)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--error)", fontFamily: "var(--font-mono)", marginBottom: 2 }}>✗ Generation Failed</div>
                            <div style={{ fontSize: 9, color: "var(--error)", fontFamily: "var(--font-mono)", opacity: 0.8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{aiErr}</div>
                          </div>
                          <button onClick={() => generateDeepDive(topic, true)}
                            style={{ flexShrink: 0, padding: "5px 12px", borderRadius: "var(--r-sm)", border: "1px solid var(--error-bd)", background: "var(--error-bg)", color: "var(--error)", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-mono)" }}>
                            ↺ Retry
                          </button>
                        </div>
                      )}
                      {/* Generate button — shown when no content and no error */}
                      {!hasAi && !aiErr && !isLoading && (
                        <button onClick={() => generateDeepDive(topic)}
                          style={{ width: "100%", padding: "8px 14px", borderRadius: "var(--r-sm)", border: "1px solid var(--accent-bd)", background: "var(--accent-bg)", color: "var(--accent)", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: "var(--font-mono)" }}>
                          ⚡ Generate AI Deep-Dive — saves to device
                        </button>
                      )}
                      {/* Loading spinner */}
                      {isLoading && (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px", color: "var(--accent)", fontSize: 11, fontFamily: "var(--font-mono)" }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block", animation: "fetchDot 1s ease-in-out infinite" }} />
                          Generating deep-dive for {topic.title}…
                        </div>
                      )}
                      {/* Rendered AI content */}
                      {hasAi && !isLoading && (
                        <div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--success)", fontFamily: "var(--font-mono)" }}>✓ AI Deep-Dive · Saved Locally</div>
                            <div style={{ display: "flex", gap: 5 }}>
                              <button onClick={() => generateDeepDive(topic, true)}
                                disabled={isLoading}
                                style={{ fontSize: 9, color: "var(--accent)", background: "none", border: "1px solid var(--accent-bd)", borderRadius: 3, padding: "2px 7px", cursor: "pointer", fontFamily: "var(--font-mono)" }}>
                                {isLoading ? "…" : "↺ Regen"}
                              </button>
                              <button onClick={() => deleteDeepDive(topic.id)}
                                style={{ fontSize: 9, color: "var(--text-sec)", background: "none", border: "1px solid var(--border)", borderRadius: 3, padding: "2px 7px", cursor: "pointer", fontFamily: "var(--font-mono)" }}>Delete</button>
                            </div>
                          </div>
                          <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", padding: "12px 14px", textAlign: "left" }}>
                            {renderAiContent(aiContent[topic.id])}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {

  const [screen, setScreen] = useState("start");
  const [qbaseCount, setQbaseCount] = useState(()=>QBase.getAll().length);
  const [sessionConfig, setSessionConfig] = useState(null);
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [sessionAnswers, setSessionAnswers] = useState({});
  const [showAdmin, setShowAdmin] = useState(false);
  const [appError, setAppError] = useState(null);
  const [fetchRunning, setFetchRunning] = useState(false);
  const [fetchLog, setFetchLog] = useState([]);
  const [fetchStats, setFetchStats] = useState({batches:0,received:0,added:0});
  const [fetchTarget, setFetchTarget] = useState(12);
  const [fetchDone, setFetchDone] = useState(false);
  const [showFetchWindow, setShowFetchWindow] = useState(false);
  const [fillQbase, setFillQbase] = useState(false);
  const fetchStopRef = useRef(false);
  const fetchStatsRef = useRef({batches:0,received:0,added:0});
  const appendFetchLog = useCallback((msg, type="info") => setFetchLog(l=>[...l,{msg,type,ts:new Date().toLocaleTimeString()}].slice(-600)),[]);

  const startFetch = useCallback(async (target, targetFillQbase) => {
    if (fetchRunning) return;
    const addToQbase = targetFillQbase !== undefined ? targetFillQbase : fillQbase;
    fetchStopRef.current = false;
    fetchStatsRef.current = {batches:0,received:0,added:0};
    setFetchRunning(true); setFetchDone(false); setFetchLog([]); setFetchStats({batches:0,received:0,added:0}); setShowFetchWindow(true);
    const rc = getActiveRateConfig();
    const allDomains = CERT_CONFIG.domains.map(d=>d.id);
    const batchCount = Math.ceil(target/rc.batchSize);
    appendFetchLog(`🚀 Fetching ${target} questions · ${batchCount} call${batchCount>1?"s":""} of up to ${rc.batchSize} each`, "done");
    appendFetchLog(`📥 Mode: ${addToQbase?"Fill qBase":"Cache Only"}`, addToQbase?"ok":"info");
    let remaining = target, batchNum = 0;
    while (remaining > 0 && !fetchStopRef.current) {
      const thisBatch = Math.min(remaining, rc.batchSize); batchNum++;
      appendFetchLog(`▶ Batch ${batchNum}/${batchCount} — requesting ${thisBatch} Qs…`, "info");
      const callStart = Date.now();
      try {
        const { results, quarantined, validationLog, attemptsNeeded, callDurationMs, promptTokens, responseTokens } = await generateQuestions({ domainIds:allDomains, count:thisBatch, questionTypes:["mcq","multi"] });
        appendFetchLog(`  ↩ ~${promptTokens||"?"}↑ / ~${responseTokens||"?"}↓ tokens · ${(callDurationMs/1000).toFixed(1)}s${attemptsNeeded>1?` · 🔁 ${attemptsNeeded} attempts`:""}`, "info");
        fetchStatsRef.current.batches++; fetchStatsRef.current.received += results.length;

        // Log Certiverse / Proofpoint validation results per question
        for (const entry of (validationLog||[])) {
          if (entry.status === "retry") {
            appendFetchLog(`  ⚠ CV-VALIDATOR: ${entry.msg}`, "warn");
          } else if (entry.status === "quarantine") {
            appendFetchLog(`  🔴 CV-QUARANTINE: ${entry.msg}`, "err");
          } else if (entry.status === "json_fail") {
            appendFetchLog(`  ⚠ CV-VALIDATOR: ${entry.msg}`, "warn");
          } else if (entry.qId) {
            if (entry.pass) {
              appendFetchLog(`  ✅ CV:${entry.score}/10 · ${entry.qId.slice(0,16)} · ${entry.domainId} · ${entry.type}`, "ok");
            } else {
              appendFetchLog(`  ⚠ CV:${entry.score}/10 · ${entry.qId.slice(0,16)} · ${(entry.violations||[]).slice(0,2).join(" / ")}`, "warn");
            }
          }
        }

        results.forEach(q => {
          if(addToQbase) QBase.add([q]); else QBase.addToAiCache([q]);
          fetchStatsRef.current.added++;
        });

        if ((quarantined||[]).length > 0) {
          appendFetchLog(`  🔒 ${quarantined.length} question(s) quarantined (PV violations after ${MAX_RETRIES+1} attempts) — see Admin › Quarantine`, "warn");
        }

        remaining -= thisBatch; setFetchStats({...fetchStatsRef.current}); if(addToQbase)setQbaseCount(QBase.getAll().length);
        appendFetchLog(`  ↳ Batch ${batchNum} done: ${results.length} passed · ${(quarantined||[]).length} quarantined · ${remaining} remaining`, results.length>0?"ok":"warn");
        if (remaining>0&&!fetchStopRef.current) { const pause=Math.max(0,rc.intervalMs-callDurationMs); if(pause>0){appendFetchLog(`  ⏱ Waiting ${(pause/1000).toFixed(1)}s…`,"info");await new Promise(r=>setTimeout(r,pause));} }
      } catch(e) {
        appendFetchLog(`  ✘ [${e.phase||"unknown"}] ${e.message}`, "err");
        remaining -= thisBatch; setFetchStats({...fetchStatsRef.current});
        if(remaining>0&&!fetchStopRef.current){const pause=Math.max(0,rc.intervalMs-(Date.now()-callStart));if(pause>0)await new Promise(r=>setTimeout(r,pause));}
      }
    }
    appendFetchLog(`✅ Done: ${fetchStatsRef.current.added} questions added`, "done");
    setFetchRunning(false); setFetchDone(true); if(addToQbase)setQbaseCount(QBase.getAll().length);
  }, [fetchRunning, fillQbase, appendFetchLog]);

  const stopFetch = useCallback(()=>{ fetchStopRef.current=true; }, []);
  const refreshQbase = () => setQbaseCount(QBase.getAll().length);

  useEffect(()=>{ if(screen!=="start")return; try{initStorage(); AutoHeal.healAll({skipPromote:false}); setQbaseCount(QBase.getAll().length);}catch(e){setAppError({msg:"Failed to initialise storage.",cause:e.message});} },[screen]);

  const startSession = ({selectedDomains, sessionType, count, questionType}) => {
    try {
      Store.set(SK.sessionCount,(Store.get(SK.sessionCount,0)||0)+1);
      const questions = QBase.selectForSession({domainIds:selectedDomains,count,sessionType,questionType:questionType||"both"});
      if (questions.length===0){setAppError({msg:"No questions available for selected domains.",cause:`domainIds: ${selectedDomains.join(", ")}`});return;}
      setSessionQuestions(questions); setSessionConfig({selectedDomains,sessionType,count}); setSessionAnswers({}); setScreen("exam_session");
      Store.log({type:"SESSION_START",sessionType,count:questions.length,ts:Date.now()});
    } catch(e){setAppError({msg:"Failed to start session.",cause:e.message});}
  };

  const finishSession = (answers, attemptedQs) => {
    try {
      const qs = attemptedQs||sessionQuestions;
      setSessionAnswers(answers); setSessionQuestions(qs); setScreen("result");
      Store.log({type:"SESSION_END",answered:Object.keys(answers).length,ts:Date.now()});
      if (sessionConfig?.sessionType!=="exam") {
        const answeredIds = Object.keys(answers);
        SeenTracker.recordSession(answeredIds);
        const freshQbase = QBase.getAll(), parkingLot = QBase.getParkingLot(), parkingIds = new Set(parkingLot.map(p=>p.id));
        answeredIds.forEach(qId=>{
          const q=freshQbase.find(x=>x.id===qId);
          if(q&&(q.seenCount||0)>=3&&!parkingIds.has(qId)){QBase.moveToParkingLot(qId);parkingIds.add(qId);}
        });
        refreshQbase();
      }
    } catch(e){setAppError({msg:"Failed to complete session.",cause:e.message});}
  };

  const fetchContext = { fetchRunning,fetchLog,fetchStats,fetchTarget,setFetchTarget,fetchDone,showFetchWindow,setShowFetchWindow,startFetch,stopFetch,fillQbase,setFillQbase };

  return (
    <AppErrorBoundary>
      <>
        <style>{STYLES}</style>
        <div className="app">
          <header className="header">
            <div className="logo-lockup">
              <div>
                <div className="logo-text">ThreatPrep</div>
                <div className="logo-sub">AI Exam Prep</div>
              </div>
              <div className="cert-badge">{CERT_CONFIG.id}</div>
            </div>
            <div className="header-right">
              <div style={{ fontSize:10,fontFamily:"var(--font-mono)",color:"var(--text-sec)" }}>
                <span style={{ color:"var(--text-pri)",fontWeight:700 }}>{qbaseCount}</span>Q
              </div>
              {fetchRunning&&(
                <button onClick={()=>setShowFetchWindow(v=>!v)} style={{ display:"flex",alignItems:"center",gap:5,padding:"4px 9px",borderRadius:6,border:"1px solid var(--border)",background:"var(--accent-bg)",color:"var(--accent)",cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:"var(--font-mono)" }}>
                  <span style={{ width:5,height:5,borderRadius:"50%",background:"var(--accent)",display:"inline-block",animation:"fetchDot 1s ease-in-out infinite" }}/>
                  {fetchStats.added}Q
                </button>
              )}
              <ThemeSwitcher />
              <ZoomControl />
              <button className="btn btn-ghost btn-sm" onClick={()=>setShowAdmin(true)}>⚙ Admin</button>
            </div>
          </header>
          {appError&&(
            <div style={{ paddingTop:12 }}>
              <ErrorBanner msg={appError.msg} cause={appError.cause} onDismiss={()=>setAppError(null)} />
            </div>
          )}
          {screen==="start"&&<StartScreen onStart={startSession} qCount={qbaseCount} onStudy={()=>setScreen("study_material")} />}
          {screen==="study_material"&&<StudyMaterialScreen onBack={()=>setScreen("start")} />}
          {screen==="exam_session"&&sessionConfig&&<ExamScreen questions={sessionQuestions} sessionType={sessionConfig.sessionType} onFinish={(ans,attempted)=>finishSession(ans,attempted)} />}
          {screen==="result"&&sessionConfig&&<ResultScreen questions={sessionQuestions} answers={sessionAnswers} sessionType={sessionConfig.sessionType} onRestart={()=>startSession(sessionConfig)} onHome={()=>setScreen("start")} />}
        </div>
        {showAdmin&&<AdminPanel onClose={()=>{setShowAdmin(false);refreshQbase();}} onQbaseChange={refreshQbase} fetchContext={fetchContext} />}
        {showFetchWindow&&<PersistentFetchWindow fetchContext={fetchContext} onQbaseChange={refreshQbase} />}
      </>
    </AppErrorBoundary>
  );
}
