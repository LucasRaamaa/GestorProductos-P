package com.lucasramallo.gestorproductos.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductoDTO {
  private Long id;

  @NotBlank(message = "El nombre no puede estar vacío")
  private String nombre;

  @Positive(message = "El precio debe ser mayor que 0")
  private Double precio;

  @Min(value = 0, message = "El stock no puede ser negativo")
  private Integer stock;
}
