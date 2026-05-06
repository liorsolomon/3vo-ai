export type AgentName =
  | "cold-pitch"
  | "pricing-reframe"
  | "linkedin-content"
  | "proposal"
  | "client-checkin";

export interface AgentField {
  name: string;
  label: string;
  placeholder: string;
  type: "text" | "textarea";
  required: boolean;
}

export interface AgentConfig {
  name: AgentName;
  title: string;
  tagline: string;
  description: string;
  fields: AgentField[];
  expandPrompt: (inputs: Record<string, string>) => string;
  generatePrompt: (inputs: Record<string, string>, expansion: string) => string;
  polishPrompt: (inputs: Record<string, string>, draft: string) => string;
}

// Serializable subset — safe to pass from Server Components to Client Components
export type SerializableAgentConfig = Pick<
  AgentConfig,
  "name" | "title" | "tagline" | "description" | "fields"
>;

export const AGENTS: Record<AgentName, AgentConfig> = {
  "cold-pitch": {
    name: "cold-pitch",
    title: "Cold Pitch",
    tagline: "Turn a cold lead into a warm reply.",
    description:
      "Generate a hyper-personalized cold outreach that leads with their pain point, not your pitch. No filler, no templates.",
    fields: [
      {
        name: "target_type",
        label: "Who are you pitching?",
        placeholder: "e.g. Series A SaaS founders, boutique agency owners, e-commerce CMOs",
        type: "text",
        required: true,
      },
      {
        name: "your_service",
        label: "What do you do?",
        placeholder: "e.g. We build fractional growth teams for B2B SaaS at $8k/mo",
        type: "textarea",
        required: true,
      },
      {
        name: "differentiator",
        label: "Why you and not anyone else?",
        placeholder: "e.g. ex-head of growth at Notion, shipped 0→$1M ARR twice",
        type: "text",
        required: true,
      },
      {
        name: "context",
        label: "Any specific context about this lead? (optional)",
        placeholder: "e.g. They just announced a Series A, they're hiring 3 SDRs",
        type: "textarea",
        required: false,
      },
    ],
    expandPrompt: (inputs) => `You are an expert B2B outreach strategist. A freelancer/consultant wants to cold-pitch:

TARGET: ${inputs.target_type}
SERVICE: ${inputs.your_service}
DIFFERENTIATOR: ${inputs.differentiator}
LEAD CONTEXT: ${inputs.context || "none provided"}

Analyze this opportunity deeply:
1. What are the top 3 pain points this target type wakes up at 3am thinking about?
2. What signals in the lead context (if any) tell us about their current state?
3. What emotional angle would make this person open and reply — fear of missing out, peer pressure, ego, cost/waste, competitive threat?
4. What single proof point from the differentiator is most credible to this target?
5. What's the lowest-friction ask that would get a reply?

Be brutally specific. No generic observations. Output your analysis in structured bullet form.`,

    generatePrompt: (inputs, expansion) => `You are a master cold email copywriter. Using this strategic analysis:

${expansion}

CONTEXT RECAP:
TARGET: ${inputs.target_type}
SERVICE: ${inputs.your_service}
DIFFERENTIATOR: ${inputs.differentiator}
LEAD CONTEXT: ${inputs.context || "none provided"}

Write a cold pitch (email or LinkedIn DM format). Rules:
- Subject line: 6 words or fewer, no spam triggers, no "quick question", no "[First Name],"
- Opening line: their world, not your pitch — specific to the pain/context
- Body: 2-3 sentences max. One credibility signal. One insight that earns the right to the ask.
- CTA: single low-friction ask. Not "let me know if you're interested." Give a specific option (e.g. "15 min Thursday?")
- Total length: under 100 words for the body
- Tone: direct, peer-to-peer — not vendor-to-buyer
- NEVER start with: "I noticed...", "I came across...", "I see that...", "I wanted to reach out", "Hope this finds you well"

Output format: Subject line, then the email body. No meta-commentary.`,

    polishPrompt: (inputs, draft) => `You are a world-class cold outreach editor. Here is a draft pitch:

---
${draft}
---

TARGET: ${inputs.target_type}

Polish this ruthlessly:
1. Cut any word that doesn't earn its place
2. Make the opening line more specific and surprising — ban "I noticed/came across/see that" openers
3. Ensure the CTA is one specific action with a concrete option (e.g. "15-min call Thursday?" not "let me know if interested")
4. If the subject line is weak or feels templated, rewrite it
5. Check: would a skeptical, busy ${inputs.target_type} read past line 1? If not, fix it.
6. Would someone recognize this as a template? If yes, personalize harder.

Output ONLY the final polished pitch. Subject line first, then body. Nothing else.`,
  },

  "pricing-reframe": {
    name: "pricing-reframe",
    title: "Pricing Reframe",
    tagline: "Stop defending your rate. Start owning it.",
    description:
      "Get a word-for-word script to reframe pricing conversations — so you never discount out of awkwardness again.",
    fields: [
      {
        name: "current_rate",
        label: "What do you charge?",
        placeholder: "e.g. $5,000/mo retainer, $150/hr, $12,000 project",
        type: "text",
        required: true,
      },
      {
        name: "service",
        label: "What do you deliver?",
        placeholder: "e.g. Brand identity + website for DTC brands, fractional CFO for funded startups",
        type: "textarea",
        required: true,
      },
      {
        name: "client_situation",
        label: "What's the client's situation / what did they say?",
        placeholder:
          'e.g. They said "that\'s more than we budgeted", they went quiet after the proposal, they asked if I can do it for less',
        type: "textarea",
        required: true,
      },
      {
        name: "outcome_delivered",
        label: "What outcome do you actually deliver? (optional)",
        placeholder: "e.g. clients typically 3x conversion rate in 90 days, average client stays 18 months",
        type: "text",
        required: false,
      },
    ],
    expandPrompt: (inputs) => `You are a sales psychology expert specializing in high-ticket freelance and consulting. Analyze this pricing situation:

RATE: ${inputs.current_rate}
SERVICE: ${inputs.service}
CLIENT SITUATION: ${inputs.client_situation}
OUTCOME DELIVERED: ${inputs.outcome_delivered || "not specified"}

Diagnose this situation:
1. What is the client actually saying with their pushback — is it genuine budget constraint, perceived value gap, fear, comparison shopping, or testing?
2. What is the VALUE the freelancer delivers in client-language terms (not features, but business outcomes)?
3. What framing shift would move this from "cost" to "investment" for this specific client?
4. What is the REAL risk to the client of NOT hiring at this rate vs. hiring a cheaper alternative?
5. What's the most powerful proof point or reframe available based on what we know?

Be specific and psychological. No platitudes.`,

    generatePrompt: (inputs, expansion) => `You are a pricing conversation coach. Using this analysis:

${expansion}

SITUATION:
RATE: ${inputs.current_rate}
SERVICE: ${inputs.service}
CLIENT SAID/DID: ${inputs.client_situation}
OUTCOMES: ${inputs.outcome_delivered || "not specified"}

Write a pricing reframe script. Format it as a real conversation the freelancer can use:

1. ACKNOWLEDGE (1 sentence — validate without agreeing. NEVER use "I completely understand" or "I hear you" — these sound scripted)
2. REFRAME (2-3 sentences — shift from cost to outcome/risk. Frame around what they lose by not hiring, not why you're worth it)
3. HOLD THE LINE (1 sentence — decisive statement, not a question, no hedging)
4. OPTIONAL: ONE alternative offer (never more than 20% below rate — scope reduction or payment structure only, not a discount)

Also write 2-3 specific verbatim phrases for: "we're comparing other options" and "can you do it for less."

Tone: confident, peer-level, zero desperation.`,

    polishPrompt: (_, draft) => `You are an elite sales coach reviewing a pricing reframe script:

---
${draft}
---

Polish this:
1. Make every phrase sound like a confident person speaking, not a script being read
2. Remove any apologetic language or hedging ("I understand if...", "I know it's a lot")
3. Make the reframe hit harder — is the value framing crystal clear?
4. The "hold the line" line must be decisive, not a question
5. Ensure the alternative offer (if present) maintains perceived value

Output ONLY the final polished script, formatted for easy use. No meta-commentary.`,
  },

  "linkedin-content": {
    name: "linkedin-content",
    title: "LinkedIn Content",
    tagline: "Posts that actually get read past line one.",
    description:
      "Write a LinkedIn post that stops the scroll, earns engagement, and positions you as the obvious expert.",
    fields: [
      {
        name: "topic",
        label: "What's the core topic or insight?",
        placeholder: "e.g. Why most agency retainers are priced backwards, a lesson from my worst client ever",
        type: "textarea",
        required: true,
      },
      {
        name: "target_audience",
        label: "Who should this reach?",
        placeholder: "e.g. freelance designers, funded startup founders, marketing directors at mid-market SaaS",
        type: "text",
        required: true,
      },
      {
        name: "angle",
        label: "What's your take / what do you want them to feel? (optional)",
        placeholder: "e.g. contrarian, practical how-to, vulnerable story, data-backed, hot take",
        type: "text",
        required: false,
      },
    ],
    expandPrompt: (inputs) => `You are a LinkedIn content strategist who has studied viral posts obsessively. Analyze this post brief:

TOPIC/INSIGHT: ${inputs.topic}
TARGET AUDIENCE: ${inputs.target_audience}
ANGLE REQUESTED: ${inputs.angle || "your best judgment"}

Plan the post:
1. What is the ONE specific insight or claim that makes this worth reading for ${inputs.target_audience}?
2. What hook formats would work best — story open, bold claim, question, specific stat, surprising admission?
3. What's the emotional journey? (Start with X tension, move to Y shift, land on Z action/insight)
4. What's the "so what" that makes someone save or share this?
5. What format structure works best — numbered list, paragraph narrative, before/after?

Be specific about the hook. The first line is everything. Suggest 3 different first-line options.`,

    generatePrompt: (inputs, expansion) => `You are a LinkedIn ghostwriter for experts and founders. Use this content strategy:

${expansion}

POST BRIEF:
TOPIC: ${inputs.topic}
AUDIENCE: ${inputs.target_audience}
ANGLE: ${inputs.angle || "best judgment"}

Write the full LinkedIn post. Rules:
- First line: scroll-stopping — should work as a standalone tweet. No openers starting with "I've been thinking...", "Unpopular opinion:", "Hot take:", "[Number] things I wish I knew", or "Let's talk about"
- Structure: short punchy paragraphs. Never more than 2 sentences per paragraph.
- Body: specific, real, concrete — no vague advice. One insight per paragraph. Show, don't tell.
- End: either a specific CTA, a reframe that lands, or a question that creates genuine debate
- Length: 150-300 words. LinkedIn penalizes under 150; over 300 loses most people.
- No hashtag spam. Max 2-3 relevant ones at the end if needed.
- No em-dash as an opener. No corporate buzzwords. No emojis unless requested.

Output ONLY the post text. No commentary.`,

    polishPrompt: (inputs, draft) => `You are a LinkedIn editor with a ruthless eye for what actually performs. Review this post for ${inputs.target_audience}:

---
${draft}
---

Polish it:
1. Read the first line cold — would you stop scrolling? If not, rewrite it. Does it work as a standalone tweet?
2. Cut any sentence that doesn't add new information or emotion
3. Make sure every paragraph break creates forward momentum ("what comes next?")
4. Is the ending strong? It should make people feel something or do something — not just trail off.
5. Flag any corporate-speak, vague claims, or "telling" when you could be "showing"
6. Is there a cliché opening? "Unpopular opinion", "Let me be honest", "Nobody talks about this" — replace with a specific concrete hook.

Output ONLY the final polished post. No meta-commentary.`,
  },

  proposal: {
    name: "proposal",
    title: "Proposal",
    tagline: "Close the deal before the meeting.",
    description:
      "Generate a professional, persuasive project proposal that communicates value, sets clear expectations, and makes saying yes easy.",
    fields: [
      {
        name: "client_name",
        label: "Client / company name",
        placeholder: "e.g. Acme Corp, Sarah at Bloomfield Design",
        type: "text",
        required: true,
      },
      {
        name: "project_scope",
        label: "What's the project?",
        placeholder:
          "e.g. Full brand identity + website for a fintech startup raising Series A. 3 logo concepts, brand guide, 8-page site.",
        type: "textarea",
        required: true,
      },
      {
        name: "timeline",
        label: "Timeline",
        placeholder: "e.g. 6 weeks, 3 sprints, by March 15",
        type: "text",
        required: true,
      },
      {
        name: "investment",
        label: "Investment / pricing",
        placeholder: "e.g. $12,000 flat, $3,500/mo for 3 months, $8,000 + $1,500/mo maintenance",
        type: "text",
        required: true,
      },
      {
        name: "context",
        label: "What do you know about the client's situation / goals? (optional)",
        placeholder: "e.g. They're fundraising in 90 days and need investor-grade materials ASAP",
        type: "textarea",
        required: false,
      },
    ],
    expandPrompt: (inputs) => `You are a senior business strategist who has reviewed thousands of winning proposals. Analyze this project:

CLIENT: ${inputs.client_name}
PROJECT: ${inputs.project_scope}
TIMELINE: ${inputs.timeline}
INVESTMENT: ${inputs.investment}
CLIENT CONTEXT: ${inputs.context || "not provided"}

Plan the proposal structure:
1. What is the client's PRIMARY business outcome from this project (not the deliverables — the outcome)?
2. What are the top 3 risks of NOT doing this project or doing it badly?
3. What should the deliverables list emphasize to communicate thoroughness without overwhelming?
4. What payment and milestone structure builds client confidence?
5. What single "why us" statement is most credible given what we know?
6. What's the best CTA — call, sign, or something else?

Be specific. This proposal needs to close, not just inform.`,

    generatePrompt: (inputs, expansion) => `You are a top-tier proposal writer. Use this strategic brief:

${expansion}

PROJECT DETAILS:
CLIENT: ${inputs.client_name}
SCOPE: ${inputs.project_scope}
TIMELINE: ${inputs.timeline}
INVESTMENT: ${inputs.investment}
CONTEXT: ${inputs.context || "not provided"}

Write a full project proposal. Structure:

**[Title]** — e.g. "Brand Identity & Website for [Client Name]"

**The Situation** — 2-3 sentences: what we understand about their context/goal

**What We'll Deliver** — clear deliverable list with phase breakdown if applicable

**Timeline** — milestone-based or phase-based schedule

**Investment** — pricing clearly stated, payment terms, what's included/excluded

**How We Work Together** — brief process note (communication, revisions, approvals)

**Next Step** — single clear CTA

Tone: professional but human. Confident, not salesy. Make them feel understood.`,

    polishPrompt: (inputs, draft) => `You are a proposal editor who has helped close $10M+ in contracts. Review this proposal for ${inputs.client_name}:

---
${draft}
---

Polish it:
1. Does the opening make them feel understood before it sells anything?
2. Are deliverables crystal clear? A confused buyer doesn't sign.
3. Is the investment framed as value, not cost?
4. Is the CTA unambiguous and low-friction?
5. Cut any corporate filler — "synergy", "leverage", "best-in-class", "world-class"
6. Check revision terms — "revisions until you're happy" is a scope trap. Make them specific (e.g. "2 rounds of revisions").
7. Check: would you sign this? If hesitating, what would you change?

Output ONLY the final polished proposal in clean markdown format. No commentary.`,
  },

  "client-checkin": {
    name: "client-checkin",
    title: "Client Check-in",
    tagline: "Keep clients close without being annoying.",
    description:
      "Draft a thoughtful client check-in that shows progress, builds trust, and keeps the relationship warm — without overexplaining.",
    fields: [
      {
        name: "client_name",
        label: "Client name",
        placeholder: "e.g. Rachel at Momentum Labs",
        type: "text",
        required: true,
      },
      {
        name: "project_phase",
        label: "Where are you in the project?",
        placeholder: "e.g. Week 2 of 6, just delivered first draft, waiting on feedback, final week",
        type: "text",
        required: true,
      },
      {
        name: "recent_progress",
        label: "What got done recently?",
        placeholder: "e.g. Completed brand guide v1, set up analytics, resolved the login bug",
        type: "textarea",
        required: true,
      },
      {
        name: "blockers",
        label: "Any blockers or things you need from them? (optional)",
        placeholder: "e.g. Waiting on logo files, need approval on homepage copy, need access to staging",
        type: "textarea",
        required: false,
      },
      {
        name: "relationship_context",
        label: "Relationship temperature? (optional)",
        placeholder: "e.g. Very happy so far, they've been quiet lately, they asked to delay last week",
        type: "text",
        required: false,
      },
    ],
    expandPrompt: (inputs) => `You are a client relationship expert for freelancers and consultants. Analyze this check-in situation:

CLIENT: ${inputs.client_name}
PHASE: ${inputs.project_phase}
RECENT PROGRESS: ${inputs.recent_progress}
BLOCKERS: ${inputs.blockers || "none"}
RELATIONSHIP TEMP: ${inputs.relationship_context || "not specified"}

Plan the check-in:
1. What is the client's emotional state most likely right now? (anxious, trusting, distracted, engaged?)
2. What does this client most need to hear at this phase — reassurance, momentum, specific outcomes?
3. If there are blockers, how do we ask for what we need without making them feel chased or guilty?
4. What tone is right — high energy update, calm and professional, or something else?
5. What's one detail from the recent progress that will most resonate with their business goals?

Be specific about the relationship psychology here.`,

    generatePrompt: (inputs, expansion) => `You are a communication coach for client-facing professionals. Use this strategy:

${expansion}

CHECK-IN DETAILS:
CLIENT: ${inputs.client_name}
PHASE: ${inputs.project_phase}
PROGRESS: ${inputs.recent_progress}
BLOCKERS: ${inputs.blockers || "none"}
RELATIONSHIP TEMP: ${inputs.relationship_context || "not specified"}

Write a check-in message (email or async message). Rules:
- Open with something specific — NEVER "Just checking in", "I wanted to touch base", "Hope you're well", "I hope this finds you well"
- Lead with value/progress, not your needs
- If you need something from them, ask once, clearly, at the end with a specific timeframe (e.g. "by Thursday" not "when you have a chance")
- Keep it under 150 words unless the project phase genuinely demands more
- Tone: confident professional who is in control and has their back — not anxious, not over-explaining
- No justifying every decision. State progress, not the process behind it.

Output the message ready to send. Subject line first if email format.`,

    polishPrompt: (inputs, draft) => `You are editing a client check-in for ${inputs.client_name}:

---
${draft}
---

Polish this:
1. Does the opening avoid "checking in", "touching base", or "hope you're well"? If not, replace with something specific.
2. Does the progress update feel confident, not defensive or over-explained?
3. If there's a blocker ask, is it clear, specific, once only, and does it include a concrete timeframe?
4. Is the length right? Too long = anxiety, too short = dismissive. Under 150 words unless there's a real reason.
5. Would the client feel "they've got this" after reading it? Or do they feel chased?

Output ONLY the final polished message. No commentary.`,
  },
};

export const AGENT_LIST: AgentConfig[] = Object.values(AGENTS);
