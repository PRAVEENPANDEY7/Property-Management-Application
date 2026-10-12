package com.property.management.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
@Profile("!test")
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Bean
    @Primary
    public DataSource dataSource(
            @Value("${spring.datasource.url}") String rawUrl,
            @Value("${spring.datasource.username:postgres}") String defaultUser,
            @Value("${spring.datasource.password:}") String defaultPassword
    ) {
        HikariConfig config = new HikariConfig();

        String url = rawUrl;
        String username = defaultUser;
        String password = defaultPassword;

        // Automatically convert cloud provider format (postgres://user:password@host:port/dbname)
        // into JDBC format required by PostgreSQL driver (jdbc:postgresql://host:port/dbname?sslmode=require)
        if (url != null && (url.startsWith("postgres://") || url.startsWith("postgresql://"))) {
            try {
                String uriString = url.startsWith("postgres://")
                        ? "http://" + url.substring("postgres://".length())
                        : "http://" + url.substring("postgresql://".length());

                URI uri = new URI(uriString);
                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath();
                String query = uri.getQuery();

                if (uri.getUserInfo() != null) {
                    String[] userParts = uri.getUserInfo().split(":", 2);
                    username = userParts[0];
                    if (userParts.length > 1) {
                        password = userParts[1];
                    }
                }

                String sslParam = (query != null && query.contains("sslmode=")) ? "" : "?sslmode=require";
                if (query != null && !query.isEmpty()) {
                    sslParam = "?" + query;
                }

                url = "jdbc:postgresql://" + host + ":" + port + path + sslParam;
                log.info("Successfully converted cloud database URI to JDBC format for host '{}' and database '{}'", host, path);
            } catch (Exception e) {
                log.error("Failed to parse database URI '{}': {}", url, e.getMessage());
            }
        }

        config.setJdbcUrl(url);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName("org.postgresql.Driver");
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setIdleTimeout(30000);
        config.setConnectionTimeout(20000);
        config.setLeakDetectionThreshold(60000);

        return new HikariDataSource(config);
    }
}
