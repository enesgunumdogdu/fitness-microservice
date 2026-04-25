package com.fitness.userservice.auth.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class AuthException extends RuntimeException {

    private final String code;
    private final HttpStatus status;

    public AuthException(HttpStatus status, String code, String message) {
        super(message);
        this.status = status;
        this.code = code;
    }

    public static AuthException emailAlreadyExists() {
        return new AuthException(HttpStatus.CONFLICT, "EMAIL_EXISTS", "An account with this email already exists");
    }

    public static AuthException invalidCredentials() {
        return new AuthException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "Invalid email or password");
    }

    public static AuthException invalidRefreshToken() {
        return new AuthException(HttpStatus.UNAUTHORIZED, "INVALID_REFRESH_TOKEN", "Refresh token is invalid, expired, or revoked");
    }
}
