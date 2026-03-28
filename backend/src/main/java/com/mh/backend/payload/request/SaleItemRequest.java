package com.mh.backend.payload.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SaleItemRequest {
    private Long medicineId;
    private Integer quantity;
}
