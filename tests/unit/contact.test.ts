import { describe, it } from "node:test";
import assert from "node:assert/strict";
import DOMPurify from "isomorphic-dompurify";

describe("6. Contact Management & Response Helpers", () => {
  // WhatsApp link generator logic helper
  const generateWaLink = (phone: string, name: string, ticketId: string, subject: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("0") ? `62${cleanPhone.slice(1)}` : cleanPhone;
    const text = encodeURIComponent(
      `Halo ${name}, terima kasih telah menghubungi LokerTimika terkait "${subject}" (Tiket: ${ticketId}).\n\nMenanggapi pesan Anda:\n`
    );
    return `https://wa.me/${formattedPhone}?text=${text}`;
  };

  // Mailto link generator logic helper
  const generateMailtoLink = (email: string, name: string, ticketId: string, subject: string) => {
    const sub = encodeURIComponent(`[LokerTimika - Tiket ${ticketId}] Re: ${subject}`);
    const body = encodeURIComponent(
      `Halo ${name},\n\nTerima kasih telah menghubungi Pusat Bantuan LokerTimika.\n\nMenanggapi pesan Anda:\n\n`
    );
    return `mailto:${email}?subject=${sub}&body=${body}`;
  };

  // Ticket ID generator helper
  const generateTicketId = () => {
    return `MSG-${Math.floor(100000 + Math.random() * 900000)}`;
  };

  describe("Ticket ID Generation", () => {
    it("should generate valid ticket ID formatted as MSG-XXXXXX", () => {
      for (let i = 0; i < 50; i++) {
        const ticket = generateTicketId();
        assert.match(ticket, /^MSG-\d{6}$/, `Ticket ID ${ticket} should match MSG-XXXXXX pattern`);
      }
    });
  });

  describe("WhatsApp Reply Link Generator", () => {
    it("should convert leading 0 to Indonesian country code 62", () => {
      const link = generateWaLink("081234567890", "Maria", "MSG-123456", "Pasang Iklan");
      assert.ok(link.startsWith("https://wa.me/6281234567890?text="));
      assert.ok(link.includes("MSG-123456"));
      assert.ok(link.includes("Maria"));
    });

    it("should handle numbers already formatted with +62 or international prefix", () => {
      const link = generateWaLink("+62 812-3456-7890", "Budi", "MSG-654321", "Kendala Akun");
      assert.ok(link.startsWith("https://wa.me/6281234567890?text="));
    });
  });

  describe("Mailto Link Generator", () => {
    it("should generate proper mailto link with encoded subject and ticket ID", () => {
      const link = generateMailtoLink("user@example.com", "Yohanes", "MSG-998877", "Kerjasama Mitra");
      assert.ok(link.startsWith("mailto:user@example.com?subject="));
      assert.ok(link.includes("MSG-998877"));
      assert.ok(link.includes("Kerjasama"));
    });
  });

  describe("Data Sanitization & XSS Defense", () => {
    it("should sanitize harmful HTML and script tags from user inputs", () => {
      const maliciousName = '<script>alert("hacked")</script>John Doe';
      const maliciousMessage = 'Halo <img src=x onerror=alert(1)> Selamat Pagi <a href="javascript:void(0)">Link</a>';
      
      const cleanName = DOMPurify.sanitize(maliciousName);
      const cleanMessage = DOMPurify.sanitize(maliciousMessage);

      assert.strictEqual(cleanName.includes("<script>"), false);
      assert.strictEqual(cleanMessage.includes("onerror"), false);
      assert.strictEqual(cleanMessage.includes("javascript:"), false);
    });
  });

  describe("Filter & Search Algorithm on Contact Messages", () => {
    const mockMessages = [
      {
        id: "1",
        ticketId: "MSG-100001",
        name: "Maria Rumkorem",
        email: "maria@gmail.com",
        phone: "081234567890",
        organization: "PT Papua Sejahtera",
        category: "general",
        subject: "Tanya Loker Admin",
        message: "Kapan pengumuman loker admin?",
        status: "unread",
        replyNotes: null,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        ticketId: "MSG-100002",
        name: "Budi Santoso",
        email: "budi@outlook.com",
        phone: "081122334455",
        organization: "Toko Sinar Timika",
        category: "partnership",
        subject: "Kerjasama Iklan",
        message: "Kami ingin pasang banner di website loker.",
        status: "replied",
        replyNotes: "Sudah dihubungi via WA",
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
    ];

    it("should filter by status correctly", () => {
      const unreadOnly = mockMessages.filter(m => m.status === "unread");
      assert.strictEqual(unreadOnly.length, 1);
      assert.strictEqual(unreadOnly[0].ticketId, "MSG-100001");

      const repliedOnly = mockMessages.filter(m => m.status === "replied");
      assert.strictEqual(repliedOnly.length, 1);
      assert.strictEqual(repliedOnly[0].ticketId, "MSG-100002");
    });

    it("should search across multiple fields (ticket, name, email, subject, body)", () => {
      const searchByName = mockMessages.filter(m => m.name.toLowerCase().includes("maria"));
      assert.strictEqual(searchByName.length, 1);

      const searchByTicket = mockMessages.filter(m => m.ticketId.toLowerCase().includes("100002"));
      assert.strictEqual(searchByTicket.length, 1);

      const searchByBody = mockMessages.filter(m => m.message.toLowerCase().includes("banner"));
      assert.strictEqual(searchByBody.length, 1);
    });
  });
});
