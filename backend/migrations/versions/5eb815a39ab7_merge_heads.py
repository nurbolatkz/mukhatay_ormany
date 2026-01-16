"""merge heads

Revision ID: 5eb815a39ab7
Revises: 839d334e07ea, add_payment_order_id
Create Date: 2026-01-16 04:51:41.226723

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5eb815a39ab7'
down_revision = ('839d334e07ea', 'add_payment_order_id')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
