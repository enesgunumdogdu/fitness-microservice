package com.fitness.userservice.auth;

import com.fitness.userservice.auth.config.JwtProperties;
import com.fitness.userservice.auth.dto.AuthResponse;
import com.fitness.userservice.auth.dto.LoginRequest;
import com.fitness.userservice.auth.dto.RegisterAuthRequest;
import com.fitness.userservice.auth.exception.AuthException;
import com.fitness.userservice.auth.jwt.JwtIssuer;
import com.fitness.userservice.auth.refresh.RefreshToken;
import com.fitness.userservice.auth.refresh.RefreshTokenRepository;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.model.User;
import com.fitness.userservice.model.UserRole;
import com.fitness.userservice.repository.UserRepository;
import com.fitness.userservice.service.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final int REFRESH_TOKEN_BYTES = 48;

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtIssuer jwtIssuer;
    private final JwtProperties jwtProperties;

    @Transactional
    public AuthResponse register(RegisterAuthRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw AuthException.emailAlreadyExists();
        }

        User user = new User();
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setRole(UserRole.USER);
        User saved = userRepository.save(user);
        log.info("Registered new user {} ({})", saved.getId(), saved.getEmail());

        return buildAuthResponse(saved);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(AuthException::invalidCredentials);

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw AuthException.invalidCredentials();
        }

        log.info("User {} logged in", user.getId());
        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse refresh(String presentedToken) {
        String tokenHash = sha256(presentedToken);
        RefreshToken stored = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(AuthException::invalidRefreshToken);

        if (stored.isRevoked() || stored.getExpiresAt().isBefore(Instant.now())) {
            refreshTokenRepository.revokeAllForUser(stored.getUserId());
            throw AuthException.invalidRefreshToken();
        }

        User user = userRepository.findById(stored.getUserId())
                .orElseThrow(AuthException::invalidRefreshToken);

        String newRaw = generateRefreshTokenValue();
        RefreshToken newToken = persistRefreshToken(user.getId(), newRaw);

        stored.setRevoked(true);
        stored.setReplacedBy(newToken.getId());
        refreshTokenRepository.save(stored);

        JwtIssuer.IssuedToken access = jwtIssuer.issueAccessToken(user);
        return buildAuthResponse(user, access, newRaw);
    }

    @Transactional
    public void logout(String presentedToken) {
        String tokenHash = sha256(presentedToken);
        refreshTokenRepository.findByTokenHash(tokenHash).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
            log.info("Refresh token {} revoked via logout", token.getId());
        });
    }

    private AuthResponse buildAuthResponse(User user) {
        String rawRefresh = generateRefreshTokenValue();
        persistRefreshToken(user.getId(), rawRefresh);
        JwtIssuer.IssuedToken access = jwtIssuer.issueAccessToken(user);
        return buildAuthResponse(user, access, rawRefresh);
    }

    private AuthResponse buildAuthResponse(User user, JwtIssuer.IssuedToken access, String refreshToken) {
        UserResponse userResponse = UserMapper.toUserResponse(user);
        return AuthResponse.builder()
                .accessToken(access.token())
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(access.expiresInSeconds())
                .user(userResponse)
                .build();
    }

    private RefreshToken persistRefreshToken(String userId, String rawValue) {
        RefreshToken refresh = RefreshToken.builder()
                .userId(userId)
                .tokenHash(sha256(rawValue))
                .expiresAt(Instant.now().plus(jwtProperties.getRefreshTokenTtl()))
                .revoked(false)
                .build();
        return refreshTokenRepository.save(refresh);
    }

    private String generateRefreshTokenValue() {
        byte[] buffer = new byte[REFRESH_TOKEN_BYTES];
        SECURE_RANDOM.nextBytes(buffer);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(buffer);
    }

    private String sha256(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest(value.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
