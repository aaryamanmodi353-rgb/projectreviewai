package com.example.projectai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CodeReviewAgent {

    private final ChatClient chatClient;
    private final List<ToolCallbackProvider> toolProviders;
    private final SseLogService logService; // Injected telemetry service

    private static final String FDE_SYSTEM_PROMPT = """
            You are a Staff-level AI Forward Deployed Engineer conducting an elite code review. Your goal is to ensure production-grade reliability, security, and architectural excellence.
            
            CRITICAL INSTRUCTIONS:
            1. Java 21 Enforcement: You must actively look for opportunities to upgrade legacy Java code to Java 21 standards. Specifically demand the use of:
               - Pattern Matching for `switch` and `instanceof`.
               - Record classes for immutable data carriers.
               - Sequenced Collections where ordered data is manipulated.
               - Virtual Threads for concurrent I/O operations.
            2. Security & Performance: Flag hardcoded secrets, potential NullPointerExceptions, and inefficient loops.
            
            OUTPUT FORMAT:
            You must strictly output your review using the following Markdown structure. Do not include any conversational filler outside of this structure.
            
            ### 🛡️ FDE Code Review Report
            
            **Severity Score:** [0-10] (0 = Perfect, 10 = Critical vulnerabilities or broken build)
            
            **Review Summary:**
            [1-2 sentences summarizing the overall quality and main issues.]
            
            **Actionable Feedback:**
            * 🔴 **Critical:** [Major bugs, security leaks, or architectural flaws]
            * 🟡 **Warning:** [Missing Java 21 features, code smells, or edge cases]
            * 🟢 **Nitpick:** [Variable naming, formatting, or minor optimizations]
            """;

    public CodeReviewAgent(ChatClient.Builder chatClientBuilder, List<ToolCallbackProvider> toolProviders, SseLogService logService) {
        this.toolProviders = toolProviders;
        this.logService = logService;
        this.chatClient = chatClientBuilder
                .defaultSystem(FDE_SYSTEM_PROMPT)
                .build();
    }

    public void reviewPullRequest(String owner, String repo, int prNumber) {
        System.out.println("Initiating AI Code Review for: " + owner + "/" + repo + " PR #" + prNumber);
        logService.emitLog("INFO", "Webhook Received", "pull_request.reopened • " + repo + "#" + prNumber);

        try {
            // 1. Load active tools
            List<ToolCallback> activeTools = new ArrayList<>();
            if (toolProviders != null) {
                for (ToolCallbackProvider provider : toolProviders) {
                    for (ToolCallback cb : provider.getToolCallbacks()) {
                        activeTools.add(cb);
                    }
                }
            }
            System.out.println("🔧 Dynamically loaded " + activeTools.size() + " MCP tools.");
            logService.emitLog("INFO", "Tools Loaded", activeTools.size() + " MCP tools available to agent");

            if (activeTools.isEmpty()) {
                System.err.println("❌ Error: No MCP tools found! Ensure mcp-servers-config.json is correct.");
                logService.emitLog("ERROR", "Tool Error", "No MCP tools found in configuration");
                return;
            }

            ToolCallback[] toolArray = activeTools.toArray(new ToolCallback[0]);

            // STEP 1: Generate the Code Review Markdown
            logService.emitLog("RUN", "Fetching Diff", "github.get_pull_request_diff");
            
            String analysisPrompt = String.format(
                "You are an expert AI code reviewer. Your task is to review Pull Request #%d for repository '%s/%s'.\n\n" +
                "1. Use the provided GitHub tools to fetch the code diffs for this PR first.\n" +
                "2. Analyze the code and generate a structured Markdown code review report.",
                prNumber, owner, repo
            );

            System.out.println("⏳ Analyzing code...");
            logService.emitLog("RUN", "Analyzing Code", "gemini-3.8-flash • deterministic mode");
            
            String markdownReview = chatClient.prompt()
                    .user(analysisPrompt)
                    .tools(toolArray)
                    .call()
                    .content(); // Extracts just the markdown text

            System.out.println("✅ Analysis complete. Posting to GitHub...");
            logService.emitLog("DONE", "Analysis Complete", "Findings extracted successfully");

            // STEP 2: Post the comment via Tool Call
            logService.emitLog("RUN", "Posting to GitHub", "github.create_issue_comment");

            String postingPrompt = String.format(
                "You are an automated GitHub bot. You MUST use the `create_issue_comment` tool to post the following review to GitHub.\n\n" +
                "Parameters:\n" +
                "- owner: \"%s\"\n" +
                "- repo: \"%s\"\n" +
                "- issue_number: %d\n" +
                "- body: \n```\n%s\n```\n\n" +
                "Execute the tool call now.",
                owner, repo, prNumber, markdownReview
            );

            org.springframework.ai.chat.model.ChatResponse postResponse = chatClient.prompt()
                    .user(postingPrompt)
                    .tools(toolArray)
                    .call()
                    .chatResponse();

            System.out.println("✅ Successfully posted the review to PR #" + prNumber);
            logService.emitLog("DONE", "Review Published", "Posted to GitHub PR #" + prNumber);

        } catch (Exception e) {
            System.err.println("❌ ERROR during AI Review process:");
            e.printStackTrace();
            logService.emitLog("ERROR", "Execution Failed", e.getMessage() != null ? e.getMessage() : "Unknown error");
        }
    }
}