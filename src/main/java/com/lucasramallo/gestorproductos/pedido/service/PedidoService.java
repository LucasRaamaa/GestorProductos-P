package com.lucasramallo.gestorproductos.pedido.service;

import com.lucasramallo.gestorproductos.model.Producto;
import com.lucasramallo.gestorproductos.pedido.dto.CrearPedidoRequest;
import com.lucasramallo.gestorproductos.pedido.dto.DetallePedidoDTO;
import com.lucasramallo.gestorproductos.pedido.dto.PedidoDTO;
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

  // ============================================================
  //                     CREAR PEDIDO
  // ============================================================
  @Transactional
  public PedidoDTO crearPedido(User cliente, CrearPedidoRequest request) {

    Pedido pedido = new Pedido();
    pedido.setFecha(LocalDateTime.now());
    pedido.setUsuario(cliente);

    Double total = 0.0;
    List<DetallePedido> detalles = new ArrayList<>();

    for (CrearPedidoRequest.Item item : request.getItems()) {

      Producto producto = productoRepository.findById(item.getProductoId())
          .orElseThrow(() -> new IllegalArgumentException(
              "Producto no encontrado: " + item.getProductoId()
          ));

      if (producto.getStock() < item.getCantidad()) {
        throw new IllegalArgumentException(
            "Stock insuficiente para el producto: " + producto.getNombre()
        );
      }

      // Descontar stock
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

    Pedido saved = pedidoRepository.save(pedido);

    return mapToDto(saved);
  }

  // ============================================================
  //                     LISTAR PEDIDOS
  // ============================================================
  public List<PedidoDTO> listarTodos() {
    return pedidoRepository.findAll()
        .stream()
        .map(this::mapToDto)
        .toList();
  }

  // ============================================================
  //                     MAPPERS
  // ============================================================
  private PedidoDTO mapToDto(Pedido pedido) {

    PedidoDTO dto = new PedidoDTO();

    dto.setId(pedido.getId());
    dto.setFecha(pedido.getFecha());
    dto.setTotal(pedido.getTotal());


    // Datos del cliente
    User u = pedido.getUsuario();
    if (u != null) {
      dto.setClienteId(u.getId());
      dto.setClienteEmail(u.getEmail());
      dto.setClienteNombre(u.getUsername());
    }

    // Detalles
    dto.setDetalles(
        pedido.getDetalle().stream()
            .map(this::mapDetalleToDto)
            .toList()
    );

    return dto;
  }

  private DetallePedidoDTO mapDetalleToDto(DetallePedido det) {

    DetallePedidoDTO dto = new DetallePedidoDTO();

    dto.setProductoId(det.getProducto().getId());
    dto.setProductoNombre(det.getProducto().getNombre());
    dto.setCantidad(det.getCantidad());
    dto.setSubtotal(det.getSubtotal());

    return dto;
  }
}





















/*package com.lucasramallo.gestorproductos.pedido.service;

import com.lucasramallo.gestorproductos.model.Producto;
import com.lucasramallo.gestorproductos.pedido.dto.CrearPedidoRequest;
import com.lucasramallo.gestorproductos.pedido.dto.PedidoDTO;
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

}*/
