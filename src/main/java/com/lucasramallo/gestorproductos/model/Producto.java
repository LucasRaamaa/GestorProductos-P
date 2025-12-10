package com.lucasramallo.gestorproductos.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.context.annotation.PropertySource;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Producto {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @NotBlank(message = "El nombre no puede estar vacio")
  private String nombre;

  @NotNull(message = "El precio no puede ser nulo")
  @Positive(message = "El precio debe ser mayor a 0")
  private Double precio;

  @NotNull(message = "El stock no puede ser nulo")
  @Min(value = 0, message = "El stock no puede ser negativo")
  private Integer stock;

}
