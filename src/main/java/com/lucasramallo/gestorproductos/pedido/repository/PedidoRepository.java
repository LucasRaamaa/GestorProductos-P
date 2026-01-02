package com.lucasramallo.gestorproductos.pedido.repository;

import com.lucasramallo.gestorproductos.pedido.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
  List<Pedido> findByUsuarioId(Integer usuarioId);
}

/*
@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
}*/