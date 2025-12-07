package com.lucasramallo.gestorproductos.pedido.repository;

import com.lucasramallo.gestorproductos.pedido.model.DetallePedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Long> {
}
