package com.fitness.gateway;

import com.fitness.gateway.user.RegisterRequest;
import com.fitness.gateway.user.UserService;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
@Slf4j
@RequiredArgsConstructor
public class KeycloakUserSyncFilter implements WebFilter {
    private final UserService userService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        String userId = exchange.getRequest().getHeaders().getFirst("X-User-ID");

        if (token == null) {
            return chain.filter(exchange);
        }

        RegisterRequest registerRequest = getUserDetails(token);

        if (userId == null && registerRequest != null) {
            userId = registerRequest.getKeycloakId();
        }

        if (userId == null) {
            return chain.filter(exchange);
        }

        String finalUserId = userId;

        return Mono.defer(() -> {
            try {
                Boolean exist = userService.validateUser(finalUserId);

                if (!exist && registerRequest != null) {
                    userService.registerUser(registerRequest);
                } else {
                    log.info("User already exist, Skipping sync.");
                }
            } catch (Exception e) {
                log.error("Error during user sync: {}", e.getMessage());
            }

            ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                    .header("X-User-ID", finalUserId)
                    .build();

            ServerWebExchange modifiedExchange = exchange.mutate()
                    .request(modifiedRequest)
                    .build();

            return chain.filter(modifiedExchange);
        });
    }

    private RegisterRequest getUserDetails(String token) {
        try {
            String tokenWithoutBearer = token.replace("Bearer ", "").trim();
            SignedJWT signedJWT = SignedJWT.parse(tokenWithoutBearer);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

            RegisterRequest registerRequest = new RegisterRequest();
            registerRequest.setEmail(claims.getStringClaim("email"));
            registerRequest.setKeycloakId(claims.getStringClaim("sub"));
            registerRequest.setPassword("dummy@123123");
            registerRequest.setFirstName(claims.getStringClaim("given_name"));
            registerRequest.setLastName(claims.getStringClaim("family_name"));
            return registerRequest;
        } catch (Exception e) {
            log.error("Error parsing JWT token: {}", e.getMessage());
            return null;
        }
    }
}
