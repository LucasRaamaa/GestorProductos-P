package com.lucasramallo.gestorproductos.pedido.service;

import com.lucasramallo.gestorproductos.model.Producto;
import com.lucasramallo.gestorproductos.pedido.dto.CrearPedidoRequest;
import com.lucasramallo.gestorproductos.pedido.model.DetallePedido;
import com.lucasramallo.gestorproductos.pedido.model.Pedido;
import com.lucasramallo.gestorproductos.pedido.repository.PedidoRepository;
import com.lucasramallo.gestorproductos.repository.ProductoRepository;
import com.lucasramallo.gestorproductos.user.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoService {

  private final PedidoRepository pedidoRepository;
  private final ProductoRepository productoRepository;

  @Transactional
  public Pedido crearPedido(User cliente, CrearPedidoRequest request){
    Pedido pedido = new Pedido();
    pedido.setFecha(LocalDateTime.now());
    pedido.setUsuario(cliente);

    Double total = 0.0;
    List<DetallePedido> detalles = new ArrayList<>();

    for(CrearPedidoRequest.Item item : request.getItems()){
      Producto producto = productoRepository.findById(item.getProductoId())
          .orElseThrow(() -> new IllegalArgumentException(
              "Producto no encontrado: " + item.getProductoId()
          ));
      if(producto.getStock() < item.getCantidad()){
        throw new IllegalArgumentException(
            "Stock insuficiente para el producto: " + producto.getNombre()
        );
      }

      // Descontamos el stock
      producto.setStock(producto.getStock() - item.getCantidad());
      productoRepository.save(producto);

      DetallePedido detalle = DetallePedido.builder()
          .pedido(pedido)
          .producto(producto)
          .cantidad(item.getCantidad())
          .precioUnitario(producto.getPrecio())
          .subtotal(producto.getPrecio() * item.getCantidad())
          .build();

      total += detalle.getSubtotal();
      detalles.add(detalle);
    }
    pedido.setTotal(total);
    pedido.setDetalle(detalles);
    return pedidoRepository.save(pedido);
  }

  public List<Pedido> listarTodos(){
    return pedidoRepository.findAll();
  }

}
