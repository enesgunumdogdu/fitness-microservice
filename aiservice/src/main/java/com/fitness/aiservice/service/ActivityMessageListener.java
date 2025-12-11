package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Activity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityMessageListener {

    private final ActivityAIService aiService;

    @RabbitListener(queues = "activity.queue")
    public void processActivity(Activity activity){
        try {
            log.info("Received activity for processing: {}", activity.getId());
            String recommendation = aiService.generateRecommendation(activity);
            log.info("Generated recommendation: {}", recommendation);
        } catch (Exception e) {
            log.error("Failed to process activity: {} - Error: {}", activity.getId(), e.getMessage(), e);
            throw new RuntimeException("Failed to process activity after retries", e);
        }
    }
}
