package com.example.demo.Controller;

import com.example.demo.Model.MyAppUser;
import com.example.demo.Model.MyAppUserRepository;
import com.example.demo.Model.Role;
import com.example.demo.Model.RoleRepository;
import com.example.demo.Model.Permission;
import com.example.demo.Model.PermissionRepository;
import com.example.demo.dto.AssignRoleRequest;
import com.example.demo.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Set;
import java.util.HashSet;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserManagementController {

    @Autowired
    private MyAppUserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private MenuService menuService;

    // Lấy danh sách tất cả user (SUPERADMIN và ADMIN có quyền)
    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_SUPERADMIN', 'ROLE_ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<Map<String, Object>> users = userRepository.findAll().stream()
            .map(user -> {
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", user.getId());
                userMap.put("username", user.getUsername());
                userMap.put("email", user.getEmail());
                userMap.put("role", user.getRole().getName());
                userMap.put("verified", user.isVerified());
                return userMap;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(users);
    }

    // Lấy danh sách tất cả role có sẵn (SUPERADMIN và ADMIN có quyền)
    @GetMapping("/roles")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPERADMIN', 'ROLE_ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllRoles() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isSuperAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPERADMIN"));

        List<Map<String, Object>> roles = roleRepository.findAll().stream()
            .filter(role -> {
                // Nếu là SUPERADMIN thì thấy tất cả role, ngược lại không thấy role SUPERADMIN
                return isSuperAdmin || !role.getName().equals("SUPERADMIN");
            })
            .map(role -> {
                Map<String, Object> roleMap = new HashMap<>();
                roleMap.put("id", role.getId());
                roleMap.put("name", role.getName());
                roleMap.put("description", role.getDescription());
                return roleMap;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(roles);
    }

    // Gán role cho user (chỉ SUPERADMIN mới có quyền)
    @PostMapping("/assign-role")
    @PreAuthorize("hasAuthority('ROLE_SUPERADMIN')")
    public ResponseEntity<?> assignRole(@RequestBody AssignRoleRequest request) {
        // Không cho phép gán role SUPERADMIN
        if (request.getRoleName().equals("SUPERADMIN")) {
            return ResponseEntity.badRequest()
                .body("Cannot assign SUPERADMIN role to users");
        }

        MyAppUser user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Không cho phép thay đổi role của SUPERADMIN
        if (user.getRole().getName().equals("SUPERADMIN")) {
            return ResponseEntity.badRequest()
                .body("Cannot change role of a SUPERADMIN user");
        }

        Role role = roleRepository.findByName(request.getRoleName())
            .orElseThrow(() -> new RuntimeException("Role not found"));

        user.setRole(role);
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Role assigned successfully");
        response.put("userId", user.getId());
        response.put("username", user.getUsername());
        response.put("newRole", role.getName());

        return ResponseEntity.ok(response);
    }

    // Lấy thông tin chi tiết của một user (SUPERADMIN và ADMIN có quyền)
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPERADMIN', 'ROLE_ADMIN')")
    public ResponseEntity<?> getUserDetails(@PathVariable Long id) {
        MyAppUser user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> userDetails = new HashMap<>();
        userDetails.put("id", user.getId());
        userDetails.put("username", user.getUsername());
        userDetails.put("email", user.getEmail());
        userDetails.put("role", user.getRole().getName());
        userDetails.put("verified", user.isVerified());

        return ResponseEntity.ok(userDetails);
    }

    // Get current user's information including role and menu
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        MyAppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String roleName = user.getRole().getName();

        Map<String, Object> response = new HashMap<>();
        response.put("role", roleName);
        response.put("menu", menuService.generateMenuForRole(roleName));
        response.put("user", Map.of(
            "id", user.getId(),
            "username", user.getUsername(),
            "email", user.getEmail()
        ));

        return ResponseEntity.ok(response);
    }
    
    // Xóa user (chỉ SUPERADMIN mới có quyền)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_SUPERADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        MyAppUser user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Không cho phép xóa tài khoản SUPERADMIN
        if (user.getRole().getName().equals("SUPERADMIN")) {
            return ResponseEntity.badRequest()
                .body("Cannot delete SUPERADMIN account");
        }

        userRepository.delete(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "User deleted successfully");
        response.put("userId", id);

        return ResponseEntity.ok(response);
    }

    // Lấy danh sách tất cả permissions (chỉ SUPERADMIN mới có quyền)
    @GetMapping("/permissions")
    @PreAuthorize("hasAuthority('ROLE_SUPERADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllPermissions() {
        List<Map<String, Object>> permissions = permissionRepository.findAll().stream()
            .map(permission -> {
                Map<String, Object> permMap = new HashMap<>();
                permMap.put("id", permission.getId());
                permMap.put("name", permission.getName());
                permMap.put("description", permission.getDescription());
                permMap.put("moduleCode", permission.getModuleCode());
                return permMap;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(permissions);
    }

    // Tạo role mới (chỉ SUPERADMIN mới có quyền)
    @PostMapping("/roles")
    @PreAuthorize("hasAuthority('ROLE_SUPERADMIN')")
    public ResponseEntity<?> createRole(@RequestBody Map<String, Object> request) {
        try {
            // Validate required fields
            if (!request.containsKey("name") || request.get("name") == null || ((String) request.get("name")).trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body("Role name is required");
            }

            String name = ((String) request.get("name")).trim();
            String description = request.containsKey("description") ? ((String) request.get("description")).trim() : "";
            
            // Handle permissionIds with proper type checking
            List<Long> permissionIds = new ArrayList<>();
            if (request.containsKey("permissionIds") && request.get("permissionIds") != null) {
                try {
                    List<?> rawIds = (List<?>) request.get("permissionIds");
                    for (Object id : rawIds) {
                        if (id instanceof Integer) {
                            permissionIds.add(((Integer) id).longValue());
                        } else if (id instanceof Long) {
                            permissionIds.add((Long) id);
                        } else if (id instanceof String) {
                            permissionIds.add(Long.parseLong((String) id));
                        } else {
                            return ResponseEntity.badRequest()
                                .body("Invalid permission ID format");
                        }
                    }
                } catch (Exception e) {
                    return ResponseEntity.badRequest()
                        .body("Invalid permissionIds format: " + e.getMessage());
                }
            }

            // Kiểm tra tên role đã tồn tại chưa
            if (roleRepository.findByName(name).isPresent()) {
                return ResponseEntity.badRequest()
                    .body("Role name already exists");
            }

            // Validate role name format - allow Vietnamese characters and spaces
            if (!name.matches("^[\\p{L}\\p{N}\\s_]+$")) {
                return ResponseEntity.badRequest()
                    .body("Role name can only contain letters, numbers, spaces and underscore");
            }

            // Tạo role mới
            Role newRole = new Role();
            newRole.setName(name);
            newRole.setDescription(description);

            // Thêm permissions cho role
            if (!permissionIds.isEmpty()) {
                Set<Permission> permissions = permissionRepository.findAllById(permissionIds)
                    .stream()
                    .collect(Collectors.toSet());
                
                // Kiểm tra xem có permission nào không tồn tại không
                if (permissions.size() != permissionIds.size()) {
                    Set<Long> foundIds = permissions.stream()
                        .map(Permission::getId)
                        .collect(Collectors.toSet());
                    List<Long> missingIds = permissionIds.stream()
                        .filter(id -> !foundIds.contains(id))
                        .collect(Collectors.toList());
                    
                    return ResponseEntity.badRequest()
                        .body("The following permissions do not exist: " + missingIds);
                }
                
                newRole.setPermissions(permissions);
            } else {
                newRole.setPermissions(new HashSet<>());
            }

            Role savedRole = roleRepository.save(newRole);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Role created successfully");
            response.put("role", Map.of(
                "id", savedRole.getId(),
                "name", savedRole.getName(),
                "description", savedRole.getDescription()
            ));

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (ClassCastException e) {
            return ResponseEntity.badRequest()
                .body("Invalid data format: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to create role: " + e.getMessage());
        }
    }

    // Xóa role (chỉ SUPERADMIN mới có quyền)
    @DeleteMapping("/roles/{id}")
    @PreAuthorize("hasAuthority('ROLE_SUPERADMIN')")
    public ResponseEntity<?> deleteRole(@PathVariable Integer id) {
        Role role = roleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Role not found"));

        // Không cho phép xóa role SUPERADMIN
        if (role.getName().equals("SUPERADMIN")) {
            return ResponseEntity.badRequest()
                .body("Cannot delete SUPERADMIN role");
        }

        // Kiểm tra xem role có đang được sử dụng bởi user nào không
        if (!role.getUsers().isEmpty()) {
            return ResponseEntity.badRequest()
                .body("Cannot delete role because it is assigned to users");
        }

        roleRepository.delete(role);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Role deleted successfully");
        response.put("roleId", id);

        return ResponseEntity.ok(response);
    }
} 
