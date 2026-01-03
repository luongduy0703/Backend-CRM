package com.example.demo.Controller;

import com.example.demo.dto.ProductDTO;
import com.example.demo.Model.Product;
import com.example.demo.Model.MyAppUser;
import com.example.demo.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {
    
    @Autowired
    private ProductService productService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Product> createProduct(
            @Valid @RequestBody ProductDTO productDTO,
            @AuthenticationPrincipal MyAppUser user) {
        Product product = productService.createProduct(productDTO, null);
        return ResponseEntity.ok(product);
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }
} 