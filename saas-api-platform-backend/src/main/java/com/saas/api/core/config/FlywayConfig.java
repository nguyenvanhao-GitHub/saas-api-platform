package com.saas.api.core.config;

import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FlywayConfig {

    @Bean
    public FlywayMigrationStrategy cleanMigrateStrategy() {
        return flyway -> {
            // Tự động repair schema history (sửa checksum, xóa bản ghi failed) trước khi migrate
            try {
                flyway.repair();
            } catch (Exception e) {
                // Log and continue
            }
            flyway.migrate();
        };
    }
}