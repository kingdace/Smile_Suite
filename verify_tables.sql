-- Run this in HeidiSQL to verify all tables were created successfully

SHOW TABLES LIKE 'notifications';
SHOW TABLES LIKE 'support_tickets';
SHOW TABLES LIKE 'support_ticket_messages';
SHOW TABLES LIKE 'support_ticket_attachments';

-- Check table structures
DESCRIBE notifications;
DESCRIBE support_tickets;
DESCRIBE support_ticket_messages;
DESCRIBE support_ticket_attachments;

