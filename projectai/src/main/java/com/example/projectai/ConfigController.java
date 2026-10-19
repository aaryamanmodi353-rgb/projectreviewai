package com.example.projectai;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/config")
@CrossOrigin(origins = "http://localhost:3000") // <-- This is required for Next.js to connect!
public class ConfigController {

    private String targetRepositories = "aaryamanmodi353-rgb/ai-pr-test";
    private String geminiApiKey = "AIzaSy... (Managed by Vault)";
    private String systemPrompt = "You are a deterministic enterprise Java 21 code reviewer. Analyze pull request diffs for correctness, security, performance, and idiomatic Java usage. Return a structured Markdown report with severity scores and actionable fixes.";

    public record ConfigData(String targetRepositories, String geminiApiKey, String systemPrompt) {}

    @GetMapping
    public ConfigData getConfig() {
        return new ConfigData(targetRepositories, geminiApiKey, systemPrompt);
    }

    @PostMapping
    public ConfigData updateConfig(@RequestBody ConfigData newData) {
        this.targetRepositories = newData.targetRepositories();
        this.geminiApiKey = newData.geminiApiKey();
        this.systemPrompt = newData.systemPrompt();
        
        System.out.println("⚙️ Agent Configuration Updated by User: Aryaman");
        return new ConfigData(targetRepositories, geminiApiKey, systemPrompt);
    }
}