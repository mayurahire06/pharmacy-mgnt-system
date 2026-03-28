package com.mh.backend.payload.request;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class SaleRequest {
    private String customerName;
    private List<SaleItemRequest> items;
}
