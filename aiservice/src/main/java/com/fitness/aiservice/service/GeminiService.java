package com.fitness.aiservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import java.util.Map;

@Service
@Slf4j
public class GeminiService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    // gemini api format
    public String getAnswer(String prompt){
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
                        })
                }
        );

        log.info("Calling Gemini API: {}", geminiApiUrl);
        log.debug("Request body: {}", requestBody);

        try {
            String response = webClient.post()
                    .uri(geminiApiUrl)
                    .header("Content-Type", "application/json")
                    .header("x-goog-api-key", geminiApiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            return response;
        } catch (WebClientResponseException e) {
            log.error("Gemini API error - Status: {}, Response: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw e;
        }
    }
}
