import asyncio
import sys
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

# Add the parent directory to sys.path to import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config import get_settings

async def check_columns():
    settings = get_settings()
    try:
        engine = create_async_engine(
            settings.database_url,
            connect_args={"statement_cache_size": 0}
        )
        
        async with engine.begin() as conn:
            print("Checking columns for 'users' table...")
            result = await conn.execute(text("""
                SELECT column_name, data_type, udt_name 
                FROM information_schema.columns 
                WHERE table_name = 'users' AND table_schema = 'public';
            """))
            for row in result.fetchall():
                print(f"Column: {row[0]}, Type: {row[1]}, UDT: {row[2]}")
            
        await engine.dispose()
    except Exception as e:
        print(f"❌ Error checking columns: {e}")

if __name__ == "__main__":
    asyncio.run(check_columns())
