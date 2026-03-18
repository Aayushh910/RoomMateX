"""add owner_is_read to reports

Revision ID: 005
Revises: 004
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '005'
down_revision = '004'
branch_labels = None
depends_on = None


def upgrade():
    # Add owner_is_read column to reports table
    op.add_column('reports', sa.Column('owner_is_read', sa.Boolean(), nullable=False, server_default='false'))


def downgrade():
    # Remove owner_is_read column from reports table
    op.drop_column('reports', 'owner_is_read')
