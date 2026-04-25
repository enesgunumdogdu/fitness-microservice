package com.fitness.userservice.auth.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Data
@Component
@ConfigurationProperties(prefix = "auth.jwt")
public class JwtProperties {

    private String issuer = "fitness-auth-service";
    private String audience = "fitness-platform";
    private Duration accessTokenTtl = Duration.ofMinutes(15);
    private Duration refreshTokenTtl = Duration.ofDays(30);
    private String keysDirectory = "auth-keys";
    private String keyId = "auth-key-1";
}
