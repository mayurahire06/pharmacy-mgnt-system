package com.mh.backend.controller;

import com.mh.backend.entity.Medicine;
import com.mh.backend.entity.Sale;
import com.mh.backend.entity.SaleItem;
import com.mh.backend.entity.User;
import com.mh.backend.payload.request.SaleItemRequest;
import com.mh.backend.payload.request.SaleRequest;
import com.mh.backend.repository.MedicineRepository;
import com.mh.backend.repository.SaleRepository;
import com.mh.backend.repository.UserRepository;
import com.mh.backend.security.services.UserDetailsImpl;
import com.mh.backend.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/sales")
public class SaleController {

    @Autowired
    SaleRepository saleRepository;

    @Autowired
    MedicineRepository medicineRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PdfService pdfService;

    @PostMapping
    @PreAuthorize("hasRole('PHARMACIST')")
    @Transactional
    public ResponseEntity<?> createSale(@RequestBody SaleRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User pharmacist = userRepository.findById(userDetails.getId()).orElseThrow();

        Sale sale = new Sale();
        sale.setPharmacist(pharmacist);
        sale.setCustomerName(request.getCustomerName());
        sale.setSaleDate(LocalDateTime.now());
        sale.setItems(new ArrayList<>());
        
        double totalAmount = 0.0;

        for (SaleItemRequest itemReq : request.getItems()) {
            Medicine medicine = medicineRepository.findById(itemReq.getMedicineId())
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

            if (medicine.getStockQuantity() < itemReq.getQuantity()) {
                return ResponseEntity.badRequest().body("Not enough stock for medicine: " + medicine.getName());
            }

            medicine.setStockQuantity(medicine.getStockQuantity() - itemReq.getQuantity());
            medicineRepository.save(medicine);

            SaleItem item = new SaleItem();
            item.setSale(sale);
            item.setMedicine(medicine);
            item.setQuantity(itemReq.getQuantity());
            item.setPriceAtSale(medicine.getPrice());

            sale.getItems().add(item);
            totalAmount += (medicine.getPrice() * itemReq.getQuantity());
        }

        sale.setTotalAmount(totalAmount);
        saleRepository.save(sale);

        byte[] pdfBytes = pdfService.generateBillPdf(sale);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=bill_" + sale.getId() + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
