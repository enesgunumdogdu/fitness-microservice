package com.fitness.userservice.auth.refresh;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {

    Optional<RefreshToken> findByTokenHash(String tokenHash);

    @Modifying
    @Query("update RefreshToken rt set rt.revoked = true where rt.userId = :userId and rt.revoked = false")
    int revokeAllForUser(@Param("userId") String userId);

    @Modifying
    @Query("delete from RefreshToken rt where rt.expiresAt < :now")
    int deleteExpired(@Param("now") Instant now);
}
