package com.lucasramallo.gestorproductos.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank(message = "El nombre de usuario no puede estar vacio")
  private String username;

  @NotBlank(message = "La contraseña no puede estar vacia.")
  private String password;

  @Email(message = "Debe tener formato de email valido")
  @NotBlank(message = "El email no puede estar vacio")
  @Column(unique = true)
  private String email;

  @Enumerated(EnumType.STRING)
  private Role role;

  // metodos de UserDetails
  @Override
  public Collection<? extends GrantedAuthority> getAuthorities(){
    return List.of(() -> "ROLE_" + role.name());
  }
  @Override
  public boolean isAccountNonExpired(){
    return true;
  }

  @Override
  public boolean isAccountNonLocked(){
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired(){
    return true;
  }

  @Override
  public boolean isEnabled(){
    return true;
  }

}
