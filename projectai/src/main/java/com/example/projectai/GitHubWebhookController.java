package com.example.projectai;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/webhooks")
public class GitHubWebhookController {

    private final CodeReviewAgent codeReviewAgent;

    public GitHubWebhookController(CodeReviewAgent codeReviewAgent) {
        this.codeReviewAgent = codeReviewAgent;
    }

    @PostMapping("/github")
    public String handleGitHubWebhook(
            @RequestBody Map<String, Object> payload, 
            @RequestHeader("X-GitHub-Event") String eventType) {
        
        String action = (String) payload.get("action");
        System.out.println("🔔 Webhook received! Event Type: " + eventType + " | Action: " + action);
                                          
        try {
            if ("pull_request".equals(eventType)) {
                if ("opened".equals(action) || "synchronize".equals(action) || "reopened".equals(action)) {
                    
                    Map<String, Object> prData = (Map<String, Object>) payload.get("pull_request");
                    Map<String, Object> repoData = (Map<String, Object>) payload.get("repository");
                    
                    String repoName = (String) repoData.get("name");
                    Map<String, Object> ownerData = (Map<String, Object>) repoData.get("owner");
                    String ownerName = (String) ownerData.get("login");
                    
                    // Safely handle the PR number regardless of how Jackson parsed it
                    Number prNumObj = (Number) prData.get("number");
                    int prNumber = prNumObj.intValue();

                    System.out.println("✅ Data extracted successfully! PR #" + prNumber + " for " + ownerName + "/" + repoName);

                    // Trigger the AI in the background and catch any async crashes
                    CompletableFuture.runAsync(() -> {
                        System.out.println("🚀 Async thread started!");
                        
                        // Dynamically use the exact PR that triggered the webhook
                        System.out.println("Initiating AI Code Review for: " + ownerName + "/" + repoName + " PR #" + prNumber);
                        codeReviewAgent.reviewPullRequest(ownerName, repoName, prNumber);
                        
                    }).exceptionally(ex -> {
                        System.err.println("❌ Async thread crashed:");
                        ex.printStackTrace();
                        return null;
                    });
                    
                    return "PR Review Initiated for PR #" + prNumber;
                }
            }
        } catch (Exception e) {
            System.err.println("❌ ERROR extracting webhook payload:");
            e.printStackTrace();
        }
        
        return "Event ignored";
    }
}