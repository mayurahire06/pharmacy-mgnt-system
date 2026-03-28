package com.mh.backend.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.mh.backend.entity.Sale;
import com.mh.backend.entity.SaleItem;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    public byte[] generateBillPdf(Sale sale) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        Document document = new Document();
        PdfWriter.getInstance(document, out);

        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Paragraph title = new Paragraph("Pharmacy Bill", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

        document.add(new Paragraph(" "));
        document.add(new Paragraph("Sale ID: " + sale.getId()));
        document.add(new Paragraph("Customer Name: " + sale.getCustomerName()));
        document.add(new Paragraph("Pharmacist: " + sale.getPharmacist().getUsername()));
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        document.add(new Paragraph("Date: " + sale.getSaleDate().format(formatter)));
        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.addCell(new PdfPCell(new Phrase("Medicine")));
        table.addCell(new PdfPCell(new Phrase("Price")));
        table.addCell(new PdfPCell(new Phrase("Quantity")));
        table.addCell(new PdfPCell(new Phrase("Total")));

        for (SaleItem item : sale.getItems()) {
            table.addCell(item.getMedicine().getName());
            table.addCell(String.valueOf(item.getPriceAtSale()));
            table.addCell(String.valueOf(item.getQuantity()));
            table.addCell(String.valueOf(item.getPriceAtSale() * item.getQuantity()));
        }

        document.add(table);

        document.add(new Paragraph(" "));
        Font totalFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
        Paragraph totalParagraph = new Paragraph("Grand Total: $" + sale.getTotalAmount(), totalFont);
        totalParagraph.setAlignment(Element.ALIGN_RIGHT);
        document.add(totalParagraph);

        document.close();

        return out.toByteArray();
    }
}
