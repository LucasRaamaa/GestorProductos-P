package com.lucasramallo.gestorproductos.pedido.dto;

import lombok.Data;

@Data
public class DetallePedidoDTO {

  private Integer productoId;
  private String productoNombre;
  private Integer cantidad;
  private Double subtotal;
}
