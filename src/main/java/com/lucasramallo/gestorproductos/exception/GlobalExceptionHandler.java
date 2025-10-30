package com.lucasramallo.gestorproductos.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

  //Manejar errores de validacion
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult().getAllErrors().forEach(error -> {
      String fieldName = ((FieldError) error).getField();
      String errorMessage = error.getDefaultMessage();
      errors.put(fieldName, errorMessage);
    });
    return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
  }

  // Maneja errores generales (por ejemplo producto no encontrado)
  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
    Map<String, String> error = new HashMap<>();
    error.put("error", ex.getMessage());
    return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
  }


  @ExceptionHandler(ProductoNotFoundException.class)
  public ResponseEntity<Map<String, String>> handleProductoNotFound(ProductoNotFoundException ex) {
    Map<String, String> error = new HashMap<>();
    error.put("error", ex.getMessage());
    return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
  }
}
