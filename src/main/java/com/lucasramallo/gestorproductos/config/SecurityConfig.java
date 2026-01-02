package com.lucasramallo.gestorproductos.config;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final JwtAuthenticationFilter jwtAuthFilter;
  private final AuthenticationProvider authenticationProvider;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        // activamos la seguridad del cors
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(auth -> auth
            // Público
            .requestMatchers("/api/auth/**").permitAll()

            // Solo ADMIN puede crear o eliminar productos
            .requestMatchers(HttpMethod.POST, "/api/productos/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasRole("ADMIN")

            //Pedidos
            .requestMatchers(HttpMethod.POST, "/api/pedidos").hasRole("CLIENTE")
            .requestMatchers(HttpMethod.GET, "/api/pedidos/mis").hasRole("CLIENTE")
            .requestMatchers(HttpMethod.GET, "/api/pedidos").hasRole("ADMIN")

            // CLIENTE o ADMIN pueden ver productos
            .requestMatchers(HttpMethod.GET, "/api/productos/**").hasAnyRole("CLIENTE", "ADMIN")

            // Todo lo demás requiere autenticación
            .anyRequest().authenticated()
        )
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authenticationProvider(authenticationProvider)
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    // ORIGEN DEL FRONT
    config.setAllowedOrigins(List.of("http://localhost:5173","http://localhost:5174",
        "http://localhost:5175" ));
    // Métodos permitidos
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    // Headers permitidos
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
  }
}
