package com.mh.backend.payload.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SaleDTO {
    private Long id;
    private String customerName;
    private Double totalAmount;
    private LocalDateTime saleDate;
    private String pharmacistName;
}
