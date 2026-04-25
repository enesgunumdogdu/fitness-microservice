package com.fitness.userservice.auth.jwt;

import com.fitness.userservice.auth.config.JwtProperties;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtKeyManager {

    private static final String PRIVATE_KEY_FILE = "private.pem";
    private static final String PUBLIC_KEY_FILE = "public.pem";

    private final JwtProperties properties;

    private RSAPrivateKey privateKey;
    private RSAPublicKey publicKey;

    public RSAPrivateKey getPrivateKey() {
        return privateKey;
    }

    public RSAPublicKey getPublicKey() {
        return publicKey;
    }

    @PostConstruct
    public void init() throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
        Path dir = Paths.get(properties.getKeysDirectory()).toAbsolutePath();
        Path privateKeyPath = dir.resolve(PRIVATE_KEY_FILE);
        Path publicKeyPath = dir.resolve(PUBLIC_KEY_FILE);

        if (Files.exists(privateKeyPath) && Files.exists(publicKeyPath)) {
            log.info("Loading existing RSA key pair from {}", dir);
            privateKey = readPrivateKey(privateKeyPath);
            publicKey = readPublicKey(publicKeyPath);
            return;
        }

        log.warn("RSA key pair not found at {} - generating a new one", dir);
        Files.createDirectories(dir);
        KeyPair keyPair = generateKeyPair();
        privateKey = (RSAPrivateKey) keyPair.getPrivate();
        publicKey = (RSAPublicKey) keyPair.getPublic();

        writePem(privateKeyPath, "PRIVATE KEY", keyPair.getPrivate().getEncoded());
        writePem(publicKeyPath, "PUBLIC KEY", keyPair.getPublic().getEncoded());
        log.info("Persisted new RSA key pair to {}", dir);
    }

    private KeyPair generateKeyPair() throws NoSuchAlgorithmException {
        KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
        generator.initialize(2048);
        return generator.generateKeyPair();
    }

    private RSAPrivateKey readPrivateKey(Path path) throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
        byte[] decoded = readPem(path);
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(decoded);
        return (RSAPrivateKey) KeyFactory.getInstance("RSA").generatePrivate(spec);
    }

    private RSAPublicKey readPublicKey(Path path) throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
        byte[] decoded = readPem(path);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(decoded);
        return (RSAPublicKey) KeyFactory.getInstance("RSA").generatePublic(spec);
    }

    private byte[] readPem(Path path) throws IOException {
        String content = Files.readString(path);
        String stripped = content
                .replaceAll("-----BEGIN [^-]+-----", "")
                .replaceAll("-----END [^-]+-----", "")
                .replaceAll("\\s+", "");
        return Base64.getDecoder().decode(stripped);
    }

    private void writePem(Path path, String label, byte[] encoded) throws IOException {
        String base64 = Base64.getEncoder().encodeToString(encoded);
        StringBuilder pem = new StringBuilder();
        pem.append("-----BEGIN ").append(label).append("-----\n");
        for (int i = 0; i < base64.length(); i += 64) {
            pem.append(base64, i, Math.min(i + 64, base64.length())).append('\n');
        }
        pem.append("-----END ").append(label).append("-----\n");
        Files.writeString(path, pem.toString());
    }
}
