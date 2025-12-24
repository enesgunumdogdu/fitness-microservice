package com.fitness.userservice.exception;

import com.fitness.userservice.dto.RegistrationResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RegistrationException.class)
    public ResponseEntity<RegistrationResponse> handleRegistrationException(RegistrationException ex) {
        HttpStatus status = switch (ex.getErrorCode()) {
            case "EMAIL_EXISTS" -> HttpStatus.CONFLICT;
            case "USERNAME_EXISTS" -> HttpStatus.CONFLICT;
            case "KEYCLOAK_ERROR" -> HttpStatus.SERVICE_UNAVAILABLE;
            default -> HttpStatus.BAD_REQUEST;
        };

        return ResponseEntity.status(status).body(
                RegistrationResponse.builder()
                        .success(false)
                        .message(ex.getMessage())
                        .build()
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<RegistrationResponse> handleValidationException(MethodArgumentNotValidException ex) {
        String errors = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));

        return ResponseEntity.badRequest().body(
                RegistrationResponse.builder()
                        .success(false)
                        .message(errors)
                        .build()
        );
    }
}

