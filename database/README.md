# Database Setup for Railway

## How to Import Your MySQL Dump

1. **Place your SQL dump file** in this directory as `dump.sql`
2. **Railway will automatically import it** when the app starts
3. **If no dump.sql is found**, it will run Laravel migrations instead

## File Structure
```
database/
├── README.md          # This file
├── dump.sql          # Your MySQL dump file (place it here)
└── (other database files)
```

## Supported Formats
- `.sql` files (MySQL dump)
- Any MySQL-compatible SQL file

## Notes
- The import script will wait for the database to be ready
- It will automatically create the database if it doesn't exist
- All existing data will be preserved
