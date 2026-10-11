package com.saas.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(exclude = {RedisRepositoriesAutoConfiguration.class})
@EnableAsync
@EnableCaching
@EnableScheduling
@EnableJpaRepositories(basePackages = "com.saas.api.modules")
public class SaasApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(SaasApiApplication.class, args);
    }
}
