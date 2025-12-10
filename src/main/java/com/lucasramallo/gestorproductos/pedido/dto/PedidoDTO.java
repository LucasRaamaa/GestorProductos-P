package com.lucasramallo.gestorproductos.pedido.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PedidoDTO {

  private Long id;
  private Double total;
  private LocalDateTime fecha;

  // Datos del usuario (NO retornar password ni flags)
  private Integer clienteId;
  private String clienteEmail;
  private String clienteNombre;

  private String estado;

  private List<DetallePedidoDTO> detalles;
}
