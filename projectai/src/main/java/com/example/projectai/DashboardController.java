package com.example.projectai;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {

    public record PrRecord(String pr, String repo, String event, String action, String severity, String state, String time, String type) {}

    private final List<PrRecord> recentPrs = new CopyOnWriteArrayList<>(List.of(
            new PrRecord("#11 ai-pr-test", "ai-pr-test", "pull_request", "reopened", "10.0/10", "Analyzing Diff", "Just now", "analyzing"),
            new PrRecord("#483 enterprise-backend-v2", "enterprise-backend-v2", "pull_request", "synchronized", "7.4/10", "Comment Posted", "2m ago", "success"),
            new PrRecord("#479 enterprise-backend-v2", "enterprise-backend-v2", "pull_request", "opened", "3.2/10", "Comment Posted", "8m ago", "success"),
            new PrRecord("#10 ai-pr-test", "ai-pr-test", "pull_request", "reopened", "8.7/10", "API Error", "16m ago", "error")
    ));

    @PostMapping
    public void manualTriggerLog(@RequestBody PrRecord newRecord) {
        recordNewReview(newRecord);
        System.out.println("📥 Dashboard updated: Manual review posted from UI.");
    }
    
    @GetMapping
    public Map<String, Object> getDashboardData() {
        int totalProcessed = 1280 + recentPrs.size(); 
        
        return Map.of(
            "metrics", Map.of(
                "prsProcessed", String.format("%,d", totalProcessed),
                "avgSeverity", "6.8",
                "successRate", "98.7%",
                "activeTools", 26
            ),
            "recentPrs", recentPrs
        );
    }

    public void recordNewReview(PrRecord newRecord) {
        recentPrs.add(0, newRecord);
        if (recentPrs.size() > 50) {
            recentPrs.remove(recentPrs.size() - 1);
        }
    }
}