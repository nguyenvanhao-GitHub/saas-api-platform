package com.saas.api;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordTest {

    @Test
    void generateHashes() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String devHash = encoder.encode("Dev@123456");
        String adminHash = encoder.encode("Admin@123456");
        System.out.println("DEV_HASH: " + devHash);
        System.out.println("ADMIN_HASH: " + adminHash);
        System.out.println("MATCH_DEV: " + encoder.matches("Dev@123456", devHash));
        System.out.println("MATCH_ADMIN: " + encoder.matches("Admin@123456", adminHash));
    }
}
