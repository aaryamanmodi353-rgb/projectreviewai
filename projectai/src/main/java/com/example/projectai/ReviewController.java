package com.example.projectai;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/review")
@CrossOrigin(origins = "http://localhost:3000") // Added CORS permission
public class ReviewController {

    private final ChatClient chatClient;
    private final List<ToolCallbackProvider> toolProviders;

    public ReviewController(ChatClient.Builder chatClientBuilder, List<ToolCallbackProvider> toolProviders) {
        this.toolProviders = toolProviders;
        this.chatClient = chatClientBuilder.build();
    }

   @PostMapping("/{owner}/{repo}/{prNumber}/comment")
    public Map<String, String> postComment(@PathVariable String owner, @PathVariable String repo, @PathVariable int prNumber, @RequestBody Map<String, String> payload) {
        String reportBody = payload.get("report");
        
        List<ToolCallback> activeTools = new ArrayList<>();
        if (toolProviders != null) {
            for (ToolCallbackProvider provider : toolProviders) {
                activeTools.addAll(List.of(provider.getToolCallbacks()));
            }
        }

        System.out.println("🚀 Publishing AI report to GitHub PR #" + prNumber);

        // Force Gemini to use the GitHub MCP tool to publish the comment
        String prompt = String.format(
            "Use the `github.create_issue_comment` tool to post the following review report to the pull request '%s/%s' on issue/PR number %d. \n\nReport:\n%s",
            owner, repo, prNumber, reportBody
        );

        chatClient.prompt()
                .user(prompt)
                .tools(activeTools.toArray(new ToolCallback[0]))
                .call()
                .content();

        System.out.println("✅ Report successfully posted to GitHub.");
        return Map.of("status", "success");
    }
    
@GetMapping("/{owner}/{repo}/{prNumber}/diff")
    public Map<String, String> getPrDiff(@PathVariable String owner, @PathVariable String repo, @PathVariable int prNumber) {
        System.out.println("⏳ Studio requested live diff. (Bypassing Gemini due to 429 Quota limit...)");

        // Hardcoded diff to test the frontend UI without hitting the Gemini API
        String dummyDiff = 
            "--- a/src/main/java/com/example/projectai/CodeReviewAgent.java\n" +
            "+++ b/src/main/java/com/example/projectai/CodeReviewAgent.java\n" +
            "@@ -15,7 +15,8 @@\n" +
            " public class CodeReviewAgent {\n" +
            "-    // TODO: Implement execution status\n" +
            "-    private String status = \"pending\";\n" +
            "+    // Status tracking enabled\n" +
            "+    private String status = \"active\";\n" +
            " }\n";

        return Map.of("diff", dummyDiff);
    }
}