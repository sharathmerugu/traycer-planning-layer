/**
 * Plan generation logic - converts natural language descriptions into structured tasks
 */

import { Task, TaskType, Agent } from "./types";

/**
 * Parsed plan structure from user description
 */
export interface ParsedPlan {
  goal: string;
  technologies: string[];
  complexity: "simple" | "moderate" | "complex";
  suggestedTasks: string[];
}

/**
 * Analyzes user's plan description to extract key information
 * @param description - Natural language description of what to build
 * @returns Structured parsed plan data
 */
export function analyzePlanDescription(description: string): ParsedPlan {
  const lowerDesc = description.toLowerCase();

  // Extract action keywords
  const actionKeywords = [
    "build",
    "create",
    "add",
    "implement",
    "fix",
    "optimize",
    "refactor",
    "develop",
    "setup",
    "configure",
  ];
  const detectedActions = actionKeywords.filter((keyword) =>
    lowerDesc.includes(keyword)
  );

  // Detect technologies mentioned
  const techKeywords = [
    "react",
    "next.js",
    "nextjs",
    "api",
    "database",
    "db",
    "auth",
    "authentication",
    "ui",
    "component",
    "backend",
    "frontend",
    "testing",
    "typescript",
    "tailwind",
    "css",
    "form",
    "validation",
  ];
  const detectedTech = techKeywords.filter((tech) => lowerDesc.includes(tech));

  // Extract file type mentions
  const fileTypes = [
    "component",
    "page",
    "api route",
    "utility",
    "hook",
    "service",
    "model",
    "controller",
  ];
  const detectedFileTypes = fileTypes.filter((type) =>
    lowerDesc.includes(type)
  );

  // Determine complexity based on description length and tech count
  let complexity: "simple" | "moderate" | "complex";
  const wordCount = description.split(" ").length;
  const techCount = detectedTech.length;

  if (wordCount < 10 && techCount <= 2) {
    complexity = "simple";
  } else if (wordCount < 25 && techCount <= 4) {
    complexity = "moderate";
  } else {
    complexity = "complex";
  }

  // Generate suggested task titles based on detected actions and tech
  const suggestedTasks: string[] = [];

  if (detectedActions.length > 0) {
    suggestedTasks.push(
      `Analyze requirements for ${detectedTech.join(", ") || "project"}`
    );

    if (lowerDesc.includes("auth") || lowerDesc.includes("authentication")) {
      suggestedTasks.push("Design authentication flow");
      suggestedTasks.push("Implement authentication logic");
    }

    if (lowerDesc.includes("api") || lowerDesc.includes("backend")) {
      suggestedTasks.push("Design API endpoints");
      suggestedTasks.push("Implement API routes");
    }

    if (
      lowerDesc.includes("ui") ||
      lowerDesc.includes("component") ||
      lowerDesc.includes("frontend")
    ) {
      suggestedTasks.push("Design UI components");
      suggestedTasks.push("Implement UI components");
    }

    if (lowerDesc.includes("database") || lowerDesc.includes("db")) {
      suggestedTasks.push("Design database schema");
      suggestedTasks.push("Setup database connection");
    }

    suggestedTasks.push("Write unit tests");
    suggestedTasks.push("Optimize and refactor");
  }

  return {
    goal: description,
    technologies: detectedTech,
    complexity,
    suggestedTasks:
      suggestedTasks.length > 0
        ? suggestedTasks
        : [
            "Analyze project requirements",
            "Implement core functionality",
            "Test implementation",
          ],
  };
}

/**
 * Generates structured tasks from a natural language description
 * @param description - What the user wants to build
 * @returns Array of structured Task objects with dependencies
 */
export function generateTasksFromDescription(description: string): Task[] {
  const parsed = analyzePlanDescription(description);
  const tasks: Task[] = [];
  let taskCounter = 0;

  const createTaskId = () => `task-${Date.now()}-${taskCounter++}`;

  // Helper to create a task
  const createTask = (
    title: string,
    description: string,
    type: TaskType,
    estimatedTime: number,
    files: string[],
    dependencies: string[] = []
  ): Task => ({
    id: createTaskId(),
    title,
    description,
    status: "pending",
    type,
    dependencies,
    estimatedTime,
    files,
    createdAt: new Date(),
  });

  // PHASE 1: Analysis tasks (no dependencies)
  const analysisTask = createTask(
    "Analyze project requirements",
    `Review and understand the requirements: ${parsed.goal}`,
    "analysis",
    10,
    ["REQUIREMENTS.md", "docs/planning.md"]
  );
  tasks.push(analysisTask);

  const codeReviewTask = createTask(
    "Review existing codebase structure",
    "Analyze current project structure and identify integration points",
    "analysis",
    15,
    ["src/", "package.json"],
    [analysisTask.id]
  );
  tasks.push(codeReviewTask);

  // PHASE 2: Design tasks (depend on analysis)
  const architectureTask = createTask(
    "Design system architecture",
    `Plan the architecture for: ${
      parsed.technologies.join(", ") || "the system"
    }`,
    "analysis",
    20,
    ["docs/architecture.md"],
    [codeReviewTask.id]
  );
  tasks.push(architectureTask);

  // PHASE 3: Implementation tasks (depend on design)
  const implementationTasks: Task[] = [];

  if (
    parsed.technologies.includes("component") ||
    parsed.technologies.includes("ui") ||
    parsed.technologies.includes("frontend")
  ) {
    const uiTask = createTask(
      "Implement UI components",
      "Build the user interface components with React and Tailwind CSS",
      "implementation",
      30,
      ["src/components/Feature.tsx", "src/app/feature/page.tsx"],
      [architectureTask.id]
    );
    tasks.push(uiTask);
    implementationTasks.push(uiTask);
  }

  if (
    parsed.technologies.includes("api") ||
    parsed.technologies.includes("backend")
  ) {
    const apiTask = createTask(
      "Implement API endpoints",
      "Create backend API routes and handlers",
      "implementation",
      35,
      ["src/app/api/feature/route.ts", "src/lib/api.ts"],
      [architectureTask.id]
    );
    tasks.push(apiTask);
    implementationTasks.push(apiTask);
  }

  if (
    parsed.technologies.includes("auth") ||
    parsed.technologies.includes("authentication")
  ) {
    const authTask = createTask(
      "Implement authentication",
      "Setup user authentication and authorization flow",
      "implementation",
      40,
      ["src/lib/auth.ts", "src/middleware.ts"],
      [architectureTask.id]
    );
    tasks.push(authTask);
    implementationTasks.push(authTask);
  }

  if (
    parsed.technologies.includes("database") ||
    parsed.technologies.includes("db")
  ) {
    const dbTask = createTask(
      "Setup database integration",
      "Configure database connection and create schema",
      "implementation",
      25,
      ["src/lib/db.ts", "prisma/schema.prisma"],
      [architectureTask.id]
    );
    tasks.push(dbTask);
    implementationTasks.push(dbTask);
  }

  // If no specific implementation tasks, create a generic one
  if (implementationTasks.length === 0) {
    const genericTask = createTask(
      "Implement core functionality",
      "Build the main features as described in requirements",
      "implementation",
      30,
      ["src/lib/core.ts", "src/components/Main.tsx"],
      [architectureTask.id]
    );
    tasks.push(genericTask);
    implementationTasks.push(genericTask);
  }

  // PHASE 4: Testing tasks (depend on implementation)
  const testTask = createTask(
    "Write unit tests",
    "Create comprehensive unit tests for all components and functions",
    "testing",
    25,
    ["src/__tests__/feature.test.ts", "src/__tests__/integration.test.ts"],
    implementationTasks.map((t) => t.id)
  );
  tasks.push(testTask);

  const integrationTestTask = createTask(
    "Run integration tests",
    "Test the complete flow and ensure all parts work together",
    "testing",
    20,
    ["src/__tests__/e2e.test.ts"],
    [testTask.id]
  );
  tasks.push(integrationTestTask);

  // PHASE 5: Refinement tasks (depend on testing)
  const optimizeTask = createTask(
    "Optimize performance",
    "Improve code performance, reduce bundle size, optimize renders",
    "refactor",
    30,
    implementationTasks.map((t) => t.files).flat(),
    [integrationTestTask.id]
  );
  tasks.push(optimizeTask);

  const documentTask = createTask(
    "Add documentation",
    "Document the implementation, add code comments, update README",
    "refactor",
    15,
    ["README.md", "docs/implementation.md"],
    [optimizeTask.id]
  );
  tasks.push(documentTask);

  return tasks;
}

/**
 * Assigns the most suitable agent to a task based on type and capabilities
 * @param task - The task to assign
 * @param agents - Available agents
 * @returns Agent ID of the best match
 */
export function assignAgentToTask(task: Task, agents: Agent[]): string {
  // Define agent preferences by task type
  const agentPreferences: Record<TaskType, string[]> = {
    analysis: ["cursor", "windsurf", "copilot", "codeium"], // Cursor best for analysis
    implementation: ["copilot", "cursor", "windsurf", "codeium"], // Copilot best for new code
    testing: ["codeium", "copilot", "windsurf", "cursor"], // Codeium best for tests
    refactor: ["windsurf", "cursor", "copilot", "codeium"], // Windsurf best for optimization
  };

  // Get preferred agents for this task type
  const preferredAgentIds = agentPreferences[task.type];

  // Filter available agents (status: 'available')
  const availableAgents = agents.filter(
    (agent) => agent.status === "available"
  );

  // If no available agents, return first in preference list
  if (availableAgents.length === 0) {
    return preferredAgentIds[0];
  }

  // Find first available agent from preference list
  for (const agentId of preferredAgentIds) {
    const agent = availableAgents.find((a) => a.id === agentId);
    if (agent) {
      return agent.id;
    }
  }

  // Fallback: return first available agent
  return availableAgents[0].id;
}
