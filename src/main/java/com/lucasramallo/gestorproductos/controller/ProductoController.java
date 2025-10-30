package com.lucasramallo.gestorproductos.controller;

import com.lucasramallo.gestorproductos.model.Producto;
import com.lucasramallo.gestorproductos.service.ProductoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

  private final ProductoService service;

  public ProductoController(ProductoService service) {
    this.service = service;
  }

  @GetMapping
  public List<Producto> listarTodos() {
    return service.listarTodos();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Producto> buscarPorId(@PathVariable Long id) {
    Producto producto = service.buscarPorId(id);
    return ResponseEntity.ok(producto);
  }

  @PostMapping
  public ResponseEntity<Producto> crear(@Valid @RequestBody Producto producto) {
    Producto nuevo = service.guardar(producto);
    return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Producto> editar(@PathVariable Long id,@Valid @RequestBody Producto producto) {
    Producto actualizado = service.editar(id,producto);
    return ResponseEntity.ok(actualizado);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> eliminar(@PathVariable Long id) {
    service.eliminar(id);
    return ResponseEntity.noContent().build();
  }
}
