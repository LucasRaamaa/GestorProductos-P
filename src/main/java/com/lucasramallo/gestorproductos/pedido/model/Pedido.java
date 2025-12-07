package com.lucasramallo.gestorproductos.pedido.model;
import com.lucasramallo.gestorproductos.user.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

import java.util.ArrayList;
import java.util.List;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pedido {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private LocalDateTime fecha;
  private Double total;

  @ManyToOne
  @JoinColumn(name = "usuario_id", nullable = false)
  private User usuario;

  @OneToMany(
      mappedBy = "pedido",
      cascade = CascadeType.ALL,
      orphanRemoval = true
  )
  @Builder.Default
  private List<DetallePedido> detalle = new ArrayList<>();

}
