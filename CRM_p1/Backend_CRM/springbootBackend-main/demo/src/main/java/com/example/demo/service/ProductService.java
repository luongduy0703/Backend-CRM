package com.example.demo.service;

import com.example.demo.dto.ProductDTO;
import com.example.demo.Model.Product;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public Product createProduct(ProductDTO productDTO, Long userId) {
        Product product = new Product();
        product.setName(productDTO.getName());
        product.setPrice(productDTO.getPrice());
        product.setDescription(productDTO.getDescription());
        product.setCreatedBy(userId);
        
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
} 