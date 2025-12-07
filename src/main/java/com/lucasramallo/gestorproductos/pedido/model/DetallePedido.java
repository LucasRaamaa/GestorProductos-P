package com.lucasramallo.gestorproductos.pedido.model;
import com.lucasramallo.gestorproductos.model.Producto;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetallePedido {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private Integer cantidad;
  private Double precioUnitario;
  private Double subtotal;

  @ManyToOne
  @JoinColumn(name = "pedido_id", nullable = false)
  private Pedido pedido;

  @ManyToOne
  @JoinColumn(name = "producto_id", nullable = false)
  private Producto producto;

}
