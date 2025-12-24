package com.fitness.userservice.service;

import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.RegistrationResponse;
import com.fitness.userservice.exception.RegistrationException;
import com.fitness.userservice.model.User;
import com.fitness.userservice.repository.UserRepository;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.RolesResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegistrationService {

    private final Keycloak keycloakAdminClient;
    private final UserRepository userRepository;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.default-role:ROLE_USER}")
    private String defaultRole;

    @Transactional
    public RegistrationResponse registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RegistrationException("Email already exists", "EMAIL_EXISTS");
        }

        String keycloakUserId = createKeycloakUser(request);

        User user = new User();
        user.setEmail(request.getEmail());
        user.setKeycloakId(keycloakUserId);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPassword("MANAGED_BY_KEYCLOAK");

        User savedUser = userRepository.save(user);

        log.info("User registered successfully: {}", request.getEmail());

        return RegistrationResponse.builder()
                .success(true)
                .message("Registration successful")
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .build();
    }

    private String createKeycloakUser(RegisterRequest request) {
        try {
            RealmResource realmResource = keycloakAdminClient.realm(realm);
            UsersResource usersResource = realmResource.users();

            List<UserRepresentation> existingUsers = usersResource.searchByEmail(request.getEmail(), true);
            if (!existingUsers.isEmpty()) {
                throw new RegistrationException("Email already registered in identity provider", "EMAIL_EXISTS");
            }

            UserRepresentation userRep = new UserRepresentation();
            userRep.setEnabled(true);
            userRep.setUsername(request.getEmail());
            userRep.setEmail(request.getEmail());
            userRep.setFirstName(request.getFirstName());
            userRep.setLastName(request.getLastName());
            userRep.setEmailVerified(true);

            CredentialRepresentation credential = new CredentialRepresentation();
            credential.setTemporary(false);
            credential.setType(CredentialRepresentation.PASSWORD);
            credential.setValue(request.getPassword());
            userRep.setCredentials(Collections.singletonList(credential));

            Response response = usersResource.create(userRep);
            int status = response.getStatus();

            if (status == 201) {
                String locationHeader = response.getHeaderString("Location");
                String userId = locationHeader.substring(locationHeader.lastIndexOf("/") + 1);

                assignDefaultRole(realmResource, userId);

                log.info("Keycloak user created successfully: {}", userId);
                return userId;
            }

            if (status == 409) {
                throw new RegistrationException("User already exists in identity provider", "EMAIL_EXISTS");
            }

            String errorMessage = response.readEntity(String.class);
            log.error("Keycloak user creation failed: {} - {}", status, errorMessage);
            throw new RegistrationException("Failed to create user: " + errorMessage, "KEYCLOAK_ERROR");

        } catch (RegistrationException e) {
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during Keycloak user creation", e);
            throw new RegistrationException("Registration service unavailable", "KEYCLOAK_ERROR");
        }
    }

    private void assignDefaultRole(RealmResource realmResource, String userId) {
        try {
            RolesResource rolesResource = realmResource.roles();
            RoleRepresentation roleRep = rolesResource.get(defaultRole).toRepresentation();
            realmResource.users().get(userId).roles().realmLevel().add(Collections.singletonList(roleRep));
            log.info("Assigned role {} to user {}", defaultRole, userId);
        } catch (Exception e) {
            log.warn("Could not assign default role {} to user {}: {}", defaultRole, userId, e.getMessage());
        }
    }
}

