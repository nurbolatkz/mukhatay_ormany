"""Add payment_order_id to Donation model

Revision ID: add_payment_order_id
Revises: 
Create Date: 2026-01-13

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_payment_order_id'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Add payment_order_id column to donation table
    op.add_column('donation', sa.Column('payment_order_id', sa.String(), nullable=True))


def downgrade():
    # Remove payment_order_id column from donation table
    op.drop_column('donation', 'payment_order_id')
