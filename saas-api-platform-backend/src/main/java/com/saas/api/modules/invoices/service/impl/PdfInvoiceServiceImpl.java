package com.saas.api.modules.invoices.service.impl;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.saas.api.modules.invoices.domain.InvoiceEntity;
import com.saas.api.modules.invoices.service.PdfInvoiceService;
import com.saas.api.modules.storage.service.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class PdfInvoiceServiceImpl implements PdfInvoiceService {

    private final StorageService storageService;

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")
            .withZone(ZoneId.of("Asia/Ho_Chi_Minh"));

    @Override
    public byte[] generateInvoicePdf(InvoiceEntity invoice) {
        log.info("Khởi tạo tài liệu PDF cho Hóa đơn: {}", invoice.getInvoiceNumber());

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 36, 36, 36, 36);
            PdfWriter.getInstance(document, out);
            document.open();

            // Font styles
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, Color.BLACK);
            Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.DARK_GRAY);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, Color.WHITE);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.BLACK);

            // 1. Header & Branding
            Paragraph brand = new Paragraph("SAAS DEVELOPER API PLATFORM", titleFont);
            brand.setAlignment(Element.ALIGN_LEFT);
            document.add(brand);

            Paragraph subtitle = new Paragraph("Commercial Cloud API Invoicing & Metered Settlement\nWebsite: https://saas-platform.example.com", subTitleFont);
            subtitle.setSpacingAfter(15);
            document.add(subtitle);

            // 2. Invoice Info Table
            PdfPTable metaTable = new PdfPTable(2);
            metaTable.setWidthPercentage(100);
            metaTable.setSpacingAfter(15);

            PdfPCell c1 = new PdfPCell(new Phrase("MÃ HÓA ĐƠN: " + invoice.getInvoiceNumber() + "\nNGÀY LẬP: " + DATE_FORMAT.format(invoice.getCreatedAt()), boldFont));
            c1.setBorder(Rectangle.NO_BORDER);
            c1.setPadding(4);

            String userEmail = invoice.getUser() != null ? invoice.getUser().getEmail() : "N/A";
            String userName = invoice.getUser() != null ? invoice.getUser().getFullName() : "Developer";
            PdfPCell c2 = new PdfPCell(new Phrase("KHÁCH HÀNG: " + userName + "\nEMAIL: " + userEmail + "\nTRẠNG THÁI: " + invoice.getStatus(), boldFont));
            c2.setBorder(Rectangle.NO_BORDER);
            c2.setHorizontalAlignment(Element.ALIGN_RIGHT);
            c2.setPadding(4);

            metaTable.addCell(c1);
            metaTable.addCell(c2);
            document.add(metaTable);

            // 3. Line Items Table
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1f, 4f, 2f, 2f});
            table.setSpacingAfter(20);

            // Table Header
            String[] headers = {"STT", "Hạng mục Dịch vụ API", "Đơn giá", "Thành tiền (USD)"};
            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
                cell.setBackgroundColor(new Color(30, 41, 59)); // Slate-800
                cell.setPadding(8);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);
            }

            // Row 1
            PdfPCell cellIdx = new PdfPCell(new Phrase("1", bodyFont));
            cellIdx.setHorizontalAlignment(Element.ALIGN_CENTER);
            cellIdx.setPadding(6);
            table.addCell(cellIdx);

            PdfPCell cellDesc = new PdfPCell(new Phrase("Gói cước API Developer & Lưu lượng Metered Billing", bodyFont));
            cellDesc.setPadding(6);
            table.addCell(cellDesc);

            PdfPCell cellUnitPrice = new PdfPCell(new Phrase("$" + invoice.getAmount(), bodyFont));
            cellUnitPrice.setHorizontalAlignment(Element.ALIGN_RIGHT);
            cellUnitPrice.setPadding(6);
            table.addCell(cellUnitPrice);

            PdfPCell cellAmount = new PdfPCell(new Phrase("$" + invoice.getAmount(), boldFont));
            cellAmount.setHorizontalAlignment(Element.ALIGN_RIGHT);
            cellAmount.setPadding(6);
            table.addCell(cellAmount);

            // Total Row
            PdfPCell totalLabelCell = new PdfPCell(new Phrase("TỔNG CỘNG THANH TOÁN (TOTAL):", boldFont));
            totalLabelCell.setColspan(3);
            totalLabelCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalLabelCell.setPadding(8);
            totalLabelCell.setBackgroundColor(new Color(241, 245, 249));
            table.addCell(totalLabelCell);

            PdfPCell totalValCell = new PdfPCell(new Phrase("$" + invoice.getAmount() + " USD", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, new Color(16, 185, 129))));
            totalValCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalValCell.setPadding(8);
            totalValCell.setBackgroundColor(new Color(241, 245, 249));
            table.addCell(totalValCell);

            document.add(table);

            // 4. Payment instructions & Footer
            Paragraph paymentInfo = new Paragraph(
                    "HƯỚNG DẪN THANH TOÁN:\n" +
                    "- Thanh toán tự động qua cổng VietQR (Quét mã trên Developer Portal) với cú pháp: SAAS " + invoice.getInvoiceNumber() + "\n" +
                    "- Hoặc thanh toán qua thẻ tín dụng quốc tế / API Webhook.\n" +
                    "- Hóa đơn điện tử có giá trị pháp lý lưu trữ trên hệ thống Cloud S3.",
                    bodyFont
            );
            paymentInfo.setSpacingAfter(25);
            document.add(paymentInfo);

            Paragraph footer = new Paragraph("Cảm ơn quý khách đã tin tưởng sử dụng dịch vụ SaaS API Platform!", subTitleFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Lỗi khi sinh file PDF hóa đơn {}: {}", invoice.getInvoiceNumber(), e.getMessage());
            throw new RuntimeException("Không thể sinh file PDF hóa đơn: " + e.getMessage(), e);
        }
    }

    @Override
    public String generateAndUploadInvoicePdf(InvoiceEntity invoice) {
        byte[] pdfBytes = generateInvoicePdf(invoice);
        String s3Key = "invoices/" + invoice.getInvoiceNumber() + ".pdf";
        return storageService.uploadBytes(s3Key, pdfBytes, "application/pdf");
    }
}
