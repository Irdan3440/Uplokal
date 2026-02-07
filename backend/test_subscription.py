import asyncio
from sqlalchemy import select
from app.database import async_session_maker
from app.models.subscription import SubscriptionPlan

async def test_subscription_plans():
    """Test subscription plans in database."""
    print("🔍 Checking subscription plans...\n")
    
    try:
        async with async_session_maker() as session:
            result = await session.execute(
                select(SubscriptionPlan).order_by(SubscriptionPlan.display_order)
            )
            plans = result.scalars().all()
            
            if not plans:
                print("❌ No subscription plans found!")
                print("Run the seed data from supabase_schema.sql")
                return
            
            print(f"✅ Found {len(plans)} subscription plans:\n")
            
            for plan in plans:
                print(f"{'🔥' if plan.is_popular else '📦'} {plan.name} ({plan.tier})")
                print(f"   💰 Price: Rp {plan.price_monthly:,}/month | Rp {plan.price_yearly:,}/year")
                print(f"   📄 Max Documents: {plan.max_documents}")
                print(f"   📋 Max RFQ/month: {plan.max_rfq_per_month}")
                print(f"   🤖 AI Diagnostic: {'✅' if plan.ai_diagnostic else '❌'}")
                print(f"   🔌 API Access: {'✅' if plan.api_access else '❌'}")
                print()
                
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_subscription_plans())
