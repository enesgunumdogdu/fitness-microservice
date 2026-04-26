package com.fitness.aiservice.service;

import com.fitness.aiservice.exception.ForbiddenException;
import com.fitness.aiservice.exception.RecommendationNotFoundException;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final RecommendationRepository recommendationRepository;

    public List<Recommendation> getUserRecommendation(String userId) {
        return recommendationRepository.findByUserId(userId);
    }

    public Recommendation getActivityRecommendation(String activityId, String callerUserId) {
        Recommendation recommendation = recommendationRepository.findByActivityId(activityId)
                .orElseThrow(() -> new RecommendationNotFoundException("No Recommendation found for this activity " + activityId));
        if (!recommendation.getUserId().equals(callerUserId)) {
            throw new ForbiddenException("Access denied");
        }
        return recommendation;
    }
}
