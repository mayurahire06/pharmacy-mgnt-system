package com.mh.backend.controller;

import com.mh.backend.entity.Medicine;
import com.mh.backend.entity.Supplier;
import com.mh.backend.repository.MedicineRepository;
import com.mh.backend.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/medicines")
public class MedicineController {
    @Autowired
    MedicineRepository medicineRepository;
    
    @Autowired
    SupplierRepository supplierRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('PHARMACIST')")
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addMedicine(@RequestBody Medicine medicine) {
        if (medicine.getSupplier() != null && medicine.getSupplier().getId() != null) {
            Supplier supplier = supplierRepository.findById(medicine.getSupplier().getId()).orElseThrow();
            medicine.setSupplier(supplier);
        }
        return ResponseEntity.ok(medicineRepository.save(medicine));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Medicine> updateMedicine(@PathVariable Long id, @RequestBody Medicine details) {
        Medicine medicine = medicineRepository.findById(id).orElseThrow();
        medicine.setName(details.getName());
        medicine.setDescription(details.getDescription());
        medicine.setPrice(details.getPrice());
        medicine.setStockQuantity(details.getStockQuantity());
        medicine.setExpiryDate(details.getExpiryDate());
        if (details.getSupplier() != null && details.getSupplier().getId() != null) {
            Supplier supplier = supplierRepository.findById(details.getSupplier().getId()).orElseThrow();
            medicine.setSupplier(supplier);
        }
        return ResponseEntity.ok(medicineRepository.save(medicine));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteMedicine(@PathVariable Long id) {
        medicineRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
