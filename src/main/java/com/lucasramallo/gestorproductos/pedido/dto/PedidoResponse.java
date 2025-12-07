package com.lucasramallo.gestorproductos.pedido.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class PedidoResponse {

  private Long id;
  private Double total;
  private LocalDateTime fecha;
}
