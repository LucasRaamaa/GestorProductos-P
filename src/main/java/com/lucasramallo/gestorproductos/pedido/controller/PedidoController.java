package com.lucasramallo.gestorproductos.pedido.controller;

import com.lucasramallo.gestorproductos.pedido.dto.CrearPedidoRequest;
import com.lucasramallo.gestorproductos.pedido.dto.PedidoResponse;
import com.lucasramallo.gestorproductos.pedido.model.Pedido;
import com.lucasramallo.gestorproductos.pedido.service.PedidoService;
import com.lucasramallo.gestorproductos.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class PedidoController {

  private final PedidoService pedidoService;

  // CLIENTE crea pedido
  @PostMapping
  public ResponseEntity<PedidoResponse> crearPedido(
      @Valid @RequestBody CrearPedidoRequest request,
      Authentication authentication
  ) {
    User cliente = (User) authentication.getPrincipal();
    Pedido pedido = pedidoService.crearPedido(cliente, request);

    PedidoResponse response = new PedidoResponse(
        pedido.getId(),
        pedido.getTotal(),
        pedido.getFecha()
    );

    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  // ADMIN lista todos los pedidos
  @GetMapping
  public ResponseEntity<List<Pedido>> listarPedidos() {
    return ResponseEntity.ok(pedidoService.listarTodos());
  }

}
