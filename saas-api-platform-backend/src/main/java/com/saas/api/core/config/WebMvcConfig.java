package com.saas.api.core.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@Slf4j
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new HandlerInterceptor() {
            private static final String START_TIME_ATTR = "requestStartTime";

            @Override
            public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
                request.setAttribute(START_TIME_ATTR, System.currentTimeMillis());
                return true;
            }

            @Override
            public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
                Long startTime = (Long) request.getAttribute(START_TIME_ATTR);
                if (startTime != null) {
                    long duration = System.currentTimeMillis() - startTime;
                    log.info("[HTTP TRAFFIC] {} {} -> Status: {} (Thực thi trong {} ms)",
                            request.getMethod(), request.getRequestURI(), response.getStatus(), duration);
                }
            }
        });
    }
}
