package com.lucasramallo.gestorproductos.pedido.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CrearPedidoRequest {
  @NotEmpty(message = "El pedido debe contener al menos un item")
  private List<Item> items;

  @Data
  public static class Item{
    @NotNull(message = "El id del producto es obligatorio")
    private Long productoId;

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "Debe ser al menos 1 producto")
    private Integer cantidad;
  }

}
