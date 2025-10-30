package com.lucasramallo.gestorproductos.service;

import com.lucasramallo.gestorproductos.model.Producto;
import com.lucasramallo.gestorproductos.repository.ProductoRepository;
import com.lucasramallo.gestorproductos.exception.ProductoNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {
  private final ProductoRepository repository;

  public ProductoService(ProductoRepository repository){
    this.repository = repository;
  }

  public List<Producto> listarTodos(){
    return repository.findAll();
  }

  public Producto buscarPorId(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new ProductoNotFoundException(id));
  }

  public Producto guardar(Producto producto){
    return repository.save(producto);
  }

  public Producto editar(Long id, Producto productoActualizado) {
    Producto existente = repository.findById(id)
        .orElseThrow(() -> new ProductoNotFoundException(id));

    existente.setNombre(productoActualizado.getNombre());
    existente.setPrecio(productoActualizado.getPrecio());
    existente.setStock(productoActualizado.getStock());

    return repository.save(existente);
  }

  public void eliminar(Long id) {
    if (!repository.existsById(id)) {
      throw new ProductoNotFoundException(id);
    }
    repository.deleteById(id);
  }
}
