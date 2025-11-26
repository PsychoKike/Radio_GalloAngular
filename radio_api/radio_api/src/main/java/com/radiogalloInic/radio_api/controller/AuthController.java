package com.radiogalloInic.radio_api.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.radiogalloInic.radio_api.dto.LoginRequest;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // 🔥 IMPORTANTE: Permite que Angular (puerto 4200) nos hable
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Map<String, Object> response = new HashMap<>();

        // Lógica simulada (Aquí conectarías tu Base de Datos después)
        if ("admin".equals(request.getUsername()) && "12345".equals(request.getPassword())) {
            
            response.put("mensaje", "Login Exitoso a buevo");
            response.put("token", "token-falso-123456"); // Simulación de JWT
            response.put("usuario", request.getUsername());
            response.put("AAAAAAAA", "AAAAAA");
            
            return ResponseEntity.ok(response);
        } else {
            response.put("mensaje", "Credenciales incorrectas");
            return ResponseEntity.status(401).body(response);
        }
    }
}