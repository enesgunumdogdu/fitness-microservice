package com.fitness.userservice.auth.jwt;

import com.fitness.userservice.auth.config.JwtProperties;
import com.fitness.userservice.model.User;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtIssuer {

    private final JwtProperties properties;
    private final JwtKeyManager keyManager;

    public IssuedToken issueAccessToken(User user) {
        Instant now = Instant.now();
        Instant exp = now.plus(properties.getAccessTokenTtl());

        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .subject(user.getId())
                .issuer(properties.getIssuer())
                .audience(properties.getAudience())
                .issueTime(Date.from(now))
                .expirationTime(Date.from(exp))
                .jwtID(UUID.randomUUID().toString())
                .claim("email", user.getEmail())
                .claim("given_name", user.getFirstName())
                .claim("family_name", user.getLastName())
                .claim("role", user.getRole() == null ? null : user.getRole().name())
                .build();

        JWSHeader header = new JWSHeader.Builder(JWSAlgorithm.RS256)
                .keyID(properties.getKeyId())
                .type(com.nimbusds.jose.JOSEObjectType.JWT)
                .build();

        SignedJWT jwt = new SignedJWT(header, claims);
        try {
            jwt.sign(new RSASSASigner(keyManager.getPrivateKey()));
        } catch (JOSEException e) {
            throw new IllegalStateException("Failed to sign access token", e);
        }

        return new IssuedToken(jwt.serialize(), properties.getAccessTokenTtl().getSeconds());
    }

    public record IssuedToken(String token, long expiresInSeconds) {
    }
}
