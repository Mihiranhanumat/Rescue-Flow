import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { Task, RescuePlan, RescueActionStep } from "@/types";

function generateLocalHeuristicRescuePlan(tasks: Task[]): RescuePlan {
  if (!tasks || tasks.length === 0) {
    return {
      productivityScore: 98,
      chaosLevel: "Optimal",
      analysisSummary: "Zero active threats detected. System is running at optimal bandwidth.",
      tacticalMantra: "Maintain readiness. Opportunity favors the prepared mind.",
      rescueActions: [
        {
          id: "step-empty-1",
          stepNumber: 1,
          title: "Define Next Milestone Goals",
          rationale: "Proactively set high-leverage objectives before new chaos arrives.",
          estimatedMinutes: 15,
          priorityLevel: "Medium",
        },
      ],
      quickWins: [
        "Review weekly strategic goals",
        "Clear workspace and desktop clutter",
        "Hydrate and prepare next sprint vector",
      ],
      eisenhowerMatrix: {
        doFirst: [],
        schedule: [],
        delegate: [],
        drop: [],
      },
    };
  }

  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const activeTasks = pendingTasks.length > 0 ? pendingTasks : tasks;

  // Calculate weighted risk & chaos
  const totalRisk = activeTasks.reduce((acc, t) => acc + (t.risk || 50), 0);
  const avgRisk = Math.round(totalRisk / activeTasks.length);
  const criticalCount = activeTasks.filter((t) => t.priority === "Critical" || t.risk > 80).length;

  let chaosLevel: RescuePlan["chaosLevel"] = "Elevated";
  let baseScore = 75;

  if (criticalCount >= 2 || avgRisk > 75) {
    chaosLevel = "Catastrophic";
    baseScore = 42;
  } else if (criticalCount === 1 || avgRisk > 60) {
    chaosLevel = "High Alert";
    baseScore = 58;
  } else if (avgRisk < 40) {
    chaosLevel = "Manageable";
    baseScore = 88;
  }

  // Sort by urgency/risk
  const priorityRank: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
  const sortedTasks = [...activeTasks].sort((a, b) => {
    const pDiff = (priorityRank[b.priority] || 1) - (priorityRank[a.priority] || 1);
    if (pDiff !== 0) return pDiff;
    return (b.risk || 0) - (a.risk || 0);
  });

  const rescueActions: RescueActionStep[] = sortedTasks.slice(0, 4).map((task, idx) => {
    let rationale = `Direct mitigation for ${task.title}. Neutralizes high risk vector.`;
    if (task.priority === "Critical") {
      rationale = `Critical blocker (${task.risk}% failure probability). Must be isolated and resolved first.`;
    } else if (task.category === "Technical") {
      rationale = "Technical fix stabilizes dependencies and unblocks subsequent operational flows.";
    } else if (task.category === "Communication") {
      rationale = "Rapid stakeholder alignment reduces incoming anxiety and sets realistic expectations.";
    }

    return {
      id: `step-heuristic-${task.id || idx}`,
      stepNumber: idx + 1,
      title: `Execute: ${task.title} (${task.deadline || "ASAP"})`,
      rationale,
      estimatedMinutes: task.estimatedMinutes || 25,
      priorityLevel: task.priority || "High",
    };
  });

  // Quick wins (tasks <= 20 mins or simple mitigations)
  const quickWinTasks = activeTasks.filter((t) => (t.estimatedMinutes || 30) <= 20);
  const quickWins = quickWinTasks.length > 0
    ? quickWinTasks.map((t) => `Quick blast (${t.estimatedMinutes || 15}m): ${t.title}`)
    : [
        "Mute non-urgent Slack & email notifications for 60 minutes",
        `Isolate top vector: ${sortedTasks[0]?.title || "Immediate priority"}`,
        "Delegate or defer lowest-risk communication tasks",
      ];

  // Eisenhower Matrix segregation
  const doFirst: string[] = [];
  const schedule: string[] = [];
  const delegate: string[] = [];
  const drop: string[] = [];

  activeTasks.forEach((t) => {
    if (t.priority === "Critical" || t.risk >= 75) {
      doFirst.push(t.title);
    } else if (t.category === "Strategy" || (t.priority === "High" && t.risk < 75)) {
      schedule.push(t.title);
    } else if (t.category === "Operations" || t.category === "Communication" || t.priority === "Medium") {
      delegate.push(t.title);
    } else {
      drop.push(t.title);
    }
  });

  const mantras = [
    "Lock the perimeter. Eliminate highest friction vectors before expanding scope.",
    "Decisive action destroys paralysis. Attack the critical bottleneck immediately.",
    "Chaos is merely untracked momentum. Channel energy into sequential execution.",
    "One vector at a time. Laser focus over frantic multitasking.",
  ];
  const tacticalMantra = mantras[Math.floor(Math.random() * mantras.length)];

  return {
    productivityScore: baseScore,
    chaosLevel,
    analysisSummary: `Detected ${activeTasks.length} active vectors with an average risk factor of ${avgRisk}%. Immediate triage sequence prioritized ${rescueActions.length} high-leverage interventions.`,
    tacticalMantra,
    rescueActions,
    quickWins: quickWins.slice(0, 3),
    eisenhowerMatrix: {
      doFirst: doFirst.slice(0, 4),
      schedule: schedule.slice(0, 4),
      delegate: delegate.slice(0, 4),
      drop: drop.slice(0, 4),
    },
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const tasks: Task[] = body.tasks || [];

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return highly structured heuristic plan when API key is not present
      const heuristicPlan = generateLocalHeuristicRescuePlan(tasks);
      return NextResponse.json(heuristicPlan);
    }

    // If API key is present, attempt Gemini call
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      // Try gemini-1.5-flash first, or gemini-2.0-flash
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are RESCUEFLOW AI: an elite emergency triage and productivity tactical intelligence agent.
Analyze these tasks for an overwhelmed operator:
${JSON.stringify(tasks, null, 2)}

Provide a strict, valid JSON response with the following exact schema:
{
  "productivityScore": number (0 to 100 representing current rescue recovery potential),
  "chaosLevel": "Catastrophic" | "High Alert" | "Elevated" | "Manageable" | "Optimal",
  "analysisSummary": "A concise 2-sentence tactical analysis of their situation and bottleneck",
  "tacticalMantra": "A punchy, intense, 10-15 word combat/tactical focus mantra",
  "rescueActions": [
    {
      "id": "step-1",
      "stepNumber": 1,
      "title": "Clear action title",
      "rationale": "Why this must be tackled now",
      "estimatedMinutes": 25,
      "priorityLevel": "Critical" | "High" | "Medium" | "Low"
    }
  ],
  "quickWins": ["Actionable 5-15 min quick relief step 1", "step 2", "step 3"],
  "eisenhowerMatrix": {
    "doFirst": ["task title 1"],
    "schedule": ["task title 2"],
    "delegate": ["task title 3"],
    "drop": ["task title 4"]
  }
}

Rules:
- Order rescueActions from most critical/urgent to secondary.
- Be realistic, decisive, and calming yet assertive.
- Output ONLY valid raw JSON with NO markdown code fences or backticks.`;

      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();

      // Strip markdown code fences if model returned them
      if (text.startsWith("```")) {
        text = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }

      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    } catch (aiErr) {
      console.warn("Gemini API call failed or rate limited, falling back to heuristic engine:", aiErr);
      const heuristicPlan = generateLocalHeuristicRescuePlan(tasks);
      return NextResponse.json(heuristicPlan);
    }
  } catch (err) {
    console.error("RescueFlow API error:", err);
    return NextResponse.json(
      { error: "Failed to analyze mission vectors", details: String(err) },
      { status: 500 }
    );
  }
}
