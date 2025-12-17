package com.fitness.gateway;

import com.fitness.gateway.user.RegisterRequest;
import com.fitness.gateway.user.UserService;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;

@Component
@Slf4j
@RequiredArgsConstructor
public class KeycloakUserSyncFilter implements Filter {
    private final UserService userService;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        
        String token = httpRequest.getHeader("Authorization");
        String userId = httpRequest.getHeader("X-User-ID");
        
        if (token == null) {
            chain.doFilter(request, response);
            return;
        }
        
        RegisterRequest registerRequest = getUserDetails(token);
        
        if (userId == null && registerRequest != null) {
            userId = registerRequest.getKeycloakId();
        }

        if (userId != null && token != null){
            String finalUserId = userId;
            
            try {
                Boolean exist = userService.validateUser(userId);
                
                if (!exist && registerRequest != null) {
                    userService.registerUser(registerRequest);
                } else {
                    log.info("User already exist, Skipping sync.");
                }
            } catch (Exception e) {
                log.error("Error during user sync: {}", e.getMessage());
            }
            
            HttpServletRequest modifiedRequest = new HttpServletRequestWrapper(httpRequest) {
                @Override
                public String getHeader(String name) {
                    if ("X-User-ID".equals(name)) {
                        return finalUserId;
                    }
                    return super.getHeader(name);
                }

                @Override
                public Enumeration<String> getHeaders(String name) {
                    if ("X-User-ID".equals(name)) {
                        List<String> values = new ArrayList<>();
                        values.add(finalUserId);
                        return Collections.enumeration(values);
                    }
                    return super.getHeaders(name);
                }

                @Override
                public Enumeration<String> getHeaderNames() {
                    Set<String> names = new HashSet<>();
                    Enumeration<String> originalNames = super.getHeaderNames();
                    while (originalNames.hasMoreElements()) {
                        names.add(originalNames.nextElement());
                    }
                    names.add("X-User-ID");
                    return Collections.enumeration(names);
                }
            };
            
            chain.doFilter(modifiedRequest, response);
            return;
        }
        
        chain.doFilter(request, response);
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
