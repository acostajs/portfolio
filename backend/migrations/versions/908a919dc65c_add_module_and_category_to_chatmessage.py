"""Add module and category to ChatMessage

Revision ID: 908a919dc65c
Revises: 7465209f01ef
Create Date: 2026-05-19 21:05:09.570407

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '908a919dc65c'
down_revision: Union[str, Sequence[str], None] = '7465209f01ef'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    with op.batch_alter_table('chatmessage', schema=None) as batch_op:
        batch_op.add_column(sa.Column('module', sqlmodel.sql.sqltypes.AutoString(), nullable=True))
        batch_op.add_column(sa.Column('category', sqlmodel.sql.sqltypes.AutoString(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table('chatmessage', schema=None) as batch_op:
        batch_op.drop_column('category')
        batch_op.drop_column('module')
