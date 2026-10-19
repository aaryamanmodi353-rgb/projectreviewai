package com.example.projectai;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
public class SseLogService {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter subscribe() {
        // 30-minute timeout for open client connections
        SseEmitter emitter = new SseEmitter(1800000L);

        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError((e) -> emitters.remove(emitter));

        return emitter;
    }

    public void emitLog(String level, String action, String details) {
        String jsonPayload = String.format(
            "{\"time\":\"%s\",\"level\":\"%s\",\"action\":\"%s\",\"details\":\"%s\"}",
            java.time.LocalTime.now().toString().substring(0, 8),
            level,
            action,
            details.replace("\"", "\\\"")
        );

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name("log").data(jsonPayload));
            } catch (IOException e) {
                emitters.remove(emitter);
            }
        }
    }
}